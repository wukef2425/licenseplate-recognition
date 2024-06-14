import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: '',
        component: () => import('@/components/MainPage.vue')
    },
    {
        path: '/UploadPlate',
        name: 'UploadPlate',
        component: () => import('@/components/UploadPlate.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
