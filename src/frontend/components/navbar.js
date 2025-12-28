export const css = `
    /* Header */
    header {
        background: var(--bg-card); border-bottom: 1px solid var(--border);
        padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between;
        box-shadow: var(--shadow); z-index: 10; flex-shrink: 0;
    }
    
    /* Logo */
    .logo {
        display: flex; align-items: center; gap: 12px;
        font-size: 20px; font-weight: 600; color: var(--primary);
        text-decoration: none;
    }
    
    .logo-icon {
        width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
        background: linear-gradient(135deg, var(--primary), #6366f1);
        border-radius: 8px; color: white; font-weight: bold; font-size: 16px;
    }
    
    h1 { font-size: 20px; font-weight: 600; color: var(--primary); }

    /* Tabs */
    .nav-tabs { display: flex; gap: 24px; }
    .nav-tab { 
        padding: 0 4px; height: 64px; display: flex; align-items: center; 
        cursor: pointer; border-bottom: 2px solid transparent; font-weight: 500; color: var(--text-muted);
        text-decoration: none;
    }
    .nav-tab:hover { color: var(--text-main); }
    .nav-tab.active { border-bottom-color: var(--primary); color: var(--primary); }

    /* Theme Toggle */
    .theme-toggle {
        display: flex; align-items: center; justify-content: center;
        width: 40px; height: 40px; border-radius: 8px;
        background: var(--bg-input); border: 1px solid var(--border);
        cursor: pointer; transition: all 0.2s;
        color: var(--text-muted);
    }
    
    .theme-toggle:hover {
        background: var(--bg-card); border-color: var(--primary);
        color: var(--text-main);
    }
    
    .theme-toggle.dark {
        background: var(--bg-card); color: var(--primary);
    }
    
    .theme-toggle svg {
        width: 18px; height: 18px;
        transition: transform 0.2s;
    }

    /* Footer */
    .app-footer {
        text-align: center; padding: 12px; font-size: 12px; color: var(--text-muted);
        background: var(--bg-body); border-top: 1px solid var(--border);
    }
`;

const html = `
    <header>
        <div style="display: flex; align-items: center; gap: 32px;">
            <div class="logo">
                <div class="logo-icon">A</div>
                <span>AetherVault Manager</span>
            </div>
            <div class="nav-tabs">
                <router-link to="/tokens" class="nav-tab" active-class="active">Tokens</router-link>
                <router-link v-if="showDatabase" to="/database" class="nav-tab" active-class="active">Database</router-link>
            </div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
            <button class="theme-toggle" :class="{ dark: isDark }" @click="toggleTheme" :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
                <svg v-if="isDark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" fill-opacity="0.2"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.2"/>
                </svg>
            </button>
            <button class="btn btn-danger btn-sm" @click="$emit('logout')">Logout</button>
        </div>
    </header>
`;

export const js = `
    const NavBar = {
        template: \`${html}\`,
        props: ['showDatabase'],
        emits: ['logout'],
        setup() {
            const { ref, onMounted, watch } = Vue;
            
            const isDark = ref(false);
            
            // Initialize theme
            const initTheme = () => {
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme) {
                    isDark.value = savedTheme === 'dark';
                } else {
                    // Initialize based on browser settings
                    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
                }
                applyTheme();
            };
            
            // Apply theme
            const applyTheme = () => {
                if (isDark.value) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                    document.documentElement.removeAttribute('data-theme');
                }
            };
            
            // Toggle theme
            const toggleTheme = () => {
                isDark.value = !isDark.value;
                localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
                applyTheme();
            };
            
            // Listen for browser theme changes
            onMounted(() => {
                initTheme();
                
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                const handleChange = (e) => {
                    if (!localStorage.getItem('theme')) {
                        isDark.value = e.matches;
                        applyTheme();
                    }
                };
                
                mediaQuery.addEventListener('change', handleChange);
                
                // Cleanup function
                return () => {
                    mediaQuery.removeEventListener('change', handleChange);
                };
            });
            
            return {
                isDark,
                toggleTheme
            };
        }
    };
`;
