<template>
  <HeaderHome />

  <div class="catalog-page">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-frame">
        <div class="corner tl">❧</div>
        <div class="corner tr">❧</div>
        <div class="corner bl">❧</div>
        <div class="corner br">❧</div>

        <div class="hero-inner">
          <p class="est">— Established MMXXVI —</p>
          <h1>
            The Grand <span class="gold">Catalogue</span> of Subjects
          </h1>
          <div class="ornament"><span></span><i>❦</i><span></span></div>
          <p class="hero-sub">
            Consult the various sections and unearth volumes of knowledge, wisdom, and merit.
          </p>

          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search subjects in the archive..."
            />
            <button v-if="searchQuery" class="clear" @click="searchQuery = ''" aria-label="Clear">✕</button>
          </div>

          <div class="stats">
            <div class="stat">
              <strong>{{ categories.length }}</strong>
              <span>Subjects</span>
            </div>
            <div class="divider">✦</div>
            <div class="stat">
              <strong>{{ filteredCategories.length }}</strong>
              <span>Displayed</span>
            </div>
            <div class="divider">✦</div>
            <div class="stat">
              <strong>🎓</strong>
              <span>Certificates</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Panel -->
    <section class="panel">
      <div class="panel-head">
        <h2>The Archives &amp; Subjects</h2>
        <div class="head-line"></div>
        <span class="result-count" v-if="!loading">{{ filteredCategories.length }} subject(s)</span>
      </div>

      <!-- Skeleton -->
      <div v-if="loading" class="grid">
        <div v-for="n in 6" :key="n" class="card skeleton">
          <div class="sk-icon shimmer"></div>
          <div class="sk-line shimmer w60"></div>
          <div class="sk-line shimmer w90"></div>
          <div class="sk-line shimmer w40"></div>
        </div>
      </div>

      <!-- Grid -->
      <TransitionGroup v-else name="list" tag="div" class="grid">
        <div
          v-for="(cat, i) in visibleCategories"
          :key="cat.id"
          class="card"
          :style="{ '--i': i }"
          @click="viewCategories(cat.id)"
        >
          <div class="card-border"></div>
          <div class="icon">{{ getIcon(cat) }}</div>
          <h3>{{ cat.name }}</h3>
          <div class="mini-ornament">— ❦ —</div>
          <p>{{ cat.description || 'A collection of volumes dedicated to this noble subject.' }}</p>
          <span class="badge">Explore Volumes <i>→</i></span>
        </div>
      </TransitionGroup>

      <!-- Show more -->
      <div v-if="!loading && hasMore" class="more-wrap">
        <button class="more-btn" @click="showMore">
          Consult More
          <span>({{ filteredCategories.length - visibleCategories.length }} remaining)</span>
        </button>
      </div>

      <!-- Empty -->
      <div v-if="!loading && filteredCategories.length === 0" class="no-result">
        <div class="no-icon">📜</div>
        <p>Alas, no subjects match thy search.</p>
        <span>Try a different keyword.</span>
      </div>
    </section>
  </div>

  <FooterHome />
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import HeaderHome from '@/components/HeaderHome.vue'
import FooterHome from '@/components/FooterHome.vue'

const router = useRouter()
const categories = ref([])
const searchQuery = ref('')
const loading = ref(true)

const iconRules = [
  [/law|legal|justice|ច្បាប់/, '⚖️'],
  [/database|sql|mongo|data/, '🗄️'],
  [/node|express|backend|server|api/, '⚙️'],
  [/frontend|front-end|web|html|css|vue|react|ui|ux/, '💻'],
  [/javascript|typescript|python|java|code|program|software/, '👨‍💻'],
  [/\bai\b|machine|learning|intelligence/, '🤖'],
  [/security|cyber|hack/, '🔒'],
  [/network|cloud|devops/, '🌐'],
  [/mobile|android|ios|flutter/, '📱'],
  [/design|art|graphic/, '🎨'],
  [/business|finance|account|market|economic/, '💼'],
  [/math|statistic/, '🧮'],
  [/science|physics|chemistry|biology/, '🔬'],
  [/health|medic/, '🩺'],
  [/history/, '📜'],
  [/language|english|khmer/, '🔤']
]
const getIcon = (cat) => {
  if (cat.icon) return cat.icon
  const name = (cat.name || '').toLowerCase()
  const hit = iconRules.find(([re]) => re.test(name))
  return hit ? hit[1] : '📘'
}

const PAGE_SIZE = 8
const visibleCount = ref(PAGE_SIZE)

const fetchCategories = async (silent = false) => {
  try {
    if (!silent) loading.value = true
    const response = await axios.get('/api/categories')
    categories.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching categories ', error)
  } finally {
    loading.value = false
  }
}

const refreshOnFocus = () => fetchCategories(true)

const filteredCategories = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return categories.value.filter((cat) => {
    const nameMatch = cat.name?.toLowerCase().includes(q)
    const descMatch = cat.description?.toLowerCase().includes(q)
    return nameMatch || descMatch
  })
})

const visibleCategories = computed(() => filteredCategories.value.slice(0, visibleCount.value))
const hasMore = computed(() => filteredCategories.value.length > visibleCount.value)
const showMore = () => (visibleCount.value += PAGE_SIZE)

watch(searchQuery, () => (visibleCount.value = PAGE_SIZE))

const viewCategories = (id) => {
  router.push(`/user/category/${id}`)
}

onMounted(() => {
  fetchCategories()
  window.addEventListener('focus', refreshOnFocus)
})

onUnmounted(() => {
  window.removeEventListener('focus', refreshOnFocus)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=IM+Fell+English:ital@0;1&family=Playfair+Display:wght@500;700;800&family=Cormorant+Garamond:wght@500;600;700&display=swap');

.catalog-page {
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

/* ===== Hero ===== */
.hero {
  position: relative;
  padding: 44px 20px 100px;
  background:
    repeating-linear-gradient(45deg, rgba(227, 199, 118, 0.05) 0 2px, transparent 2px 14px),
    linear-gradient(180deg, #2a1a0d 0%, #3b2412 100%);
  border-bottom: 6px double var(--gold);
  box-shadow: 0 12px 30px -14px rgba(0, 0, 0, 0.6);
  text-align: center;
  color: #fff;
}
.hero-frame {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  padding: 46px 28px 40px;
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
.tl { top: -16px; left: 24px; }
.tr { top: -16px; right: 24px; transform: scaleX(-1); }
.bl { bottom: -16px; left: 24px; transform: scaleY(-1); }
.br { bottom: -16px; right: 24px; transform: scale(-1, -1); }

.hero-inner { position: relative; z-index: 1; }

.est {
  margin: 0 0 12px;
  font-family: 'Cinzel', serif;
  font-size: 12.5px;
  letter-spacing: 0.4em;
  text-transform: capitalize;
  color: var(--gold-light);
}
h1 {
  margin: 0;
  font-family: 'Playfair Display', 'Cinzel', Georgia, serif;
  font-size: clamp(34px, 6vw, 56px);
  font-weight: 800;
  line-height: 1.12;
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
.ornament span { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--gold-light), transparent); }
.ornament i { font-style: normal; font-size: 24px; color: var(--gold-light); }

.hero-sub { margin: 0; font-size: 18px; font-style: italic; line-height: 1.6; color: #e4d3ac; }

/* Search */
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
  box-sizing: border-box;
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
}
.search-box input::placeholder { color: #8f7650; }
.clear {
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
.clear:hover { background: var(--gold-light); }

/* Stats */
.stats {
  display: inline-flex;
  align-items: center;
  gap: 24px;
  margin-top: 30px;
  padding: 12px 30px;
  border-top: 1px solid var(--gold);
  border-bottom: 1px solid var(--gold);
  color: #f6ead0;
}
.stat { display: flex; flex-direction: column; align-items: center; min-width: 70px; }
.stat strong { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 800; color: var(--gold-light); }
.stat span { font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; opacity: 0.85; }
.divider { color: var(--gold); font-size: 14px; }

/* ===== Panel ===== */
.panel {
  position: relative;
  z-index: 2;
  max-width: 1160px;
  margin: -40px auto 0;
  padding: 36px 28px 48px;
  background: var(--paper-light);
  border: 2px solid var(--brown);
  border-radius: 6px;
  box-shadow: 6px 10px 0 rgba(74, 47, 20, 0.3), 0 20px 40px -16px rgba(43, 29, 14, 0.5);
  min-height: 420px;
}
.panel-head { display: flex; align-items: center; gap: 18px; margin-bottom: 28px; }
.panel-head h2 { margin: 0; font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 800; color: var(--brown); }
.head-line { flex: 1; height: 6px; border-top: 1px solid var(--brown); border-bottom: 1px solid var(--brown); }
.result-count { font-size: 15px; font-style: italic; color: var(--ink-soft); white-space: nowrap; }

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 26px;
}

/* Card */
.card {
  position: relative;
  overflow: hidden;
  padding: 24px;
  border-radius: 4px;
  background: var(--paper);
  border: 2px solid var(--brown);
  cursor: pointer;
  animation: rise 0.55s both;
  animation-delay: calc(var(--i, 0) * 55ms);
  box-shadow: 4px 6px 0 rgba(74, 47, 20, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card::after {
  content: '';
  position: absolute;
  inset: 6px;
  border: 1px solid rgba(176, 141, 60, 0.7);
  pointer-events: none;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 7px 10px 0 rgba(74, 47, 20, 0.25), 0 16px 24px -10px rgba(43, 29, 14, 0.4);
}

.icon {
  width: 50px; height: 50px;
  display: grid;
  place-items: center;
  margin-bottom: 14px;
  font-size: 24px;
  background: var(--paper-dark);
  border: 1.5px solid var(--gold);
  border-radius: 4px;
  box-shadow: inset 0 2px 4px rgba(74, 47, 20, 0.2);
}

.card h3 { margin: 0 0 4px; font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 800; color: var(--brown); }
.mini-ornament { margin: 4px 0 10px; font-size: 12px; letter-spacing: 0.3em; color: var(--gold); }
.card p {
  margin: 0 0 18px;
  min-height: 42px;
  font-size: 15px;
  line-height: 1.5;
  color: var(--ink-soft);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  font-family: 'Cinzel', serif;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: none;
  color: #f6ead0;
  background: var(--burgundy);
  border: 1px solid #3a0c0c;
  border-radius: 2px;
  transition: background 0.2s;
}
.card:hover .badge { background: #8a2525; }

/* Show more */
.more-wrap { display: flex; justify-content: center; margin-top: 36px; }
.more-btn {
  padding: 11px 26px;
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
  transition: all 0.2s;
}
.more-btn span { font-weight: 500; color: var(--ink-soft); margin-left: 6px; }
.more-btn:hover { background: var(--gold-light); }

/* Skeleton */
.skeleton { pointer-events: none; animation: none; }
.skeleton::after { display: none; }
.sk-line { height: 13px; border-radius: 2px; margin-bottom: 12px; }
.sk-icon { width: 50px; height: 50px; border-radius: 4px; margin-bottom: 14px; }
.w90 { width: 90%; } .w60 { width: 60%; } .w40 { width: 40%; }
.shimmer {
  background: linear-gradient(90deg, #e5d4a8 25%, #f3e7c9 50%, #e5d4a8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

/* Empty */
.no-result { padding: 50px 0; text-align: center; }
.no-icon { font-size: 48px; }
.no-result p { margin: 12px 0 4px; font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: var(--brown); }
.no-result span { font-style: italic; color: var(--ink-soft); font-size: 15px; }

/* Transitions */
.list-enter-active, .list-leave-active { transition: all 0.35s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: scale(0.9); }
.list-leave-active { position: absolute; }
.list-move { transition: transform 0.35s ease; }

@keyframes rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
@keyframes shimmer { to { background-position: -200% 0; } }

@media (max-width: 640px) {
  .hero { padding: 30px 14px 80px; }
  .hero-frame { padding: 38px 16px 30px; }
  .stats { gap: 14px; padding: 10px 16px; }
  .panel { padding: 24px 16px 40px; margin-top: -30px; }
  .grid { grid-template-columns: 1fr; }
}
</style>