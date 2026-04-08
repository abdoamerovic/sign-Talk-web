<template>
  <header class="header">
    <img src="../assets/images/logo.png" class="logo" />

    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/ServiceS">Services</router-link>
      <router-link to="/AboutUss">About</router-link>
      <router-link to="/ConnectUss">ConnectUs</router-link>
    </nav>

    <div class="burger" @click="toggleMenu">☰</div>

    <div class="side_manu" :class="{ active: isOpen }">
      <router-link to="/" @click="closeMenu">Home</router-link>
      <router-link to="/ServiceS" @click="closeMenu">Services</router-link>
      <router-link to="/AboutUss" @click="closeMenu">About</router-link>
      <router-link to="/ConnectUss" @click="closeMenu">ConnectUs</router-link>
    </div>
  </header>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const isOpen = ref(false)

    const toggleMenu = () => {
      isOpen.value = !isOpen.value
    }

    const closeMenu = () => {
      isOpen.value = false
    }

    return { isOpen, toggleMenu, closeMenu }
  },
}
</script>

<style scoped>
.header {
  width: 100%;
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  box-shadow: 2px 4px 10px rgba(253, 199, 2, 0.897);
  z-index: 1000;
}
.header nav a {
  text-decoration: none;
  color: var(--text-color);
  margin: 0 15px;
  font-size: 16px;
  font-weight: bold;
}
.header nav a:hover {
  color: var(--accent-color);
  transition:
    background-color 0.6s,
    color 0.5s;
  border-bottom: 4px solid var(--primary-color);
  font-size: 20px;
}
.header nav a.active {
  color: var(--accent-color);
  transition:
    background-color 0.6s,
    color 0.5s;
  border-bottom: 4px solid var(--primary-color);
  font-size: 20px;
}

.logo {
  height: 50px;
}

nav {
  display: flex;
  gap: 20px;
}

nav a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

nav a.router-link-active {
  color: #007bff;
  border-bottom: 2px solid #007bff;
}

.burger {
  display: none;
  font-size: 28px;
  cursor: pointer;
}

.side_manu {
  position: fixed;
  top: 70px;
  right: -220px;
  width: 180px;
  background: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  transition: right 0.3s ease;
}

.side_manu.active {
  right: 10px;
}

.side_manu a {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
}

/* 🔥 Mobile */
@media (max-width: 768px) {
  nav {
    display: none;
  }

  .burger {
    display: block;
  }
}
@media (max-width: 430px) {
  .header nav a.router-link-active {
    display: none;
  }

  .header {
    width: 100%;
  }
  .header nav a {
    display: none;
    position: absolute;
    top: 60px;
    right: 10px;
    background: white;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
    flex-direction: column;
    width: 150px;
  }
  .burger {
    display: block;
    margin-left: 40%;
  }
  .header nav a.router-link-active {
    display: flex;
  }

  .side_manu {
    top: 50px;
    width: 160px;
    padding: 10px;
    gap: 10px;
  }
  .side_manu.active {
    right: 5px;
  }
  .side_manu a {
    font-size: 16px;
    padding: 8px 0;
  }
  .side_manu a:hover {
    background-color: var(--secondary-color);
    color: #fff;
  }
}
</style>
