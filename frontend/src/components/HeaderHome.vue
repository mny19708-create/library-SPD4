<template>
  <header class="navbar">
    <div class="logo-container" @click="goHome">
      <div class="logo-wrapper">
        <img src="/book-logos.png" alt="Logo" class="brand-logo" />
      </div>
      <div class="brand-text">
        <span class="brand-name">Ebook Platform</span>
        <span class="brand-tag">❦ Est. MMXXVI ❦</span>
      </div>
    </div>

    <nav class="nav-links" :class="{ 'nav-active': isMenuOpen }">
      <span class="drawer-title">— Index —</span>

      <router-link to="/home" @click="isMenuOpen = false">
        <span class="icon">⌂</span> Home
      </router-link>
      <router-link to="/my-certificates" @click="isMenuOpen = false">
        <span class="icon">❖</span> Certificates
      </router-link>
      <router-link to="/categories" @click="isMenuOpen = false">
        <span class="icon">☰</span> Category
      </router-link>
      <router-link to="/user/favorites" class="favorite-link" @click="isMenuOpen = false">
        <span class="icon fav-icon">♥</span> My Favorites
      </router-link>
      <router-link to="/profile" class="profile-link" @click="isMenuOpen = false">
        <span class="icon">♟</span> Profile
      </router-link>
      <router-link to="/auth" class="btn-logout" @click="handleLogout">
        <span class="icon">⎋</span> Logout
      </router-link>
    </nav>

    <div
      class="hamburger"
      @click="isMenuOpen = !isMenuOpen"
      :class="{ toggle: isMenuOpen }"
      role="button"
      aria-label="Toggle menu"
    >
      <span></span>
      <span></span>
      <span></span>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isMenuOpen = ref(false)

const goHome = () => {
  isMenuOpen.value = false
  router.push('/home')
}

const handleLogout = () => {
  localStorage.removeItem('user')
  isMenuOpen.value = false
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=IM+Fell+English:ital@0;1&family=Playfair+Display:wght@700;800&display=swap');

.navbar {
  --paper: #f3e7c9;
  --paper-light: #faf1d9;
  --paper-dark: #e5d4a8;
  --ink: #2b1d0e;
  --brown: #4a2f14;
  --gold: #b08d3c;
  --gold-light: #e3c776;
  --burgundy: #7a1f1f;

  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 40px;
  font-family: 'Cinzel', 'Noto Serif Khmer', Georgia, serif;
  background:
    repeating-linear-gradient(45deg, rgba(227, 199, 118, 0.05) 0 2px, transparent 2px 14px),
    linear-gradient(180deg, #2a1a0d 0%, #3b2412 100%);
  border-bottom: 5px double var(--gold);
  box-shadow: 0 10px 24px -12px rgba(0, 0, 0, 0.7);
}

/* ================= BRAND ================= */
.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  white-space: nowrap;
}
.logo-wrapper {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  padding: 5px;
  background: var(--paper-light);
  border: 2px solid var(--gold);
  border-radius: 50%;
  box-shadow: 0 0 0 3px #2a1a0d, 0 0 0 4px var(--gold-light), 0 6px 12px rgba(0, 0, 0, 0.5);
  transition: transform 0.4s ease;
}
.logo-container:hover .logo-wrapper { transform: rotate(-8deg) scale(1.05); }
.brand-logo {
  height: 100%;
  width: 100%;
  object-fit: contain;
  filter: sepia(0.5) contrast(1.05);
}
.brand-text { display: flex; flex-direction: column; line-height: 1.15; }
.brand-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.01em;
  background: linear-gradient(180deg, #f6dc8a 0%, #b08d3c 60%, #8a6a22 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: none;
}
.brand-tag {
  font-size: 9.5px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #cdb98a;
}

/* ================= LINKS ================= */
.nav-links { display: flex; align-items: center; gap: 4px; }
.drawer-title { display: none; }

.nav-links a {
  position: relative;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 14px;
  text-decoration: none;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #e8d9b4;
  border: 1px solid transparent;
  border-radius: 2px;
  transition: all 0.25s ease;
}
.nav-links a .icon { font-size: 15px; color: var(--gold-light); line-height: 1; }
.nav-links a::after {
  content: '';
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 4px;
  height: 1px;
  background: var(--gold-light);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}
.nav-links a:hover {
  color: #fff4d6;
  background: rgba(227, 199, 118, 0.1);
  border-color: rgba(227, 199, 118, 0.35);
}
.nav-links a:hover::after { transform: scaleX(1); }

.nav-links a.router-link-active {
  color: #3a250f;
  background: linear-gradient(180deg, #f1d98f, #c9a24a);
  border-color: #8a6a22;
  box-shadow: 0 3px 0 #8a6a22;
}
.nav-links a.router-link-active .icon { color: var(--burgundy); }
.nav-links a.router-link-active::after { display: none; }

.favorite-link .fav-icon { color: #e05a5a; }
.favorite-link.router-link-active .fav-icon { color: var(--burgundy); }

.nav-links a.btn-logout {
  margin-left: 8px;
  color: #ffd9d0;
  background: rgba(122, 31, 31, 0.55);
  border: 1px solid #b04545;
}
.nav-links a.btn-logout .icon { color: #ffb4a6; }
.nav-links a.btn-logout:hover {
  color: #fff;
  background: #8a2525;
  border-color: #d06a6a;
}

/* ================= HAMBURGER ================= */
.hamburger {
  position: relative;
  z-index: 3;
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 22px;
  cursor: pointer;
}
.hamburger span {
  display: block;
  width: 100%;
  height: 3px;
  background: var(--gold-light);
  border-radius: 2px;
  transition: transform 0.3s ease, opacity 0.3s ease, background 0.3s ease;
}
.hamburger.toggle span { background: var(--brown); }
.hamburger.toggle span:nth-child(1) { transform: translateY(9.5px) rotate(45deg); }
.hamburger.toggle span:nth-child(2) { opacity: 0; }
.hamburger.toggle span:nth-child(3) { transform: translateY(-9.5px) rotate(-45deg); }

/* ================= MOBILE ================= */
@media (max-width: 768px) {
  .navbar { padding: 10px 18px; }
  .brand-name { font-size: 18px; }
  .brand-tag { display: none; }
  .logo-wrapper { width: 44px; height: 44px; }

  .hamburger { display: flex; }

  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    z-index: 2;
    width: 78%;
    max-width: 310px;
    height: 100vh;
    padding: 80px 22px 30px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 10px;
    background-color: var(--paper);
    background-image:
      url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.24  0 0 0 0 0.1  0 0 0 0.16 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
    border-left: 5px double var(--brown);
    box-shadow: -14px 0 30px rgba(0, 0, 0, 0.45);
    transition: right 0.35s ease;
  }
  .nav-links.nav-active { right: 0; }

  .drawer-title {
    display: block;
    margin-bottom: 6px;
    text-align: center;
    font-size: 13px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--burgundy);
  }

  .nav-links a {
    padding: 13px 14px;
    color: var(--brown);
    background: var(--paper-light);
    border: 1.5px solid var(--brown);
  }
  .nav-links a .icon { color: var(--burgundy); }
  .nav-links a::after { display: none; }
  .nav-links a:hover { color: var(--ink); background: var(--gold-light); border-color: var(--brown); }

  .nav-links a.router-link-active {
    color: #f6ead0;
    background: linear-gradient(180deg, #8a2525, #5a1616);
    border-color: #3a0c0c;
    box-shadow: 0 3px 0 #3a0c0c;
  }
  .nav-links a.router-link-active .icon { color: var(--gold-light); }

  .nav-links a.btn-logout {
    margin: 10px 0 0;
    color: var(--burgundy);
    background: transparent;
    border: 2px solid var(--burgundy);
  }
  .nav-links a.btn-logout .icon { color: var(--burgundy); }
  .nav-links a.btn-logout:hover { color: #f6ead0; background: var(--burgundy); }
}
</style>