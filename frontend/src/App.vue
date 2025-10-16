<!-- <script setup>

import Navbar from './components/Navbar.vue' 
import Connexion from './components/Connexion.vue';
</script>

<template>
  <Navbar />
  <Connexion />
  
</template>

<style scoped>

</style> -->


<template>
  <div class="app-container">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>

