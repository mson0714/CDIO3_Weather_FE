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
    {
        path : '/thoi-tiet',
        component: ()=>import('../components/ThoiTiet/DuBao/index.vue'),
        
    },
    {
        path : '/thoi-tiet/mien-bac',
        component: ()=>import('../components/ThoiTiet/MienBac/index.vue'),
        
    },
    {
        path : '/thoi-tiet/mien-trung',
        component: ()=>import('../components/ThoiTiet/MienTrung/index.vue'),
        
    },
    {
        path : '/thoi-tiet/mien-nam',
        component: ()=>import('../components/ThoiTiet/MienNam/index.vue'),
        
    },
    {
        path : '/chat-luong-khong-khi',
        component: ()=>import('../components/CanhBaoUV/index.vue'),
        
    },
    {
        path : '/thoi-tiet/10-ngay',
        component: ()=>import('../components/ThoiTiet/10Ngay/index.vue'),
        
    },
    {
        path : '/canh-bao/lu-lut',
        component: ()=>import('../components/CanhBaoLu/index.vue'),
   
        
    },

   
        
   
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router