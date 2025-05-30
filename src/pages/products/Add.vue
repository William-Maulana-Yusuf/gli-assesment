<template>
  <div class="p-6 max-w-lg mx-auto">
    <h2 class="text-2xl font-bold mb-4">Add Product</h2>
    
    <form @submit.prevent="validateAndOpenModal" class="space-y-4 flex flex-col">
      <div>
        <label class="block mb-1 font-semibold">Product Name</label>
        <input
          v-model="product.title"
          type="text"
          placeholder="Title"
          class="w-full border rounded h-10 px-2"
        />
        <p v-if="errors.title" class="text-red-600 text-sm mt-1">{{ errors.title }}</p>
      </div>
      
      <div>
        <label class="block mb-1 font-semibold">Product Price</label>
        <input
          v-model.number="product.price"
          type="number"
          placeholder="Price"
          class="w-full border rounded h-10 px-2"
        />
        <p v-if="errors.price" class="text-red-600 text-sm mt-1">{{ errors.price }}</p>
      </div>
      
      <div>
        <label class="block mb-1 font-semibold">Product Description</label>
        <textarea
          v-model="product.description"
          placeholder="Description"
          class="w-full border rounded h-24 px-2 py-1"
        ></textarea>
        <p v-if="errors.description" class="text-red-600 text-sm mt-1">{{ errors.description }}</p>
      </div>
      
      <div>
        <label class="block mb-1 font-semibold">Product Category</label>
        <select
          v-model.number="product.categoryId"
          class="w-full border rounded h-10 px-2"
        >
          <option disabled value="">Select category</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
        <p v-if="errors.categoryId" class="text-red-600 text-sm mt-1">{{ errors.categoryId }}</p>
      </div>

      
      <div>
        <label class="block mb-1 font-semibold">Product Image</label>
        <input type="file" @change="handleFileChange" multiple />
        <div class="flex gap-2 mt-2">
          <img 
            v-for="(img, index) in product.images" 
            :key="index" 
            :src="img" 
            crossorigin="anonymous"
            alt="Uploaded image" 
            class="w-16 h-16 object-cover border rounded" 
          />
        </div>
        <p v-if="errors.images" class="text-red-600 text-sm mt-1">{{ errors.images }}</p>
      </div>
      
      <div class="flex justify-end">
        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-28"
        >
          Create
        </button>
      </div>
    </form>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl w-96">
        <p class="text-lg font-semibold mb-4">Are you sure you want to save this product?</p>
        <div class="flex justify-end gap-4">
          <button @click="confirmSave" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Yes, Save</button>
          <button @click="cancelSave" class="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { onMounted } from 'vue'

const router = useRouter()
const categories = ref([])

const product = ref({
  title: '',
  price: null,
  description: '',
  categoryId: null,
  images: []
})

const errors = ref({
  title: '',
  price: '',
  description: '',
  categoryId: '',
  images: ''
})

const showConfirmDialog = ref(false)

const validateForm = () => {
  let valid = true

  // Clear previous errors
  errors.value = {
    title: '',
    price: '',
    description: '',
    categoryId: '',
    images: ''
  }

  if (!product.value.title.trim()) {
    errors.value.title = 'Product name is required.'
    valid = false
  }

  if (product.value.price === null || product.value.price <= 0) {
    errors.value.price = 'Price must be a positive number.'
    valid = false
  }

  if (!product.value.description.trim()) {
    errors.value.description = 'Description is required.'
    valid = false
  }

  if (!product.value.categoryId) {
    errors.value.categoryId = 'Please select a category.'
    valid = false
  }

  if (product.value.images.length === 0) {
    errors.value.images = 'Please upload at least one image.'
    valid = false
  }

  return valid
}

const validateAndOpenModal = () => {
  if (validateForm()) {
    showConfirmDialog.value = true
  }
}

const cancelSave = () => {
  showConfirmDialog.value = false
}

const confirmSave = async () => {
  try {
    await axios.post('https://api.escuelajs.co/api/v1/products/', {
      ...product.value,
      price: Number(product.value.price),
      categoryId: Number(product.value.categoryId)
    })
    showConfirmDialog.value = false
    router.push('/products')
  } catch (error) {
    console.error('Error creating product:', error)
    alert('Failed to create product')
  }
}

const handleFileChange = async (event) => {
  const files = Array.from(event.target.files)
  if (!files.length) return

  const uploadedImages = []

  for (const file of files) {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axios.post('https://api.escuelajs.co/api/v1/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      uploadedImages.push(res.data.location)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Image upload failed')
    }
  }

  product.value.images = [...product.value.images, ...uploadedImages]
}

const fetchCategories = async () => {
  try {
    const res = await axios.get('https://api.escuelajs.co/api/v1/categories')
    categories.value = res.data
  } catch (err) {
    console.error('Failed to fetch categories', err)
  }
}

onMounted(fetchCategories)
</script>
