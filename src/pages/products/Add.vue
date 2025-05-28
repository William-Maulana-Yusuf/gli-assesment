<template>
    <div class="">
      <h2 class="text-2xl font-bold mb-4">Add Product</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4 flex-col">
        <div class="flex flex-col gap-2 max-w-md">
            <Label>
                Product Name
            </Label>
            <input v-model="product.title" type="text" placeholder="Title" class="flex input border-2 border-black rounded h-10 px-2" required />
        </div>
        <div class="flex flex-col gap-2 max-w-md">
            <Label>
                Product Price
            </Label>
            <input v-model.number="product.price" type="number" placeholder="Price" class="flex input border-2 border-black rounded h-10 px-2" required />
        </div>
        <div class="flex flex-col gap-2 max-w-md">
            <Label>
                Product Description
            </Label>
            <textarea v-model="product.description" type="text" placeholder="Description" class="flex input border-2 border-black rounded h-16 px-2" required />
        </div>
        <div class="flex flex-col gap-2 max-w-md">
            <Label>
                Product Category
            </Label>
            <input v-model="product.categoryId" type="number" placeholder="Category ID" class="flex input border-2 border-black rounded h-10 px-2" required />
        </div>
        <div class="flex flex-col gap-2 max-w-md">
            <Label>
                Product Image
            </Label>
            <input type="file" @change="handleFileChange" placeholder="Image URL" class=" flex input " required />
        </div>
        <button type="submit" class="btn">Create</button>
      </form>
      <div v-if="showCancelDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-xl text-center w-80">
          <p class="text-lg font-semibold mb-4">Are you sure you want to cancel?</p>
          <div class="flex justify-center gap-4">
            <button @click="cancelConfirmed" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Yes</button>
            <button @click="cancelDeclined" class="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">No</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  
  const router = useRouter()
  const product = ref({
    title: '',
    price: '',
    description: '',
    categoryId: '',
    images: ['']
  })

  const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  try {
      const res = await axios.post('https://api.escuelajs.co/api/v1/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const imageUrl = res.data.location
      product.value.images = [imageUrl]
      imageName.value = file.name    
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Image upload failed')
    }
  }

  const handleSubmit = async () => {
    try {
      await axios.post('https://api.escuelajs.co/api/v1/products/', product.value)
      router.push('/dashboard/products')
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }

  const confirmCancel = () => {
    showCancelDialog.value = true
  }

  const cancelConfirmed = () => {
    showCancelDialog.value = false
    router.push('/dashboard/products')
  }

  const cancelDeclined = () => {
    showCancelDialog.value = false
  }
  </script>
    