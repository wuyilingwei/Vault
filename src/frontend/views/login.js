export const css = `
  .login-page {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: system-ui, sans-serif;
    padding: 2rem;
    box-sizing: border-box;
  }
  
  .login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  
  .login-box {
    position: relative;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 2rem;
    width: 100%;
    max-width: 360px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  [data-theme="dark"] .login-box {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
  
  .theme-toggle-btn {
    position: absolute;
    top: 36px;
    right: 24px;
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  
  .theme-toggle-btn:hover {
    background: var(--bg-hover);
    color: var(--text);
  }
  
  .login-title {
    margin: 0 0 24px 0;
    font-size: 28px;
    font-weight: 600;
    color: var(--primary);
    text-align: left;
    padding-right: 40px; /* Space for theme button */
  }
  
  .login-box input {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 14px;
    background: var(--bg-input);
    color: var(--text);
    box-sizing: border-box;
    transition: border-color 0.2s;
  }
  
  .login-box input:focus {
    outline: none;
    border-color: var(--primary);
  }
  
  .login-page .btn {
    padding: 12px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
    box-sizing: border-box;
  }
  
  .login-page .btn-primary {
    background: var(--primary);
    color: white;
  }
  
  .login-page .btn-primary:hover:not(:disabled) {
    background: var(--primary-hover);
  }
  
  .login-page .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .login-footer {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    color: var(--text-secondary);
    font-size: 12px;
  }
  
  .login-footer a {
    color: var(--text-secondary);
    text-decoration: underline;
  }
  
  .login-footer a:hover {
    color: var(--text);
  }
`;

const html = `
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
`;

export const js = `
    const LoginView = {
        template: \`${html}\`,
        props: ['showToast'],
        emits: ['login-success'],
        setup(props, { emit }) {
            const { onMounted } = Vue;
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
`;
