# Project Architecture Migration

This document describes the migration from a Worker-only architecture to a hybrid Worker + Pages frontend structure.

## What Changed

### 1. Directory Structure
- **Created `public/` directory**: Contains all frontend static assets
  - `public/index.html`: Main HTML file
  - `public/favicon.svg`: Favicon extracted from icon.js
  - `public/js/`: JavaScript files
    - `api.js`: Unified API request handler
    - `common.css`: All CSS styles
    - `router.js`: Vue Router configuration
    - `main.js`: Main Vue app initialization
    - `components/navbar.js`: Navigation bar component
    - `views/login.js`: Login view
    - `views/token.js`: Token management view
    - `views/database.js`: Database view (placeholder)

### 2. Worker Entry Logic (src/index.js)
- **Removed**: `renderHtml` and `icon` imports
- **Changed**: Now uses `env.ASSETS.fetch()` to serve static files
- **Added**: SPA routing support - 404s fallback to index.html
- **Kept**: All API routes (`/api/data`, `/api/auth/*`, `/api/config`)

### 3. Configuration (wrangler.toml)
- **Added**: `[assets]` section pointing to `./public` directory
- **Added**: `ASSETS` binding for the worker

### 4. Frontend Architecture
- **Before**: HTML/CSS/JS were embedded as strings in src/frontend/*.js
- **After**: Proper static files loaded via script tags
- **Method**: Using Vue 3 and Vue Router from CDN with global scope
- **Components**: All components now set themselves on `window.*` for global access

### 5. API Request Handling
- **Created**: `public/js/api.js` with unified request functions
- **Features**: 
  - Automatic Authorization header from localStorage
  - Global 401 error handling (redirects to login)
  - Utility methods: `api.get()`, `api.post()`, `api.put()`, `api.delete()`

## How to Use

### Development
```bash
# Install dependencies
npm install

# Start local development server
npx wrangler dev
```

### Deployment
```bash
# Deploy to Cloudflare Workers
npx wrangler deploy
```

### Configuration
1. Copy `wrangler.example.toml` to `wrangler.toml`
2. Update the KV and D1 binding IDs
3. Configure environment variables as needed

## File Structure
```
Vault/
├── public/                    # Static frontend files
│   ├── index.html            # Main HTML file
│   ├── favicon.svg           # Favicon
│   └── js/
│       ├── api.js            # API utilities
│       ├── common.css        # All CSS styles
│       ├── router.js         # Vue Router config
│       ├── main.js           # App initialization
│       ├── components/       # Vue components
│       └── views/            # Vue views
├── src/
│   ├── index.js              # Worker entry point
│   ├── backend/              # API handlers
│   └── frontend/             # (deprecated - kept for reference)
├── wrangler.toml             # Cloudflare Worker config
└── package.json
```

## Migration Benefits

1. **Better separation of concerns**: Frontend and backend are clearly separated
2. **Standard web development**: Use standard HTML/CSS/JS instead of template strings
3. **Easier debugging**: Browser dev tools work better with proper static files
4. **Better caching**: Static assets can be cached independently
5. **SPA routing**: Proper client-side routing with URL support
6. **Modern architecture**: Follows Cloudflare Pages + Workers pattern

## Notes

- The database view (`views/database.js`) is currently a placeholder and needs full implementation
- All API endpoints remain unchanged and backward compatible
- The old `src/frontend/` directory is kept for reference but not used
- Vue and Vue Router are loaded from CDN for simplicity
