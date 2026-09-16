import { createRouter, createWebHistory } from 'vue-router'
import { useScouterStore } from '@/stores/scouterStore.js'

import AuthView from '../views/AuthView.vue'
import RoditeljView from '../views/RoditeljView.vue'
import AdminView from '../views/AdminView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'prijava',
            component: AuthView
        },
        {
            path: '/roditelj',
            name: 'roditelj',
            component: RoditeljView,
            meta: { trebaPrijava: true }
        },
        {
            path: '/admin',
            name: 'admin',
            component: AdminView,
            meta: { trebaPrijava: true, samoAdmin: true }
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/'
        }
    ]
})

router.beforeEach((to) => {
    const scouterStore = useScouterStore()

    if (to.meta.trebaPrijava && scouterStore.korisnik == null) {
        return { name: 'prijava' }
    }

    if (to.meta.samoAdmin && scouterStore.jeAdmin == false) {
        return { name: 'roditelj' }
    }
})

export default router