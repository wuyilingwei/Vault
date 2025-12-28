import { css as commonCss } from './common.js';
import { css as loginCss, js as loginJs } from './views/login.js';
import { css as tokenCss, js as tokenJs } from './views/token.js';
import { css as dbCss, js as dbJs } from './views/database.js';
import { css as navCss, js as navJs } from './components/navbar.js';
import { js as routerJs } from './router.js';
import { js as mainJs } from './main.js';

export function renderHtml(env) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AetherVault</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script src="https://unpkg.com/vue-router@4/dist/vue-router.global.js"></script>
  <style>
    ${commonCss}
    ${loginCss}
    ${tokenCss}
    ${dbCss}
    ${navCss}
  </style>
</head>
<body>
  <div id="app">
    <nav-bar v-if="showNav" @logout="onLogout" :show-database="showDatabase"></nav-bar>
    
    <div class="container" :class="{ 'full-height': !showNav }">
        <router-view 
            @login-success="onLoginSuccess"
            :auth-header="authHeader" 
            :show-toast="showToast">
        </router-view>
    </div>

    <footer class="app-footer" v-if="showNav">
        <div>Powered by <a href="https://github.com/wuyilingwei/Vault" target="_blank" style="color: inherit; text-decoration: underline;">AetherVault</a></div>
    </footer>

    <!-- Toasts -->
    <div class="toast-container">
        <div v-for="msg in toasts" :key="msg.id" class="toast" 
             :style="{background: msg.type === 'error' ? 'var(--danger)' : 'var(--success)'}">
            {{ msg.text }}
        </div>
    </div>
  </div>

  <script>
    ${loginJs}
    ${navJs}
    ${tokenJs}
    ${dbJs}
    ${routerJs}
    ${mainJs}
  </script>
</body>
</html>
`;
}
