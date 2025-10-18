<template>
  <div class="statistics-container">
    <h1>{{ APP_MESSAGES.STATISTICS_TITLE }}</h1>

    <div v-if="loading" class="status">{{ APP_MESSAGES.STATISTICS_LOADING }}</div>
    <div v-else-if="error" class="status error">{{ error }}</div>

    <div v-else class="statistics-grid">
      <div class="kpi-card">
        <div class="kpi-header">
          <Users class="kpi-icon" />
          <h2>{{ APP_MESSAGES.STATISTICS_TOTAL_USERS }}</h2>
        </div>
        <p class="kpi-value">{{ statistics.totalUsers }}</p>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <MessageSquareMore class="kpi-icon" />
          <h2>{{ APP_MESSAGES.STATISTICS_USER_MOST_POSTS }}</h2>
        </div>
        <p v-if="statistics.userWithMostPosts" class="kpi-value-detail">
          <span class="username">{{ statistics.userWithMostPosts.username }}</span>
          <span class="count">({{ APP_MESSAGES.STATISTICS_POSTS_COUNT(statistics.userWithMostPosts.postCount) }})</span>
        </p>
        <p v-else class="kpi-value-detail">{{ APP_MESSAGES.STATISTICS_NA }}</p>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <HeartHandshake class="kpi-icon" />
          <h2>{{ APP_MESSAGES.STATISTICS_POST_MOST_LIKES }}</h2>
        </div>
        <p v-if="statistics.postWithMostLikes" class="kpi-value-detail">
          <span class="post-content">"{{ statistics.postWithMostLikes.postContent }}"</span>
          <br />
          <span class="username">{{ statistics.postWithMostLikes.postAuthorUsername }}</span>
          <span class="count">({{ APP_MESSAGES.STATISTICS_LIKES_COUNT(statistics.postWithMostLikes.likeCount) }})</span>
        </p>
        <p v-else class="kpi-value-detail">{{ APP_MESSAGES.STATISTICS_NA }}</p>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <Award class="kpi-icon" />
          <h2>{{ APP_MESSAGES.STATISTICS_USER_MOST_TOTAL_LIKES }}</h2>
        </div>
        <p v-if="statistics.userWithMostTotalLikes" class="kpi-value-detail">
          <span class="username">{{ statistics.userWithMostTotalLikes.username }}</span>
          <span class="count">({{ APP_MESSAGES.STATISTICS_LIKES_COUNT(statistics.userWithMostTotalLikes.totalLikeCount) }})</span>
        </p>
        <p v-else class="kpi-value-detail">{{ APP_MESSAGES.STATISTICS_NA }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Users, MessageSquareMore, HeartHandshake, Award } from 'lucide-vue-next';
import { APP_MESSAGES } from '../utils/messages.js';

const statistics = ref({
  totalUsers: 0,
  userWithMostPosts: null,
  postWithMostLikes: null,
  userWithMostTotalLikes: null
});
const loading = ref(true);
const error = ref(null);

const fetchStatistics = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`${import.meta.env.BACKEND_URL}/users/statistics`);
    statistics.value = response.data;
  } catch (err) {
    console.error(APP_MESSAGES.CONSOLE_STATISTICS_ERROR, err);
    error.value = APP_MESSAGES.STATISTICS_LOAD_ERROR;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchStatistics();
});
</script>

<style scoped>
.statistics-container {
  padding: 2.5rem;
  background-color: var(--navbar-bg);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 1000px;
  margin: 3rem auto;
  background-image: linear-gradient(45deg, rgba(201,166,107,0.05) 0%, transparent 50%, rgba(201,166,107,0.05) 100%);
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

h1 {
  color: var(--text-main);
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.8rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.status {
  color: var(--text-main);
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.status.error {
  color: #ff6b6b;
  font-weight: bold;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.kpi-card {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 2rem;
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease-in-out;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.kpi-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.6);
  border-color: #6366f1;
}

.kpi-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.kpi-icon {
  width: 30px;
  height: 30px;
  margin-right: 15px;
  color: #6366f1;
  flex-shrink: 0;
}

.kpi-card h2 {
  font-size: 1.5rem;
  margin: 0;
  color: #e0e0e0;
  font-weight: 700;
}

.kpi-value {
  font-size: 3.5rem;
  font-weight: 900;
  color: #ffffff;
  text-align: center;
  margin-top: 1.5rem;
  text-shadow: 0 3px 8px rgba(0, 0, 0, 0.5);
}

.kpi-value-detail {
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-size: 1.2rem;
  color: #c0c0c0;
  margin-top: 1rem;
  line-height: 1.6;
}

.kpi-value-detail .username,
.kpi-value-detail .post-id {
  font-weight: bold;
  color: #6366f1;
}

.kpi-value-detail .count {
  font-style: italic;
  color: #a0a0a0;
}

.kpi-value-detail .post-content {
  font-size: 1rem;
  color: #909090;
  display: block;
  margin-top: 0.5rem;
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
