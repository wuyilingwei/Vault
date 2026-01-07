// router.js - Vue Router configuration
(function() {
    const { createRouter, createWebHashHistory } = VueRouter;

    const routes = [
        { path: '/', redirect: '/tokens' },
        { path: '/login', name: 'login', component: window.LoginView },
        { path: '/tokens', name: 'tokens', component: window.TokenView, meta: { requiresAuth: true } },
        { path: '/database', name: 'database', component: window.DatabaseView, meta: { requiresAuth: true } }
    ];

    const router = createRouter({
        history: createWebHashHistory(),
        routes
    });

    router.beforeEach((to, from, next) => {
        const isAuthenticated = !!localStorage.getItem('v_auth');
        if (to.meta.requiresAuth && !isAuthenticated) {
            next('/login');
        } else if (to.path === '/login' && isAuthenticated) {
            next('/tokens');
        } else {
            next();
        }
    });

    // Export router globally
    window.router = router;
})();
