import { createRouter, createWebHistory } from "vue-router"; // cài vue-router: npm install vue-router@next --save

const routes = [
    {
        path : '/',
        component: ()=>import('../components/TrangChu/index.vue')
    },
    {
        path : '/du-bao-thoi-tiet',
        component: ()=>import('../components/dubaothoitiet/index.vue')
    },
    {
        path : '/ban-do',
        component: ()=>import('../components/BanDo/index.vue')
    },
    {
        path : '/dang-ky',
        component: ()=>import('../components/NguoiDung/DangKy/index.vue'),
        meta: {
            layout: 'blank'
        }
    },
    {
        path : '/dang-nhap',
        component: ()=>import('../components/NguoiDung/DangNhap/index.vue'),
        meta: {
            layout: 'blank'
        }
    },
   
        
   
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router