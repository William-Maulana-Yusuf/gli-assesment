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
            <input type="file" @change="handleFileChange" placeholder="Image URL" class=" flex input border-2 border-black rounded h-10 px-2" required />
        </div>
        <div class="flex justify-content-end">
          <button type="submit" class="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex justify-content-end w-20">Create</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import axios from 'axios'
  
  const route = useRoute()
  const router = useRouter()
  const productId = route.params.id
  
  const product = ref({
    title: '',
    price: '',
    description: '',
    categoryId: '',
    images: ['']
  })
  
  const imageName = ref('')
  const previewImage = ref('')
  
  onMounted(async () => {
    try {
      const { data } = await axios.get(`https://api.escuelajs.co/api/v1/products/${productId}`)
      product.value = {
        title: data.title,
        price: data.price,
        description: data.description,
        categoryId: data.category.id,
        images: [data.images[0] || '']
      }
      imageName.value = data.images[0] || ''
      previewImage.value = data.images[0] || ''
    } catch (error) {
      console.error('Error loading product:', error)
    }
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
      await axios.put(`https://api.escuelajs.co/api/v1/products/${productId}`, product.value)
      router.push('/dashboard/products')
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }
  </script>
  
    