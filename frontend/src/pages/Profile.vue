<script setup>
import { ref, onMounted } from 'vue'

const userId = '68ef874f78d407eaf8d8dea1'

const user = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:3000/users/${userId}`)
    
    if (!res.ok) {
      throw new Error(`Erreur HTTP ${res.status}`)
    }

    const data = await res.json()
    user.value = data
  } catch (err) {
    console.error(err)
    error.value = "Impossible de charger le profil."
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="profile">
    <h1>Mon profil</h1>

    <div v-if="loading" class="status">Chargement...</div>
    <div v-else-if="error" class="status error">{{ error }}</div>

    <div v-else class="info">
      <p><strong>Nom d'utilisateur :</strong> {{ user.username }}</p>
      <p><strong>Email :</strong> {{ user.email }}</p>
    </div>
  </div>
</template>

<style scoped>
.profile {
  background-color: var(--navbar-bg);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 2px 0 10px rgba(0,0,0,0.1);
  max-width: 400px;
}

h1 {
  color: var(--text-main);
  margin-bottom: 1.5rem;
}

.status {
  color: var(--text-main);
  margin-bottom: 1rem;
}

.status.error {
  color: red;
}

.info p {
  color: var(--text-main);
  margin: 0.6rem 0;
  padding: 8px;
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.info p:hover {
  background: linear-gradient(90deg, rgba(201,166,107,0.15) 0%, transparent 100%);
  border-left: 3px solid var(--border-accent);
  color: var(--text-hover);
  transform: translateX(3px);
}
</style>
