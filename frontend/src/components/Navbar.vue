<script setup>
import { House, Search, MessagesSquare, Heart, CirclePlus, CircleUserRound } from 'lucide-vue-next';
</script>

<template>
  <div class="container">
    <h3><House /> <span>Accueil</span></h3>
    <h3><Search /> <span>Recherche</span></h3>
    <h3><MessagesSquare /> <span>Messages</span></h3>
    <h3><Heart /> <span>J'aime</span></h3>
    <h3><CirclePlus /> <span>Post</span></h3>
    <h3><CircleUserRound /> <span>Profil</span></h3>
  </div>
</template>

<style scoped>

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: var(--navbar-bg);
  height: 100vh;
  width: 220px;
  padding-top: 20px;
  border-right: 1px solid var(--border-accent);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

h3 {
  display: flex;           
  align-items: center;    
  color: var(--text-main);
  font-weight: 500;
  padding: 15px 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

h3 svg {
  margin-right: 10px;      
  flex-shrink: 0;         
}

h3:hover {
  color: var(--text-hover);
  background: linear-gradient(90deg, rgba(201,166,107,0.15) 0%, transparent 100%);
  border-left: 3px solid var(--border-accent);
  transform: translateX(3px);
}
</style>
