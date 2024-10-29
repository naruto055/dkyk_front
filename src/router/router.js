import {createRouter, createWebHistory} from "vue-router"

const router = createRouter({
    // 路由历史
    history: createWebHistory(),
    routes: [
        {
            // 路径
            path: '/',
            component: () => import('../view/LoginView.vue')      // 路由懒加载
        },
        {
            path: '/dashboard',
            component: () => import('../view/DashboardView.vue'),
            children: [
                {
                    path: '',
                    component: () => import('../view/StatisticView.vue')
                },
                {
                    path: 'user',
                    component: () => import('../view/UserView.vue')
                },
                {
                    path: 'user/:id',
                    component: () => import('../view/UserDetailView.vue')
                },
                {
                    path: 'activity',
                    component: () => import('../view/ActivityView.vue')
                },
                {
                    path: 'activity/add',
                    component: () => import('../view/ActivityRecordView.vue')
                },
                {
                    path: 'activity/edit/:id',
                    component: () => import('../view/ActivityRecordView.vue')
                },
                {
                    path: 'activity/:id',
                    component: () => import('../view/ActivityDetailView.vue')
                },
                {
                    path: 'clue',
                    component: () => import('../view/ClueView.vue')
                },
                {
                    path: 'clue/add',
                    component: () => import('../view/ClueRecordView.vue')
                },
                {
                    path: 'clue/edit/:id',
                    component: () => import('../view/ClueRecordView.vue')
                },
                {
                    path: 'clue/detail/:id',
                    component: () => import('../view/ClueDetailView.vue')
                },
                {
                    path: 'customer',
                    component: () => import('../view/CustomerView.vue')
                },
            ]
        }
    ]
})

export default router;