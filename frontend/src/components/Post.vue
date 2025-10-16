<script setup>
import { ref } from 'vue'

const content = ref('')
const loading = ref(false)
const error = ref(null)
const success = ref(null)

const submitPost = async () => {
  loading.value = true
  error.value = null
  success.value = null

  if (!content.value.trim()) {
    error.value = "Le contenu du post ne peut pas être vide."
    loading.value = false
    return
  }

  try {
    const res = await fetch(`${import.meta.env.BACKEND_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', 
      body: JSON.stringify({ content: content.value })
    })

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Vous devez être connecté pour publier un post.")
      }
      throw new Error(`Erreur HTTP ${res.status}`)
    }

    const data = await res.json()
    success.value = "Post créé avec succès !"
    content.value = ''
    console.log('Post créé:', data.post)
  } catch (err) {
    console.error('Erreur lors de la création du post:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="post-form">
    <h2>Créer un nouveau post</h2>

    <textarea
      v-model="content"
      placeholder="Quoi de neuf ?"
      rows="4"
      :disabled="loading"
    ></textarea>

    <button @click="submitPost" :disabled="loading">Publier</button>

    <div v-if="loading" class="status">Publication en cours...</div>
    <div v-if="error" class="status error">{{ error }}</div>
    <div v-if="success" class="status success">{{ success }}</div>
  </div>
</template>

<style scoped>
.post-form {
    padding: 1rem;
    border-radius: 16px;
    box-shadow: 2px 0 10px rgba(0,0,0,0.4);
    max-width: 600px;
    background-color: var(--bg-global);
}

textarea {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid var(--border-accent);
  border-radius: 8px;
  resize:none;
}

button {
  background-color: var(--button-bg);
  color: var(--button-text-white);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  border: 2px solid white;
}

button:hover {
  background-color: var(--button-hover-bg-white);
  color: var(--button-text-black);
  border: 2px solid var(--border-accent-black);
}

.post-form h2 {
    margin-bottom: 1rem; 
}

.status {
  margin-top: 0.5rem;
  color: var(--text-main);
}

.status.error {
  color: red; 
}

.status.success {
  color: green; 
}
</style>
