<template>
    <div class="flex">
      <Sidebar />
      <div class="ml-64 p-6 w-full">
        <router-view />
      </div>
    </div>
  </template>
  
  <script setup>
  import Sidebar from '../components/Sidebar.vue'
  </script>