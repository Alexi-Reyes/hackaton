<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-6">
        {{ isLogin ? 'Connexion' : 'Inscription' }}
      </h1>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="!isLogin">
          <input
            v-model="formData.name"
            type="text"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Nom complet"
            required
          />
        </div>

        <div>
          <input
            v-model="formData.email"
            type="email"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Email"
            required
          />
        </div>

        <div>
          <input
            v-model="formData.password"
            type="password"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Mot de passe"
            required
          />
        </div>

        <div v-if="!isLogin">
          <input
            v-model="formData.confirmPassword"
            type="password"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Confirmer le mot de passe"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          {{ isLogin ? 'Se connecter' : 'S\'inscrire' }}
        </button>
      </form>

      <p class="text-center mt-4 text-gray-600">
        {{ isLogin ? 'Pas de compte ?' : 'Déjà inscrit ?' }}
        <button @click="toggleMode" class="text-indigo-600 font-semibold hover:underline">
          {{ isLogin ? 'S\'inscrire' : 'Se connecter' }}
        </button>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthPage',
  data() {
    return {
      isLogin: true,
      formData: {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    };
  },
  methods: {
    handleSubmit() {
      if (!this.isLogin && this.formData.password !== this.formData.confirmPassword) {
        alert('Les mots de passe ne correspondent pas');
        return;
      }
      console.log(this.isLogin ? 'Connexion' : 'Inscription', this.formData);
      alert(this.isLogin ? 'Connexion réussie !' : 'Inscription réussie !');
    },
    toggleMode() {
      this.isLogin = !this.isLogin;
      this.formData = { name: '', email: '', password: '', confirmPassword: '' };
    }
  }
};
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}

.bg-gradient-to-br {
  background: linear-gradient(to bottom right, #4f46e5, #9333ea);
}

.from-indigo-600 {
  --tw-gradient-from: #4f46e5;
}

.to-purple-600 {
  --tw-gradient-to: #9333ea;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.p-4 {
  padding: 1rem;
}

.p-8 {
  padding: 2rem;
}

.bg-white {
  background-color: white;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.w-full {
  width: 100%;
}

.max-w-md {
  max-width: 28rem;
}

.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}

.font-bold {
  font-weight: 700;
}

.font-semibold {
  font-weight: 600;
}

.text-center {
  text-align: center;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mt-4 {
  margin-top: 1rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.border {
  border-width: 1px;
  border-color: #d1d5db;
}

.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-2:focus {
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.5);
}

.focus\:ring-indigo-500:focus {
  --tw-ring-color: #6366f1;
}

.bg-indigo-600 {
  background-color: #4f46e5;
}

.text-white {
  color: white;
}

.hover\:bg-indigo-700:hover {
  background-color: #4338ca;
}

.transition {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.text-gray-600 {
  color: #4b5563;
}

.text-indigo-600 {
  color: #4f46e5;
}

.hover\:underline:hover {
  text-decoration: underline;
}

input {
  width: 100%;
}

button[type="submit"] {
  cursor: pointer;
}

button:not([type="submit"]) {
  background: none;
  border: none;
  cursor: pointer;
}
</style>