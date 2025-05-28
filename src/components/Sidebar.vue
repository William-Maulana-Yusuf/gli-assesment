<template>
    <div class="h-screen w-64 bg-gray-800 text-white p-4 fixed">
      <h2 class="text-2xl font-bold mb-6">My App</h2>
      <nav class="flex flex-col space-y-4">
        <router-link to="/dashboard" class="hover:bg-gray-700 p-2 rounded">Dashboard</router-link>
        <router-link to="/products" class="hover:bg-gray-700 p-2 rounded">Products</router-link>
        <!-- Add more nav items here -->
      </nav>
    </div>
  </template>