<template>
   <div>
    <!-- Blur overlay — click to close sidebar -->
    <div class="overlay" :class="{ active: isOpen }" @click="closeMenu"></div>

    <header class="header" :class="{ hidden: isHidden }">
    <!-- Logo → goes to Home -->
    <img
      src="../assets/images/logo.png"
      class="logo"
      @click="goHome"
      style="cursor: pointer"
    />

    <nav>
      <router-link to="/WillyHome">Home</router-link>
      <router-link to="/ServiceS">Services</router-link>
      <router-link to="/AboutUss">About</router-link>
      <router-link to="/ConnectUss">ConnectUs</router-link>
    </nav>

    <div class="burger" @click="toggleMenu">☰</div>
  </header>

  <!-- Sidebar — full screen height -->
  <div class="side_manu" :class="{ active: isOpen }">

    <!-- Top: logo + close button -->
    <div class="side_top">
      <img src="../assets/images/logo.png" class="side_logo" @click="goHome" />
      <span class="close_btn" @click="closeMenu">✕</span>
    </div>

    <hr class="divider" />

    <!-- Nav links -->
    <router-link to="/WillyHome"  @click="closeMenu"> Home</router-link>
    <router-link to="/ServiceS"   @click="closeMenu"> Services</router-link>
    <router-link to="/AboutUss"   @click="closeMenu"> About</router-link>
    <router-link to="/ConnectUss" @click="closeMenu"> Connect Us</router-link>

    <!-- Spacer pushes logout to bottom -->
    <div class="spacer"></div>

    <hr class="divider" />

    <!-- Logout -->
    <button class="logout_btn" @click="logout"> Logout</button>
  </div>
  </div>

</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signOut } from 'firebase/auth'

export default {
  name: 'MainNavbar',
  setup() {
    const router   = useRouter()
    const isOpen   = ref(false)
    const isHidden = ref(false)

    // ── Sidebar ──────────────────────────────────────────────────────────────
    const toggleMenu = () => { isOpen.value = !isOpen.value }
    const closeMenu  = () => { isOpen.value = false }

    // ── Logo click → Home ────────────────────────────────────────────────────
    const goHome = () => {
      closeMenu()
      router.push({ name: 'WelliCome' })
    }

    // ── Logout ───────────────────────────────────────────────────────────────
    const logout = async () => {
      try {
        await signOut(getAuth())
        closeMenu()
        router.push({ name: 'LogIn' })
      } catch (err) {
        console.error('Logout error:', err)
      }
    }

    // ── Hide navbar on scroll up, show on scroll down ────────────────────────
    let lastScroll = 0
    const handleScroll = () => {
      const current = window.scrollY
      isHidden.value = current > lastScroll && current > 60
      lastScroll = current
    }

    onMounted(()  => window.addEventListener('scroll', handleScroll))
    onUnmounted(() => window.removeEventListener('scroll', handleScroll))

    return { isOpen, isHidden, toggleMenu, closeMenu, goHome, logout }
  },
}
</script>

<style scoped>
/* ── Variables ─────────────────────────────────────────────────────────────── */
:root {
  --primary-color:   #007bff;
  --secondary-color: #00bfff;
  --accent-color:    #e3a81f;
  --text-color:      #333;
}

/* ── Overlay / Blur ────────────────────────────────────────────────────────── */
.overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1100;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.overlay.active {
  display: block;
  opacity: 1;
}

/* ── Header ────────────────────────────────────────────────────────────────── */
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
  transition: transform 0.3s ease;
}

/* Hide on scroll up */
.header.hidden {
  transform: translateY(-100%);
}

.logo {
  height: 50px;
}

/* ── Desktop nav ───────────────────────────────────────────────────────────── */
nav {
  display: flex;
  gap: 20px;
}
nav a {
  text-decoration: none;
  color: var(--text-color);
  font-weight: bold;
  font-size: 16px;
  padding-bottom: 4px;
  transition: color 0.3s, border-bottom 0.3s, font-size 0.2s;
}
nav a:hover,
nav a.router-link-active {
  color: var(--accent-color);
  border-bottom: 3px solid var(--primary-color);
  font-size: 18px;
}

/* ── Burger ────────────────────────────────────────────────────────────────── */
.burger {
  display: none;
  font-size: 28px;
  cursor: pointer;
  color: var(--primary-color);
}

/* ── Sidebar ───────────────────────────────────────────────────────────────── */
.side_manu {
  position: fixed;
  top: 0;
  right: -300px;          /* hidden by default */
  width: 260px;
  height: 100vh;           /* full screen height */
  background: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 8px;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  z-index: 1200;
  transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
}
.side_manu.active {
  right: 0;
}

/* Top section: logo + close */
.side_top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.side_logo {
  height: 42px;
  cursor: pointer;
}
.close_btn {
  font-size: 22px;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
}
.close_btn:hover {
  color: var(--accent-color);
}

/* Divider */
.divider {
  border: none;
  border-top: 1px solid #eee;
  margin: 2px 0;
}

/* Links */
.side_manu a {
  text-decoration: none;
  color: var(--primary-color);
  font-weight: bold;
  font-size: 17px;
  padding: 12px 14px;
  border-radius: 10px;
  transition: background 0.2s, color 0.2s, padding-left 0.2s;
}
.side_manu a:hover,
.side_manu a.router-link-active {
  background: rgba(0, 123, 255, 0.08);
  color: var(--accent-color);
  padding-left: 20px;
  border-left: 3px solid var(--accent-color);
}

/* Spacer */
.spacer {
  flex: 1;
}

/* Logout button */
.logout_btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #ff4d4d, #cc0000);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  margin-bottom: 10px;
}
.logout_btn:hover {
  opacity: 0.88;
  transform: scale(0.98);
}

/* ── Mobile ────────────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  nav {
    display: none;
  }
  .burger {
    display: block;
  }
}

@media (max-width: 430px) {
  .header {
    padding: 10px 15px;
  }
  .side_manu {
    width: 70vw;
    right: -400px;      /* 75% of screen width on small phones */
  }
}
</style>
