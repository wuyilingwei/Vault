import { handleApi } from './backend/api.js';
import { handleAdminApi } from './backend/pages.js';
import { renderHtml } from './frontend/render.js';
import { icon } from './frontend/icon.js';

// Handle Configuration API
async function handleConfigApi(request, env) {
    if (request.method !== 'GET') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    const config = {
        background: env.BACKGROUND || null,
        adminDatabaseView: env.ADMIN_DATABASE_VIEW !== "false"
    };

    return new Response(JSON.stringify(config), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const API_PREFIX = env.API_PREFIX || "/api";

        // Pure Data API requests
        if (url.pathname === API_PREFIX + '/data') {
            return handleApi(request, env);
        }

        // Admin/Auth API requests
        if (url.pathname.startsWith(API_PREFIX + '/auth/')) {
            return handleAdminApi(request, env);
        }

        // Configuration API requests
        if (url.pathname === API_PREFIX + '/config') {
            return handleConfigApi(request, env);
        }

        // Serve favicon
        if (url.pathname === '/favicon.svg') {
            return new Response(icon, {
                headers: { 'Content-Type': 'image/svg+xml' }
            });
        }

        // Serve Management UI (HTML)
        return new Response(renderHtml(env), {
            headers: { 'Content-Type': 'text/html' }
        });
    }
};
