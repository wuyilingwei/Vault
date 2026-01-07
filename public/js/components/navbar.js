// navbar.js - Navigation bar component
(function() {
    const { ref, onMounted, onUnmounted } = Vue;

    const NavBar = {
    template: `
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
    `,
    props: ['showDatabase'],
    emits: ['logout'],
    setup() {
        const isDark = ref(false);
        let mediaQuery = null;
        let handleChange = null;
        
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
            
            mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            handleChange = (e) => {
                if (!localStorage.getItem('theme')) {
                    isDark.value = e.matches;
                    applyTheme();
                }
            };
            
            mediaQuery.addEventListener('change', handleChange);
        });
        
        // Cleanup event listener
        onUnmounted(() => {
            if (mediaQuery && handleChange) {
                mediaQuery.removeEventListener('change', handleChange);
            }
        });
        
        return {
            isDark,
            toggleTheme
        };
    }
};

// Make NavBar available globally
window.NavBar = NavBar;
})();
