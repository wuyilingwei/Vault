import { html } from './frontend/html.js';
import { icon } from './frontend/icon.js';

/**
 * Vault Service v2.3
 * Auth: KV (vault-access)
 * Data: D1 (vault-data)
 */

export default {
    async fetch(request, env) {
        const DB = env["vault-data"];
        const KV = env["vault-access"];
        const ADMIN_PASSWORD = env.ADMIN_PASSWORD;

        if (!DB || !KV) return new Response("Config Error: Bindings not found.", { status: 500 });

        const url = new URL(request.url);
        const path = url.pathname;
        const API_PREFIX = env.API_PREFIX || "/api";

        // Serve Frontend
        if (path === "/" || path === "/index.html") {
            return new Response(html, { headers: { "Content-Type": "text/html" } });
        }
        if (path === "/favicon.svg") {
            return new Response(icon, { headers: { "Content-Type": "image/svg+xml" } });
        }

        // API Router
        if (path.startsWith(API_PREFIX + "/")) {
            // Admin API
            if (path.startsWith(API_PREFIX + "/auth/")) {
                return await handleAdminApi(request, env, KV, ADMIN_PASSWORD);
            }
            // Data API - Batch Operation
            if (path === API_PREFIX + "/data") {
                return await handleDataApi(request, env, DB, KV);
            }
        }

        return new Response("Not Found", { status: 404 });
    }
};

// Helper: Check Admin Auth
function checkAdminAuth(request, password) {
    const auth = request.headers.get("Authorization");
    if (!auth || !auth.startsWith("Basic ")) return false;
    try {
        const decoded = atob(auth.split(' ')[1]).split(':');
        return decoded[1] === password; // user:password
    } catch { return false; }
}

// Helper: Check Token Permission
function checkPermission(authData, module, key) {
    const requestPath = `/${module}/${key}`;
    let permission = "no";

    // Find best match
    for (const [pattern, perm] of Object.entries(authData.permissions)) {
        let match = false;
        if (pattern.endsWith("*")) {
            const prefix = pattern.slice(0, -1);
            if (requestPath.startsWith(prefix)) match = true;
        } else {
            if (requestPath === pattern) match = true;
        }

        if (match) {
            permission = perm;
        }
    }
    return permission;
}

async function handleAdminApi(request, env, KV, adminPassword) {
    if (!checkAdminAuth(request, adminPassword)) {
        return new Response("Unauthorized", { status: 401, headers: { 'WWW-Authenticate': 'Basic' } });
    }

    const url = new URL(request.url);
    const path = url.pathname; // /api/auth/...

    // List Tokens
    if (path === "/api/auth/list" && request.method === "GET") {
        const list = await KV.list({ prefix: "auth:" });
        const tokens = [];
        for (const key of list.keys) {
            const val = await KV.get(key.name, { type: "json" });
            if (val) tokens.push(val);
        }
        return new Response(JSON.stringify(tokens), { headers: { "Content-Type": "application/json" } });
    }

    // Create Token
    if (path === "/api/auth/create" && request.method === "POST") {
        const body = await request.json();
        const uuid = crypto.randomUUID();
        const newAuth = {
            uuid: uuid,
            name: body.name || "Unnamed",
            created_at: new Date().toISOString(),
            permissions: body.permissions || {}
        };
        await KV.put(`auth:${uuid}`, JSON.stringify(newAuth));
        return new Response(JSON.stringify(newAuth), { status: 201 });
    }

    // Update/Delete Token
    // Path format: /api/auth/{uuid}
    const match = path.match(/^\/api\/auth\/([a-f0-9\-]+)$/);
    if (match) {
        const uuid = match[1];
        if (request.method === "PUT") {
            const body = await request.json();
            const existing = await KV.get(`auth:${uuid}`, { type: "json" });
            const updatedAuth = {
                uuid: uuid,
                name: body.name,
                created_at: existing ? existing.created_at : new Date().toISOString(),
                permissions: body.permissions
            };
            await KV.put(`auth:${uuid}`, JSON.stringify(updatedAuth));
            return new Response("OK", { status: 200 });
        }
        if (request.method === "DELETE") {
            await KV.delete(`auth:${uuid}`);
            return new Response("OK", { status: 200 });
        }
    }

    // Rotate Token
    const rotateMatch = path.match(/^\/api\/auth\/([a-f0-9\-]+)\/rotate$/);
    if (rotateMatch && request.method === "POST") {
        const oldUuid = rotateMatch[1];
        const existing = await KV.get(`auth:${oldUuid}`, { type: "json" });
        if (!existing) return new Response("Token not found", { status: 404 });

        const newUuid = crypto.randomUUID();
        const newAuth = {
            uuid: newUuid,
            name: existing.name,
            created_at: existing.created_at || new Date().toISOString(), // Preserve creation date
            permissions: existing.permissions,
            last_used_at: existing.last_used_at, // Preserve usage stats
            last_used_ip: existing.last_used_ip
        };

        await KV.put(`auth:${newUuid}`, JSON.stringify(newAuth));
        await KV.delete(`auth:${oldUuid}`);

        return new Response(JSON.stringify(newAuth), { status: 200 });
    }

    return new Response("Not Found", { status: 404 });
}

async function handleDataApi(request, env, DB, KV) {
    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    const authHeaderName = env.AUTH_HEADER || "Authorization";
    const authHeader = request.headers.get(authHeaderName);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response("Unauthorized: Missing or invalid Bearer token", { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // 1. Auth Check (KV)
    const authData = await KV.get(`auth:${token}`, { type: "json" });
    if (!authData) return new Response("Forbidden: Invalid Token", { status: 403 });

    let ops = [];
    try {
        const body = await request.json();
        // Support both array directly or { ops: [...] }
        if (Array.isArray(body)) {
            ops = body;
        } else if (body.ops && Array.isArray(body.ops)) {
            ops = body.ops;
        } else {
            return new Response("Invalid batch format", { status: 400 });
        }
    } catch (e) {
        return new Response("Invalid JSON", { status: 400 });
    }

    const results = [];

    for (const op of ops) {
        const { type, module, key, value, id } = op;
        const result = {
            id: id,
            status: 200,
            data: {}
        };

        if (!module || !key) {
            result.status = 400;
            result.data = { error: "Missing module or key" };
            results.push(result);
            continue;
        }

        // 2. Permission Check
        const perm = checkPermission(authData, module, key);
        if (perm === "no") {
            result.status = 403;
            result.data = { error: "Permission Denied" };
            results.push(result);
            continue;
        }

        const canRead = perm.includes("r");
        const canWrite = perm.includes("w");
        const canAppend = perm.includes("a") || perm === "add" || canWrite;

        try {
            if (type === "read") {
                if (!canRead) throw { status: 403, message: "Read Permission Denied" };

                const row = await DB.prepare("SELECT value, updated_at FROM vault_items WHERE module = ? AND key = ?")
                    .bind(module, key).first();

                if (row) {
                    result.data = {
                        content: row.value,
                        last_update: row.updated_at
                    };
                } else {
                    result.status = 404;
                    result.data = { error: "Not Found" };
                }

            } else if (type === "write") {
                if (!canWrite) throw { status: 403, message: "Write Permission Denied" };

                const timestamp = new Date().toISOString();
                const separator = op.separator !== undefined ? op.separator : null;

                // If separator is provided, update it. If not (null), keep existing on conflict, or null on insert.
                // We rely on COALESCE in the UPDATE clause to keep existing value if new one is NULL.
                // For INSERT, if separator is NULL, it stays NULL (and we treat NULL as default '\n' on read/append).
                await DB.prepare(`
                    INSERT INTO vault_items (module, key, value, updated_at, separator) VALUES (?, ?, ?, ?, ?)
                    ON CONFLICT(module, key) DO UPDATE SET 
                        value = excluded.value, 
                        updated_at = excluded.updated_at,
                        separator = COALESCE(excluded.separator, vault_items.separator)
                `).bind(module, key, value, timestamp, separator).run();

                result.data = { last_update: timestamp };

            } else if (type === "append") {
                if (!canAppend) throw { status: 403, message: "Append Permission Denied" };

                // Fetch existing value AND separator
                const existing = await DB.prepare("SELECT value, separator FROM vault_items WHERE module = ? AND key = ?")
                    .bind(module, key).first();

                const timestamp = new Date().toISOString();

                // Use stored separator or default to \n
                const sep = (existing && existing.separator) ? existing.separator : "\n";

                const appendContent = value;
                let newValue;

                if (existing) {
                    newValue = existing.value + sep + appendContent;
                    await DB.prepare("UPDATE vault_items SET value = ?, updated_at = ? WHERE module = ? AND key = ?")
                        .bind(newValue, timestamp, module, key).run();
                } else {
                    newValue = appendContent;
                    // For new items created via append, separator is NULL (defaulting to \n next time)
                    await DB.prepare("INSERT INTO vault_items (module, key, value, updated_at) VALUES (?, ?, ?, ?)")
                        .bind(module, key, newValue, timestamp).run();
                }

                result.data = { last_update: timestamp };

            } else {
                result.status = 400;
                result.data = { error: "Unknown operation type" };
            }
        } catch (err) {
            result.status = err.status || 500;
            result.data = { error: err.message || "Internal Error" };
        }

        results.push(result);
    }

    return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
}
