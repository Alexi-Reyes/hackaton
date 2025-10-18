<script setup>
import { ref } from 'vue'
import { APP_MESSAGES } from '../utils/messages.js'

const content = ref('')
const loading = ref(false)
const error = ref(null)
const success = ref(null)

const submitPost = async () => {
  loading.value = true
  error.value = null
  success.value = null

  if (!content.value.trim()) {
    error.value = APP_MESSAGES.POST_CONTENT_EMPTY
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
        throw new Error(APP_MESSAGES.UNAUTHORIZED_CREATE_POST)
      }
      throw new Error(APP_MESSAGES.HTTP_ERROR(res.status))
    }

    const data = await res.json()
    success.value = APP_MESSAGES.POST_CREATED_SUCCESS_ALERT
    content.value = ''
    console.log(APP_MESSAGES.CONSOLE_POST_CREATED, data.post)
  } catch (err) {
    console.error(APP_MESSAGES.CONSOLE_CREATE_POST_ERROR, err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="post-form">
    <h2>{{ APP_MESSAGES.CREATE_NEW_POST_TITLE }}</h2>

    <textarea
      v-model="content"
      :placeholder="APP_MESSAGES.WHAT_IS_NEW_PLACEHOLDER"
      rows="4"
      :disabled="loading"
    ></textarea>

    <button @click="submitPost" :disabled="loading">{{ APP_MESSAGES.PUBLISH_BUTTON }}</button>

    <div v-if="loading" class="status">{{ APP_MESSAGES.POSTING_IN_PROGRESS }}</div>
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
