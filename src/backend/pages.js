
// --- Admin API Logic ---

export async function handleAdminApi(request, env) {
    if (env.ADMIN_DATABASE_VIEW === "false") {
        return new Response("Not Found", { status: 404 });
    }

    const KV = env["aethervault-access"];
    const ADMIN_PASSWORD = env.ADMIN_PASSWORD;
    const ADMIN_USERNAME = env.ADMIN_USERNAME || "admin";

    if (!checkAdminAuth(request, ADMIN_USERNAME, ADMIN_PASSWORD)) {
        return new Response(JSON.stringify({ error: "Unauthorized", code: "AUTH_FAILED" }), {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic',
                'Content-Type': 'application/json'
            }
        });
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

export function checkAdminAuth(request, username, password) {
    if (!password) return false; // Security: Require a password to be set
    const auth = request.headers.get("Authorization");
    if (!auth || !auth.startsWith("Basic ")) return false;
    try {
        const decoded = atob(auth.split(' ')[1]).split(':');
        return decoded[0] === username && decoded[1] === password; // user:password
    } catch { return false; }
}
