// login.js - Login view component
const { ref, onMounted } = Vue;

const LoginView = {
    template: `
        <div class="login-page">
            <div class="login-container">
                <div class="login-box">
                    <!-- Theme toggle button in top right corner of login box -->
                    <button class="theme-toggle-btn" @click="toggleTheme" :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
                        <svg v-if="!isDark" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
                        </svg>
                        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    
                    <h2 class="login-title">AetherVault Login</h2>
                    <input type="text" v-model="username" placeholder="Username" style="margin-bottom: 12px;" :disabled="loading">
                    <input type="password" v-model="password" placeholder="Password" @keyup.enter="login" style="margin-bottom: 16px;" :disabled="loading">
                    <button class="btn btn-primary" style="width: 100%" @click="login" :disabled="loading">
                        {{ loading ? 'Logging in...' : 'Login' }}
                    </button>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="login-footer">
                <div>Powered by <a href="https://github.com/wuyilingwei/Vault" target="_blank">AetherVault</a></div>
            </div>
        </div>
    `,
    props: ['showToast'],
    emits: ['login-success'],
    setup(props, { emit }) {
        const username = ref('');
        const password = ref('');
        const loading = ref(false);
        const isDark = ref(false);
        const router = VueRouter.useRouter();

        const initTheme = () => {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                isDark.value = savedTheme === 'dark';
            } else {
                isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
            updateTheme();
        };

        const updateTheme = () => {
            document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light');
            localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
        };

        const toggleTheme = () => {
            isDark.value = !isDark.value;
            updateTheme();
        };

        onMounted(() => {
            initTheme();
        });

        const login = async () => {
            if(!password.value || !username.value) return;
            loading.value = true;
            
            // Note: Basic auth should only be used over HTTPS in production
            const auth = 'Basic ' + btoa(username.value + ':' + password.value);
            
            try {
                // Verify credentials by fetching list
                const res = await fetch('/api/auth/list', {
                    headers: { 'Authorization': auth }
                });
                
                if (res.status === 200) {
                    props.showToast('Login Successful');
                    emit('login-success', auth);
                    router.push('/tokens');
                } else {
                    try {
                        const err = await res.json();
                        if (err.code) props.showToast('Login Failed: ' + err.code, 'error');
                        else props.showToast('Login Failed', 'error');
                    } catch {
                        props.showToast('Login Failed', 'error');
                    }
                }
            } catch(e) {
                props.showToast('Network Error', 'error');
            } finally {
                loading.value = false;
            }
        };

        return { username, password, loading, login, isDark, toggleTheme };
    }
};

// Make LoginView available globally
window.LoginView = LoginView;
