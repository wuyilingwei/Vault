// api.js - Unified API request handler

/**
 * Makes an authenticated API request
 * @param {string} url - The API endpoint URL
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise<Response>} - The fetch response
 */
export async function apiRequest(url, options = {}) {
    const authHeader = localStorage.getItem('v_auth');
    
    const headers = {
        ...options.headers,
    };
    
    // Add Authorization header if available
    if (authHeader) {
        headers['Authorization'] = authHeader;
    }
    
    // Add Content-Type for JSON payloads
    if (options.body && typeof options.body === 'object') {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(options.body);
    }
    
    try {
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        // Handle 401 Unauthorized - session expired
        if (response.status === 401) {
            localStorage.removeItem('v_auth');
            // Redirect to login if not already there
            if (window.location.hash !== '#/login') {
                window.location.hash = '#/login';
            }
        }
        
        return response;
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
}

/**
 * Makes a GET request
 */
export async function apiGet(url) {
    return apiRequest(url, { method: 'GET' });
}

/**
 * Makes a POST request
 */
export async function apiPost(url, data) {
    return apiRequest(url, { method: 'POST', body: data });
}

/**
 * Makes a PUT request
 */
export async function apiPut(url, data) {
    return apiRequest(url, { method: 'PUT', body: data });
}

/**
 * Makes a DELETE request
 */
export async function apiDelete(url) {
    return apiRequest(url, { method: 'DELETE' });
}

// Export as default object
export default {
    request: apiRequest,
    get: apiGet,
    post: apiPost,
    put: apiPut,
    delete: apiDelete
};
