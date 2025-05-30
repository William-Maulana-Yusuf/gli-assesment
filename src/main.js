// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import { createRouter, createWebHistory } from 'vue-router'
import Login from './pages/Login.vue'
import Dashboard from './pages/Dashboard.vue'
import DefaultLayout from './layout/index.vue'
import List from './pages/products/List.vue'
import Add from './pages/products/Add.vue'
import Edit from './pages/products/Edit.vue'
import { createPinia } from 'pinia'
import { authMiddleware } from './middleware/auth'


const router = createRouter({
    history: createWebHistory(),
    routes: [
        { 
            path: '/', 
            component: Login,
            meta: { requiresAuth: false }
        },
        {
            path: '/dashboard',
            component: DefaultLayout,
            children: [
              {
                path: '',
                name: 'Dashboard',
                component: Dashboard,
                meta: { requiresAuth: true }
              },
              {
                path: '/products',
                name: 'List',
                component: List,
                meta: { requiresAuth: true }
              },
              {
                path: '/products/add',
                name: 'Add',
                component: Add,
                meta: { requiresAuth: true }
              },
              {
                path: '/products/edit/:id',
                name: 'Edit',
                component: Edit,
                meta: { requiresAuth: true }
              }
            ]
        }
    ]
});

router.beforeEach(authMiddleware)
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router);
app.mount('#app')
