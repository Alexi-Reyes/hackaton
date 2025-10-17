<script setup>
import { ref, onMounted } from 'vue'
import { Heart, Search } from 'lucide-vue-next'

const posts = ref([])
const loading = ref(true)
const error = ref(null)
const user = ref(null)

onMounted(async () => {
  await getCurrentUser()
  await loadPosts()
})

// 🔹 Récupérer l'utilisateur connecté
const getCurrentUser = async () => {
  try {
    const res = await fetch('http://localhost:3000/users/profile', { credentials: 'include' })
    if (res.ok) user.value = await res.json()
  } catch (err) {
    console.error('Erreur utilisateur:', err)
  }
}

// 🔹 Charger les posts
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
        const resLikes = await fetch(`http://localhost:3000/likes/post/${post._id}`, { credentials: 'include' })
        if (resLikes.ok) {
          const likes = await resLikes.json()
          post.userLiked = likes.some(like => like.userId._id === user.value._id)
        } else post.userLiked = false
      }
    }
  } catch (err) {
    console.error('Erreur lors du chargement des posts:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// 🔹 Liker ou unliker un post
const toggleLike = async (post) => {
  if (!user.value) return alert('Vous devez être connecté pour liker un post.')

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

// 🔹 Gérer l'affichage et chargement des commentaires
const toggleComments = async (post) => {
  post.showComments = !post.showComments
  if (post.showComments && !post.comments) {
    await loadComments(post)
  }
}

const loadComments = async (post) => {
  try {
    const res = await fetch(`http://localhost:3000/comments/post/${post._id}`, { credentials: 'include' })
    if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`)
    post.comments = await res.json()
  } catch (err) {
    console.error('Erreur lors du chargement des commentaires:', err)
  }
}

// 🔹 Ajouter un commentaire
const newComments = ref({})

const addComment = async (post) => {
  const content = newComments.value[post._id]
  if (!user.value) return alert('Vous devez être connecté pour commenter.')
  if (!content?.trim()) return

  try {
    const res = await fetch('http://localhost:3000/comments', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postId: post._id,
        userId: user.value._id,
        content
      })
    })
    if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`)
    const data = await res.json()
    post.comments.unshift({
      ...data.comment,
      userId: { username: user.value.username }
    })
    newComments.value[post._id] = ''
  } catch (err) {
    console.error('Erreur lors de l’ajout du commentaire:', err)
  }
}
</script>

<template>
  <div class="home">
    <h1>Fil d’actualité</h1>

    <div v-if="loading" class="status">Chargement des posts...</div>
    <div v-else-if="error" class="status error">{{ error }}</div>

    <div v-else class="posts">
      <div v-if="posts.length === 0" class="no-posts">Aucun post pour le moment.</div>

      <div v-for="post in posts" :key="post._id" class="post">
        <div class="post-header">
          <span class="users">{{ post.userId?.username || 'Utilisateur inconnu' }}</span>
          <span class="date">{{ new Date(post.createdAt).toLocaleString() }}</span>
        </div>

        <div class="post-content">{{ post.content }}</div>

        <div class="post-footer">
          <button class="comment-button" @click="toggleComments(post)">
            <Search />
          </button>

          <button class="like-button" :class="{ liked: post.userLiked }" @click="toggleLike(post)">
            <Heart :class="{ liked: post.userLiked }" />
            <span>{{ post.likesCount || 0 }}</span>
          </button>
        </div>

        <div v-if="post.showComments" class="comments-section">
          <div class="add-comment">
            <input
              v-model="newComments[post._id]"
              type="text"
              placeholder="Écrire un commentaire..."
              @keyup.enter="addComment(post)"
            />
            <button @click="addComment(post)">Envoyer</button>
          </div>

          <div v-if="!post.comments?.length" class="no-comments">Aucun commentaire.</div>

          <div v-for="comment in post.comments" :key="comment._id" class="comment">
            <div class="comment-body">
              <div class="comment-header">
                <span class="comment-user">{{ comment.userId?.username || 'Utilisateur inconnu' }}</span>
                <span class="comment-date">{{ new Date(comment.createdAt).toLocaleString() }}</span>
              </div>
              <div class="comment-content">{{ comment.content }}</div>
            </div>
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

.date {
  font-style: italic;
  color: var(--border-accent);
  font-size: 0.85rem;
}

.post-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.7rem;
  margin-top: 0.5rem;
}

.comment-button,
.like-button {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--border-accent);
  transition: color 0.3s ease;
}

.like-button:hover,
.comment-button:hover,
.like-button.liked {
  color: red;
}

.comments-section {
  margin-top: 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.7rem;
  border-radius: 8px;
}

.add-comment {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.add-comment input {
  flex: 1;
  border: 1px solid var(--border-accent);
  background: transparent;
  color: var(--text-main);
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
}

.add-comment button {
  background: var(--border-accent);
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
}

.comment {
  background: rgba(0,0,0,0.2);
  border-radius: 6px;
  padding: 0.5rem;
  margin-bottom: 0.4rem;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  color: var(--text-hover);
  font-size: 0.85rem;
}

.comment-content {
  margin-top: 0.3rem;
  color: var(--text-main);
}
</style>
