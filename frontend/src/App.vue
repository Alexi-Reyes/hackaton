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
  <Navbar />
  <router-view />
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>

