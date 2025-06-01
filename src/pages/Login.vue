<template>
  <div>
    <div v-if="loading" class="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-xl text-gray-600">Logging in...</p>
      </div>
    </div>

    <div class="p-6 max-w-md mx-auto mt-[10%] bg-white rounded-xl shadow-lg space-y-4">
      <h2 class="text-2xl font-bold">Login</h2>
      <form @submit.prevent="validateAndLogin" class="space-y-4">
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input 
            v-model="credentials.email" 
            type="email" 
            class="w-full p-2 border rounded"  
          />
          <p v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Password</label>
          <input 
            v-model="credentials.password" 
            type="password" 
            class="w-full p-2 border rounded"  
          />
          <p v-if="errors.password" class="text-red-600 text-sm mt-1">{{ errors.password }}</p>
        </div>
        <button 
          type="submit" 
          class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../auth'

const router = useRouter()
const authStore = useAuthStore()

const credentials = ref({
  email: '',
  password: ''
})

const errors = ref({
  email: '',
  password: ''
})

const error = ref('')
const loading = ref(false)


const validateForm = () => {
  let valid = true
  
  // Clear previous errors
  errors.value = {
    email: '',
    password: ''
  }

  // Email validation
  if (!credentials.value.email.trim()) {
    errors.value.email = 'Email is required'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.value.email)) {
    errors.value.email = 'Please enter a valid email address'
    valid = false
  }

  // Password validation
  if (!credentials.value.password.trim()) {
    errors.value.password = 'Password is required'
    valid = false
  } else if (credentials.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    valid = false
  }

  return valid
}

const validateAndLogin = async () => {
  if (validateForm()) {
    loading.value = true
    error.value = ''

    try {
      const response = await axios.post('https://api.escuelajs.co/api/v1/auth/login', {
        email: credentials.value.email,
        password: credentials.value.password
      })

      // Store the token
      authStore.setAuth(response.data.access_token)
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      error.value = 'Invalid email or password'
      console.error(err)
      loading.value = false
    }
  }
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

input:focus {
  outline: none;
  border-color: #3182ce;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>