// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Login from './pages/Login.vue'
import Dashboard from './pages/Dashboard.vue'
import DefaultLayout from './layout/index.vue'
import List from './pages/products/List.vue'
import Add from './pages/products/Add.vue'
import Edit from './pages/products/Edit.vue'


const router = createRouter({
    history: createWebHistory(),
    routes: [
        { 
            path: '/', 
            component: Home 
        },
        { 
            path: '/login', 
            name: Login 
        },
        {
            path: '/dashboard',
            component: DefaultLayout,
            children: [
              {
                path: '',
                name: 'Dashboard',
                component: Dashboard
              },
              {
                path: '/products',
                name: 'List',
                component: List
              },
              {
                path: '/products/add',
                name: 'Add',
                component: Add
              },
              {
                path: '/products/edit/:id',
                name: 'Edit',
                component: Edit 
              }
            ]
        }
    ]
});

const app = createApp(App)

app.use(router);
app.mount('#app')
