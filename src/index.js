import { handleApi } from './backend/api.js';
import { handleAdminApi } from './backend/pages.js';

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

        // Serve static assets and frontend (SPA routing)
        // Try to fetch from ASSETS, fallback to index.html for SPA routing
        try {
            const assetResponse = await env.ASSETS.fetch(request);
            
            // If asset found, return it
            if (assetResponse.status !== 404) {
                return assetResponse;
            }
            
            // For SPA routing: if no asset found, serve index.html
            const indexRequest = new Request(new URL('/index.html', request.url), request);
            return env.ASSETS.fetch(indexRequest);
        } catch (error) {
            // Fallback in case ASSETS binding is not available
            return new Response('Static assets not configured', { status: 500 });
        }
    }
};
