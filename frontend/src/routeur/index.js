import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/Home.vue'
import Search from '../pages/Search.vue'
import Messages from '../pages/Messages.vue'
import Likes from '../pages/Likes.vue'
import Post from '../pages/Post.vue'
import Profile from '../pages/Profile.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/search', name: 'Search', component: Search },
  { path: '/messages', name: 'Messages', component: Messages },
  { path: '/likes', name: 'Likes', component: Likes },
  { path: '/post', name: 'Post', component: Post },
  { path: '/profile', name: 'Profile', component: Profile },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
