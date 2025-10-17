<script setup>
import { ref, onMounted, computed } from 'vue'

const user = ref(null)
const loading = ref(true)
const error = ref(null)
const editMode = ref(false)
const form = ref({ username: '', email: '', profilePicture: '' })
const avatarFile = ref(null)

onMounted(async () => {
  await loadProfile()
})

const loadProfile = async () => {
  loading.value = true
  try {
    const res = await fetch(`${import.meta.env.BACKEND_URL}/users/profile`, {
      credentials: 'include',
    })
    if (!res.ok) throw new Error("Impossible de charger le profil")
    const data = await res.json()
    user.value = data
    form.value.username = data.username
    form.value.email = data.email
    form.value.profilePicture = data.profilePicture || ''
  } catch (err) {
    console.error(err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const toggleEdit = () => {
  editMode.value = !editMode.value
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    avatarFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.profilePicture = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const displayAvatar = computed(() => {
  if (form.value.profilePicture) return form.value.profilePicture
  if (form.value.username) {
    const letter = form.value.username.charAt(0).toUpperCase()
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <rect width="100" height="100" fill="#ccc" />
      <text x="50%" y="50%" font-size="50" text-anchor="middle" dominant-baseline="central" fill="#000">${letter}</text>
    </svg>`
    return `data:image/svg+xml;base64,${btoa(svg)}`
  }
  return ''
})

const saveProfile = async () => {
  try {
    const payload = {
      username: form.value.username,
      email: form.value.email,
      profilePicture: form.value.profilePicture
    }

    const res = await fetch(`${import.meta.env.BACKEND_URL}/users/${user.value._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Erreur lors de la mise à jour du profil')
    const data = await res.json()
    user.value = data.user
    editMode.value = false
    avatarFile.value = null
  } catch (err) {
    console.error(err)
    error.value = err.message
  }
}
</script>

<template>
  <div class="profile">
    <div class="profile-header">
      <h1>Mon profil</h1>
      <button @click="editMode ? saveProfile() : toggleEdit()" class="edit-btn">
        {{ editMode ? 'Enregistrer' : 'Modifier le profil' }}
      </button>
    </div>

    <div v-if="loading" class="status">Chargement...</div>
    <div v-else-if="error" class="status error">{{ error }}</div>

    <div v-else class="info">
      <div class="avatar-container">
        <img
          :src="displayAvatar"
          alt="Avatar"
          class="avatar"
        />
        <div v-if="editMode" class="upload-group">
          <input type="file" accept="image/*" @change="handleFileUpload" />
        </div>
      </div>

      <div class="field-group">
        <label class="field-label">Nom d'utilisateur</label>
        <span v-if="!editMode" class="field-value">{{ user.username }}</span>
        <input v-else v-model="form.username" type="text" class="field-input" />
      </div>

      <div class="field-group">
        <label class="field-label">Email</label>
        <span v-if="!editMode" class="field-value">{{ user.email }}</span>
        <input v-else v-model="form.email" type="email" class="field-input" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile {
  background-color: var(--navbar-bg);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 2px 0 10px rgba(0,0,0,0.1);
  max-width: 500px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.edit-btn {
  background-color: var(--button-bg-white);
  font-weight: bold;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-btn:hover {
  background-color: var(--button-hover-bg-grey);
  color: var(--button-text-black);
}

h1 {
  color: var(--text-main);
  margin: 0;
}

.status {
  color: var(--text-main);
  margin-bottom: 1rem;
}

.status.error {
  color: red;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-accent);
}

.upload-group {
  margin-top: 0.5rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.field-label {
  color: var(--text-main);
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.5px;
  opacity: 0.8;
}

.field-value {
  color: var(--text-main);
  padding: 0.8rem 1rem;
  background: linear-gradient(90deg, rgba(201,166,107,0.1) 0%, transparent 100%);
  border-left: 3px solid var(--border-accent);
  border-radius: 6px;
  transition: all 0.3s ease;
}

.field-input {
  padding: 0.8rem 1rem;
  background: rgba(201,166,107,0.05);
  border: 2px solid var(--border-accent);
  color: var(--text-main);
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
}

.field-input:focus {
  outline: none;
  border-color: var(--button-bg);
  background: rgba(201,166,107,0.15);
  box-shadow: 0 0 0 3px rgba(201,166,107,0.1);
}
</style>
