export const css = `
    /* Color variable definitions - supports translucency */
    .database-container {
        --bg-secondary: rgba(252, 253, 254, 0.85); /* Secondary background color - lighter base color */
        --bg-tertiary: rgba(248, 250, 252, 0.65); /* Tertiary background color - lighter base color */
        --bg-input-enhanced: rgba(255, 255, 255, 0.95); /* Enhanced input background color - higher opacity */
    }
    
    /* Dark mode support */
    [data-theme="dark"] .database-container {
        --bg-secondary: rgba(30, 41, 59, 0.8); /* Dark mode keeps original values */
        --bg-tertiary: rgba(51, 65, 85, 0.7); /* Reduce opacity */
        --bg-input-enhanced: rgba(15, 23, 42, 0.9);
    }
    
    .database-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding: 24px;
        overflow: hidden;
        flex: 1;
    }

    .database-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
    }

    .changes-status {
        color: var(--text-muted);
        font-size: 14px;
    }

    .changes-status.has-changes {
        color: var(--primary);
        font-weight: 500;
    }

    .database-table-container {
        flex: 1;
        overflow: auto;
        background: var(--bg-card);
        border-radius: 12px;
        border: 1px solid var(--border);
        box-shadow: var(--shadow);
    }

    .database-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 800px;
    }

    .database-table th {
        background: var(--bg-secondary);
        padding: 12px 16px;
        text-align: left;
        font-weight: 600;
        font-size: 14px;
        color: var(--text-main);
        border-bottom: 1px solid var(--border);
        position: sticky;
        top: 0;
        z-index: 1;
        cursor: pointer;
        user-select: none;
        transition: background 0.2s;
    }

    .database-table th:hover {
        background: var(--bg-card);
    }

    .sortable-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .sort-indicator {
        font-size: 12px;
        opacity: 0.5;
        margin-left: 4px;
    }

    .sort-indicator.active {
        opacity: 1;
        color: var(--primary);
    }

    .database-table td {
        padding: 12px 16px;
        border-bottom: 1px solid var(--border);
        vertical-align: middle;
    }

    .database-table tbody tr:hover {
        background: var(--bg-card);
        box-shadow: inset 0 0 0 1px rgba(79, 70, 229, 0.1);
    }

    .database-table tbody tr.modified {
        background: rgba(79, 70, 229, 0.15);
        border-left: 3px solid var(--primary);
    }

    .database-table tbody tr.deleted {
        background: rgba(239, 68, 68, 0.15);
        opacity: 0.7;
        text-decoration: line-through;
        border-left: 3px solid var(--danger);
    }

    .database-table tbody tr.new {
        background: rgba(16, 185, 129, 0.15);
        border-left: 3px solid var(--success);
    }

    .field-input {
        width: 100%;
        border: none;
        background: transparent;
        padding: 4px 8px;
        border-radius: 4px;
        transition: background 0.2s;
        min-height: 32px;
        resize: none;
        white-space: pre;
        font-family: 'SF Mono', monospace;
        overflow: hidden;
        line-height: 24px;
    }

    .field-input::placeholder {
        color: var(--text-muted);
        font-style: italic;
    }

    .field-input:hover {
        background: rgba(0, 0, 0, 0.02);
    }

    .field-input:focus {
        outline: none;
        background: var(--bg-input-enhanced);
        border: 1px solid var(--primary);
        box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
    }

    .readonly-field {
        color: var(--text-muted);
        font-size: 13px;
        font-family: 'SF Mono', monospace;
        white-space: pre;
    }

    .space-visualizer {
        background-color: #e3f2fd;
        border: 1px solid #90caf9;
        border-radius: 3px;
        padding: 1px 4px;
        margin: 0 1px;
        font-size: 10px;
        color: #1565c0;
        display: inline-block;
        min-width: 12px;
        text-align: center;
        font-weight: bold;
    }

    .empty-indicator {
        color: var(--text-muted);
        font-style: italic;
        font-size: 12px;
        background-color: #f5f5f5;
        padding: 2px 6px;
        border-radius: 3px;
        border: 1px dashed #ccc;
    }

    .expand-btn {
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: 4px;
        padding: 2px 6px;
        margin-left: 8px;
        cursor: pointer;
        font-size: 12px;
        color: var(--text-muted);
        transition: all 0.2s;
    }

    .expand-btn:hover {
        background: var(--bg-card);
        color: var(--text-main);
    }

    .actions-cell {
        width: 80px;
        text-align: center;
    }

    .add-row-container {
        padding: 16px;
        border-top: 1px solid var(--border);
        background: var(--bg-tertiary);
        text-align: center;
    }

    /* Modal Editor */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal-content {
        background: var(--bg-card);
        border-radius: 12px;
        box-shadow: var(--shadow);
        min-width: 600px;
        max-width: min(95vw, 1400px);
        width: auto;
        max-height: 90%;
        display: flex;
        flex-direction: column;
        transition: width 0.2s ease;
    }

    .modal-header {
        padding: 20px 24px 16px;
        border-bottom: 1px solid var(--border);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .modal-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--text-main);
    }

    .modal-body {
        padding: 24px;
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .modal-textarea {
        width: 100%;
        min-height: 150px;
        max-height: 60vh;
        padding: 12px;
        border: 1px solid var(--border);
        border-radius: 6px;
        font-size: 14px;
        font-family: 'SF Mono', monospace;
        resize: vertical;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-y: auto;
        box-sizing: border-box;
        background: var(--bg-input-enhanced);
        color: var(--text-main);
        transition: border-color 0.2s, box-shadow 0.2s;
    }
    
    .modal-textarea:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    .modal-controls {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 16px;
        padding: 16px;
        background: var(--bg-secondary);
        border-radius: 6px;
        border: 1px solid var(--border);
    }

    .control-group {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
    }

    .control-label {
        font-size: 13px;
        font-weight: 500;
        color: var(--text-main);
        white-space: nowrap;
    }

    .control-options {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        align-items: center;
    }

    .control-option {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .control-option input[type="radio"] {
        margin: 0;
    }

    .control-option label {
        font-size: 13px;
        color: var(--text-main);
        cursor: pointer;
        white-space: nowrap;
        line-height: 1;
        margin-bottom: 0;
    }

    .separator-input {
        width: 40px !important;
        height: 20px;
        padding: 2px 4px;
        border: 1px solid var(--border);
        border-radius: 3px;
        font-size: 11px;
        font-family: 'SF Mono', monospace;
        margin-left: 4px;
        box-sizing: border-box;
        vertical-align: middle;
    }

    .mini-tools {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-left: auto;
    }

    .mini-tool-btn {
        padding: 4px 8px;
        border: 1px solid var(--border);
        background: var(--bg-card);
        border-radius: 4px;
        font-size: 11px;
        cursor: pointer;
        color: var(--text-muted);
        transition: all 0.2s;
        white-space: nowrap;
    }

    .mini-tool-btn:hover {
        background: var(--bg-secondary);
        color: var(--text-main);
    }

    .mini-tool-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .editor-stats {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: var(--text-muted);
        font-family: 'SF Mono', monospace;
    }

    .editor-actions {
        display: flex;
        gap: 8px;
    }

    .editor-action-btn {
        padding: 4px 8px;
        border: 1px solid var(--border);
        background: var(--bg-card);
        border-radius: 3px;
        font-size: 11px;
        cursor: pointer;
        color: var(--text-muted);
        transition: all 0.2s;
    }

    .editor-action-btn:hover {
        background: var(--bg-secondary);
        color: var(--text-main);
    }

    .modal-footer {
        padding: 16px 24px;
        border-top: 1px solid var(--border);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .modal-actions {
        display: flex;
        gap: 12px;
    }

    /* Confirmation Dialog */
    .confirm-dialog {
        background: var(--bg-card);
        border-radius: 12px;
        box-shadow: var(--shadow);
        width: 90%;
        max-width: 500px;
        max-height: 70%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .confirm-header {
        padding: 20px 24px 16px;
        border-bottom: 1px solid var(--border);
    }

    .confirm-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--text-main);
        margin-bottom: 8px;
    }

    .confirm-subtitle {
        font-size: 14px;
        color: var(--text-muted);
    }

    .confirm-body {
        padding: 20px 24px;
        flex: 1;
        overflow-y: auto;
    }

    .changes-list {
        background: var(--bg-tertiary);
        border-radius: 6px;
        padding: 12px;
        font-family: 'SF Mono', monospace;
        font-size: 13px;
        line-height: 1.5;
        max-height: 200px;
        overflow-y: auto;
    }

    .change-item {
        margin-bottom: 8px;
        padding: 4px 0;
    }

    .change-item.create {
        color: var(--success);
    }

    .change-item.update {
        color: var(--primary);
    }

    .change-item.delete {
        color: var(--danger);
    }

    .change-item.overwrite {
        color: #9333ea;
    }

    .confirm-footer {
        padding: 16px 24px;
        border-top: 1px solid var(--border);
        display: flex;
        gap: 12px;
        justify-content: flex-end;
    }
`;

const html = `
    <div class="database-container">
        <div class="database-header">
            <h2>Database Management</h2>
            <div style="display: flex; align-items: center; gap: 16px;">
                <div class="changes-status" :class="{ 'has-changes': hasChanges }">
                    {{ hasChanges ? changeCount + ' unsaved changes' : 'No changes' }}
                </div>
                <button class="btn btn-primary" @click="saveChanges" :disabled="!hasChanges || loading">
                    {{ loading ? 'Saving...' : 'Save Changes' }}
                </button>
            </div>
        </div>

        <div class="database-table-container">
            <table class="database-table">
                <thead>
                    <tr>
                        <th @click="sortBy('module')">
                            <div class="sortable-header">
                                <span>Module</span>
                                <span class="sort-indicator" :class="{ active: sortField === 'module' }">
                                    {{ sortField === 'module' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕' }}
                                </span>
                            </div>
                        </th>
                        <th @click="sortBy('key')">
                            <div class="sortable-header">
                                <span>Key</span>
                                <span class="sort-indicator" :class="{ active: sortField === 'key' }">
                                    {{ sortField === 'key' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕' }}
                                </span>
                            </div>
                        </th>
                        <th @click="sortBy('value')">
                            <div class="sortable-header">
                                <span>Value</span>
                                <span class="sort-indicator" :class="{ active: sortField === 'value' }">
                                    {{ sortField === 'value' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕' }}
                                </span>
                            </div>
                        </th>
                        <th @click="sortBy('separator')">
                            <div class="sortable-header">
                                <span>Separator</span>
                                <span class="sort-indicator" :class="{ active: sortField === 'separator' }">
                                    {{ sortField === 'separator' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕' }}
                                </span>
                            </div>
                        </th>
                        <th @click="sortBy('updated_at')">
                            <div class="sortable-header">
                                <span>Updated At</span>
                                <span class="sort-indicator" :class="{ active: sortField === 'updated_at' }">
                                    {{ sortField === 'updated_at' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕' }}
                                </span>
                            </div>
                        </th>
                        <th style="width: 80px;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in displayItems" 
                        :key="item.module + '-' + item.key" 
                        :class="{
                            'modified': item._status === 'modified',
                            'deleted': item._status === 'deleted',
                            'new': item._status === 'new'
                        }">
                        <td>
                            <input 
                                v-if="item._status !== 'deleted'"
                                type="text" 
                                class="field-input"
                                v-model="item.module"
                                @input="markChanged(item)"
                                placeholder="Module">
                            <span v-else class="readonly-field">{{ item.module }}</span>
                        </td>
                        <td>
                            <input 
                                v-if="item._status !== 'deleted'"
                                type="text" 
                                class="field-input"
                                v-model="item.key"
                                @input="markChanged(item)"
                                placeholder="Key">
                            <span v-else class="readonly-field">{{ item.key }}</span>
                        </td>
                        <td>
                            <div style="display: flex; align-items: center;" v-if="item._status !== 'deleted'">
                                <input 
                                    type="text"
                                    class="field-input"
                                    v-model="item.value"
                                    @input="markChanged(item)"
                                    @click="checkAutoExpand($event, item, 'value')"
                                    placeholder="Value">
                                <button 
                                    class="expand-btn" 
                                    @click="openModal(item, 'value')"
                                    title="Expand editor">
                                    ⤢
                                </button>
                            </div>
                            <span v-else class="readonly-field">{{ truncate(item.value, 50) }}</span>
                        </td>
                        <td>
                            <div style="display: flex; align-items: center;" v-if="item._status !== 'deleted'">
                                <input 
                                    type="text" 
                                    class="field-input"
                                    v-model="item.separator"
                                    @input="markChanged(item)"
                                    placeholder="none">
                                <button 
                                    class="expand-btn" 
                                    @click="openModal(item, 'separator')"
                                    title="Expand editor">
                                    ⤢
                                </button>
                            </div>
                            <span v-else class="readonly-field">
                                <span v-if="!item.separator || item.separator === ''" class="empty-indicator">&lt;none&gt;</span>
                                <span v-else>{{ item.separator }}</span>
                            </span>
                        </td>
                        <td>
                            <span class="readonly-field">{{ formatDate(item.updated_at) }}</span>
                        </td>
                        <td class="actions-cell">
                            <button 
                                v-if="item._status === 'deleted'"
                                class="btn btn-sm btn-secondary" 
                                @click="restoreItem(item)"
                                title="Restore">
                                ↩
                            </button>
                            <button 
                                v-else
                                class="btn btn-sm btn-danger" 
                                @click="deleteItem(item)"
                                title="Delete">
                                🗑
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <div class="add-row-container">
                <button class="btn btn-secondary" @click="addNewRow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5v14m-7-7h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Add New Entry
                </button>
            </div>
        </div>

        <!-- Edit Dialog -->
        <div v-if="modalVisible" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">
                        Edit {{ modalField }} 
                        <span style="color: var(--text-muted); font-size: 0.85em; font-weight: normal;">
                            - {{ modalTitle }}
                        </span>
                    </h3>
                    <button class="btn btn-icon btn-secondary" @click="closeModal">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="modal-controls">
                        <div class="control-group">
                            <div class="control-label">Display Mode:</div>
                            <div class="control-options">
                                <div class="control-option">
                                    <input type="radio" id="mode-default" v-model="displayMode" value="default" name="displayMode">
                                    <label for="mode-default">Default</label>
                                </div>
                                <div class="control-option">
                                    <input type="radio" id="mode-custom" v-model="displayMode" value="custom" name="displayMode">
                                    <label for="mode-custom">Custom Break</label>
                                    <input 
                                        v-if="displayMode === 'custom'"
                                        type="text" 
                                        class="separator-input"
                                        v-model="customLineBreak"
                                        placeholder="\\n">
                                </div>
                            </div>
                            <div class="mini-tools">
                                <button 
                                    class="mini-tool-btn" 
                                    @click="base64Decode"
                                    :disabled="!canBase64Decode"
                                    title="Base64 Decode (single line only)">
                                    B64 Decode
                                </button>
                                <button 
                                    class="mini-tool-btn" 
                                    @click="base64Encode"
                                    :disabled="!modalValue"
                                    title="Base64 Encode">
                                    B64 Encode
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <textarea 
                        class="modal-textarea"
                        :value="displayedValue"
                        @input="handleTextareaInput"
                        :placeholder="'Enter ' + modalField + '...'"
                        ref="modalTextarea"
                        :style="{ whiteSpace: displayMode === 'default' ? 'pre-wrap' : 'pre' }">
                    </textarea>
                </div>
                <div class="modal-footer">
                    <div class="editor-stats">
                        <span>Characters: {{ modalValue.length }}</span>
                        <span style="margin-left: 16px;">Lines: {{ lineCount }}</span>
                        <span v-if="displayMode === 'custom' && customLineBreak && customLineBreak !== '\\\\n'" style="margin-left: 16px;">
                            Segments: {{ separatorCount }}
                        </span>
                        <button class="editor-action-btn" @click="copyContent" style="margin-left: 16px;">Copy</button>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-secondary" @click="closeModal">
                            Cancel
                        </button>
                        <button class="btn btn-primary" @click="applyModalChanges">
                            Apply Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Save Confirmation Dialog -->
        <div v-if="confirmVisible" class="modal-overlay">
            <div class="confirm-dialog">
                <div class="confirm-header">
                    <h3 class="confirm-title">
                        {{ hasOverwrite ? 'Warning: Overwrite Detected' : 'Confirm Changes' }}
                    </h3>
                    <p class="confirm-subtitle">
                        {{ hasOverwrite 
                            ? 'The following changes include overwrite operations that will replace existing data:' 
                            : 'Review and confirm the following changes:' }}
                    </p>
                </div>
                <div class="confirm-body">
                    <div class="changes-list">
                        <div v-for="change in pendingChanges" 
                             :key="change.id" 
                             class="change-item"
                             :class="change.type">
                            <strong>{{ change.type.toUpperCase() }}</strong> 
                            {{ change.module }}/{{ change.key }}
                            <div v-if="change.type === 'update'" style="margin-left: 16px; color: var(--text-muted);">
                                {{ change.changes.join(', ') }}
                            </div>
                            <div v-if="change.type === 'overwrite'" style="margin-left: 16px; color: #9333ea; font-weight: bold;">
                                ⚠️ This will overwrite existing data!
                            </div>
                        </div>
                    </div>
                </div>
                <div class="confirm-footer">
                    <button class="btn btn-secondary" @click="confirmVisible = false">
                        Cancel
                    </button>
                    <button class="btn btn-danger" @click="confirmSave">
                        Confirm & Save
                    </button>
                </div>
            </div>
        </div>
    </div>
`;

export const js = `
    const DatabaseView = {
        template: \`${html}\`,
        props: ['showToast'],
        setup(props) {
            const { ref, computed, onMounted, nextTick, watch } = Vue;
            const items = ref([]);
            const originalItems = ref([]);
            const loading = ref(false);
            const modalVisible = ref(false);
            const confirmVisible = ref(false);
            const modalItem = ref(null);
            const modalField = ref('');
            const modalValue = ref('');
            const modalTextarea = ref(null);
            const displayMode = ref('default'); // Display mode: default, custom
            const customLineBreak = ref('\\n'); // Custom line break
            const sortField = ref(''); // Sort field
            const sortOrder = ref('asc'); // Sort order: asc or desc

            const LENGTH_THRESHOLD = 50; // Length threshold for auto-popup

            // Computed properties
            const displayItems = computed(() => {
                let result = [...items.value];
                
                if (sortField.value) {
                    result.sort((a, b) => {
                        let aVal = a[sortField.value] || '';
                        let bVal = b[sortField.value] || '';
                        
                        // For date fields, use date comparison
                        if (sortField.value === 'updated_at') {
                            aVal = new Date(aVal || 0);
                            bVal = new Date(bVal || 0);
                            return sortOrder.value === 'asc' ? aVal - bVal : bVal - aVal;
                        }
                        
                        // String comparison
                        aVal = String(aVal).toLowerCase();
                        bVal = String(bVal).toLowerCase();
                        
                        if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1;
                        if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1;
                        return 0;
                    });
                }
                
                return result;
            });
            
            const hasChanges = computed(() => {
                return items.value.some(item => 
                    item._status === 'new' || 
                    item._status === 'modified' || 
                    item._status === 'deleted'
                );
            });

            const changeCount = computed(() => {
                return items.value.filter(item => 
                    item._status === 'new' || 
                    item._status === 'modified' || 
                    item._status === 'deleted'
                ).length;
            });

            const pendingChanges = computed(() => {
                const changes = [];
                
                items.value.forEach(item => {
                    if (item._status === 'new') {
                        // Check if the newly created item conflicts with an existing item
                        const targetExists = originalItems.value.some(orig => 
                            orig.module === item.module && orig.key === item.key
                        );
                        
                        changes.push({
                            id: item.module + '-' + item.key + '-new',
                            type: targetExists ? 'overwrite' : 'create',
                            module: item.module,
                            key: item.key
                        });
                    } else if (item._status === 'deleted') {
                        changes.push({
                            id: item.module + '-' + item.key + '-delete',
                            type: 'delete',
                            module: item.module,
                            key: item.key
                        });
                    } else if (item._status === 'modified') {
                        const original = originalItems.value.find(orig => 
                            orig.module === item._originalModule && orig.key === item._originalKey
                        );
                        const changedFields = [];
                        
                        if (original) {
                            if (item.module !== original.module) changedFields.push('module');
                            if (item.key !== original.key) changedFields.push('key');
                            if (item.value !== original.value) changedFields.push('value');
                            if (item.separator !== original.separator) changedFields.push('separator');
                        }
                        
                        // Check if it is a rename operation (module or key changed)
                        const isRenamed = (item.module !== item._originalModule || item.key !== item._originalKey);
                        let changeType = 'update';
                        
                        if (isRenamed) {
                            // Check if the target location after rename already exists (excluding the current item itself)
                            const targetExists = originalItems.value.some(orig => 
                                orig.module === item.module && 
                                orig.key === item.key &&
                                !(orig.module === item._originalModule && orig.key === item._originalKey)
                            );
                            
                            if (targetExists) {
                                changeType = 'overwrite';
                            }
                        }
                        
                        changes.push({
                            id: item.module + '-' + item.key + '-update',
                            type: changeType,
                            module: item.module,
                            key: item.key,
                            changes: changedFields
                        });
                    }
                });
                
                return changes;
            });
            
            // Check if there are overwrite operations
            const hasOverwrite = computed(() => {
                return pendingChanges.value.some(change => change.type === 'overwrite');
            });

            // Newline conversion helper functions
            const NEWLINE_PLACEHOLDER = '/*N*/';
            
            const convertNewlinesToPlaceholder = (text) => {
                if (typeof text !== 'string') return text;
                return text.replace(/\\n/g, NEWLINE_PLACEHOLDER);
            };
            
            const convertPlaceholderToNewlines = (text) => {
                if (typeof text !== 'string') return text;
                // Use regex for escaping to avoid matching issues
                return text.replace(/\\/\\*N\\*\\//g, '\\n');
            };

            // Modal related computed properties
            const currentSeparator = computed(() => {
                if (!modalItem.value) return '';
                return modalItem.value.separator || '';
            });

            const lineCount = computed(() => {
                if (!modalValue.value) return 0;
                return modalValue.value.split('\\n').length;
            });

            const separatorCount = computed(() => {
                if (!modalValue.value) return 0;
                if (displayMode.value === 'custom' && customLineBreak.value && customLineBreak.value !== '\\n') {
                    return modalValue.value.split(customLineBreak.value).length;
                }
                return 0;
            });

            const formattedModalValue = computed(() => {
                if (!modalValue.value) return '';
                
                switch (displayMode.value) {
                    case 'separator':
                        if (currentSeparator.value) {
                            return modalValue.value.split(currentSeparator.value).join('\\n');
                        }
                        return modalValue.value;
                    case 'custom':
                        if (customLineBreak.value) {
                            return modalValue.value.split(customLineBreak.value).join('\\n');
                        }
                        return modalValue.value;
                    default:
                        return modalValue.value;
                }
            });

            const displayedValue = computed(() => {
                if (!modalValue.value) return '';
                
                switch (displayMode.value) {
                    case 'custom':
                        if (customLineBreak.value && customLineBreak.value !== '\\n') {
                            // Split modalValue (already placeholder version) by custom separator, join with newline for display
                            return modalValue.value.split(customLineBreak.value).join('\\n');
                        }
                        // When no custom separator, display placeholder version directly
                        return modalValue.value;
                    default:
                        // In Default mode, display original value directly
                        return modalValue.value;
                }
            });

            // Base64 related computed properties
            const canBase64Decode = computed(() => {
                if (!modalValue.value) return false;
                // Allow decoding only when content is a single line
                const lines = modalValue.value.split('\\n').filter(line => line.trim());
                if (lines.length !== 1) return false;
                
                // Simple check if it might be base64 format
                const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
                return base64Regex.test(lines[0].trim()) && lines[0].trim().length > 0;
            });

            // Modal title display
            const modalTitle = computed(() => {
                if (!modalItem.value) return 'Unknown/Unknown';
                const module = modalItem.value.module || 'Unknown';
                const key = modalItem.value.key || 'Unknown';
                return module + '/' + key;
            });

            // Methods
            const loadData = async () => {
                loading.value = true;
                try {
                    const auth = localStorage.getItem('v_auth');
                    const response = await fetch('/api/data', {
                        method: 'POST',
                        headers: {
                            'Authorization': auth,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify([{ type: 'list' }])
                    });
                    
                    if (!response.ok) {
                        throw new Error('Failed to load data');
                    }
                    
                    const result = await response.json();
                    if (result[0].status !== 200) {
                        throw new Error(result[0].data.error || 'Failed to load data');
                    }
                    const data = result[0].data;

                    originalItems.value = JSON.parse(JSON.stringify(data));
                    items.value = data.map(item => ({
                        ...item,
                        _status: 'unchanged',
                        _originalModule: item.module,
                        _originalKey: item.key
                    }));
                } catch (error) {
                    props.showToast('Failed to load database: ' + error.message, 'error');
                } finally {
                    loading.value = false;
                }
            };

            const markChanged = (item) => {
                if (item._status === 'new') return;
                if (item._status !== 'modified') {
                    item._status = 'modified';
                }
            };

            const sortBy = (field) => {
                if (sortField.value === field) {
                    // If already sorted by this field, toggle sort direction
                    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
                } else {
                    // Switch to new field, default ascending
                    sortField.value = field;
                    sortOrder.value = 'asc';
                }
            };

            const checkAutoExpand = (event, item, field) => {
                // Check content length, auto-open modal if exceeds threshold
                const value = item[field] || '';
                if (value.length > LENGTH_THRESHOLD) {
                    event.preventDefault();
                    openModal(item, field);
                }
            };

            const autoResizeTextarea = () => {
                nextTick(() => {
                    if (modalTextarea.value) {
                        const textarea = modalTextarea.value;
                        textarea.style.height = 'auto';
                        const newHeight = Math.max(150, Math.min(textarea.scrollHeight + 2, window.innerHeight * 0.6));
                        textarea.style.height = newHeight + 'px';
                    }
                });
            };

            const autoResizeModal = () => {
                nextTick(() => {
                    if (modalTextarea.value) {
                        const textarea = modalTextarea.value;
                        const modal = textarea.closest('.modal-content');
                        if (modal) {
                            // Create a temporary element to measure text width
                            const tempDiv = document.createElement('div');
                            tempDiv.style.position = 'absolute';
                            tempDiv.style.visibility = 'hidden';
                            tempDiv.style.whiteSpace = 'pre';
                            tempDiv.style.font = window.getComputedStyle(textarea).font;
                            tempDiv.style.fontSize = window.getComputedStyle(textarea).fontSize;
                            tempDiv.style.fontFamily = window.getComputedStyle(textarea).fontFamily;
                            
                            document.body.appendChild(tempDiv);
                            
                            // Find the widest line
                            const lines = textarea.value.split('\\n');
                            let maxWidth = 0;
                            lines.forEach(line => {
                                tempDiv.textContent = line || ' '; // Replace empty lines with space
                                maxWidth = Math.max(maxWidth, tempDiv.offsetWidth);
                            });
                            
                            document.body.removeChild(tempDiv);
                            
                            // Calculate suitable modal width (text width + padding + scrollbar etc.)
                            const padding = 48; // 24px * 2 sides
                            const scrollbarWidth = 20;
                            const minWidth = 720;
                            const maxModalWidth = Math.min(window.innerWidth * 0.9, 1400);
                            
                            const idealWidth = Math.max(minWidth, Math.min(maxWidth + padding + scrollbarWidth, maxModalWidth));
                            modal.style.width = idealWidth + 'px';
                        }
                    }
                });
            };

            const handleTextareaInput = (event) => {
                const inputValue = event.target.value;
                
                // Handle input value based on display mode
                switch (displayMode.value) {
                    case 'custom':
                        // In non-Default mode, convert user input newlines to placeholders for storage
                        modalValue.value = convertNewlinesToPlaceholder(inputValue);
                        break;
                    default:
                        // In Default mode, store original value directly
                        modalValue.value = inputValue;
                        break;
                }
                
                autoResizeTextarea();
                autoResizeModal();
            };

            const openModal = (item, field) => {
                modalItem.value = item;
                modalField.value = field;
                // Display original value directly
                const originalValue = item[field] || '';
                modalVisible.value = true;
                
                // Set default display mode and auto-fill based on separator existence
                if (item.separator) {
                    displayMode.value = 'custom';
                    customLineBreak.value = item.separator;
                    // In custom mode, convert real newlines to placeholders for storage
                    modalValue.value = convertNewlinesToPlaceholder(originalValue);
                } else {
                    displayMode.value = 'default';
                    customLineBreak.value = '\\n';
                    // In default mode, store original value directly
                    modalValue.value = originalValue;
                }
                
                nextTick(() => {
                    if (modalTextarea.value) {
                        modalTextarea.value.focus();
                        autoResizeTextarea();
                        autoResizeModal();
                    }
                });
            };

            const closeModal = () => {
                modalVisible.value = false;
                modalItem.value = null;
                modalField.value = '';
                modalValue.value = '';
                displayMode.value = 'default';
                customLineBreak.value = '\\n';
            };

            const applyModalChanges = () => {
                if (modalItem.value && modalField.value) {
                    // Convert and save value based on current display mode
                    let valueToSave = modalValue.value;
                    
                    switch (displayMode.value) {
                        case 'custom':
                            // In non-Default mode, convert placeholders back to newlines before saving
                            valueToSave = convertPlaceholderToNewlines(modalValue.value);
                            break;
                        default:
                            // In Default mode, save original value directly
                            valueToSave = modalValue.value;
                            break;
                    }
                    
                    modalItem.value[modalField.value] = valueToSave;
                    markChanged(modalItem.value);
                }
                closeModal();
            };

            const deleteItem = (item) => {
                item._status = 'deleted';
            };

            const restoreItem = (item) => {
                if (item._status === 'deleted') {
                    // Check if it is a newly added item
                    const isNewItem = !originalItems.value.some(orig => 
                        orig.module === item._originalModule && orig.key === item._originalKey
                    );
                    item._status = isNewItem ? 'new' : 'modified';
                }
            };

            const addNewRow = () => {
                const newItem = {
                    module: '',
                    key: '',
                    value: '',
                    separator: '',
                    updated_at: new Date().toISOString(),
                    _status: 'new',
                    _originalModule: '',
                    _originalKey: ''
                };
                items.value.push(newItem);
            };

            const saveChanges = () => {
                if (!hasChanges.value) return;
                confirmVisible.value = true;
            };

            const confirmSave = async () => {
                loading.value = true;
                confirmVisible.value = false;
                
                try {
                    const ops = [];
                    
                    items.value.forEach(item => {
                        if (item._status === 'deleted') {
                            ops.push({
                                type: 'delete',
                                module: item._originalModule,
                                key: item._originalKey
                            });
                        } else if (item._status === 'new') {
                            ops.push({
                                type: 'write',
                                module: item.module,
                                key: item.key,
                                value: item.value,
                                separator: item.separator
                            });
                        } else if (item._status === 'modified') {
                            // Check if it is a rename operation (module or key changed)
                            const isRenamed = (item.module !== item._originalModule || item.key !== item._originalKey);
                            
                            if (isRenamed) {
                                // Rename: delete original record first, then create new record
                                ops.push({
                                    type: 'delete',
                                    module: item._originalModule,
                                    key: item._originalKey
                                });
                            }
                            
                            // Create or update record
                            ops.push({
                                type: 'write',
                                module: item.module,
                                key: item.key,
                                value: item.value,
                                separator: item.separator
                            });
                        }
                    });
                    
                    const auth = localStorage.getItem('v_auth');
                    const response = await fetch('/api/data', {
                        method: 'POST',
                        headers: {
                            'Authorization': auth,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ ops })
                    });
                    
                    if (!response.ok) {
                        throw new Error('Failed to save changes');
                    }
                    
                    props.showToast('Changes saved successfully');
                    await loadData(); // Reload data
                } catch (error) {
                    props.showToast('Failed to save changes: ' + error.message, 'error');
                } finally {
                    loading.value = false;
                }
            };

            const formatDate = (dateString) => {
                if (!dateString) return '';
                return new Date(dateString).toLocaleString();
            };

            const truncate = (str, length) => {
                if (!str) return '';
                return str.length > length ? str.substring(0, length) + '...' : str;
            };

            onMounted(() => {
                loadData();
            });

            // Watch display mode changes, update textarea display
            watch([displayMode, customLineBreak], (newValues, oldValues) => {
                if (!modalVisible.value) return;
                
                const [newMode, newCustomBreak] = newValues;
                const [oldMode, oldCustomBreak] = oldValues || [];
                
                // If mode changes, need to convert modalValue format
                if (oldMode && newMode !== oldMode && modalValue.value) {
                    if (newMode === 'custom' && oldMode === 'default') {
                        // Switch from default to custom, convert real newlines to placeholders
                        modalValue.value = convertNewlinesToPlaceholder(modalValue.value);
                    } else if (newMode === 'default' && oldMode === 'custom') {
                        // Switch from custom to default, convert placeholders to real newlines
                        modalValue.value = convertPlaceholderToNewlines(modalValue.value);
                    }
                }
                
                nextTick(() => {
                    if (modalTextarea.value) {
                        // Adjust text display based on display mode
                        const textarea = modalTextarea.value;
                        switch (displayMode.value) {
                            case 'default':
                                textarea.style.whiteSpace = 'pre-wrap';
                                break;
                            case 'custom':
                                textarea.style.whiteSpace = 'pre';
                                break;
                        }
                        
                        // When switching modes, need to update textarea value to reflect new display format
                        if (modalValue.value) {
                            textarea.value = displayedValue.value;
                        }
                        
                        autoResizeTextarea();
                        autoResizeModal();
                    }
                });
            });

            // Editor operations
            const copyContent = () => {
                if (modalValue.value) {
                    navigator.clipboard.writeText(modalValue.value).then(() => {
                        // Simple notification could be added here
                        console.log('Content copied to clipboard');
                    });
                }
            };

            // Base64 operations
            const base64Encode = () => {
                if (!modalValue.value) return;
                try {
                    const encoded = btoa(unescape(encodeURIComponent(modalValue.value)));
                    modalValue.value = encoded;
                } catch (error) {
                    console.error('Base64 encode error:', error);
                    // Could show user-friendly error message
                }
            };

            const base64Decode = () => {
                if (!canBase64Decode.value) return;
                try {
                    const lines = modalValue.value.split('\\n').filter(line => line.trim());
                    const base64String = lines[0].trim();
                    const decoded = decodeURIComponent(escape(atob(base64String)));
                    modalValue.value = decoded;
                } catch (error) {
                    console.error('Base64 decode error:', error);
                    // Could show user-friendly error message
                }
            };

            return {
                items,
                loading,
                modalVisible,
                confirmVisible,
                modalField,
                modalValue,
                modalTextarea,
                displayMode,
                customLineBreak,
                sortField,
                sortOrder,
                displayItems,
                hasChanges,
                changeCount,
                pendingChanges,
                hasOverwrite,
                currentSeparator,
                lineCount,
                separatorCount,
                formattedModalValue,
                displayedValue,
                canBase64Decode,
                modalTitle,
                markChanged,
                sortBy,
                checkAutoExpand,
                autoResizeTextarea,
                autoResizeModal,
                handleTextareaInput,
                openModal,
                closeModal,
                applyModalChanges,
                deleteItem,
                restoreItem,
                addNewRow,
                saveChanges,
                confirmSave,
                formatDate,
                truncate,
                copyContent,
                base64Encode,
                base64Decode
            };
        }
    };
`;