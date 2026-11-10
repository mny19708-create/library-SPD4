<template>
  <HeaderHome />
  <div class="page">
    <div class="favorite-container">
      <header class="header">
        <div>
          <p class="eyebrow">— Personal Archive —</p>
          <h2><span class="heart">♥</span> My Favorite Volumes</h2>
        </div>
        <div v-if="!loading && favoriteBooks.length" class="count-badge">
          {{ favoriteBooks.length }} <span>volumes</span>
        </div>
      </header>

      <!-- Skeleton loading -->
      <div v-if="loading" class="grid">
        <div v-for="n in 6" :key="n" class="card skeleton">
          <div class="sk-img shimmer"></div>
          <div class="card-body">
            <div class="sk-line shimmer w80"></div>
            <div class="sk-line shimmer w50"></div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="favoriteBooks.length === 0" class="empty-state">
        <div class="empty-icon">📜</div>
        <p>Alas, thou hast not added any favorite volumes yet.</p>
        <span>Volumes thou cherishest shall be cataloged here.</span>
      </div>

      <!-- Grid -->
      <TransitionGroup v-else name="list" tag="div" class="grid">
        <div
          v-for="(book, i) in favoriteBooks"
          :key="book.book_id || book.id"
          class="card"
          :style="{ '--i': i }"
        >
          <div class="cover-wrap">
            <img
              :src="book.image_url || book.cover_image || book.cover || book.book_cover || '/placeholder.png'"
              alt="Book cover"
              class="cover-img"
            />
            <div class="cover-overlay">
              <button class="btn-read-overlay" @click="readBook(book.book_id || book.id)">▶ Read Volume</button>
            </div>
            <span class="fav-chip">♥</span>
          </div>

          <div class="card-body">
            <h3 :title="book.title">{{ book.title }}</h3>
            <div class="mini-ornament">— ❦ —</div>
            <p>{{ book.category_name || 'General' }}</p>
            <div class="actions">
              <button class="btn-read" @click="readBook(book.book_id || book.id)">Read Now</button>
              <button
                class="btn-remove"
                title="Remove from favorites"
                @click="removeFavorite(book.book_id || book.id)"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">{{ toast.message }}</div>
    </Transition>
  </div>
  <FooterHome />
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import HeaderHome from '@/components/HeaderHome.vue'
import FooterHome from '@/components/FooterHome.vue'

const router = useRouter()
const favoriteBooks = ref([])
const loading = ref(true)
const toast = reactive({ show: false, message: '', type: 'success' })

let toastTimer = null
const showToast = (message, type = 'success') => {
  toast.message = message
  toast.type = type
  toast.show = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.show = false), 2500)
}

const getUserId = () => {
  const userRaw = localStorage.getItem('user')
  if (!userRaw) return ''
  const userObj = JSON.parse(userRaw)
  return userObj.id || userObj.user_id
}

const fetchFavoriteBooks = async () => {
  try {
    loading.value = true
    const userId = getUserId()
    const response = await axios.get(`/api/favorites/user/${userId}`)

    if (response.data && response.data.success) {
      favoriteBooks.value = response.data.data || []
    } else {
      favoriteBooks.value = []
    }
  } catch (error) {
    console.error('Error fetching favorites:', error)
    favoriteBooks.value = []
  } finally {
    loading.value = false
  }
}

const removeFavorite = async (bookId) => {
  try {
    const userId = getUserId()
    const response = await axios.delete('/api/favorites/remove', {
      data: { user_id: userId, book_id: bookId }
    })

    if (response.data && response.data.success) {
      favoriteBooks.value = favoriteBooks.value.filter((book) => (book.book_id || book.id) !== bookId)
      showToast('Removed volume from favorites successfully!')
    }
  } catch (error) {
    console.error('Error removing favorite:', error.response?.data || error.message)
    showToast('Could not remove volume. Please try again!', 'error')
  }
}

const readBook = (bookId) => {
  router.push(`/read/${bookId}`)
}

onMounted(() => {
  fetchFavoriteBooks()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=IM+Fell+English:ital@0;1&family=Playfair+Display:wght@500;700;800&family=Cormorant+Garamond:wght@500;600;700&display=swap');

.page {
  --paper: #f3e7c9;
  --paper-light: #faf1d9;
  --paper-dark: #e5d4a8;
  --ink: #2b1d0e;
  --ink-soft: #6b5334;
  --brown: #4a2f14;
  --gold: #b08d3c;
  --gold-light: #e3c776;
  --burgundy: #7a1f1f;

  min-height: 100vh;
  background-color: var(--paper);
  background-image:
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.24  0 0 0 0 0.1  0 0 0 0.16 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"),
    radial-gradient(ellipse at 20% 0%, rgba(176, 141, 60, 0.18), transparent 55%),
    radial-gradient(ellipse at 100% 100%, rgba(122, 31, 31, 0.1), transparent 50%);
  font-family: 'IM Fell English', 'Cormorant Garamond', Georgia, serif;
  color: var(--ink);
}

.favorite-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 28px;
}

/* Header */
.header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 36px;
  border-bottom: 2px solid var(--brown);
  padding-bottom: 18px;
}
.eyebrow {
  margin: 0 0 6px;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--gold);
}
h2 {
  margin: 0;
  font-family: 'Playfair Display', serif;
  font-size: 34px;
  font-weight: 800;
  color: var(--brown);
}
.heart {
  display: inline-block;
  color: var(--burgundy);
}
.count-badge {
  padding: 8px 18px;
  border-radius: 3px;
  background: var(--paper-light);
  border: 1.5px solid var(--gold);
  font-family: 'Cinzel', serif;
  font-weight: 700;
  color: var(--brown);
}
.count-badge span { font-weight: 400; color: var(--ink-soft); margin-left: 4px; }

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 26px;
}

/* Card */
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  overflow: hidden;
  background: var(--paper-light);
  border: 2px solid var(--brown);
  box-shadow: 4px 6px 0 rgba(74, 47, 20, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: rise 0.6s both;
  animation-delay: calc(var(--i, 0) * 60ms);
}
.card:hover {
  transform: translateY(-6px);
  box-shadow: 7px 10px 0 rgba(74, 47, 20, 0.25), 0 16px 24px -10px rgba(43, 29, 14, 0.4);
}

.cover-wrap {
  position: relative;
  height: 260px;
  overflow: hidden;
  background: var(--paper-dark);
  border-bottom: 2px solid var(--gold);
}
.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: sepia(0.3) contrast(1.05);
  transition: transform 0.5s ease;
}
.card:hover .cover-img { transform: scale(1.06); }

.cover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(42, 26, 13, 0.75);
  opacity: 0;
  transition: opacity 0.3s;
}
.card:hover .cover-overlay { opacity: 1; }

.btn-read-overlay {
  padding: 10px 20px;
  border: 1px solid var(--gold);
  border-radius: 2px;
  background: var(--paper-dark);
  color: var(--brown);
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transform: translateY(10px);
  transition: transform 0.3s, background 0.2s;
}
.card:hover .btn-read-overlay { transform: translateY(0); }
.btn-read-overlay:hover { background: var(--gold-light); }

.fav-chip {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--burgundy);
  color: #f6ead0;
  font-size: 14px;
  border: 1px solid var(--gold);
}

.card-body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 18px;
  text-align: center;
}
.card-body h3 {
  margin: 0 0 4px;
  font-family: 'Playfair Display', serif;
  font-size: 18px;
  font-weight: 800;
  color: var(--brown);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.mini-ornament { margin: 2px 0 8px; font-size: 12px; color: var(--gold); }
.card-body p {
  margin: 0 0 16px;
  font-size: 13.5px;
  font-style: italic;
  color: var(--ink-soft);
}

.actions {
  margin-top: auto;
  display: flex;
  gap: 8px;
}
.btn-read {
  flex: 1;
  padding: 10px;
  border: 2px solid #3a0c0c;
  border-radius: 3px;
  color: #f6ead0;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  background: linear-gradient(180deg, #8a2525, #5a1616);
  box-shadow: 0 3px 0 #3a0c0c;
  transition: all 0.2s;
}
.btn-read:hover { filter: brightness(1.1); transform: translateY(-1px); }

.btn-remove {
  width: 40px;
  border: 2px solid var(--brown);
  border-radius: 3px;
  background: var(--paper-dark);
  color: var(--burgundy);
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-remove:hover { background: #e3c776; }

/* Empty state */
.empty-state {
  margin-top: 60px;
  padding: 56px 24px;
  text-align: center;
  border-radius: 4px;
  background: var(--paper-light);
  border: 3px double var(--brown);
}
.empty-icon { font-size: 50px; margin-bottom: 8px; }
.empty-state p { margin: 10px 0 4px; font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: var(--brown); }
.empty-state span { font-style: italic; color: var(--ink-soft); font-size: 14px; }

/* Skeleton */
.skeleton { pointer-events: none; animation: none; }
.sk-img { height: 260px; }
.sk-line { height: 14px; border-radius: 2px; margin-bottom: 10px; }
.w80 { width: 80%; } .w50 { width: 50%; }
.shimmer {
  background: linear-gradient(90deg, #e5d4a8 25%, #f3e7c9 50%, #e5d4a8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

/* Toast */
.toast {
  position: fixed;
  left: 50%;
  bottom: 32px;
  transform: translateX(-50%);
  z-index: 50;
  padding: 12px 22px;
  border-radius: 3px;
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 700;
  color: #f6ead0;
  border: 1px solid var(--gold);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
}
.toast.success { background: #2f4a33; }
.toast.error { background: #7a1f1f; }

@keyframes rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }

@media (max-width: 600px) {
  .favorite-container { padding: 32px 16px; }
  h2 { font-size: 26px; }
  .grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
  .cover-wrap { height: 200px; }
}
</style>