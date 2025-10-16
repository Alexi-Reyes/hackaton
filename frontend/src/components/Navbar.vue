<script setup>
import { House, Search, MessagesSquare, Heart, CirclePlus, CircleUserRound, LogIn } from 'lucide-vue-next'
</script>

<template>
  <div class="container">
    <RouterLink to="/" class="nav-item">
      <House /> <span>Accueil</span>
    </RouterLink>

    <RouterLink to="/search" class="nav-item">
      <Search /> <span>Recherche</span>
    </RouterLink>

    <RouterLink to="/messages" class="nav-item">
      <MessagesSquare /> <span>Messages</span>
    </RouterLink>

    <RouterLink to="/likes" class="nav-item">
      <Heart /> <span>J'aime</span>
    </RouterLink>

    <RouterLink to="/post" class="nav-item">
      <CirclePlus /> <span>Post</span>
    </RouterLink>

    <RouterLink to="/profile" class="nav-item">
      <CircleUserRound /> <span>Profil</span>
    </RouterLink>

    <RouterLink to="/login" class="nav-item">
      <LogIn /> <span>Login</span>
    </RouterLink>
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

.nav-item {
  display: flex;
  align-items: center;
  color: var(--text-main);
  font-weight: 500;
  padding: 15px 25px;
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.nav-item svg {
  margin-right: 10px;
  flex-shrink: 0;
}

.nav-item:hover {
  color: var(--text-hover);
  background: linear-gradient(90deg, rgba(201,166,107,0.15) 0%, transparent 100%);
  border-left: 3px solid var(--border-accent);
  transform: translateX(3px);
}

.router-link-exact-active {
  color: var(--text-hover);
  font-weight: bold;
  border-left: 3px solid var(--border-accent);
}
</style>
