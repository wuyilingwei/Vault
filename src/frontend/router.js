export const js = `
    const routes = [
        { path: '/', redirect: '/tokens' },
        { path: '/login', name: 'login', component: LoginView },
        { path: '/tokens', name: 'tokens', component: TokenView, meta: { requiresAuth: true } },
        { path: '/database', name: 'database', component: DatabaseView, meta: { requiresAuth: true } }
    ];

    const router = VueRouter.createRouter({
        history: VueRouter.createWebHashHistory(),
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
`;
