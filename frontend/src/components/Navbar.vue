<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { House, Search, MessagesSquare, Heart, CirclePlus, CircleUserRound, LogIn, LogOut, BarChart } from 'lucide-vue-next';
import { APP_MESSAGES } from '../utils/messages.js';

const isLoggedIn = ref(false);
const router = useRouter();

const checkLoginStatus = async () => {
  try {
    await axios.get(`${import.meta.env.BACKEND_URL}/users/status`);
    isLoggedIn.value = true;
  } catch (error) {
    isLoggedIn.value = false;
  }
};

const handleLogout = async () => {
  try {
    await axios.post(`${import.meta.env.BACKEND_URL}/users/logout`);
    isLoggedIn.value = false;
    alert(APP_MESSAGES.LOGOUT_SUCCESS);
    router.push('/login');
  } catch (error) {
    console.error(APP_MESSAGES.CONSOLE_LOGOUT_ERROR, error);
    alert(APP_MESSAGES.LOGOUT_ERROR);
  }
};

onMounted(() => {
  checkLoginStatus();
});

router.afterEach(() => {
  checkLoginStatus();
});
</script>

<template>
  <div class="container">
    <RouterLink to="/" class="nav-item">
      <House /> <span>{{ APP_MESSAGES.NAV_HOME }}</span>
    </RouterLink>

    <RouterLink to="/search" class="nav-item">
      <Search /> <span>{{ APP_MESSAGES.NAV_SEARCH }}</span>
    </RouterLink>

    <RouterLink to="/messages" class="nav-item">
      <MessagesSquare /> <span>{{ APP_MESSAGES.NAV_MESSAGES }}</span>
    </RouterLink>

    <RouterLink to="/likes" class="nav-item">
      <Heart /> <span>{{ APP_MESSAGES.NAV_LIKES }}</span>
    </RouterLink>

    <RouterLink to="/post" class="nav-item">
      <CirclePlus /> <span>{{ APP_MESSAGES.NAV_POST }}</span>
    </RouterLink>

    <RouterLink to="/profile" class="nav-item">
      <CircleUserRound /> <span>{{ APP_MESSAGES.NAV_PROFILE }}</span>
    </RouterLink>

    <RouterLink to="/statistics" class="nav-item">
      <BarChart /> <span>{{ APP_MESSAGES.NAV_STATISTICS }}</span>
    </RouterLink>

    <RouterLink v-if="!isLoggedIn" to="/login" class="nav-item">
      <LogIn /> <span>{{ APP_MESSAGES.NAV_LOGIN }}</span>
    </RouterLink>
    <a v-else @click="handleLogout" class="nav-item">
      <LogOut /> <span>{{ APP_MESSAGES.NAV_LOGOUT }}</span>
    </a>
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
