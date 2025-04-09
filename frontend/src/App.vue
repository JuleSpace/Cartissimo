<template>
  <div id="app">
    <Navbar />
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* Couleurs principales du logo */
  --blue-light: #7FD1F4;
  --yellow: #FFD75C;
  --mint: #64E0B9;
  --coral: #FF8B8B;
  --blue: #4B95DE;
  
  /* Couleurs de fond et utilitaires */
  --bg-primary: #F8D7D7;
  --bg-secondary: #FFFFFF;
  --text-primary: #2C3E50;
  --text-light: #FFFFFF;
  
  /* Ombres et effets */
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  
  /* Espacements */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Bordures */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  
  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
}

html, body, #app {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-color: var(--bg-primary);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
}

/* Style pour les cartes blanches */
.white-card {
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  transition: var(--transition-fast);
}

.white-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
</style> 