<template>
    <div class="h-screen w-64 bg-gray-800 text-white p-4 fixed">
      <h2 class="text-2xl font-bold mb-6">My App</h2>
      <nav class="flex flex-col space-y-4">
        <router-link to="/dashboard" class="hover:bg-gray-700 p-2 rounded">Dashboard</router-link>
        <router-link to="/products" class="hover:bg-gray-700 p-2 rounded">Products</router-link>
        <!-- Add more nav items here -->
        <a href="#" @click.prevent="handleLogout" class="hover:bg-gray-700 p-2 rounded ">Logout</a>
      </nav>
    </div>
  </template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/') 
}
</script>