<template>
  <div class="container">
    <div class="card">
      <h1>Connexion</h1>

      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
          />
        </div>

        <div class="input-group">
          <input
            v-model="password"
            type="password"
            placeholder="Mot de passe"
            required
          />
        </div>

        <button type="submit" class="btn">
          Se connecter
        </button>
      </form>

      <p class="footer-text">
        Pas de compte ?
        <a href="/register">S'inscrire</a>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('http://localhost:3000/users/login', {
          email: this.email,
          password: this.password
        });
        console.log('Connexion réussie:', response.data);
        alert('Connexion réussie !');
        this.router.push('/');
      } catch (error) {
        console.error('Erreur lors de la connexion:', error.response ? error.response.data : error.message);
        let errorMessage = 'Erreur lors de la connexion.';
        if (error.response && error.response.data && error.response.data.msg) {
          errorMessage = 'Erreur lors de la connexion: ' + error.response.data.msg;
        } else if (error.message) {
          errorMessage = 'Erreur lors de la connexion: ' + error.message;
        }
        alert(errorMessage);
      }
    }
  }
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.card {
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 0.75rem;
  border: 1px solid #333;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 400px;
}

h1 {
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #ffffff;
}

.input-group {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: #0a0a0a;
  border: 1px solid #333;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #ffffff;
  box-sizing: border-box;
  transition: all 0.2s;
}

input::placeholder {
  color: #ded7d7;
}

input:focus {
  outline: none;
  border-color: #6366f1;
  background: #1a1a1a;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #e5e5e5;
  color: rgb(6, 6, 6);
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover {
  background-color: #55555f;
  color: #e5e5e5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(82, 82, 86, 0.4);
}

.footer-text {
  text-align: center;
  margin-top: 1rem;
  color: #888;
}

.footer-text a {
  color: #ffffff;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
  text-decoration: underline;
}

.footer-text a:hover {
  color: #9797a3;
  text-decoration: underline;
}
</style>
