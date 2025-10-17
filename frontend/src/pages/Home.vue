<script setup>
import { ref, onMounted } from 'vue'
import { Heart, MessageCircleMore } from 'lucide-vue-next'

const posts = ref([])
const loading = ref(true)
const error = ref(null)
const user = ref(null)
const selectedPost = ref(null)
const newComment = ref('')

onMounted(async () => {
  await getCurrentUser()
  await loadPosts()
})

const getCurrentUser = async () => {
  try {
    const res = await fetch(`${import.meta.env.BACKEND_URL}/users/profile`, { credentials: 'include' })
    if (res.ok) user.value = await res.json()
  } catch (err) {
    console.error('Erreur utilisateur:', err)
  }
}

const loadPosts = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await fetch(`${import.meta.env.BACKEND_URL}/posts`, { credentials: 'include' })
    if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`)
    const data = await res.json()
    posts.value = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    for (const post of posts.value) {
      await loadLikes(post)
      await loadComments(post)
    }
  } catch (err) {
    console.error('Erreur lors du chargement des posts:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const loadLikes = async (post) => {
  try {
    const resLikes = await fetch(`${import.meta.env.BACKEND_URL}/likes/post/${post._id}`, { credentials: 'include' })
    if (resLikes.ok) {
      const likes = await resLikes.json()
      post.likesCount = likes.length
      post.userLiked = user.value ? likes.some(like => like.userId._id === user.value._id) : false
    }
  } catch (err) {
    console.error('Erreur lors du chargement des likes:', err)
  }
}

const loadComments = async (post) => {
  try {
    const resComments = await fetch(`${import.meta.env.BACKEND_URL}/comments/post/${post._id}`, { credentials: 'include' })
    if (resComments.ok) {
      post.comments = await resComments.json()
    } else {
      post.comments = []
    }
  } catch (err) {
    console.error('Erreur lors du chargement des commentaires:', err)
    post.comments = []
  }
}

const toggleLike = async (post) => {
  if (!user.value) {
    alert('Vous devez être connecté pour liker un post.')
    return
  }

  const alreadyLiked = post.userLiked

  try {
    const res = await fetch(`${import.meta.env.BACKEND_URL}/likes`, {
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

const toggleComments = (postId) => {
  selectedPost.value = selectedPost.value === postId ? null : postId
}

const addComment = async (post) => {
  if (!user.value) {
    alert('Vous devez être connecté pour commenter.')
    return
  }

  if (!newComment.value.trim()) return

  try {
    const res = await fetch(`${import.meta.env.BACKEND_URL}/comments`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: newComment.value,
        postId: post._id,
        userId: user.value._id
      })
    })

    if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`)
    const createdComment = await res.json()

    const normalizedComment = {
      _id: createdComment._id,
      content: createdComment.content || newComment.value,
      userId: createdComment.userId || user.value,
      createdAt: createdComment.createdAt || new Date().toISOString()
    }

    post.comments.unshift(normalizedComment)

    newComment.value = ''
  } catch (err) {
    console.error('Erreur lors de l’ajout du commentaire:', err)
  }
}


const getAvatar = (userData) => {
  if (!userData) return defaultAvatar('U')
  if (userData.profilePicture) return userData.profilePicture
  return defaultAvatar(userData.username?.charAt(0).toUpperCase() || 'U')
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
          <div class="left-actions">
            <button
              class="like-button"
              :class="{ liked: post.userLiked }"
              @click="toggleLike(post)"
            >
              <Heart :class="{ liked: post.userLiked }" />
              <span>{{ post.likesCount || 0 }}</span>
            </button>

            <button class="comment-toggle" @click="toggleComments(post._id)">
              <MessageCircleMore  />
            </button>
          </div>
        </div>

        <div v-if="selectedPost === post._id" class="comments-section">
          <div v-if="post.comments && post.comments.length > 0" class="comments-list">
            <div v-for="comment in post.comments" :key="comment._id" class="comment">
              <div class="comment-header">
                <img :src="getAvatar(comment.userId)" class="avatar" />
                <span class="comment-username">{{ comment.userId?.username || 'Utilisateur inconnu' }}</span>
              </div>

              <div class="comment-content">
                {{ comment.content }}
              </div>

              <div class="comment-date">
                {{ new Date(comment.createdAt).toLocaleString() }}
              </div>
            </div>
          </div>

          <div v-else class="no-comments">Aucun commentaire pour le moment.</div>

          <div class="add-comment">
            <input
              v-model="newComment"
              placeholder="Écrire un commentaire..."
              @keyup.enter="addComment(post)"
            />
            <button @click="addComment(post)">Envoyer</button>
          </div>
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

.left-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.like-button, .comment-toggle {
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

.like-button.liked svg {
  color: red;
  fill: red;
}

.comments-section {
  margin-top: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-accent);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.comment {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  color: var(--text-main);
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.comment-username {
  font-weight: bold;
  color: var(--text-hover);
}

.comment-content {
  margin-top: 0.3rem;
  margin-left: 2.5rem;
  font-size: 0.95rem;
}

.comment-date {
  margin-top: 0.2rem;
  margin-left: 2.5rem;
  font-size: 0.8rem;
  color: var(--border-accent);
  font-style: italic;
}

.add-comment {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.8rem;
}

.add-comment input {
  flex: 1;
  padding: 0.4rem;
  border-radius: 6px;
  border: 1px solid var(--border-accent);
  background-color: var(--bg-global);
}

.add-comment button {
  padding: 0.4rem 0.8rem;
  background-color: var(--border-accent);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
}

.add-comment button:hover {
  background-color: var(--text-hover);
}
</style>
