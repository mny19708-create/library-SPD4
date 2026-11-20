<template>
  <header class="app-header">
    <div class="bar">
      <!-- Logo -->
      <router-link to="/" class="logo" @click="open = false">
        <span class="logo-icon">⚜</span>
        <span class="logo-text">
          <strong>Ebook Master</strong>
          <small>Librarian's Office</small>
        </span>
      </router-link>

      <!-- Navigation -->
      <nav class="nav-links" :class="{ open }">
        <span class="drawer-title">— Index —</span>

        <router-link to="/" class="nav-item" active-class="" exact-active-class="is-active" @click="open = false">
          <span class="ni-icon">🏛</span><span>Dashboard</span>
        </router-link>
        <router-link to="/ebooks" class="nav-item" active-class="is-active" @click="open = false">
          <span class="ni-icon"></span><span>គ្រប់គ្រង Ebooks</span>
        </router-link>
        <router-link to="/categories" class="nav-item" active-class="is-active" @click="open = false">
          <span class="ni-icon">🗂</span><span>គ្រប់គ្រង Categories</span>
        </router-link>
        <router-link to="/users" class="nav-item" active-class="is-active" @click="open = false">
          <span class="ni-icon">👥</span><span>គ្រប់គ្រង Users &amp; Progress</span>
        </router-link>
        <router-link to="/certificates" class="nav-item" active-class="is-active" @click="open = false">
          <span class="ni-icon">📜</span><span>Manage Certificates</span>
        </router-link>
      </nav>

      <!-- Right side -->
      <div class="right">
        <div class="admin-chip">
          <span class="avatar">A</span>
          <span class="admin-text">
            <strong>Admin</strong>
            <small><i class="online"></i>Online</small>
          </span>
        </div>

        <button class="burger" :class="{ open }" @click="open = !open" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=IM+Fell+English:ital@0;1&family=Playfair+Display:wght@700;800&display=swap');

.app-header {
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
  z-index: 50;
  font-family: 'Cinzel', 'Noto Serif Khmer', Georgia, serif;
  color: #f6ead0;
  background:
    repeating-linear-gradient(45deg, rgba(227, 199, 118, 0.05) 0 2px, transparent 2px 14px),
    linear-gradient(180deg, #2a1a0d 0%, #3b2412 100%);
  border-bottom: 5px double var(--gold);
  box-shadow: 0 10px 24px -12px rgba(0, 0, 0, 0.7);
}

.bar {
  max-width: 1400px;
  margin: 0 auto;
  padding: 10px 28px;
  display: flex;
  align-items: center;
  gap: 26px;
}

/* ===== Logo ===== */
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  flex-shrink: 0;
}
.logo-icon {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  font-size: 22px;
  color: var(--gold-light);
  background: radial-gradient(circle at 35% 30%, #8a2525 0%, #4a1010 100%);
  border: 3px double var(--gold);
  border-radius: 50%;
  box-shadow: 0 6px 12px -2px rgba(0, 0, 0, 0.6), inset 0 2px 3px rgba(255, 255, 255, 0.2);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.logo:hover .logo-icon { transform: rotate(-12deg) scale(1.08); }
.logo-text { display: flex; flex-direction: column; line-height: 1.15; }
.logo-text strong {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 20px;
  font-weight: 800;
  background: linear-gradient(180deg, #f6dc8a 0%, #b08d3c 60%, #8a6a22 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.logo-text small {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #cdb98a;
}

/* ===== Nav ===== */
.nav-links {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px;
  width: fit-content;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(227, 199, 118, 0.4);
  border-radius: 3px;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.4);
}
.drawer-title { display: none; }

.nav-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  font-family: 'Cinzel', 'Noto Serif Khmer', serif;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  color: #e8d9b4;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: 2px;
  transition: all 0.25s ease;
}
.ni-icon { font-size: 15px; line-height: 1; transition: transform 0.25s ease; }
.nav-item:hover {
  color: #fff4d6;
  background: rgba(227, 199, 118, 0.12);
  border-color: rgba(227, 199, 118, 0.4);
}
.nav-item:hover .ni-icon { transform: translateY(-2px) scale(1.15); }
.nav-item.is-active {
  color: #3a250f;
  background: linear-gradient(180deg, #f1d98f, #c9a24a);
  border-color: #8a6a22;
  box-shadow: 0 3px 0 #8a6a22;
}

/* ===== Right ===== */
.right { margin-left: auto; display: flex; align-items: center; gap: 14px; }
.admin-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 16px 5px 5px;
  background: rgba(227, 199, 118, 0.08);
  border: 1.5px solid var(--gold);
  border-radius: 999px;
}
.avatar {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  font-family: 'Playfair Display', serif;
  font-weight: 800;
  font-size: 16px;
  color: var(--gold-light);
  background: radial-gradient(circle at 35% 30%, #8a2525 0%, #4a1010 100%);
  border: 2px solid var(--gold);
  border-radius: 50%;
}
.admin-text { display: flex; flex-direction: column; line-height: 1.15; }
.admin-text strong {
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #f6ead0;
}
.admin-text small {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: 'IM Fell English', Georgia, serif;
  font-size: 13px;
  font-style: italic;
  color: #cdb98a;
}
.online {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #7fd18a;
  box-shadow: 0 0 0 3px rgba(127, 209, 138, 0.25);
  animation: pulse 1.8s infinite;
}

/* ===== Burger ===== */
.burger {
  position: relative;
  z-index: 3;
  display: none;
  width: 42px;
  height: 42px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: transparent;
  border: 1.5px solid var(--gold);
  border-radius: 3px;
  cursor: pointer;
}
.burger span {
  width: 18px;
  height: 2px;
  background: var(--gold-light);
  border-radius: 2px;
  transition: all 0.3s ease;
}
.burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.burger.open span:nth-child(2) { opacity: 0; }
.burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }

/* ===== Responsive ===== */
@media (max-width: 1180px) {
  .admin-text { display: none; }
  .admin-chip { padding: 5px; }
  .nav-item { padding: 10px 11px; }
}
@media (max-width: 960px) {
  .bar { padding: 10px 18px; position: relative; }
  .burger { display: flex; }

  .nav-links {
    position: absolute;
    top: calc(100% + 8px);
    left: 14px;
    right: 14px;
    flex-direction: column;
    align-items: stretch;
    width: auto;
    gap: 8px;
    padding: 16px 14px 14px;
    background-color: var(--paper);
    background-image:
      url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.24  0 0 0 0 0.1  0 0 0 0.16 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
    border: 3px double var(--brown);
    border-radius: 3px;
    box-shadow: 8px 12px 0 rgba(43, 29, 14, 0.35), 0 30px 50px -20px rgba(0, 0, 0, 0.7);
    opacity: 0;
    transform: translateY(-10px);
    pointer-events: none;
    transition: all 0.25s ease;
  }
  .nav-links.open { opacity: 1; transform: translateY(0); pointer-events: auto; }

  .drawer-title {
    display: block;
    text-align: center;
    font-size: 12.5px;
    font-weight: 700;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--burgundy);
  }

  .nav-item {
    padding: 13px 14px;
    font-size: 13px;
    color: var(--brown);
    background: var(--paper-light);
    border: 1.5px solid var(--brown);
  }
  .nav-item:hover { color: var(--ink); background: var(--gold-light); border-color: var(--brown); }
  .nav-item.is-active {
    color: #f6ead0;
    background: linear-gradient(180deg, #8a2525, #5a1616);
    border-color: #3a0c0c;
    box-shadow: 0 3px 0 #3a0c0c;
  }
}
</style>