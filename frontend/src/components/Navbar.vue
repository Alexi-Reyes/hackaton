<template>
  <div class="container">
    <h3>Accueil</h3>
    <h3>Recherche</h3>
    <h3>Messages</h3>
    <h3>J'aime</h3>
    <h3>Post</h3>
    <h3>Profil</h3>
  </div>
</template>

<style scoped>

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: var(--navbar-bg);
  height: 100vh;
  width: 220px;
  padding-top: 20px;
  border-right: 1px solid var(--border-accent);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

h3 {
  color: var(--text-main);
  font-weight: 500;
  padding: 15px 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

h3:hover {
  color: var(--text-hover);
  background: linear-gradient(90deg, rgba(201,166,107,0.15) 0%, transparent 100%);
  border-left: 3px solid var(--border-accent);
  transform: translateX(3px);
}
</style>
