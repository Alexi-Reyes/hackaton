<script setup>
import { ref, onMounted } from 'vue'
import { Heart, MessageCircleMore, X } from 'lucide-vue-next'

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
      body: JSON.stringify({ postId: post._id }) // userId récupéré depuis la session côté backend
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


const deletePost = async (postId) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) return

  try {
    const res = await fetch(`${import.meta.env.BACKEND_URL}/posts/${postId}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.msg || `Erreur HTTP ${res.status}`)
    }

    // Retirer le post de la liste
    posts.value = posts.value.filter(post => post._id !== postId)
  } catch (err) {
    console.error('Erreur lors de la suppression:', err)
    alert(err.message || 'Erreur lors de la suppression du post')
  }
}

const isAuthor = (post) => {
  return user.value && post.userId?._id === user.value._id
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

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'À l\'instant'
  if (minutes < 60) return `Il y a ${minutes} min`
  if (hours < 24) return `Il y a ${hours}h`
  if (days < 7) return `Il y a ${days}j`
  return date.toLocaleDateString('fr-FR')
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
            <div class="user-details">
              <span class="username">{{ post.userId?.username || 'Utilisateur inconnu' }}</span>
              <span class="date">{{ formatDate(post.createdAt) }}</span>
            </div>
          </div>
          <button v-if="isAuthor(post)" class="delete-button" @click="deletePost(post._id)">
            <X />
          </button>
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
                {{ formatDate(comment.createdAt) }}
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
  font-size: 2rem;
  font-weight: 700;
}

.status {
  text-align: center;
}

.status.error {
  color: red;
}

.posts {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.post {
  background-color: var(--navbar-bg);
  color: var(--text-main);
  padding: 1.25rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.post:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 255, 255, 0.1);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-accent);
}

.username {
  font-weight: 600;
  font-size: 1rem;
}

.date {
  font-size: 0.8rem;
  color: var(--border-accent);
  opacity: 0.8;
}

.post-content {
  line-height: 1.6;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.post-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.left-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.like-button, .comment-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--border-accent);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
}

.like-button:hover,
.comment-toggle:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.like-button:hover,
.like-button.liked {
  color: #ff4757;
}

.like-button.liked svg {
  color: #ff4757;
  fill: #ff4757;
}

.comment-toggle:hover {
  color: var(--text-hover);
}

.delete-button {
  background: none;
  border: none;
  color: var(--border-accent);
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-button:hover {
  background-color: rgba(255, 77, 87, 0.1);
  color: #ff4757;
}

.delete-button svg {
  width: 20px;
  height: 20px;
}

.comments-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.comment {
  background-color: rgba(255, 255, 255, 0.04);
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: background-color 0.2s ease;
}

.comment:hover {
  background-color: rgba(255, 255, 255, 0.06);
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

.comment .avatar {
  width: 32px;
  height: 32px;
}

.comment-username {
  font-weight: 600;
  font-size: 0.9rem;
}

.comment-content {
  font-size: 0.9rem;
  line-height: 1.5;
  opacity: 0.95;
  margin-left: 2.5rem;
  margin-bottom: 0.3rem;
}

.comment-date {
  font-size: 0.75rem;
  color: var(--border-accent);
  opacity: 0.7;
  margin-left: 2.5rem;
}

.no-comments {
  padding: 1rem;
  text-align: center;
  color: var(--border-accent);
  font-style: italic;
  opacity: 0.7;
  font-size: 0.9rem;
}

.add-comment {
  display: flex;
  gap: 0.6rem;
  margin-top: 1rem;
}

.add-comment input {
  flex: 1;
  padding: 0.65rem 0.9rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.05);
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.add-comment input:focus {
  outline: none;
  border-color: var(--border-accent);
  background-color: rgba(255, 255, 255, 0.08);
}

.add-comment input::placeholder {
  color: var(--border-accent);
  opacity: 0.6;
}

.add-comment button {
  padding: 0.65rem 1.2rem;
  background-color: var(--border-accent);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.add-comment button:hover {
  transform: translateY(-1px);
  background-color: var(--text-hover);
}

.add-comment button:active {
  transform: translateY(0);
}
</style>
