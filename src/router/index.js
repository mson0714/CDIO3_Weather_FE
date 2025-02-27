import { createRouter, createWebHistory } from "vue-router"; // cài vue-router: npm install vue-router@next --save

const routes = [
    {
        path : '/',
        component: ()=>import('../layout/wrapper/index.vue')
    },
    {
        path : '/du-bao-thoi-tiet',
        component: ()=>import('../components/dubaothoitiet/index.vue')
    },
    {
        path : '/trang-chu',
        component: ()=>import('../components/TrangChu/index.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router