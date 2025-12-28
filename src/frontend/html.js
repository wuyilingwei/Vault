export const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AetherVault</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <style>
    :root { 
        --primary: #4f46e5; --primary-hover: #4338ca;
        --danger: #ef4444; --danger-hover: #dc2626;
        --success: #10b981;
        --bg-body: #f3f4f6; --bg-card: #ffffff; --bg-input: #ffffff;
        --text-main: #111827; --text-muted: #6b7280;
        --border: #e5e7eb;
        --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    }
    
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    
    body { background: var(--bg-body); color: var(--text-main); height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
    
    /* Header */
    header {
        background: var(--bg-card); border-bottom: 1px solid var(--border);
        padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between;
        box-shadow: var(--shadow); z-index: 10; flex-shrink: 0;
    }
    h1 { font-size: 20px; font-weight: 600; color: var(--primary); }
    
    /* Layout */
    .container { 
        display: flex; gap: 24px; padding: 24px; 
        max-width: 1800px; margin: 0 auto; width: 100%; flex: 1; 
        overflow: hidden; min-height: 0; align-items: flex-start;
    }
    
    /* Sidebar */
    .sidebar { 
        width: 380px; background: var(--bg-card); border-radius: 12px; 
        box-shadow: var(--shadow); display: flex; flex-direction: column;
        border: 1px solid var(--border); overflow: hidden;
        max-height: calc(100vh - 112px);
    }
    .sidebar-header { padding: 16px; border-bottom: 1px solid var(--border); background: #f9fafb; display: flex; align-items: center; gap: 8px; }
    .sidebar-list { flex: 1; overflow-y: auto; padding: 12px; min-height: 0; }
    
    .token-item { 
        padding: 12px; cursor: pointer; border-radius: 8px; margin-bottom: 8px;
        border: 1px solid transparent; transition: all 0.2s;
    }
    .token-item:hover { background: #f3f4f6; }
    .token-item.active { background: #eef2ff; border-color: #c7d2fe; }
    .token-item.active .token-name { color: var(--primary); }
    
    .token-name { font-weight: 600; font-size: 15px; margin-bottom: 4px; }
    .token-uuid { font-family: 'SF Mono', monospace; font-size: 12px; color: var(--text-muted); word-break: break-all; line-height: 1.4; }
    .token-meta { font-size: 11px; color: #9ca3af; margin-top: 6px; display: flex; justify-content: space-between; }

    /* Main Content */
    .main { 
        flex: 1; background: var(--bg-card); border-radius: 12px; 
        box-shadow: var(--shadow); padding: 32px; border: 1px solid var(--border);
        overflow-y: auto; max-height: calc(100vh - 112px);
    }
    
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
    
    /* Permissions Table */
    .perm-row { display: flex; gap: 12px; margin-bottom: 12px; align-items: center; }
    .perm-path { flex: 2; }
    .perm-access { flex: 1; min-width: 140px; }
    
    /* Buttons */
    .btn { 
        padding: 8px 16px; border-radius: 6px; font-weight: 500; font-size: 14px;
        cursor: pointer; border: 1px solid transparent; transition: all 0.2s;
        display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { background: var(--primary-hover); }
    
    .btn-danger { background: var(--danger); color: white; }
    .btn-danger:hover { background: var(--danger-hover); }
    
    .btn-secondary { background: white; border-color: var(--border); color: var(--text-main); }
    .btn-secondary:hover { background: #f9fafb; border-color: #d1d5db; }
    
    .btn-sm { padding: 6px 12px; font-size: 13px; }
    .btn-icon { width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }

    /* UUID Box */
    .uuid-display {
        background: #f9fafb; border: 1px solid var(--border); border-radius: 6px;
        padding: 12px; font-family: 'SF Mono', monospace; font-size: 14px;
        color: var(--text-main); display: flex; align-items: center; justify-content: space-between;
        cursor: pointer; transition: background 0.2s;
    }
    .uuid-display:hover { background: #f3f4f6; }
    .uuid-text { word-break: break-all; margin-right: 12px; }

    /* Login Screen */
    .login-container {
        display: flex; align-items: center; justify-content: center; height: 100vh;
        background: var(--bg-body);
    }
    .login-box {
        background: white; padding: 40px; border-radius: 16px; box-shadow: var(--shadow);
        width: 100%; max-width: 400px; text-align: center;
    }

    /* Toast */
    .toast-container { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 12px; z-index: 100; }
    .toast {
        padding: 12px 16px; border-radius: 8px; color: white; font-size: 14px; font-weight: 500;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); animation: slideIn 0.3s ease-out;
    }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  </style>
</head>
<body>
  <div id="app">
    <!-- Login Screen -->
    <div v-if="!authenticated" class="login-container">
      <div class="login-box">
        <h2 style="margin-bottom: 24px; color: var(--primary);">AetherVault Login</h2>
        <input type="password" v-model="password" placeholder="Password" @keyup.enter="login" style="margin-bottom: 16px;">
        <button class="btn btn-primary" style="width: 100%" @click="login">Login</button>
      </div>
    </div>

    <!-- Main App -->
    <div v-else style="display: flex; flex-direction: column; height: 100%;">
        <header>
            <h1>AetherVault Manager</h1>
            <button class="btn btn-danger btn-sm" @click="logout">Logout</button>
        </header>

        <div class="container">
            <!-- Sidebar -->
            <div class="sidebar">
                <div class="sidebar-header">
                    <select v-model="sortMethod" style="flex: 1;">
                        <option value="name">Name</option>
                        <option value="created_at">Created Time</option>
                    </select>
                    <button class="btn btn-secondary btn-icon" @click="fetchTokens" title="Refresh">&#x21bb;</button>
                </div>
                <div class="sidebar-list">
                    <div v-for="t in sortedTokens" :key="t.uuid" 
                         :class="['token-item', {active: selected && selected.uuid === t.uuid}]"
                         @click="selectToken(t)">
                        <div class="token-name">{{t.name}}</div>
                        <div class="token-uuid">{{t.uuid}}</div>
                    </div>
                </div>
                <div class="sidebar-footer" style="padding: 16px; border-top: 1px solid var(--border); background: #f9fafb;">
                    <button class="btn btn-primary" style="width: 100%" @click="selectNew">+ New Token</button>
                </div>
            </div>

            <!-- Editor -->
            <div class="main" v-if="selected">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h2 style="font-size: 24px; font-weight: 600;">{{ selected.uuid ? 'Edit Token' : 'Create Token' }}</h2>
                    <div v-if="selected.uuid">
                        <button class="btn btn-danger" @click="deleteToken">Revoke Token</button>
                    </div>
                </div>

                <div class="form-group">
                    <label>Device Name</label>
                    <input type="text" v-model="selected.name" placeholder="e.g. Production Server 1">
                </div>

                <div class="form-group" v-if="selected.uuid">
                    <label>Access Token (UUID)</label>
                    <div class="uuid-display" @click="copyToClipboard(selected.uuid)" title="Click to copy">
                        <span class="uuid-text">{{selected.uuid}}</span>
                        <span style="font-size: 12px; color: var(--primary);">COPY</span>
                    </div>
                    <div style="margin-top: 8px;">
                        <button class="btn btn-secondary btn-sm" @click="rotateToken">Rotate UUID</button>
                        <span style="font-size: 12px; color: var(--text-muted); margin-left: 8px;">Generates a new UUID and invalidates the old one.</span>
                    </div>
                </div>

                <div style="margin-top: 32px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                    <label style="margin: 0;">Access Permissions</label>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-secondary btn-sm" @click="copyPerms">Copy JSON</button>
                        <button class="btn btn-secondary btn-sm" @click="pastePerms">Paste JSON</button>
                    </div>
                </div>

                <div style="background: #f9fafb; padding: 16px; border-radius: 8px; border: 1px solid var(--border);">
                    <div v-for="(p, index) in selected.permsArray" :key="index" class="perm-row">
                        <input type="text" class="perm-path" v-model="p.path" placeholder="Path (e.g. /certs/*)">
                        <select class="perm-access" v-model="p.access">
                            <option value="no">No Access</option>
                            <option value="r">Read (r)</option>
                            <option value="a">Append (a)</option>
                            <option value="ra">Read + Append</option>
                            <option value="w">Write (w)</option>
                            <option value="rw">Read + Write</option>
                        </select>
                        <button class="btn btn-danger btn-icon" @click="removePerm(index)" title="Remove">&times;</button>
                    </div>
                    <button class="btn btn-secondary" style="width: 100%; margin-top: 8px;" @click="addPerm">+ Add Permission Scope</button>
                </div>

                <div style="margin-top: 32px;">
                    <button class="btn btn-primary" style="padding: 10px 32px;" @click="saveToken">Save Changes</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Toasts -->
    <div class="toast-container">
        <div v-for="msg in toasts" :key="msg.id" class="toast" 
             :style="{background: msg.type === 'error' ? 'var(--danger)' : 'var(--success)'}">
            {{ msg.text }}
        </div>
    </div>
  </div>

  <script>
    const {createApp, ref, computed} = Vue;
    createApp({
      setup() {
        const authenticated = ref(false);
        const password = ref('');
        const tokens = ref([]);
        const selected = ref(null);
        const authHeader = ref(localStorage.getItem('v_auth') || '');
        const toasts = ref([]);
        const sortMethod = ref('name');

        const showToast = (text, type = 'success') => {
            const id = Date.now();
            toasts.value.push({id, text, type});
            setTimeout(() => toasts.value = toasts.value.filter(t => t.id !== id), 3000);
        };

        const login = () => {
            if(!password.value) return;
            authHeader.value = 'Basic ' + btoa('admin:' + password.value);
            localStorage.setItem('v_auth', authHeader.value);
            fetchTokens();
        };

        const logout = () => {
            localStorage.removeItem('v_auth');
            authHeader.value = '';
            authenticated.value = false;
            password.value = '';
            selected.value = null;
        };

        const fetchTokens = async () => {
            try {
                const res = await fetch('/api/auth/list', {
                    headers: { 'Authorization': authHeader.value }
                });
                if (res.status === 200) {
                    tokens.value = await res.json();
                    authenticated.value = true;
                } else {
                    authenticated.value = false;
                    if(authHeader.value) showToast('Session expired', 'error');
                }
            } catch(e) {
                showToast('Network Error', 'error');
            }
        };

        const sortedTokens = computed(() => {
            return [...tokens.value].sort((a, b) => {
                if (sortMethod.value === 'name') return (a.name || '').localeCompare(b.name || '');
                if (sortMethod.value === 'created_at') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
                return 0;
            });
        });

        const selectToken = (t) => {
            const permsArray = Object.entries(t.permissions || {}).map(([path, access]) => ({path, access}));
            selected.value = { ...t, permsArray };
        };

        const selectNew = () => {
            selected.value = { name: '', permissions: {}, permsArray: [] };
        };

        const addPerm = () => selected.value.permsArray.push({path: '', access: 'r'});
        const removePerm = (index) => selected.value.permsArray.splice(index, 1);

        const getPermsObject = () => {
            const permissions = {};
            selected.value.permsArray.forEach(p => {
                if(p.path) permissions[p.path] = p.access;
            });
            return permissions;
        };

        const saveToken = async () => {
            const payload = {
                name: selected.value.name,
                permissions: getPermsObject()
            };
            const url = selected.value.uuid ? '/api/auth/' + selected.value.uuid : '/api/auth/create';
            const method = selected.value.uuid ? 'PUT' : 'POST';

            try {
                const res = await fetch(url, {
                    method,
                    headers: { 'Authorization': authHeader.value, 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    await fetchTokens();
                    if (!selected.value.uuid) selectNew();
                    showToast('Saved successfully');
                } else {
                    showToast('Error saving', 'error');
                }
            } catch(e) { showToast(e.message, 'error'); }
        };

        const deleteToken = async () => {
            if(!confirm('Revoke this token?')) return;
            try {
                const res = await fetch('/api/auth/' + selected.value.uuid, {
                    method: 'DELETE',
                    headers: { 'Authorization': authHeader.value }
                });
                if(res.ok) {
                    await fetchTokens();
                    selectNew();
                    showToast('Token revoked');
                }
            } catch(e) { showToast(e.message, 'error'); }
        };

        const rotateToken = async () => {
            if(!confirm('Rotate UUID? Old UUID will stop working immediately.')) return;
            try {
                const res = await fetch('/api/auth/' + selected.value.uuid + '/rotate', {
                    method: 'POST',
                    headers: { 'Authorization': authHeader.value }
                });
                if (!res.ok) throw new Error('Failed');
                const newToken = await res.json();
                
                // Update local state directly
                const idx = tokens.value.findIndex(t => t.uuid === selected.value.uuid);
                if (idx !== -1) {
                    tokens.value[idx] = newToken;
                }
                
                selectToken(newToken);
                showToast('Token rotated');
            } catch (e) { showToast('Rotation failed', 'error'); }
        };

        const copyToClipboard = async (text) => {
            await navigator.clipboard.writeText(text);
            showToast('Copied to clipboard');
        };

        const copyPerms = async () => {
            await copyToClipboard(JSON.stringify(getPermsObject(), null, 2));
        };

        const pastePerms = async () => {
            try {
                const text = await navigator.clipboard.readText();
                const perms = JSON.parse(text);
                selected.value.permsArray = Object.entries(perms).map(([path, access]) => ({path, access}));
                showToast('Permissions pasted');
            } catch { showToast('Invalid JSON', 'error'); }
        };

        const formatDate = (iso) => {
            if(!iso) return '';
            return new Date(iso).toLocaleString();
        };

        if(authHeader.value) fetchTokens();

        return { 
            authenticated, password, login, logout, tokens, selected, toasts,
            selectToken, selectNew, addPerm, removePerm, saveToken, deleteToken,
            rotateToken, copyToClipboard, copyPerms, pastePerms, formatDate,
            sortMethod, sortedTokens, fetchTokens
        };
      }
    }).mount('#app');
  </script>
</body>
</html>
`;
