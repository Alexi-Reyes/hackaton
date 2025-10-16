<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

</style>


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
export default {
  name: 'App'
};
</script>

