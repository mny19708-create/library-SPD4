<template>
  <div class="home">
    <!-- Header Component -->
    <HeaderHome />

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-frame">
        <div class="corner tl">❧</div>
        <div class="corner tr">❧</div>
        <div class="corner bl">❧</div>
        <div class="corner br">❧</div>

        <div class="hero-inner">
          <p class="est">— Established MMXXVI —</p>
          <h1>
            The Grand <span class="gold">Ebook</span><br />
            Library
          </h1>
          <div class="ornament"><span></span><i>❦</i><span></span></div>
          <p class="hero-sub">
            A humble collection of volumes to read, to study,<br />
            and to be honoured with a certificate of merit.
          </p>

          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input type="text" v-model="searchQuery" placeholder="Consult the catalogue by title..."
              @input="currentPage = 1" />
            <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''; currentPage = 1"
              aria-label="Clear">✕</button>
          </div>

          <div class="hero-stats">
            <div class="stat"><strong>{{ ebooks.length }}</strong><span>Volumes</span></div>
            <div class="divider">✦</div>
            <div class="stat"><strong>{{ categories.length - 1 }}</strong><span>Subjects</span></div>
            <div class="divider">✦</div>
            <div class="stat"><strong>🎓</strong><span>Certificates</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="content">
      <!-- Index tabs -->
      <div class="category-tabs">
        <button v-for="cat in categories" :key="cat" :class="{ active: selectedCategory === cat }"
          @click="selectedCategory = cat; currentPage = 1">
          {{ cat }}
        </button>
      </div>

      <div class="section-head">
        <h2>The Collection</h2>
        <div class="head-line"></div>
        <span class="result-count" v-if="!isLoading">{{ filteredEbooks.length }} volume(s)</span>
      </div>

      <!-- Skeleton Loading -->
      <div v-if="isLoading" class="ebook-grid">
        <div v-for="n in 6" :key="n" class="ebook-card skeleton">
          <div class="sk sk-cover"></div>
          <div class="sk sk-line w60"></div>
          <div class="sk sk-line w30"></div>
          <div class="sk sk-line w90"></div>
        </div>
      </div>

      <div v-else-if="paginatedEbooks.length > 0">
        <div class="ebook-grid">
          <article v-for="(ebook, index) in paginatedEbooks" :key="ebook.id" class="ebook-card"
            :style="{ animationDelay: index * 70 + 'ms' }">
            <!-- Cover (leather binding) -->
            <div class="cover" :style="{ background: coverLeather(ebook) }">
              <div class="cover-border"></div>

              <img v-if="ebook.image_url && !imgFailed[ebook.id]" :src="ebook.image_url" alt="Book Cover"
                class="real-cover-img" loading="lazy" @error="imgFailed[ebook.id] = true" />

              <div v-else class="book-mock">
                <div class="book-spine"></div>
                <div class="book-face">
                  <span class="book-emoji">✠</span>
                  <span class="book-title-mini">{{ ebook.title }}</span>
                  <span class="book-emoji small">❦</span>
                </div>
              </div>

              <!-- Favorite bookmark ribbon -->
              <button class="favorite-btn" :class="{ on: isFavorite(ebook.id) }" @click.stop="toggleFavorite(ebook.id)"
                :title="isFavorite(ebook.id) ? 'Remove from favorites' : 'Add to favorites'">
                <span>{{ isFavorite(ebook.id) ? '♥' : '♡' }}</span>
              </button>

              <span class="badge">{{ ebook.category_name || 'General' }}</span>
              <span class="time-chip">⌛ {{ requiredMinutes(ebook) }} min</span>
            </div>

            <!-- Body -->
            <div class="card-body">
              <h3>{{ ebook.title }}</h3>
              <div class="mini-ornament">— ❦ —</div>
              <p class="description" v-if="ebook.description">
                {{ ebook.description.substring(0, 80) }}{{ ebook.description.length > 80 ? '...' : '' }}
              </p>
              <p class="description muted" v-else>Begin thy reading and earn a certificate of merit.</p>

              <div class="card-progress-section">
                <div class="progress-info">
                  <span>Reading Progress</span>
                  <span class="progress-pct">{{ getProgressPercent(ebook) }}%</span>
                </div>
                <div class="mini-bar">
                  <div class="mini-bar-fill" :style="{ width: getProgressPercent(ebook) + '%' }"></div>
                </div>
                <div v-if="getProgressPercent(ebook) >= 100" class="seal">✔ Completed</div>
              </div>

              <div class="card-actions">
                <button @click="checkAuthAndGo('detail', ebook.id)" class="btn-view">View Details</button>
                <button @click="checkAuthAndGo('read', ebook.id)" class="btn-read">
                  Read Now
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        </div>

        <div class="pagination" v-if="totalPages > 1">
          <button :disabled="currentPage === 1" @click="currentPage--">← Previous</button>
          <div class="page-dots">
            <span v-for="p in totalPages" :key="p" :class="{ on: p === currentPage }" @click="currentPage = p">{{
              toRoman(p) }}</span>
          </div>
          <button :disabled="currentPage === totalPages" @click="currentPage++">Next →</button>
        </div>
      </div>

      <div v-else class="empty">
        <div class="empty-icon">📜</div>
        <h4>No volumes found</h4>
        <p>Alas, no ebooks match thy search.</p>
        <button class="btn-reset" @click="searchQuery = ''; selectedCategory = 'All'; currentPage = 1">Reset
          filters</button>
      </div>
    </section>

    <FooterHome />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onActivated, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import HeaderHome from '@/components/HeaderHome.vue'
import FooterHome from '@/components/FooterHome.vue'

const router = useRouter()
const ebooks = ref([])
const userProgressMap = ref({}) // ebook_id -> { seconds, done }
const favoriteBookIds = ref(new Set()) // Track favorite ebook IDs
const isLoading = ref(true)
const imgFailed = reactive({}) // ebook id -> cover image failed to load

const searchQuery = ref('')
const selectedCategory = ref('All')
const currentPage = ref(1)
const itemsPerPage = 6

const getUserId = () => {
  try {
    const rawValue = localStorage.getItem('user')
    if (rawValue) {
      const userObj = JSON.parse(rawValue)
      return userObj.id || userObj.user_id
    }
  } catch (err) {
    console.error('Error reading user from localStorage:', err)
  }
  return null
}
// បន្ថែម Function សម្រាប់ពិនិត្យការ Login មុននឹងអនុញ្ញាតឱ្យមើលលម្អិត ឬអានសៀវភៅ
const checkAuthAndGo = (actionType, id) => {
  const user = localStorage.getItem('user') // ពិនិត្យមើលទិន្នន័យ user ក្នុង localStorage
  
  if (!user) {
    // បើមិនទាន់ Login ទេ ឱ្យបង្ហាញសារព្រមាន និងបង្វែរទំព័រទៅកាន់ /auth (Login/Register)
    alert('📜 សូមធ្វើការ Sign In ឬ Enroll (Login) ជាមុនសិន ដើម្បីមើលលម្អិត ឬអានវ៉ុនសៀវភៅនេះ!')
    router.push('/auth')
  } else {
    // បើបាន Login ហើយ ឱ្យចូលទៅតាមមុខងារធម្មតា
    if (actionType === 'detail') {
      router.push(`/ebook/${id}`)
    } else if (actionType === 'read') {
      router.push(`/read/${id}`)
    }
  }
}
// Required minutes set by admin
const requiredMinutes = (ebook) => Number(ebook.estimated_reading_time) || 10

const fetchEbooks = async () => {
  try {
    const response = await axios.get('/api/ebooks')
    if (response.data.success) {
      ebooks.value = response.data.data
    }
  } catch (err) {
    console.error('Failed to fetch ebooks:', err)
  }
}

// Fetch reading progress
const fetchProgress = async () => {
  const userId = getUserId()
  if (!userId || userId === 'user') return
  try {
    const progRes = await axios.get(`/api/progress/user/${userId}`)
    if (progRes.data.success) {
      const map = {}
      progRes.data.data.forEach(item => {
        map[String(item.ebook_id)] = {
          seconds: Number(item.reading_seconds) || (Number(item.reading_duration_minutes) || 0) * 60,
          done: !!item.is_completed
        }
      })
      userProgressMap.value = map
    }
  } catch (err) {
    console.warn('Failed to fetch reading progress:', err.response?.status || err.message)
  }
}

// Fetch user favorites list
const fetchFavorites = async () => {
  const userId = getUserId()
  if (!userId || userId === 'user') return
  try {
    const res = await axios.get(`/api/favorites/user/${userId}`)
    if (res.data.success) {
      const favSet = new Set()
      res.data.data.forEach(fav => {
        favSet.add(String(fav.book_id || fav.id))
      })
      favoriteBookIds.value = favSet
    }
  } catch (err) {
    console.warn('Failed to fetch favorites:', err)
  }
}

const isFavorite = (bookId) => favoriteBookIds.value.has(String(bookId))

// Toggle Favorite (Add / Remove)
const toggleFavorite = async (bookId) => {
  const userId = getUserId()
  if (!userId || userId === 'user') {
    alert('Please log in to save favorites.')
    return
  }

  const strBookId = String(bookId)
  const isFav = favoriteBookIds.value.has(strBookId)

  try {
    if (isFav) {
      await axios.delete('/api/favorites/remove', {
        data: { user_id: userId, book_id: bookId }
      })
      favoriteBookIds.value.delete(strBookId)
    } else {
      await axios.post('/api/favorites/add', {
        user_id: userId,
        book_id: bookId
      })
      favoriteBookIds.value.add(strBookId)
    }
    // trigger reactivity for the Set
    favoriteBookIds.value = new Set(favoriteBookIds.value)
  } catch (err) {
    console.error('Failed to update favorite status:', err)
    alert('Could not update favorite status. Please try again.')
  }
}

const onWindowFocus = () => {
  fetchProgress()
  fetchFavorites()
}

onMounted(async () => {
  await Promise.all([fetchEbooks(), fetchProgress(), fetchFavorites()])
  isLoading.value = false
  window.addEventListener('focus', onWindowFocus)
})

onActivated(() => {
  if (!isLoading.value) {
    fetchProgress()
    fetchFavorites()
  }
})
onUnmounted(() => window.removeEventListener('focus', onWindowFocus))

const getProgressPercent = (ebook) => {
  const p = userProgressMap.value[String(ebook.id)]
  if (!p) return 0
  if (p.done) return 100
  const percent = Math.floor((p.seconds / (requiredMinutes(ebook) * 60)) * 100)
  return Math.min(100, Math.max(0, percent))
}

const categories = computed(() => {
  const cats = ebooks.value.map(e => e.category_name || 'General')
  return ['All', ...new Set(cats)]
})

const filteredEbooks = computed(() => {
  return ebooks.value.filter(ebook => {
    const matchesSearch = ebook.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const ebookCat = ebook.category_name || 'General'
    const matchesCategory = selectedCategory.value === 'All' || ebookCat === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const totalPages = computed(() => Math.ceil(filteredEbooks.value.length / itemsPerPage) || 1)

const paginatedEbooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredEbooks.value.slice(start, start + itemsPerPage)
})

// Antique leather binding colours: burgundy, forest, navy, umber, plum, slate
const leathers = [
  ['#7a1f1f', '#4a1010'],
  ['#2f4a33', '#1a2e1e'],
  ['#1f3250', '#111d33'],
  ['#6b4423', '#3e2713'],
  ['#4e2a54', '#2a1530'],
  ['#3d4a52', '#222b31']
]
const coverLeather = (ebook) => {
  const name = ebook.category_name || 'General'
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  const [a, b] = leathers[hash % leathers.length]
  return `linear-gradient(145deg, ${a} 0%, ${b} 100%)`
}

// 1 -> I, 4 -> IV, 12 -> XII ...
const toRoman = (num) => {
  const map = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
  let n = num
  let out = ''
  for (const [v, s] of map) {
    while (n >= v) { out += s; n -= v }
  }
  return out
}

const goToDetail = (id) => {
  router.push(`/ebook/${id}`)
}

const startReading = (id) => {
  router.push(`/read/${id}`)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=IM+Fell+English:ital@0;1&family=Playfair+Display:wght@500;700;800&family=Cormorant+Garamond:wght@500;600;700&display=swap');

.home {
  --paper: #f3e7c9;
  --paper-light: #faf1d9;
  --paper-dark: #e5d4a8;
  --ink: #2b1d0e;
  --ink-soft: #6b5334;
  --brown: #4a2f14;
  --gold: #b08d3c;
  --gold-light: #e3c776;
  --burgundy: #7a1f1f;
  --green: #2f4a33;

  font-family: 'IM Fell English', 'Cormorant Garamond', Georgia, 'Noto Serif Khmer', 'Times New Roman', serif;
  min-height: 100vh;
  color: var(--ink);
  background-color: var(--paper);
  background-image:
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.24  0 0 0 0 0.1  0 0 0 0.16 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"),
    radial-gradient(ellipse at 20% 0%, rgba(176, 141, 60, 0.18), transparent 55%),
    radial-gradient(ellipse at 100% 100%, rgba(122, 31, 31, 0.1), transparent 50%);
}

/* ================= HERO ================= */
.hero {
  position: relative;
  padding: 44px 20px 90px;
  background:
    repeating-linear-gradient(45deg, rgba(227, 199, 118, 0.05) 0 2px, transparent 2px 14px),
    linear-gradient(180deg, #2a1a0d 0%, #3b2412 100%);
  border-bottom: 6px double var(--gold);
  box-shadow: 0 12px 30px -14px rgba(0, 0, 0, 0.6);
}

.hero-frame {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  padding: 46px 28px 40px;
  text-align: center;
  border: 2px solid var(--gold);
  outline: 1px solid rgba(227, 199, 118, 0.5);
  outline-offset: 6px;
  background: radial-gradient(ellipse at center, rgba(227, 199, 118, 0.1), transparent 70%);
}

.corner {
  position: absolute;
  font-size: 28px;
  color: var(--gold-light);
  line-height: 1;
  background: #33200f;
  padding: 0 6px;
}

.tl {
  top: -16px;
  left: 24px;
}

.tr {
  top: -16px;
  right: 24px;
  transform: scaleX(-1);
}

.bl {
  bottom: -16px;
  left: 24px;
  transform: scaleY(-1);
}

.br {
  bottom: -16px;
  right: 24px;
  transform: scale(-1, -1);
}

.hero-inner {
  position: relative;
  z-index: 1;
}

.est {
  margin: 0 0 12px;
  font-family: 'Cinzel', serif;
  font-size: 12.5px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--gold-light);
}

.hero h1 {
  margin: 0;
  font-family: 'Playfair Display', 'Cinzel', Georgia, serif;
  font-size: clamp(34px, 6vw, 62px);
  line-height: 1.12;
  font-weight: 800;
  color: #f6ead0;
  text-shadow: 0 2px 0 #1d1108, 0 6px 18px rgba(0, 0, 0, 0.5);
}

.gold {
  background: linear-gradient(180deg, #f6dc8a 0%, #b08d3c 55%, #8a6a22 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: none;
}

.ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin: 18px auto 16px;
  max-width: 340px;
}

.ornament span {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold-light), transparent);
}

.ornament i {
  font-style: normal;
  font-size: 24px;
  color: var(--gold-light);
}

.hero-sub {
  margin: 0;
  font-size: 18px;
  font-style: italic;
  line-height: 1.6;
  color: #e4d3ac;
}

.search-box {
  position: relative;
  max-width: 540px;
  margin: 30px auto 0;
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--ink-soft);
}

.search-box input {
  width: 100%;
  padding: 15px 46px 15px 48px;
  font-family: inherit;
  font-size: 17px;
  font-style: italic;
  color: var(--ink);
  background: var(--paper-light);
  border: 2px solid var(--gold);
  border-radius: 4px;
  outline: none;
  box-shadow: inset 0 2px 6px rgba(74, 47, 20, 0.25), 0 0 0 4px rgba(176, 141, 60, 0.25);
  transition: box-shadow 0.25s ease;
}

.search-box input::placeholder {
  color: #8f7650;
}

.search-box input:focus {
  box-shadow: inset 0 2px 6px rgba(74, 47, 20, 0.25), 0 0 0 5px rgba(227, 199, 118, 0.55);
}

.clear-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 26px;
  height: 26px;
  border: 1px solid var(--gold);
  border-radius: 50%;
  background: var(--paper-dark);
  color: var(--brown);
  cursor: pointer;
  font-size: 11px;
}

.clear-btn:hover {
  background: var(--gold-light);
}

.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: 24px;
  margin-top: 30px;
  padding: 12px 30px;
  border-top: 1px solid var(--gold);
  border-bottom: 1px solid var(--gold);
}

.stat {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  color: #f6ead0;
}

.stat strong {
  font-family: 'Playfair Display', serif;
  font-size: 26px;
  font-weight: 800;
  color: var(--gold-light);
}

.stat span {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.85;
}

.divider {
  color: var(--gold);
  font-size: 14px;
}

/* ================= CONTENT ================= */
.content {
  position: relative;
  z-index: 2;
  max-width: 1160px;
  margin: -40px auto 0;
  padding: 0 24px 70px;
}

/* Index tabs */
.category-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 36px;
  padding: 10px 12px 0;
  overflow-x: auto;
  background: var(--paper-light);
  border: 2px solid var(--brown);
  border-bottom: 5px solid var(--brown);
  border-radius: 6px 6px 0 0;
  box-shadow: 0 14px 24px -16px rgba(43, 29, 14, 0.7);
  scrollbar-width: none;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.category-tabs button {
  padding: 10px 22px;
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-soft);
  white-space: nowrap;
  background: var(--paper-dark);
  border: 1px solid var(--brown);
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-tabs button:hover {
  background: var(--gold-light);
  color: var(--ink);
}

.category-tabs button.active {
  color: #f6ead0;
  background: linear-gradient(180deg, var(--burgundy), #521212);
  box-shadow: 0 5px 0 var(--burgundy);
  transform: translateY(2px);
}

.section-head {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 26px;
}

.section-head h2 {
  margin: 0;
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-weight: 800;
  color: var(--brown);
}

.head-line {
  flex: 1;
  height: 6px;
  border-top: 1px solid var(--brown);
  border-bottom: 1px solid var(--brown);
}

.result-count {
  font-size: 15px;
  font-style: italic;
  color: var(--ink-soft);
  white-space: nowrap;
}

/* ================= GRID & CARD ================= */
.ebook-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

.ebook-card {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--paper-light);
  border: 2px solid var(--brown);
  border-radius: 4px;
  box-shadow: 6px 8px 0 rgba(74, 47, 20, 0.28), 0 18px 30px -14px rgba(43, 29, 14, 0.5);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}

.ebook-card::after {
  content: '';
  position: absolute;
  inset: 6px;
  border: 1px solid rgba(176, 141, 60, 0.7);
  pointer-events: none;
  z-index: 4;
}

.ebook-card:hover {
  transform: translateY(-6px) rotate(-0.4deg);
  box-shadow: 9px 14px 0 rgba(74, 47, 20, 0.3), 0 26px 38px -14px rgba(43, 29, 14, 0.55);
}

.cover {
  position: relative;
  height: 220px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-bottom: 3px double var(--gold);
}

.cover-border {
  position: absolute;
  inset: 12px;
  border: 1.5px solid var(--gold);
  box-shadow: inset 0 0 0 4px transparent, inset 0 0 0 5px rgba(227, 199, 118, 0.45);
  z-index: 2;
  pointer-events: none;
}

.real-cover-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  filter: sepia(0.35) contrast(1.02);
  transition: transform 0.6s ease, filter 0.4s ease;
}

.ebook-card:hover .real-cover-img {
  transform: scale(1.05);
  filter: sepia(0.1) contrast(1.05);
}

.book-mock {
  position: relative;
  z-index: 1;
  display: flex;
  filter: drop-shadow(0 14px 14px rgba(0, 0, 0, 0.5));
  transform: rotate(-2deg);
}

.book-spine {
  width: 14px;
  background: repeating-linear-gradient(180deg, #b08d3c 0 6px, #8a6a22 6px 8px);
  border-radius: 3px 0 0 3px;
}

.book-face {
  width: 112px;
  height: 152px;
  padding: 14px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  background: linear-gradient(160deg, #f6ead0, #e3d1a1);
  border: 2px solid var(--gold);
  border-radius: 0 6px 6px 0;
}

.book-emoji {
  font-size: 28px;
  color: var(--burgundy);
}

.book-emoji.small {
  font-size: 18px;
}

.book-title-mini {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: 'Playfair Display', serif;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--ink);
}

/* Bookmark ribbon (favorite) */
.favorite-btn {
  position: absolute;
  top: 0;
  right: 22px;
  z-index: 5;
  width: 38px;
  height: 56px;
  padding-bottom: 8px;
  display: grid;
  place-items: center;
  color: #f6ead0;
  font-size: 20px;
  line-height: 1;
  background: linear-gradient(180deg, #5a1616, #3a0c0c);
  border: none;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%);
  cursor: pointer;
  filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.4));
  transition: transform 0.2s ease, background 0.2s ease;
}

.favorite-btn:hover {
  transform: translateY(3px);
}

.favorite-btn.on {
  background: linear-gradient(180deg, #b32424, #7a1f1f);
  color: #ffe9b8;
}

.badge {
  position: absolute;
  top: 22px;
  left: 22px;
  z-index: 3;
  padding: 5px 12px;
  font-family: 'Cinzel', serif;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #3a250f;
  background: linear-gradient(180deg, #f1d98f, #c9a24a);
  border: 1px solid #8a6a22;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.35);
}

.time-chip {
  position: absolute;
  bottom: 22px;
  right: 22px;
  z-index: 3;
  padding: 4px 10px;
  font-size: 13px;
  font-style: italic;
  color: var(--ink);
  background: var(--paper-light);
  border: 1px solid var(--gold);
  border-radius: 2px;
}

.card-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 24px 24px 22px;
}

.card-body h3 {
  margin: 0;
  text-align: center;
  font-family: 'Playfair Display', serif;
  font-size: 21px;
  font-weight: 800;
  line-height: 1.3;
  color: var(--brown);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.mini-ornament {
  margin: 6px 0 10px;
  text-align: center;
  font-size: 14px;
  letter-spacing: 0.3em;
  color: var(--gold);
}

.description {
  margin: 0 0 16px;
  flex: 1;
  font-size: 15.5px;
  line-height: 1.6;
  text-align: center;
  color: var(--ink-soft);
}

.description.muted {
  font-style: italic;
  opacity: 0.85;
}

/* Progress (ink gauge) */
.card-progress-section {
  margin-bottom: 18px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-family: 'Cinzel', serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-soft);
}

.progress-pct {
  color: var(--burgundy);
  font-size: 13px;
}

.mini-bar {
  width: 100%;
  height: 10px;
  padding: 1px;
  background: var(--paper-dark);
  border: 1.5px solid var(--brown);
  border-radius: 2px;
  box-shadow: inset 0 1px 3px rgba(43, 29, 14, 0.35);
}

.mini-bar-fill {
  height: 100%;
  background: repeating-linear-gradient(45deg, #7a1f1f 0 6px, #5a1616 6px 12px);
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.seal {
  display: inline-block;
  margin-top: 8px;
  padding: 3px 12px;
  font-family: 'Cinzel', serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #f6ead0;
  background: var(--green);
  border: 1px solid #1a2e1e;
  border-radius: 2px;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.btn-view,
.btn-read {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 12px;
  font-family: 'Cinzel', serif;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-view {
  color: var(--brown);
  background: transparent;
  border: 2px solid var(--brown);
}

.btn-view:hover {
  background: var(--paper-dark);
}

.btn-read {
  color: #f6ead0;
  background: linear-gradient(180deg, #8a2525, #5a1616);
  border: 2px solid #3a0c0c;
  box-shadow: 0 4px 0 #3a0c0c;
}

.btn-read:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 0 #3a0c0c;
  filter: brightness(1.1);
}

.btn-read:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 #3a0c0c;
}

.btn-read svg {
  transition: transform 0.2s ease;
}

.btn-read:hover svg {
  transform: translateX(3px);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  margin-top: 50px;
  flex-wrap: wrap;
}

.pagination>button {
  padding: 10px 20px;
  font-family: 'Cinzel', serif;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--brown);
  background: var(--paper-light);
  border: 2px solid var(--brown);
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination>button:hover:not(:disabled) {
  background: var(--gold-light);
}

.pagination>button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-dots {
  display: flex;
  gap: 8px;
}

.page-dots span {
  min-width: 40px;
  height: 40px;
  padding: 0 8px;
  display: grid;
  place-items: center;
  font-family: 'Cinzel', serif;
  font-size: 14px;
  font-weight: 700;
  color: var(--brown);
  background: var(--paper-light);
  border: 2px solid var(--brown);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-dots span:hover {
  background: var(--gold-light);
}

.page-dots span.on {
  color: #f6ead0;
  background: var(--burgundy);
  box-shadow: 0 0 0 3px var(--paper), 0 0 0 5px var(--burgundy);
}

/* Empty */
.empty {
  max-width: 460px;
  margin: 30px auto;
  padding: 50px 30px;
  text-align: center;
  background: var(--paper-light);
  border: 3px double var(--brown);
}

.empty-icon {
  font-size: 52px;
}

.empty h4 {
  margin: 12px 0 6px;
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  color: var(--brown);
}

.empty p {
  margin: 0 0 20px;
  font-style: italic;
  color: var(--ink-soft);
  font-size: 16px;
}

.btn-reset {
  padding: 10px 24px;
  font-family: 'Cinzel', serif;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #f6ead0;
  background: linear-gradient(180deg, #8a2525, #5a1616);
  border: 2px solid #3a0c0c;
  border-radius: 3px;
  cursor: pointer;
}

/* Skeleton */
.skeleton {
  padding: 0 0 22px;
  animation: none;
}

.sk {
  background: linear-gradient(90deg, #e5d4a8 25%, #f3e7c9 50%, #e5d4a8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 2px;
}

.sk-cover {
  height: 220px;
  border-radius: 0;
  margin-bottom: 20px;
}

.sk-line {
  height: 14px;
  margin: 0 22px 12px;
}

.w60 {
  width: 60%;
}

.w30 {
  width: 30%;
}

.w90 {
  width: calc(100% - 44px);
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(26px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

@media (max-width: 640px) {
  .hero {
    padding: 30px 14px 80px;
  }

  .hero-frame {
    padding: 38px 16px 30px;
  }

  .hero-sub br {
    display: none;
  }

  .hero-stats {
    gap: 14px;
    padding: 10px 16px;
  }

  .content {
    padding: 0 14px 50px;
  }

  .ebook-grid {
    grid-template-columns: 1fr;
  }

  .section-head h2 {
    font-size: 24px;
  }
}
</style>