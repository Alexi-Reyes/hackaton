<script setup>
import { ref, onMounted, computed } from 'vue'
import { Heart } from 'lucide-vue-next'

const posts = ref([])
const loading = ref(true)
const error = ref(null)
const user = ref(null)

onMounted(async () => {
  await getCurrentUser()
  await loadPosts()
})

const getCurrentUser = async () => {
  try {
    const res = await fetch('http://localhost:3000/users/profile', { credentials: 'include' })
    if (res.ok) {
      user.value = await res.json()
    }
  } catch (err) {
    console.error('Erreur utilisateur:', err)
  }
}

const loadPosts = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('http://localhost:3000/posts', { credentials: 'include' })
    if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`)
    const data = await res.json()
    posts.value = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    if (user.value) {
      for (const post of posts.value) {
        const resLikes = await fetch(`http://localhost:3000/likes/post/${post._id}`, {
          credentials: 'include'
        })
        if (resLikes.ok) {
          const likes = await resLikes.json()
          post.userLiked = likes.some(like => like.userId._id === user.value._id)
        } else {
          post.userLiked = false
        }
      }
    }

  } catch (err) {
    console.error('Erreur lors du chargement des posts:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const toggleLike = async (post) => {
  if (!user.value) {
    alert('Vous devez être connecté pour liker un post.')
    return
  }

  const alreadyLiked = post.userLiked

  try {
    const res = await fetch(`http://localhost:3000/likes`, {
      method: alreadyLiked ? 'DELETE' : 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: post._id, userId: user.value._id })
    })

    if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`)

    post.userLiked = !alreadyLiked
    post.likesCount += alreadyLiked ? -1 : 1
  } catch (err) {
    console.error('Erreur lors du like:', err)
  }
}

const getAvatar = (postUser) => {
  if (!postUser) return defaultAvatar('U')
  if (postUser.profilePicture) return postUser.profilePicture
  return defaultAvatar(postUser.username.charAt(0).toUpperCase())
}

const defaultAvatar = (letter) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50">
    <rect width="50" height="50" fill="#ccc"/>
    <text x="50%" y="50%" font-size="24" text-anchor="middle" dominant-baseline="central" fill="#000">${letter}</text>
  </svg>`
  return `data:image/svg+xml;base64,${btoa(svg)}`
}
</script>

<template>
  <div class="home">
    <h1>Fil d’actualité</h1>

    <div v-if="loading" class="status">Chargement des posts...</div>
    <div v-else-if="error" class="status error">{{ error }}</div>

    <div v-else class="posts">
      <div v-if="posts.length === 0" class="no-posts">
        Aucun post pour le moment.
      </div>

      <div v-for="post in posts" :key="post._id" class="post">
        <div class="post-header">
          <div class="user-info">
            <img :src="getAvatar(post.userId)" class="avatar" />
            <span class="username">{{ post.userId?.username || 'Utilisateur inconnu' }}</span>
          </div>
          <span class="date">{{ new Date(post.createdAt).toLocaleString() }}</span>
        </div>

        <div class="post-content">
          {{ post.content }}
        </div>

        <div class="post-footer">
          <button
            class="like-button"
            :class="{ liked: post.userLiked }"
            @click="toggleLike(post)"
          >
            <Heart :class="{ liked: post.userLiked }" />
            <span>{{ post.likesCount || 0 }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  background-color: var(--bg-global);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 2px 0 10px rgb(0 0 0 / 40%);
  max-width: 700px;
  margin: auto;
}

h1 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.status {
  color: var(--text-main);
  text-align: center;
}

.status.error {
  color: red;
}

.posts {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post {
  background-color: var(--navbar-bg);
  color: var(--text-main);
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  transition: transform 0.2s ease;
}

.post:hover {
  transform: translateY(-2px);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-hover);
  margin-bottom: 0.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-accent);
}

.username {
  font-weight: bold;
}

.date {
  font-style: italic;
  color: var(--border-accent);
  font-size: 0.85rem;
}

.post-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.like-button {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: var(--border-accent);
  cursor: pointer;
  transition: color 0.3s ease;
}

.like-button:hover,
.like-button.liked {
  color: red;
}

.like-button svg {
  transition: fill 0.3s ease, color 0.3s ease;
}

.like-button.liked svg {
  color: red;
  fill: red;
}
</style>
