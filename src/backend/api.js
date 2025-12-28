import { checkAdminAuth } from './pages.js';

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

export async function handleApi(request, env) {
    const url = new URL(request.url);
    const API_PREFIX = env.API_PREFIX || "/api";
    const path = url.pathname;

    const DB = env["aethervault-data"];
    const KV = env["aethervault-access"];

    if (!DB || !KV) return new Response("Config Error: Bindings not found.", { status: 500 });

    // Data API - Batch Operation
    if (path === API_PREFIX + "/data") {
        return await handleDataApi(request, env, DB, KV);
    }

    return new Response("Not Found", { status: 404 });
}

async function handleDataApi(request, env, DB, KV) {
    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    let authData = null;
    const authHeaderName = env.AUTH_HEADER || "Authorization";
    const authHeader = request.headers.get(authHeaderName);

    if (authHeader) {
        if (authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            authData = await KV.get(`auth:${token}`, { type: "json" });
        } else if (authHeader.startsWith("Basic ")) {
            const ADMIN_USERNAME = env.ADMIN_USERNAME || "admin";
            const ADMIN_PASSWORD = env.ADMIN_PASSWORD;
            if (checkAdminAuth(request, ADMIN_USERNAME, ADMIN_PASSWORD)) {
                const adminRange = env.ADMIN_EDIT_RANGE || "*";
                if (adminRange === "none") {
                    authData = {
                        name: "Admin",
                        permissions: { "*": "r" }
                    };
                } else {
                    authData = {
                        name: "Admin",
                        permissions: { [adminRange]: "rw" }
                    };
                }
            }
        }
    }

    if (!authData) {
        return new Response("Unauthorized: Missing or invalid credentials", { status: 401 });
    }

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

        // Determine permission check parameters
        let permModule = module;
        let permKey = key;

        // For list, module/key might be empty to signify root/all
        if (type === 'list') {
            permModule = module || '';
            permKey = key || '';
        } else {
            if (!module || !key) {
                result.status = 400;
                result.data = { error: "Missing module or key" };
                results.push(result);
                continue;
            }
        }

        // 2. Permission Check
        const perm = checkPermission(authData, permModule, permKey);
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

                const row = await DB.prepare("SELECT value, updated_at FROM aethervault_items WHERE module = ? AND key = ?")
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
                    INSERT INTO aethervault_items (module, key, value, updated_at, separator) VALUES (?, ?, ?, ?, ?)
                    ON CONFLICT(module, key) DO UPDATE SET 
                        value = excluded.value, 
                        updated_at = excluded.updated_at,
                        separator = COALESCE(excluded.separator, aethervault_items.separator)
                `).bind(module, key, value, timestamp, separator).run();

                result.data = { last_update: timestamp };

            } else if (type === "append") {
                if (!canAppend) throw { status: 403, message: "Append Permission Denied" };

                // Fetch existing value AND separator
                const existing = await DB.prepare("SELECT value, separator FROM aethervault_items WHERE module = ? AND key = ?")
                    .bind(module, key).first();

                const timestamp = new Date().toISOString();

                // Use stored separator or default to \n
                const sep = (existing && existing.separator) ? existing.separator : "\n";

                const appendContent = value;
                let newValue;

                if (existing) {
                    newValue = existing.value + sep + appendContent;
                    await DB.prepare("UPDATE aethervault_items SET value = ?, updated_at = ? WHERE module = ? AND key = ?")
                        .bind(newValue, timestamp, module, key).run();
                } else {
                    newValue = appendContent;
                    // For new items created via append, separator is NULL (defaulting to \n next time)
                    await DB.prepare("INSERT INTO aethervault_items (module, key, value, updated_at) VALUES (?, ?, ?, ?)")
                        .bind(module, key, newValue, timestamp).run();
                }

                result.data = { last_update: timestamp };

            } else if (type === "delete") {
                if (!canWrite) throw { status: 403, message: "Delete Permission Denied" };

                await DB.prepare("DELETE FROM vault_items WHERE module = ? AND key = ?")
                    .bind(module, key).run();

                result.data = { success: true };

            } else if (type === "list") {
                if (!canRead) throw { status: 403, message: "List Permission Denied" };

                let query;
                let params = [];

                if (module) {
                    if (key) {
                        // List with prefix (Secure: ensure we only list what we checked permission for)
                        query = "SELECT * FROM vault_items WHERE module = ? AND key LIKE ? ORDER BY key";
                        params = [module, key + '%'];
                    } else {
                        // List entire module
                        query = "SELECT * FROM vault_items WHERE module = ? ORDER BY key";
                        params = [module];
                    }
                } else {
                    // List all (Global)
                    query = "SELECT * FROM vault_items ORDER BY module, key";
                }

                const { results: listResults } = await DB.prepare(query).bind(...params).all();
                result.data = listResults;

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
