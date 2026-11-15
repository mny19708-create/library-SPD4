<template>
  <div class="dashboard">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner">
        <div>
          <span class="eyebrow">— Grand Archives Administration —</span>
          <h2>Library Dashboard Overview</h2>
          <p class="subtitle">Welcome back, Keeper. Consult the sacred statistics of the realm.</p>
        </div>
        <div class="today">
          <span class="today-label">Current Date</span>
          <strong>{{ todayText }}</strong>
        </div>
      </div>
    </section>

    <div class="content">
      <!-- Section 1: Summary Statistics Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-info">
            <h3>Total Volumes</h3>
            <p class="stat-number">{{ isLoading ? '—' : animEbooks.toLocaleString() }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🏷️</div>
          <div class="stat-info">
            <h3>Total Subjects</h3>
            <p class="stat-number">{{ isLoading ? '—' : animCategories.toLocaleString() }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">⏱️</div>
          <div class="stat-info">
            <h3>Reading Span</h3>
            <p class="stat-number">
              {{ isLoading ? '—' : animTime.toLocaleString() }}<small> mins</small>
            </p>
            <span class="stat-sub" v-if="!isLoading">≈ {{ totalHours }} hours</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h3>Enrolled Scholars</h3>
            <p class="stat-number">{{ totalUsers === null ? '—' : animUsers.toLocaleString() }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🎓</div>
          <div class="stat-info">
            <h3>Certificates Awarded</h3>
            <p class="stat-number">{{ totalCertificates === null ? '—' : animCerts.toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <div class="two-col">
        <!-- Section 2: Recent Ebooks Table -->
        <div class="panel recent-section">
          <div class="panel-head">
            <h3>📖 Recently Inscribed Volumes</h3>
            <span class="count-pill">Latest {{ recentEbooks.length }}</span>
          </div>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Volume Title</th>
                  <th>Subject</th>
                  <th>Reading Time</th>
                  <th>Registry Date</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="isLoading">
                  <tr v-for="n in 5" :key="'sk' + n">
                    <td colspan="4"><div class="sk"></div></td>
                  </tr>
                </template>

                <template v-else>
                  <tr v-for="ebook in recentEbooks" :key="ebook.id">
                    <td>
                      <div class="title-cell">
                        <span class="mini-cover">📘</span>
                        <strong>{{ ebook.title }}</strong>
                      </div>
                    </td>
                    <td>
                      <span class="badge-cat">{{ ebook.category_name || 'General' }}</span>
                    </td>
                    <td><span class="time-chip">⌛ {{ ebook.estimated_reading_time }} mins</span></td>
                    <td class="date-cell">{{ formatDate(ebook.created_at) }}</td>
                  </tr>
                  <tr v-if="recentEbooks.length === 0">
                    <td colspan="4" class="no-data">
                      <div class="no-icon">📜</div>
                      Alas, no volume archives recorded yet
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 3: Ebooks per category -->
        <div class="panel by-cat">
          <div class="panel-head">
            <h3>🗂️ Volumes per Subject Archive</h3>
          </div>

          <div v-if="!isLoading && categoryStats.length" class="bars">
            <div v-for="c in categoryStats" :key="c.name" class="bar-row">
              <div class="bar-top">
                <span class="bar-name">{{ c.name }}</span>
                <span class="bar-count">{{ c.count }}</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" :style="{ width: c.percent + '%' }"></div>
              </div>
            </div>
          </div>
          <div v-else-if="isLoading" class="bars">
            <div v-for="n in 4" :key="n" class="sk sk-bar"></div>
          </div>
          <div v-else class="no-data small">No records available</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'

const API = '/api'

const ebooks = ref([])
const categories = ref([])
const isLoading = ref(true)

const totalUsers = ref(null)
const totalCertificates = ref(null)

const fetchData = async () => {
  try {
    const ebookRes = await axios.get(`${API}/ebooks`)
    if (ebookRes.data.success) {
      ebooks.value = ebookRes.data.data
    }

    const catRes = await axios.get(`${API}/categories`)
    if (catRes.data.success) {
      categories.value = catRes.data.data
    }
  } catch (err) {
    console.error('Error fetching dashboard data:', err)
  } finally {
    isLoading.value = false
  }

  try {
    const statsRes = await axios.get(`${API}/stats`)
    if (statsRes.data?.success) {
      totalUsers.value = Number(statsRes.data.data?.total_users ?? 0)
      totalCertificates.value = Number(statsRes.data.data?.total_certificates ?? 0)
    }
  } catch (err) {
    console.warn('[Dashboard] /api/stats not available:', err.response?.status || err.message)
  }
}

const totalEbooks = computed(() => ebooks.value.length)
const totalCategories = computed(() => categories.value.length)
const totalReadingTime = computed(() => {
  return ebooks.value.reduce((acc, curr) => acc + (Number(curr.estimated_reading_time) || 0), 0)
})
const totalHours = computed(() => (totalReadingTime.value / 60).toFixed(1))

const recentEbooks = computed(() => {
  return [...ebooks.value]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 5)
})

const categoryStats = computed(() => {
  const map = {}
  ebooks.value.forEach(e => {
    const name = e.category_name || 'General'
    map[name] = (map[name] || 0) + 1
  })
  const list = Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
  const max = list.length ? list[0].count : 1
  return list.map(c => ({ ...c, percent: Math.max(8, Math.round((c.count / max) * 100)) }))
})

const useCountUp = (source) => {
  const shown = ref(0)
  watch(source, (target) => {
    if (target === null || target === undefined) return
    const from = shown.value
    const start = performance.now()
    const duration = 1100
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      shown.value = Math.round(from + (target - from) * eased)
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, { immediate: true })
  return shown
}
const animEbooks = useCountUp(totalEbooks)
const animCategories = useCountUp(totalCategories)
const animTime = useCountUp(totalReadingTime)
const animUsers = useCountUp(totalUsers)
const animCerts = useCountUp(totalCertificates)

const formatDate = (value) => {
  if (!value) return '—'
  const d = new Date(value)
  return isNaN(d) ? '—' : d.toLocaleDateString()
}

const todayText = new Date().toLocaleDateString(undefined, {
  weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
})

onMounted(fetchData)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=IM+Fell+English:ital@0;1&family=Playfair+Display:wght@500;700;800&family=Cormorant+Garamond:wght@500;600;700&display=swap');

.dashboard {
  min-height: 100vh;
  background-color: #f3e7c9;
  background-image: 
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.24  0 0 0 0 0.1  0 0 0 0.16 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"),
    radial-gradient(ellipse at 20% 0%, rgba(176, 141, 60, 0.18), transparent 55%),
    radial-gradient(ellipse at 100% 100%, rgba(122, 31, 31, 0.1), transparent 50%);
  font-family: 'IM Fell English', 'Cormorant Garamond', Georgia, serif;
  color: #2b1d0e;
}

/* ================= HERO ================= */
.hero {
  position: relative;
  padding: 40px 30px 85px;
  color: #f6ead0;
  background:
    repeating-linear-gradient(45deg, rgba(227, 199, 118, 0.05) 0 2px, transparent 2px 14px),
    linear-gradient(180deg, #2a1a0d 0%, #3b2412 100%);
  border-bottom: 6px double #b08d3c;
  box-shadow: 0 12px 30px -14px rgba(0, 0, 0, 0.6);
}
.hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}
.eyebrow {
  display: inline-block;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #e3c776;
  margin-bottom: 8px;
}
.hero h2 {
  margin: 0 0 6px;
  font-family: 'Playfair Display', serif;
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 800;
  color: #f6ead0;
}
.subtitle {
  margin: 0;
  font-size: 17px;
  font-style: italic;
  color: #e4d3ac;
}
.today {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 24px;
  background: #33200f;
  border: 2px solid #b08d3c;
  border-radius: 4px;
}
.today-label {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #f6ead0;
  opacity: 0.85;
}
.today strong {
  font-family: 'Playfair Display', serif;
  font-size: 16px;
  color: #e3c776;
  margin-top: 2px;
}

/* ================= CONTENT ================= */
.content {
  max-width: 1200px;
  margin: -45px auto 0;
  padding: 0 20px 60px;
  position: relative;
  z-index: 2;
}

/* ----- stat cards ----- */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px;
  background: #faf1d9;
  border: 2px solid #4a2f14;
  border-radius: 4px;
  box-shadow: 4px 6px 0 rgba(74, 47, 20, 0.2);
  transition: transform 0.2s ease;
}
.stat-card:hover { transform: translateY(-4px); }

.stat-icon {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  font-size: 24px;
  background: #e5d4a8;
  border: 1.5px solid #b08d3c;
  border-radius: 2px;
  box-shadow: inset 0 2px 4px rgba(74, 47, 20, 0.15);
}

.stat-info h3 {
  margin: 0;
  font-family: 'Cinzel', serif;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #6b5334;
}
.stat-number {
  margin: 4px 0 0;
  font-family: 'Playfair Display', serif;
  font-size: 26px;
  font-weight: 800;
  color: #4a2f14;
  line-height: 1.1;
}
.stat-number small { font-size: 14px; font-weight: 600; color: #6b5334; }
.stat-sub { display: block; margin-top: 2px; font-size: 13px; font-style: italic; color: #6b5334; }

/* ----- layout of panels ----- */
.two-col {
  display: grid;
  grid-template-columns: 1.7fr 1fr;
  gap: 30px;
  align-items: start;
}
.panel {
  background: #faf1d9;
  padding: 28px;
  border: 2px solid #4a2f14;
  border-radius: 4px;
  box-shadow: 6px 10px 0 rgba(74, 47, 20, 0.25), 0 16px 30px -12px rgba(43, 29, 14, 0.4);
}
.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e3c776;
  padding-bottom: 10px;
}
.panel-head h3 {
  margin: 0;
  font-family: 'Playfair Display', serif;
  font-size: 21px;
  font-weight: 800;
  color: #4a2f14;
}
.count-pill {
  padding: 3px 10px;
  font-family: 'Cinzel', serif;
  font-size: 11.5px;
  font-weight: 700;
  color: #4a2f14;
  background: #e5d4a8;
  border: 1px solid #b08d3c;
  border-radius: 2px;
}

/* ----- table ----- */
.table-responsive { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; min-width: 520px; }
.data-table th {
  padding: 12px 14px;
  text-align: left;
  font-family: 'Cinzel', serif;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #4a2f14;
  background: #e5d4a8;
  border-bottom: 2px solid #b08d3c;
}
.data-table td {
  padding: 14px;
  font-size: 15px;
  border-bottom: 1px solid #d4c297;
  vertical-align: middle;
}
.data-table tbody tr:hover { background: #f3e7c9; }

.title-cell { display: flex; align-items: center; gap: 12px; }
.title-cell strong {
  font-family: 'Playfair Display', serif;
  font-size: 16px;
  font-weight: 700;
  color: #4a2f14;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.mini-cover {
  width: 36px;
  height: 46px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  font-size: 16px;
  background: #e5d4a8;
  border: 1px solid #b08d3c;
  border-radius: 2px;
}

.badge-cat {
  display: inline-block;
  padding: 4px 10px;
  font-family: 'Cinzel', serif;
  font-size: 11px;
  font-weight: 700;
  color: #4a2f14;
  background: #e5d4a8;
  border: 1px solid #b08d3c;
  border-radius: 2px;
  white-space: nowrap;
}
.time-chip {
  padding: 4px 10px;
  font-size: 13px;
  font-style: italic;
  color: #6b5334;
  background: #faf1d9;
  border: 1px solid #b08d3c;
  border-radius: 2px;
  white-space: nowrap;
}
.date-cell { color: #6b5334; font-style: italic; white-space: nowrap; }

.no-data { text-align: center; color: #6b5334; font-style: italic; padding: 36px 14px !important; }
.no-data.small { padding: 24px 0 !important; }
.no-icon { font-size: 38px; margin-bottom: 6px; }

/* ----- category bars ----- */
.bars { display: grid; gap: 18px; }
.bar-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; font-size: 15px; }
.bar-name { font-family: 'Playfair Display', serif; font-weight: 700; color: #4a2f14; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bar-count {
  padding: 2px 8px;
  font-family: 'Cinzel', serif;
  font-size: 11px;
  font-weight: 700;
  color: #4a2f14;
  background: #e5d4a8;
  border: 1px solid #b08d3c;
  border-radius: 2px;
}
.bar-track {
  height: 8px;
  background: #f3e7c9;
  border: 1px solid #b08d3c;
  border-radius: 2px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #7a1f1f, #b08d3c);
  border-radius: 1px;
  animation: grow 1s cubic-bezier(0.22, 1, 0.36, 1) both;
  transform-origin: left;
}

/* ----- skeleton ----- */
.sk {
  height: 38px;
  border-radius: 2px;
  background: linear-gradient(90deg, #e5d4a8 25%, #faf1d9 50%, #e5d4a8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.sk-bar { height: 24px; border-radius: 2px; }

/* ----- animations ----- */
@keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes shimmer { to { background-position: -200% 0; } }

/* ----- responsive ----- */
@media (max-width: 1100px) {
  .two-col { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .hero { padding: 30px 18px 80px; }
  .content { padding: 0 14px 40px; }
  .panel { padding: 22px 16px; }
  .stat-number { font-size: 22px; }
}
</style>
