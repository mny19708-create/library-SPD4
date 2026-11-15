<template>
  <div class="certificates-container">
    <HeaderHome />

    <!-- Hero -->
    <section class="hero">
      <div class="hero-frame">
        <div class="corner-o tl">❧</div>
        <div class="corner-o tr">❧</div>
        <div class="corner-o bl">❧</div>
        <div class="corner-o br">❧</div>

        <div class="hero-inner">
          <p class="est">— Hall of Achievements —</p>
          <h1>My Earned <span class="gold">Certificates</span></h1>
          <div class="ornament"><span></span><i>❦</i><span></span></div>
          <p class="hero-sub">Every volume thou hast finished is honoured with a diploma of merit.</p>

          <div class="hero-stats" v-if="!isLoading">
            <div class="stat"><strong>{{ certificates.length }}</strong><span>Certificates</span></div>
            <div class="divider">✦</div>
            <div class="stat"><strong>{{ totalMinutes }}</strong><span>Minutes read</span></div>
          </div>

          <div v-if="!isLoading && certificates.length > 1" class="hero-actions">
            <button class="btn-all" @click="downloadAll" :disabled="downloadingAll">
              <span v-if="downloadingAll" class="spinner"></span>
              <template v-else>📜 Save all certificates ({{ certificates.length }})</template>
              <template v-if="downloadingAll"> Saving {{ allProgress }}/{{ certificates.length }}...</template>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="content">
      <!-- Skeleton -->
      <div v-if="isLoading" class="cert-grid">
        <div v-for="n in 3" :key="n" class="cert-card skeleton">
          <div class="sk sk-circle"></div>
          <div class="sk sk-line w60"></div>
          <div class="sk sk-line w30"></div>
          <div class="sk sk-btn"></div>
        </div>
      </div>

      <!-- Certificates -->
      <div v-else-if="certificates.length > 0" class="cert-grid">
        <article
          v-for="(cert, index) in certificates"
          :key="cert.id"
          class="cert-card"
          :style="{ animationDelay: index * 80 + 'ms' }"
        >
          <div class="inner-frame"></div>
          <div class="corner tl">❦</div>
          <div class="corner tr">❦</div>
          <div class="corner bl">❦</div>
          <div class="corner br">❦</div>

          <!-- Wax seal -->
          <div class="wax" :style="{ background: waxColor(cert) }">
            <span class="wax-ring"></span>
            <span class="wax-star">★</span>
          </div>

          <p class="cert-label">Certificate of Completion</p>
          <div class="mini-ornament">— ❦ —</div>
          <p class="awarded">is hereby awarded for finishing</p>
          <h3>{{ cert.ebook_title }}</h3>

          <div class="meta">
            <span class="chip">⌛ Read {{ formatMinutes(certMinutes(cert)) }}</span>
            <span class="chip" v-if="issuedDate(cert)">📅 {{ issuedDate(cert) }}</span>
          </div>

          <button
            @click="downloadPDF(cert)"
            class="btn-download"
            :disabled="downloadingId === cert.id"
          >
            <span v-if="downloadingId === cert.id" class="spinner"></span>
            <template v-else>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>
              Download PDF
            </template>
          </button>
        </article>
      </div>

      <!-- Empty -->
      <div v-else class="empty">
        <div class="empty-icon">📜</div>
        <h4>No certificates yet</h4>
        <p>Begin thy reading to earn the first diploma of merit.</p>
        <router-link to="/" class="btn-start">Browse ebooks →</router-link>
      </div>
    </section>

    <FooterHome />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import HeaderHome from '@/components/HeaderHome.vue'
import FooterHome from '@/components/FooterHome.vue'

const certificates = ref([])
const isLoading = ref(true)
const downloadingId = ref(null)
const downloadingAll = ref(false)
const allProgress = ref(0)

const totalMinutes = computed(() =>
  certificates.value.reduce((sum, c) => sum + certMinutes(c), 0)
)

// minutes the user really read (seconds are the most exact value)
const certMinutes = (cert) => {
  const fromSeconds = Math.floor((Number(cert.reading_seconds) || 0) / 60)
  return Math.max(fromSeconds, Math.floor(Number(cert.reading_duration_minutes) || 0))
}

const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
}

const fetchCertificates = async () => {
  try {
    const storedUser = getStoredUser()
    const userId = storedUser && (storedUser.id || storedUser.user_id)
    if (!userId) return

    const res = await axios.get(`/api/certificates/user/${userId}`)
    if (res.data.success) {
      certificates.value = res.data.data
    }
  } catch (err) {
    console.error('Error fetching certificates:', err)
  } finally {
    isLoading.value = false
  }
}

const saveOnePDF = async (cert) => {
  const storedUser = getStoredUser()
  const userName = storedUser ? (storedUser.username || storedUser.name) : 'Student'

  const response = await axios.post('/api/certificates/generate', {
    userName: userName,
    ebookTitle: cert.ebook_title,
    readingMinutes: certMinutes(cert),
    readingSeconds: Number(cert.reading_seconds) || undefined
  }, {
    responseType: 'blob'
  })

  const blob = new Blob([response.data], { type: 'application/pdf' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${cert.ebook_title}-Certificate.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => window.URL.revokeObjectURL(url), 1000)
}

const downloadPDF = async (cert) => {
  downloadingId.value = cert.id
  try {
    await saveOnePDF(cert)
  } catch (err) {
    console.error('Error downloading PDF:', err)
    alert('Failed to download certificate.')
  } finally {
    downloadingId.value = null
  }
}

// Save every certificate, one after another (small pause so the browser accepts multiple downloads)
const downloadAll = async () => {
  if (downloadingAll.value || certificates.value.length === 0) return
  downloadingAll.value = true
  allProgress.value = 0
  let failed = 0
  for (const cert of certificates.value) {
    try {
      await saveOnePDF(cert)
    } catch (err) {
      failed++
      console.error('Error downloading PDF:', cert.ebook_title, err)
    }
    allProgress.value++
    await new Promise(r => setTimeout(r, 600))
  }
  downloadingAll.value = false
  if (failed) alert(`${failed} certificate(s) could not be downloaded.`)
}

const formatMinutes = (m) => {
  const n = Math.max(0, Math.floor(Number(m) || 0))
  return `${n} min${n === 1 ? '' : 's'}`
}

const issuedDate = (cert) => {
  const d = cert.certificate_issued_at || cert.last_read_at
  if (!d) return ''
  const date = new Date(d)
  return isNaN(date) ? '' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

// Wax seal colours: burgundy, forest green, navy, umber, plum
const waxes = [
  ['#a52a2a', '#5a1010'],
  ['#3f6b45', '#1a2e1e'],
  ['#2c4a78', '#111d33'],
  ['#8a5a2b', '#3e2713'],
  ['#6d3a78', '#2a1530']
]
const waxColor = (cert) => {
  const name = String(cert.ebook_title || 'Certificate')
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  const [a, b] = waxes[hash % waxes.length]
  return `radial-gradient(circle at 35% 30%, ${a} 0%, ${b} 100%)`
}

onMounted(() => {
  fetchCertificates()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=IM+Fell+English:ital@0;1&family=Playfair+Display:wght@500;700;800&display=swap');

.certificates-container {
  --paper: #f3e7c9;
  --paper-light: #faf1d9;
  --paper-dark: #e5d4a8;
  --ink: #2b1d0e;
  --ink-soft: #6b5334;
  --brown: #4a2f14;
  --gold: #b08d3c;
  --gold-light: #e3c776;
  --burgundy: #7a1f1f;

  font-family: 'IM Fell English', Georgia, 'Noto Serif Khmer', 'Times New Roman', serif;
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
  max-width: 820px;
  margin: 0 auto;
  padding: 44px 28px 38px;
  text-align: center;
  border: 2px solid var(--gold);
  outline: 1px solid rgba(227, 199, 118, 0.5);
  outline-offset: 6px;
  background: radial-gradient(ellipse at center, rgba(227, 199, 118, 0.1), transparent 70%);
}
.corner-o {
  position: absolute;
  font-size: 28px;
  line-height: 1;
  color: var(--gold-light);
  background: #33200f;
  padding: 0 6px;
}
.corner-o.tl { top: -16px; left: 24px; }
.corner-o.tr { top: -16px; right: 24px; transform: scaleX(-1); }
.corner-o.bl { bottom: -16px; left: 24px; transform: scaleY(-1); }
.corner-o.br { bottom: -16px; right: 24px; transform: scale(-1, -1); }

.hero-inner { position: relative; z-index: 1; }
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
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(30px, 5.4vw, 52px);
  line-height: 1.15;
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
  margin: 16px auto;
  max-width: 320px;
}
.ornament span { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--gold-light), transparent); }
.ornament i { font-style: normal; font-size: 24px; color: var(--gold-light); }
.hero-sub { margin: 0; font-size: 18px; font-style: italic; line-height: 1.6; color: #e4d3ac; }

.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: 24px;
  margin-top: 28px;
  padding: 12px 30px;
  border-top: 1px solid var(--gold);
  border-bottom: 1px solid var(--gold);
}
.stat { display: flex; flex-direction: column; line-height: 1.2; color: #f6ead0; }
.stat strong { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 800; color: var(--gold-light); }
.stat span { font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; opacity: 0.85; }
.divider { color: var(--gold); font-size: 14px; }

.hero-actions { margin-top: 24px; }
.btn-all {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px 28px;
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #3a250f;
  background: linear-gradient(180deg, #f1d98f, #c9a24a);
  border: 2px solid #8a6a22;
  border-radius: 3px;
  box-shadow: 0 4px 0 #8a6a22, 0 12px 20px -8px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-all:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.06); }
.btn-all:active:not(:disabled) { transform: translateY(3px); box-shadow: 0 1px 0 #8a6a22; }
.btn-all:disabled { opacity: 0.85; cursor: wait; }
.btn-all .spinner { border-color: rgba(58, 37, 15, 0.25); border-top-color: #3a250f; }

/* ================= CONTENT ================= */
.content { position: relative; z-index: 2; max-width: 1100px; margin: -40px auto 0; padding: 0 24px 70px; }
.cert-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 30px; }

/* ================= CARD (diploma) ================= */
.cert-card {
  position: relative;
  padding: 46px 30px 28px;
  text-align: center;
  background:
    radial-gradient(ellipse at center, rgba(255, 255, 255, 0.5), transparent 70%),
    var(--paper-light);
  border: 2px solid var(--brown);
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 6px 8px 0 rgba(74, 47, 20, 0.28), 0 18px 30px -14px rgba(43, 29, 14, 0.5);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}
.cert-card:hover {
  transform: translateY(-6px) rotate(-0.4deg);
  box-shadow: 9px 14px 0 rgba(74, 47, 20, 0.3), 0 26px 38px -14px rgba(43, 29, 14, 0.55);
}
.inner-frame {
  position: absolute;
  inset: 8px;
  border: 1px solid var(--gold);
  box-shadow: inset 0 0 0 4px transparent, inset 0 0 0 5px rgba(176, 141, 60, 0.4);
  pointer-events: none;
}
.corner {
  position: absolute;
  font-size: 16px;
  line-height: 1;
  color: var(--gold);
  background: var(--paper-light);
  padding: 2px;
}
.corner.tl { top: 3px; left: 3px; }
.corner.tr { top: 3px; right: 3px; transform: scaleX(-1); }
.corner.bl { bottom: 3px; left: 3px; transform: scaleY(-1); }
.corner.br { bottom: 3px; right: 3px; transform: scale(-1, -1); }

/* Wax seal */
.wax {
  position: relative;
  width: 78px;
  height: 78px;
  margin: 0 auto 18px;
  display: grid;
  place-items: center;
  border-radius: 50% 46% 52% 48% / 48% 52% 46% 50%;
  box-shadow: 0 8px 14px -4px rgba(0, 0, 0, 0.55), inset 0 2px 4px rgba(255, 255, 255, 0.25), inset 0 -4px 8px rgba(0, 0, 0, 0.35);
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.cert-card:hover .wax { transform: rotate(-10deg) scale(1.08); }
.wax-ring {
  position: absolute;
  inset: 9px;
  border: 2px dashed rgba(255, 233, 184, 0.55);
  border-radius: 50%;
}
.wax-star {
  font-size: 30px;
  color: rgba(255, 233, 184, 0.9);
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.4), 0 1px 0 rgba(255, 255, 255, 0.2);
}

.cert-label {
  margin: 0;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--burgundy);
}
.mini-ornament { margin: 4px 0 8px; font-size: 14px; letter-spacing: 0.3em; color: var(--gold); }
.awarded { margin: 0 0 8px; font-size: 14.5px; font-style: italic; color: var(--ink-soft); }
.cert-card h3 {
  margin: 0 0 16px;
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 800;
  line-height: 1.3;
  color: var(--brown);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.meta { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 22px; }
.chip {
  padding: 5px 12px;
  font-size: 14px;
  font-style: italic;
  color: var(--ink);
  background: var(--paper-dark);
  border: 1px solid var(--gold);
  border-radius: 2px;
}

.btn-download {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #f6ead0;
  background: linear-gradient(180deg, #8a2525, #5a1616);
  border: 2px solid #3a0c0c;
  border-radius: 3px;
  box-shadow: 0 4px 0 #3a0c0c;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-download:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 5px 0 #3a0c0c; filter: brightness(1.1); }
.btn-download:active:not(:disabled) { transform: translateY(3px); box-shadow: 0 1px 0 #3a0c0c; }
.btn-download:disabled { opacity: 0.8; cursor: wait; }
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(246, 234, 208, 0.4);
  border-top-color: #f6ead0;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

/* ================= EMPTY ================= */
.empty {
  max-width: 460px;
  margin: 30px auto;
  padding: 50px 30px;
  text-align: center;
  background: var(--paper-light);
  border: 3px double var(--brown);
}
.empty-icon { font-size: 52px; }
.empty h4 { margin: 12px 0 6px; font-family: 'Playfair Display', serif; font-size: 22px; color: var(--brown); }
.empty p { margin: 0 0 22px; font-style: italic; color: var(--ink-soft); font-size: 16px; }
.btn-start {
  display: inline-block;
  padding: 11px 26px;
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #f6ead0;
  text-decoration: none;
  background: linear-gradient(180deg, #8a2525, #5a1616);
  border: 2px solid #3a0c0c;
  border-radius: 3px;
  box-shadow: 0 4px 0 #3a0c0c;
}

/* ================= SKELETON ================= */
.skeleton { padding: 46px 30px 28px; animation: none; display: flex; flex-direction: column; align-items: center; gap: 14px; }
.sk {
  background: linear-gradient(90deg, #e5d4a8 25%, #f3e7c9 50%, #e5d4a8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 2px;
}
.sk-circle { width: 78px; height: 78px; border-radius: 50%; }
.sk-line { height: 14px; }
.sk-btn { width: 100%; height: 44px; margin-top: 8px; }
.w60 { width: 60%; } .w30 { width: 30%; }

/* ================= ANIMATIONS ================= */
@keyframes rise { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: translateY(0); } }
@keyframes shimmer { to { background-position: -200% 0; } }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 640px) {
  .hero { padding: 30px 14px 80px; }
  .hero-frame { padding: 38px 16px 30px; }
  .hero-stats { gap: 14px; padding: 10px 16px; }
  .content { padding: 0 14px 50px; }
  .cert-grid { grid-template-columns: 1fr; }
}
</style>
