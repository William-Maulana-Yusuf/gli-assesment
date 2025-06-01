<template>
    <div class="bg-white shadow rounded-xl p-4 flex items-center gap-4">
      <div class="text-3xl">{{ icon }}</div>
      <div>
        <p class="text-gray-500 text-sm">{{ title }}</p>
        <p :class="['text-xl font-bold', color]">{{ value }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    title: String,
    value: [String, Number],
    icon: String,
    color: String
  })
  </script>