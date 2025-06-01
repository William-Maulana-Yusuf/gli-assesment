<template>
    <div class="text-center my-10">
      <h1 class="text-3xl font-bold">Welcome to the Dashboard!</h1>
      <p class="text-gray-600">You have successfully logged in.</p>
    </div>
  <div class="p-6 space-y-6 bg-gray-50 min-h-screen">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard title="Total Products" :value="totalProducts" icon="📦" color="text-blue-600" />
      <DashboardCard title="Total Categories" :value="categories.length" icon="📁" color="text-green-600" />
      <DashboardCard title="Max Price" :value="`$${maxPrice}`" icon="💰" color="text-purple-600" />
      <DashboardCard title="Average Price" :value="`$${averagePrice}`" icon="🧮" color="text-indigo-600" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Categories List -->
      <div class="bg-white rounded-xl shadow p-4">
        <h2 class="text-xl font-semibold mb-4">Product Categories</h2>
        <ul class="list-disc list-inside text-gray-700">
          <li v-for="cat in categories" :key="cat.id">{{ cat.name }}</li>
        </ul>
      </div>

      <!-- Recent Products -->
      <div class="bg-white rounded-xl shadow p-4">
        <h2 class="text-xl font-semibold mb-4">Latest Products</h2>
        <ul class="divide-y">
          <li v-for="product in products.slice(0, 5)" :key="product.id" class="py-2">
            <div class="flex justify-between items-center">
              <span>{{ product.title }}</span>
              <span class="text-sm text-gray-500">${{ product.price }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import DashboardCard from '../components/DashboardCard.vue'

const products = ref([])
const categories = ref([])
const totalProducts = ref(0)
const maxPrice = ref(0)
const averagePrice = ref(0)

onMounted(async () => {
  try {
    const [prodRes, catRes] = await Promise.all([
      axios.get('https://api.escuelajs.co/api/v1/products'),
      axios.get('https://api.escuelajs.co/api/v1/categories')
    ])

    products.value = prodRes.data
    categories.value = catRes.data
    totalProducts.value = products.value.length
    maxPrice.value = Math.max(...products.value.map(p => p.price))

    // Calculate average price
    const prices = products.value.map(p => p.price)
    const total = prices.reduce((sum, price) => sum + price, 0)
    averagePrice.value = (total / prices.length).toFixed(2)
  } catch (err) {
    console.error('Failed to load dashboard data:', err)
  }
})
</script>
