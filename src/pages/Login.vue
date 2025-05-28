<template>
    <div class="p-6 max-w-md mx-auto mt-[10%] bg-white rounded-xl shadow-lg space-y-4">
      <h2 class="text-2xl font-bold">Login</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input v-model="email" type="email" class="w-full p-2 border rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Password</label>
          <input v-model="password" type="password" class="w-full p-2 border rounded" required />
        </div>
        <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Login
        </button>
        <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  
  const email = ref('')
  const password = ref('')
  const error = ref('')
  const router = useRouter()
  
  const login = async () => {
    error.value = ''
    try {
      const response = await axios.post('https://api.escuelajs.co/api/v1/auth/login', {
        email: email.value,
        password: password.value
      })
  
      console.log('JWT Token:', response.data.access)
    //   alert('Login successful!')
  
      // Save token to localStorage or state manager (Vuex/Pinia)
      localStorage.setItem('token', response.data.access)
      router.push('/dashboard')
    } catch (err) {
      error.value = 'Invalid email or password'
      console.error(err)
    }
  }
  </script>
  
  <style scoped>
  input:focus {
    outline: none;
    border-color: #3182ce;
  }
  </style>
  