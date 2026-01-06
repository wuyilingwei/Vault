// token.js - Token management view component
const { ref, computed, onMounted } = Vue;

const TokenView = {
    template: `
        <div class="token-container" style="display: flex; width: 100%; gap: 24px; height: 100%;">
            <!-- Sidebar -->
            <div class="sidebar">
                <div class="sidebar-header">
                    <select v-model="sortMethod" style="flex: 1;">
                        <option value="name">Name</option>
                        <option value="created_at">Created Time</option>
                    </select>
                    <button class="btn btn-secondary btn-icon" @click="fetchTokens" title="Refresh">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div class="sidebar-list">
                    <div v-for="t in sortedTokens" :key="t.uuid" 
                            :class="['token-item', {active: selected && selected.uuid === t.uuid}]"
                            @click="selectToken(t)">
                        <div class="token-name">{{t.name}}</div>
                        <div class="token-uuid">{{t.uuid}}</div>
                    </div>
                </div>
                <div class="sidebar-footer">
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

                <div style="background: var(--bg-tertiary); padding: 16px; border-radius: 8px; border: 1px solid var(--border);">
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
                        <button class="btn btn-danger btn-icon" @click="removePerm(index)" title="Remove">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <button class="btn btn-secondary" style="width: 100%; margin-top: 8px;" @click="addPerm">+ Add Permission Scope</button>
                </div>

                <div style="margin-top: 32px; display: flex; align-items: center; gap: 16px;">
                    <button class="btn btn-primary" style="padding: 10px 32px;" @click="saveToken">Save Changes</button>
                    <div style="font-size: 12px; color: var(--text-muted); opacity: 0.8;">
                        Note: Changes may take ~15s to propagate due to KV consistency.
                    </div>
                </div>
            </div>
        </div>
    `,
    props: ['authHeader', 'showToast'],
    setup(props) {
        const tokens = ref([]);
        const selected = ref(null);
        const sortMethod = ref('name');

        const fetchTokens = async () => {
            try {
                const res = await fetch('/api/auth/list', {
                    headers: { 'Authorization': props.authHeader }
                });
                if (res.status === 200) {
                    tokens.value = await res.json();
                } else {
                    props.showToast('Session expired', 'error');
                }
            } catch(e) {
                props.showToast('Network Error', 'error');
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
            const isNew = !selected.value.uuid;
            const payload = {
                name: selected.value.name,
                permissions: getPermsObject()
            };
            const url = isNew ? '/api/auth/create' : '/api/auth/' + selected.value.uuid;
            const method = isNew ? 'POST' : 'PUT';

            try {
                const res = await fetch(url, {
                    method,
                    headers: { 'Authorization': props.authHeader, 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    if (isNew) {
                        const newToken = await res.json();
                        tokens.value.push(newToken);
                        selectToken(newToken);
                    } else {
                        const idx = tokens.value.findIndex(t => t.uuid === selected.value.uuid);
                        if (idx !== -1) {
                            tokens.value[idx] = { ...tokens.value[idx], ...payload };
                        }
                    }
                    props.showToast('Saved successfully');
                } else {
                    props.showToast('Error saving', 'error');
                }
            } catch(e) { props.showToast(e.message, 'error'); }
        };

        const deleteToken = async () => {
            if(!confirm('Revoke this token?')) return;
            try {
                const res = await fetch('/api/auth/' + selected.value.uuid, {
                    method: 'DELETE',
                    headers: { 'Authorization': props.authHeader }
                });
                if(res.ok) {
                    await fetchTokens();
                    selectNew();
                    props.showToast('Token revoked');
                }
            } catch(e) { props.showToast(e.message, 'error'); }
        };

        const rotateToken = async () => {
            if(!confirm('Rotate UUID? Old UUID will stop working immediately.')) return;
            try {
                const res = await fetch('/api/auth/' + selected.value.uuid + '/rotate', {
                    method: 'POST',
                    headers: { 'Authorization': props.authHeader }
                });
                if (!res.ok) throw new Error('Failed');
                const newToken = await res.json();
                
                const idx = tokens.value.findIndex(t => t.uuid === selected.value.uuid);
                if (idx !== -1) {
                    tokens.value[idx] = newToken;
                }
                
                selectToken(newToken);
                props.showToast('Token rotated');
            } catch (e) { props.showToast('Rotation failed', 'error'); }
        };

        const copyToClipboard = async (text) => {
            await navigator.clipboard.writeText(text);
            props.showToast('Copied to clipboard');
        };

        const copyPerms = async () => {
            await copyToClipboard(JSON.stringify(getPermsObject(), null, 2));
        };

        const pastePerms = async () => {
            try {
                const text = await navigator.clipboard.readText();
                const perms = JSON.parse(text);
                selected.value.permsArray = Object.entries(perms).map(([path, access]) => ({path, access}));
                props.showToast('Permissions pasted');
            } catch { props.showToast('Invalid JSON', 'error'); }
        };

        onMounted(() => {
            fetchTokens();
        });

        return { 
            tokens, selected, sortMethod, sortedTokens,
            selectToken, selectNew, addPerm, removePerm, saveToken, deleteToken,
            rotateToken, copyToClipboard, copyPerms, pastePerms, fetchTokens
        };
    }
};

// Make TokenView available globally
window.TokenView = TokenView;
