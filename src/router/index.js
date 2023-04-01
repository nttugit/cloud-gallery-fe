import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"
import UploadView from "../views/UploadView.vue"
import BlogView from "../views/BlogView.vue"
import ContactView from "../views/ContactView.vue"

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/upload',
        name: 'upload',
        // lazy loading
        component: UploadView,

        // component: require("../views/UploadView.vue")(),
    },
    {
        path: '/blog',
        name: 'blog',
        component: BlogView,
    },
    {
        path: '/contact',
        name: 'contact',
        component: ContactView,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;