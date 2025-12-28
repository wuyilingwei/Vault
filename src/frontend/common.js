export const css = `
    :root { 
        --primary: #4f46e5; --primary-hover: #4338ca;
        --danger: #ef4444; --danger-hover: #dc2626;
        --success: #10b981;
        --bg-body: #f3f4f6; --bg-card: #ffffff; --bg-input: #ffffff;
        --text-main: #111827; --text-muted: #6b7280;
        --border: #e5e7eb;
        --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    }
    
    /* Dark theme */
    [data-theme="dark"] {
        --primary: #6366f1; --primary-hover: #4f46e5;
        --danger: #f87171; --danger-hover: #ef4444;
        --success: #34d399;
        --bg-body: #111827; --bg-card: #1f2937; --bg-input: #374151;
        --text-main: #f9fafb; --text-muted: #9ca3af;
        --border: #374151;
        --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.2), 0 2px 4px -1px rgb(0 0 0 / 0.1);
    }
    
    /* Scrollbar styling */
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    
    ::-webkit-scrollbar-track {
        background: var(--bg-body);
        border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb {
        background: var(--border);
        border-radius: 4px;
        transition: background 0.2s;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: var(--text-muted);
    }
    
    [data-theme="dark"] ::-webkit-scrollbar-thumb {
        background: #4b5563;
    }
    
    [data-theme="dark"] ::-webkit-scrollbar-thumb:hover {
        background: #6b7280;
    }
    
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    
    body { background: var(--bg-body); color: var(--text-main); height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
    
    /* Background image support */
    body.has-background {
        background-image: var(--background-image);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-attachment: fixed;
    }
    
    body.has-background::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: -1;
    }
    
    [data-theme="dark"] body.has-background::before {
        background: rgba(0, 0, 0, 0.5);
    }
    
    /* Semi-transparent backgrounds for background images */
    body.has-background {
        --bg-body: rgba(243, 244, 246, 0.8);
        --bg-card: rgba(255, 255, 255, 0.85);
        --bg-input: rgba(255, 255, 255, 0.9);
    }
    
    [data-theme="dark"] body.has-background {
        --bg-body: rgba(17, 24, 39, 0.8);
        --bg-card: rgba(31, 41, 55, 0.85);
        --bg-input: rgba(55, 65, 81, 0.9);
    }
    #app { display: flex; flex-direction: column; height: 100%; width: 100%; }
    
    /* Forms */
    .form-group { margin-bottom: 20px; }
    label { display: block; margin-bottom: 8px; font-weight: 500; font-size: 14px; color: var(--text-main); }
    
    input[type="text"], input[type="password"], select {
        width: 100%; padding: 10px 12px; border: 1px solid var(--border); border-radius: 6px;
        font-size: 14px; color: var(--text-main); background: var(--bg-input);
        transition: border-color 0.2s, box-shadow 0.2s;
    }
    input:focus, select:focus { 
        outline: none; border-color: var(--primary); 
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); 
    }
    
    /* Buttons */
    .btn { 
        padding: 8px 16px; border-radius: 6px; font-weight: 500; font-size: 14px;
        cursor: pointer; border: 1px solid transparent; transition: all 0.2s;
        display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover:not(:disabled) { background: var(--primary-hover); }
    
    .btn-danger { background: var(--danger); color: white; }
    .btn-danger:hover:not(:disabled) { background: var(--danger-hover); }
    
    .btn-secondary { background: var(--bg-card); border-color: var(--border); color: var(--text-main); }
    .btn-secondary:hover:not(:disabled) { background: var(--bg-input); border-color: var(--text-muted); }
    
    .btn-sm { padding: 6px 12px; font-size: 13px; }
    .btn-icon { width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
    
    .btn svg {
        transition: transform 0.2s;
    }
    
    .btn:hover svg {
        transform: scale(1.05);
    }

    /* Toast */
    .toast-container { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 12px; z-index: 100; }
    .toast {
        padding: 12px 16px; border-radius: 8px; color: white; font-size: 14px; font-weight: 500;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); animation: slideIn 0.3s ease-out;
    }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    
    /* Layout Helpers */
    .container { 
        display: flex; gap: 24px; padding: 24px; 
        max-width: 1800px; margin: 0 auto; width: 100%; flex: 1; 
        overflow: hidden; min-height: 0; align-items: flex-start;
    }
    .container.full-height {
        height: 100vh;
        align-items: center;
        justify-content: center;
    }
    
    /* Footer */
    .app-footer {
        text-align: center; padding: 12px; font-size: 12px; color: var(--text-muted);
        background: var(--bg-body); border-top: 1px solid var(--border);
        flex-shrink: 0;
    }
`;
