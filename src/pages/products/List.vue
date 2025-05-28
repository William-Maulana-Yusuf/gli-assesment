<template>
    <div>
      <h2 class="text-2xl font-bold mb-4">Product List</h2>
  
    <div class="flex justify-end my-5">
        <RouterLink to="/products/add" class="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Add Product</RouterLink>
    </div>

      <table v-if="!loading && products.length" class="w-full border-collapse mb-4">
        <thead>
          <tr class="bg-gray-200 text-left">
            <th class="p-2 border">#</th>
            <th class="p-2 border">Name</th>
            <th class="p-2 border">Price</th>
            <th class="p-2 border">Category</th>
            <th class="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="product.id" class="hover:bg-gray-100">
            <td class="p-2 border">{{ (currentPage - 1) * limit + index + 1 }}</td>
            <td class="p-2 border">{{ product.title }}</td>
            <td class="p-2 border">${{ product.price.toFixed(2) }}</td>
            <td class="p-2 border">{{ product.category?.name || '—' }}</td>
            <td class="p-2 border w-28">
            <button @click="goToEdit(product.id)" class="mx-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" class="flex size-6 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
            </button>
            <button @click="deleteProduct(product.id)" class="mx-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" class="flex size-6 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Pagination Buttons -->
      <div class="flex space-x-2">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Prev
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="changePage(page)"
          :class="[
            'px-4 py-2 rounded',
            currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
          ]"
        >
          {{ page }}
        </button>
        <button
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
          class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'

  const router = useRouter() 
  const products = ref([])
  const loading = ref(true)
  const error = ref('')
  const currentPage = ref(1)
  const limit = 5
  const totalPages = 5 // You can set this dynamically if needed
  
  const fetchProducts = async () => {
    loading.value = true
    error.value = ''
    try {
      const offset = (currentPage.value - 1) * limit
      const response = await axios.get(
        `https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=${limit}`
      )
      products.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch products.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  
  const changePage = (page) => {
    currentPage.value = page
    fetchProducts()
  }
  
  onMounted(fetchProducts)

  const goToEdit = (id) => {
    router.push(`/products/edit/${id}`)
  }

  const deleteProduct = async (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await axios.delete(`https://api.escuelajs.co/api/v1/products/${id}`)
      fetchProducts()
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }
}
  </script>
  