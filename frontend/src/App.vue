<template>
  <div class="app-layout">
    <!-- Mobile top bar (only when the admin sidebar is available) -->
    <div v-if="showAdminSidebar" class="mobile-bar">
      <button class="m-burger" @click="mobileOpen = true" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
      <div class="m-brand">⚜ <strong>Ebook Master</strong></div>
    </div>

    <!-- Overlay for mobile drawer -->
    <transition name="fade">
      <div v-if="showAdminSidebar && mobileOpen" class="overlay" @click="mobileOpen = false"></div>
    </transition>

    <!-- Admin Sidebar: shown only when the admin is logged in and not on a user/login page -->
    <aside
      v-if="showAdminSidebar"
      class="sidebar"
      :class="{ collapsed, 'mobile-open': mobileOpen }"
    >
      <!-- Brand -->
      <div class="brand">
        <span class="brand-icon">⚜</span>
        <span class="brand-text">
          <strong>Ebook Master</strong>
          <small>Librarian's Office</small>
        </span>
        <button class="collapse-btn" @click="toggleCollapse" :title="collapsed ? 'Expand' : 'Collapse'" aria-label="Toggle sidebar">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="nav-menu">
        <span class="nav-label">— Index —</span>

        <router-link to="/dashboard" class="nav-item" active-class="is-active" title="Dashboard">
          <span class="ni-icon">🏛</span><span class="ni-text">Dashboard</span>
        </router-link>
        <router-link to="/manage-ebooks" class="nav-item" active-class="is-active" title="Manage Ebooks">
          <span class="ni-icon">📚</span><span class="ni-text">Manage Ebooks</span>
        </router-link>
        <router-link to="/manage-categories" class="nav-item" active-class="is-active" title="Manage Categories">
          <span class="ni-icon">🗂</span><span class="ni-text">Manage Categories</span>
        </router-link>
        <router-link to="/users-progress" class="nav-item" active-class="is-active" title="Users &amp; Progress">
          <span class="ni-icon">👥</span><span class="ni-text">Users &amp; Progress</span>
        </router-link>
      </nav>

      <!-- Bottom: admin card + logout -->
      <div class="logout-section">
        <div class="admin-card">
          <span class="avatar">A</span>
          <span class="admin-text">
            <strong>Administrator</strong>
            <small><i class="online"></i>Online</small>
          </span>
        </div>
        <button @click="handleLogout" class="btn-logout" title="Logout">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
          <span class="lg-text">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main :class="{ 'full-width': !showAdminSidebar }" class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Sidebar collapse state (remembered between visits)
const readCollapsed = () => {
  try { return localStorage.getItem('sidebarCollapsed') === '1' } catch (e) { return false }
}
const collapsed = ref(readCollapsed())
const mobileOpen = ref(false)

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
  try { localStorage.setItem('sidebarCollapsed', collapsed.value ? '1' : '0') } catch (e) { /* ignore */ }
}

// Close the mobile drawer after navigating
watch(() => route.path, () => { mobileOpen.value = false })

// Decide whether to show the admin sidebar
const showAdminSidebar = computed(() => {
  const adminToken = localStorage.getItem('adminToken')
  const currentPath = route.path

  // Show only when a token exists and the page is not a user page or the admin login page
  const isUserPage =
    currentPath === '/auth' ||
    currentPath === '/home' ||
    currentPath === '/profile' ||
    currentPath.startsWith('/read') ||
    currentPath.startsWith('/ebook') ||
    currentPath === '/my-certificates'||
    currentPath === '/categories'||
    currentPath ==='/user/favorites'||
    currentPath.startsWith('/user/category/')

  return adminToken && !isUserPage && currentPath !== '/admin/login'
})

// Admin logout
const handleLogout = () => {
  localStorage.removeItem('adminToken') // remove the token
  router.push('/admin/login') // back to admin login
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=IM+Fell+English:ital@0;1&family=Playfair+Display:wght@700;800&display=swap');

.app-layout {
  --paper: #f3e7c9;
  --paper-light: #faf1d9;
  --paper-dark: #e5d4a8;
  --ink: #2b1d0e;
  --brown: #4a2f14;
  --gold: #b08d3c;
  --gold-light: #e3c776;
  --burgundy: #7a1f1f;

  display: flex;
  min-height: 100vh;
  font-family: 'Cinzel', 'Noto Serif Khmer', Georgia, serif;
}

/* ================= SIDEBAR ================= */
.sidebar {
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100vh;
  width: 270px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #f6ead0;
  background:
    repeating-linear-gradient(45deg, rgba(227, 199, 118, 0.05) 0 2px, transparent 2px 14px),
    linear-gradient(170deg, #2a1a0d 0%, #351f0f 60%, #261608 100%);
  border-right: 5px double var(--gold);
  box-shadow: 10px 0 30px -16px rgba(0, 0, 0, 0.75);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 60;
}
.sidebar.collapsed { width: 84px; }

/* ----- brand ----- */
.brand {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 22px 18px;
  border-bottom: 3px double var(--gold);
}
.brand-icon {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  font-size: 22px;
  color: var(--gold-light);
  background: radial-gradient(circle at 35% 30%, #8a2525 0%, #4a1010 100%);
  border: 3px double var(--gold);
  border-radius: 50%;
  box-shadow: 0 6px 12px -2px rgba(0, 0, 0, 0.6), inset 0 2px 3px rgba(255, 255, 255, 0.2);
}
.brand-text { display: flex; flex-direction: column; line-height: 1.15; min-width: 0; white-space: nowrap; }
.brand-text strong {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 19px;
  font-weight: 800;
  background: linear-gradient(180deg, #f6dc8a 0%, #b08d3c 60%, #8a6a22 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.brand-text small {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: #cdb98a;
}

.collapse-btn {
  margin-left: auto;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  color: var(--gold-light);
  background: transparent;
  border: 1.5px solid var(--gold);
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.collapse-btn:hover { color: #3a250f; background: linear-gradient(180deg, #f1d98f, #c9a24a); }
.collapse-btn svg { transition: transform 0.3s ease; }
.sidebar.collapsed .collapse-btn svg { transform: rotate(180deg); }

/* ----- nav ----- */
.nav-menu {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 14px;
  overflow-y: auto;
}
.nav-label {
  padding: 0 12px 8px;
  text-align: center;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--gold);
}
.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 11px 12px;
  font-family: 'Cinzel', 'Noto Serif Khmer', serif;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #e8d9b4;
  text-decoration: none;
  white-space: nowrap;
  border: 1px solid transparent;
  border-radius: 2px;
  transition: all 0.25s ease;
}
.ni-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  font-size: 17px;
  background: rgba(227, 199, 118, 0.08);
  border: 1px solid rgba(227, 199, 118, 0.4);
  border-radius: 50%;
  transition: all 0.25s ease;
}
.nav-item:hover {
  color: #fff4d6;
  background: rgba(227, 199, 118, 0.1);
  border-color: rgba(227, 199, 118, 0.4);
  transform: translateX(3px);
}
.nav-item:hover .ni-icon { background: rgba(227, 199, 118, 0.2); }

.nav-item.is-active {
  color: #3a250f;
  background: linear-gradient(180deg, #f1d98f, #c9a24a);
  border-color: #8a6a22;
  box-shadow: 0 3px 0 #8a6a22;
}
.nav-item.is-active .ni-icon {
  background: rgba(58, 37, 15, 0.12);
  border-color: rgba(58, 37, 15, 0.5);
}
.nav-item.is-active::before {
  content: '❧';
  position: absolute;
  left: -16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 15px;
  line-height: 1;
  color: var(--gold-light);
}

/* ----- bottom ----- */
.logout-section {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 14px 18px;
  border-top: 3px double var(--gold);
}
.admin-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(227, 199, 118, 0.45);
  border-radius: 2px;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.4);
  overflow: hidden;
}
.avatar {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  font-family: 'Playfair Display', serif;
  font-weight: 800;
  font-size: 17px;
  color: var(--gold-light);
  background: radial-gradient(circle at 35% 30%, #8a2525 0%, #4a1010 100%);
  border: 2px solid var(--gold);
  border-radius: 50%;
}
.admin-text { display: flex; flex-direction: column; line-height: 1.2; white-space: nowrap; }
.admin-text strong {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.admin-text small {
  display: flex;
  align-items: center;
  gap: 6px;
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

.btn-logout {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 11px;
  font-family: 'Cinzel', serif;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #ffd9d0;
  background: rgba(122, 31, 31, 0.55);
  border: 1.5px solid #b04545;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.btn-logout:hover {
  color: #fff;
  background: linear-gradient(180deg, #a52a2a, #6e1818);
  border-color: #d06a6a;
  box-shadow: 0 4px 0 #3a0c0c;
  transform: translateY(-2px);
}

/* ----- collapsed state ----- */
.sidebar.collapsed .brand { flex-direction: column; gap: 14px; padding: 18px 0; }
.sidebar.collapsed .brand-text,
.sidebar.collapsed .nav-label,
.sidebar.collapsed .ni-text,
.sidebar.collapsed .admin-text,
.sidebar.collapsed .lg-text { display: none; }
.sidebar.collapsed .collapse-btn { margin-left: 0; }
.sidebar.collapsed .nav-item { justify-content: center; padding: 8px 0; }
.sidebar.collapsed .nav-item:hover { transform: none; }
.sidebar.collapsed .nav-item.is-active::before { left: 2px; }
.sidebar.collapsed .admin-card { justify-content: center; padding: 8px 0; }

/* ================= MAIN ================= */
.main-content {
  flex: 1;
  min-width: 0;
  background-color: var(--paper);
  background-image:
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.24  0 0 0 0 0.1  0 0 0 0.16 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"),
    radial-gradient(ellipse at 20% 0%, rgba(176, 141, 60, 0.18), transparent 55%),
    radial-gradient(ellipse at 100% 100%, rgba(122, 31, 31, 0.1), transparent 50%);
}
.main-content.full-width { width: 100%; }

/* ================= MOBILE ================= */
.mobile-bar { display: none; }
.overlay { display: none; }

@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 900px) {
  .app-layout { flex-direction: column; }

  .mobile-bar {
    position: sticky;
    top: 0;
    z-index: 40;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 10px 18px;
    color: #f6ead0;
    background:
      repeating-linear-gradient(45deg, rgba(227, 199, 118, 0.05) 0 2px, transparent 2px 14px),
      linear-gradient(180deg, #2a1a0d 0%, #3b2412 100%);
    border-bottom: 5px double var(--gold);
  }
  .m-burger {
    width: 42px;
    height: 42px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    background: transparent;
    border: 1.5px solid var(--gold);
    border-radius: 3px;
    cursor: pointer;
  }
  .m-burger span { width: 18px; height: 2px; background: var(--gold-light); border-radius: 2px; }
  .m-brand { font-size: 17px; color: var(--gold-light); }
  .m-brand strong {
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 800;
    background: linear-gradient(180deg, #f6dc8a 0%, #b08d3c 60%, #8a6a22 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .overlay {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 55;
    background: rgba(25, 14, 6, 0.7);
    backdrop-filter: blur(4px);
  }

  .sidebar,
  .sidebar.collapsed {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px;
    transform: translateX(-105%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .sidebar.mobile-open { transform: translateX(0); }

  /* the drawer ignores the "collapsed" look */
  .sidebar.collapsed .brand { flex-direction: row; gap: 12px; padding: 22px 18px; }
  .sidebar.collapsed .brand-text,
  .sidebar.collapsed .nav-label,
  .sidebar.collapsed .ni-text,
  .sidebar.collapsed .admin-text,
  .sidebar.collapsed .lg-text { display: flex; }
  .sidebar.collapsed .nav-label,
  .sidebar.collapsed .ni-text,
  .sidebar.collapsed .lg-text { display: inline; }
  .sidebar.collapsed .nav-item { justify-content: flex-start; padding: 11px 12px; }
  .sidebar.collapsed .nav-item.is-active::before { left: -16px; }
  .sidebar.collapsed .admin-card { justify-content: flex-start; padding: 10px 12px; }
  .collapse-btn { display: none; }
}
</style>