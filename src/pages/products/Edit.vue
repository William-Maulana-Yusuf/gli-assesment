<template>
  <div class="p-6 max-w-lg mx-auto">
    <h2 class="text-2xl font-bold mb-4">Edit Product</h2>

    <div v-if="product.title !== ''">
      <form @submit.prevent="validateAndOpenConfirm" class="space-y-4 flex flex-col max-w-md">

        <div class="flex flex-col gap-1">
          <label>Product Name</label>
          <input
            v-model="product.title"
            type="text"
            class="input border-2 border-black rounded h-10 px-2"
            required
          />
          <span v-if="errors.title" class="text-red-600 text-sm">{{ errors.title }}</span>
        </div>

        <div class="flex flex-col gap-1">
          <label>Product Price</label>
          <input
            v-model.number="product.price"
            type="number"
            min="1"
            class="input border-2 border-black rounded h-10 px-2"
            required
          />
          <span v-if="errors.price" class="text-red-600 text-sm">{{ errors.price }}</span>
        </div>

        <div class="flex flex-col gap-1">
          <label>Product Description</label>
          <textarea
            v-model="product.description"
            class="input border-2 border-black rounded h-16 px-2"
            required
          ></textarea>
          <span v-if="errors.description" class="text-red-600 text-sm">{{ errors.description }}</span>
        </div>

        <div class="flex flex-col gap-1">
          <label>Category</label>
          <select v-model.number="product.categoryId" class="input border-2 border-black rounded h-10 px-2" required>
            <option disabled value="">Select a category</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
          <span v-if="errors.categoryId" class="text-red-600 text-sm">{{ errors.categoryId }}</span>
        </div>

        <div class="flex flex-col gap-1">
          <label>Upload Images</label>
          <input type="file" multiple @change="handleFileChange" />
          <div class="flex gap-2 mt-2">
            <img
              v-for="img in previewImages"
              :src="img"
              :key="img"
              crossorigin="anonymous"
              class="w-20 h-20 object-cover border rounded"
            />
          </div>
        </div>

        <div class="flex justify-end">
          <button type="submit" class="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 w-24">
            Update
          </button>
        </div>
      </form>

      <!-- Confirmation Modal -->
      <div
        v-if="showConfirmModal"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <div class="bg-white p-6 rounded shadow-lg max-w-sm w-full">
          <h3 class="text-lg font-semibold mb-4">Confirm Update</h3>
          <p class="mb-6">Are you sure you want to save changes?</p>
          <div class="flex justify-end gap-4">
            <button
              @click="cancelSave"
              class="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              @click="confirmSave"
              class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Yes, Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const productId = route.params.id

const categories = ref([])
const previewImages = ref([])
const uploadedImages = ref([])

const showConfirmModal = ref(false)

// Store product data bound with v-model
const product = ref({
  title: '',
  price: null,
  description: '',
  categoryId: null,
  images: [],
})

// Errors object to hold validation error messages
const errors = ref({
  title: '',
  price: '',
  description: '',
  categoryId: '',
})

onMounted(async () => {
  try {
    const [productRes, categoryRes] = await Promise.all([
      axios.get(`https://api.escuelajs.co/api/v1/products/${productId}`),
      axios.get('https://api.escuelajs.co/api/v1/categories'),
    ])

    const data = productRes.data
    product.value = {
      title: data.title,
      price: data.price,
      description: data.description,
      categoryId: data.category.id,
      images: data.images || [],
    }

    previewImages.value = [...product.value.images]
    uploadedImages.value = [...product.value.images]
    categories.value = categoryRes.data
  } catch (error) {
    console.error('Failed to load product or categories:', error)
  }
})

const handleFileChange = async (event) => {
  const files = Array.from(event.target.files)
  for (const file of files) {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await axios.post('https://api.escuelajs.co/api/v1/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      const url = res.data.location
      previewImages.value.push(url)
      uploadedImages.value.push(url)
    } catch (error) {
      console.error('Image upload failed:', error)
    }
  }
}

// Simple manual validation function
const validate = () => {
  let valid = true
  errors.value.title = product.value.title.trim() ? '' : 'Product name is required'
  errors.value.price =
    product.value.price && product.value.price > 0 ? '' : 'Price must be greater than 0'
  errors.value.description = product.value.description.trim()
    ? ''
    : 'Description is required'
  errors.value.categoryId = product.value.categoryId ? '' : 'Category is required'

  // If any error message is set, form is invalid
  for (const key in errors.value) {
    if (errors.value[key]) valid = false
  }
  return valid
}

const validateAndOpenConfirm = () => {
  if (validate()) {
    showConfirmModal.value = true
  }
}

const cancelSave = () => {
  showConfirmModal.value = false
}

const confirmSave = async () => {
  try {
    const payload = {
      ...product.value,
      images: uploadedImages.value,
    }
    await axios.put(`https://api.escuelajs.co/api/v1/products/${productId}`, payload)
    showConfirmModal.value = false
    router.push('/products')
  } catch (error) {
    console.error('Update failed:', error)
    alert('Failed to update product')
  }
}
</script>
