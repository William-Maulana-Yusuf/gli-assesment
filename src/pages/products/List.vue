<template>
    <div>
      <h2 class="text-2xl font-bold mb-4">Product List</h2>
  
    <div class="flex justify-end my-5">
        <RouterLink to="/products/add" class="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Add Product</RouterLink>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <input
      type="text"
      v-model="filters.title"
      placeholder="Search by title"
      class="border p-2 rounded"
    />

    <input
      type="number"
      v-model.number="filters.price_min"
      placeholder="Min Price"
      class="border p-2 rounded"
    />

    <input
      type="number"
      v-model.number="filters.price_max"
      placeholder="Max Price"
      class="border p-2 rounded"
    />

    <select v-model="filters.categoryId" class="border p-2 rounded">
      <option value="">All Categories</option>
      <option v-for="category in categories" :key="category.id" :value="category.id">
        {{ category.name }}
      </option>
    </select>
  </div>

  <div class="mb-4 flex space-x-2">
    <button @click="applyFilters" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
      Apply Filters
    </button>
    <button @click="resetFilters" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
      Reset Filters
    </button>
  </div>

    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading products...</p>
    </div>

    <div v-else-if="!products.length" class="text-center py-8">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto text-gray-400">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
      <h3 class="mt-4 text-xl font-semibold text-gray-600">No Products Found</h3>
      <p class="mt-2 text-gray-500">
        {{ getNoProductsMessage() }}
      </p>
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
            <button @click="showDeleteModal(product)" class="mx-2">
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

      <div v-if="showDeleteDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl w-96">
        <h3 class="text-lg font-semibold mb-4">Delete Product</h3>
        <p class="mb-4">Are you sure you want to delete this product? This action cannot be undone.</p>
        <div class="flex justify-end gap-4">
          <button 
            @click="deleteProduct" 
            class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
          <button 
            @click="cancelDelete" 
            class="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
    </div>
  </template>
  
<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const products = ref([])
const categories = ref([])
const loading = ref(true)
const error = ref('')
const currentPage = ref(1)
const limit = 5
const totalPages = 5 // Optionally calculate this dynamically
const showDeleteDialog = ref(false)
const productToDelete = ref(null)

const filters = ref({
  title: '',
  price_min: null,
  price_max: null,
  categoryId: ''
})

// Fetch categories for dropdown
const fetchCategories = async () => {
  try {
    const res = await axios.get('https://api.escuelajs.co/api/v1/categories')
    categories.value = res.data
  } catch (err) {
    console.error('Error fetching categories', err)
  }
}

// Fetch filtered products
const fetchProducts = async () => {
  loading.value = true
  error.value = ''
  try {
    const offset = (currentPage.value - 1) * limit
    let query = `?offset=${offset}&limit=${limit}`

    if (filters.value.title) query += `&title=${encodeURIComponent(filters.value.title)}`
    if (filters.value.price_min !== null) query += `&price_min=${filters.value.price_min}`
    if (filters.value.price_max !== null) query += `&price_max=${filters.value.price_max}`
    if (filters.value.categoryId) query += `&categoryId=${filters.value.categoryId}`

    const url = `https://api.escuelajs.co/api/v1/products${query}`
    const response = await axios.get(url)
    products.value = response.data
  } catch (err) {
    error.value = 'Failed to fetch products.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
  fetchProducts()
}

const hasActiveFilters = computed(() => {
  return filters.value.title || 
         filters.value.price_min !== null || 
         filters.value.price_max !== null || 
         filters.value.categoryId
})

const getNoProductsMessage = () => {
  if (hasActiveFilters.value) {
    return 'No products match your current filters. Try adjusting your search criteria.'
  }
  return 'There are no products available at the moment.'
}

const changePage = (page) => {
  currentPage.value = page
  fetchProducts()
}

const goToEdit = (id) => {
  router.push(`/products/edit/${id}`)
}

const showDeleteModal = (product) => {
  productToDelete.value = product
  showDeleteDialog.value = true
}

const cancelDelete = () => {
  showDeleteDialog.value = false
  productToDelete.value = null
}

const deleteProduct = async (id) => {
  if (!productToDelete.value) return

  try {
    await axios.delete(`https://api.escuelajs.co/api/v1/products/${productToDelete.value.id}`)
    showDeleteDialog.value = false
    productToDelete.value = null
    fetchProducts() // Refresh the list
  } catch (error) {
    console.error('Delete failed:', error)
    alert('Failed to delete product')
  }
}

const resetFilters = () => {
  filters.value = {
    title: '',
    price_min: null,
    price_max: null,
    categoryId: ''
  }
  currentPage.value = 1
  fetchProducts()
}

onMounted(() => {
  fetchCategories()
  fetchProducts()
})

  </script>
  