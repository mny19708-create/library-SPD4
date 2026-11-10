<template>
  <div class="page">
    <!-- Top Navigation -->
    <header class="topbar">
      <div class="topbar-inner">
        <button @click="router.push('/home')" class="btn-back">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span>Return to Library</span>
        </button>

        <div class="brand">
          <span class="brand-icon">✠</span>
          <span class="brand-text">The Grand Reading Chamber</span>
        </div>

        <div class="topbar-spacer"></div>
      </div>
    </header>

    <main class="container">
      <!-- Loading -->
      <div v-if="isLoading" class="state-card">
        <div class="spinner"></div>
        <p class="state-title">Unrolling the manuscript...</p>
        <p class="state-sub">Please wait a moment</p>
      </div>

      <!-- Reader -->
      <div v-else-if="ebook" class="reader">
        <!-- Hero / Info -->
        <section class="hero">
          <div class="hero-frame">
            <div class="corner tl">❧</div>
            <div class="corner tr">❧</div>
            <div class="corner bl">❧</div>
            <div class="corner br">❧</div>

            <div class="hero-cover-wrap" v-if="ebook.image_url">
              <img :src="ebook.image_url" :alt="ebook.title" class="hero-cover-img" />
            </div>

            <div class="hero-left">
              <span class="category-badge">{{ ebook.category_name || 'General' }}</span>
              <h1 class="book-title">{{ ebook.title }}</h1>
              <div class="ornament"><span></span><i>❦</i><span></span></div>
              <div class="hero-meta">
                <span class="meta-chip">
                  ⌛ {{ maxMinutes }} min study
                </span>
                <span class="meta-chip" :class="statusClass">
                  <span class="dot"></span>{{ statusText }}
                </span>
              </div>
            </div>

            <!-- Circular Progress / Wax Seal Style -->
            <div class="ring-wrap">
              <svg class="ring" viewBox="0 0 120 120">
                <circle class="ring-bg" cx="60" cy="60" r="52" />
                <circle class="ring-fg" cx="60" cy="60" r="52" :stroke-dasharray="circumference"
                  :stroke-dashoffset="ringOffset" />
              </svg>
              <div class="ring-center">
                <span class="ring-percent">{{ progressPercentage }}<small>%</small></span>
                <span class="ring-label">scribed</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Progress Card -->
        <section class="card progress-card">
          <div class="progress-head">
            <div class="timer">
              <span class="timer-icon">⏳</span>
              <div>
                <div class="timer-label">Time devoted to study</div>
                <div class="timer-value">
                  <strong>{{ currentTimeText }}</strong>
                  <span> / {{ requiredTimeText }}</span>
                  <span v-if="isComplete" class="extra-time"> · +{{ extraTimeText }} zeal</span>
                </div>
              </div>
            </div>

            <transition name="fade">
              <div v-if="isIdle || !windowFocused" class="idle-alert">
                <span class="pulse-dot"></span>
                Archival study paused — return and stir thy quill to resume
              </div>
            </transition>
          </div>

          <!-- Progress Bar -->
          <div class="bar">
            <div class="bar-fill" :style="{ width: progressPercentage + '%' }">
              <span class="bar-shine"></span>
            </div>
          </div>
          <div class="bar-legend">
            <span>Inception</span><span>Quarter</span><span>Midpoint</span><span>Advanced</span><span>Certificate 🎓</span>
          </div>

          <input type="range" min="0" :max="maxSeconds" v-model.number="readingSeconds" class="sr-only" disabled />
        </section>

        <!-- PDF Viewer -->
        <section class="viewer" @mouseenter="onViewerEnter" @mouseleave="onViewerLeave" @contextmenu.prevent>
          <div class="viewer-bar">
            <div class="traffic"><i></i><i></i><i></i></div>
            <div class="viewer-title">Volume Archive: {{ ebook.title }}.pdf</div>
            <span class="viewer-spacer"></span>
          </div>

          <div v-if="safePdfUrl" class="viewer-body">
            <iframe
              :src="safePdfUrl"
              class="viewer-frame"
              sandbox="allow-scripts allow-same-origin"
            ></iframe>
            <div class="drive-blocker" @click.stop.prevent @contextmenu.prevent></div>
          </div>

          <div v-else class="no-link">
            <div class="no-link-icon">📜</div>
            <p>No manuscript scroll available for this volume.</p>
          </div>
        </section>

        <!-- Action -->
        <section class="card action-card">
          <div class="action-text">
            <h4>{{ isComplete ? 'Volume Mastered! 🎉' : 'Continue thy study to claim merit' }}</h4>
            <p v-if="isComplete">Thou hast fulfilled the required hours of study. Claim thy certificate.</p>
            <p v-else>Remain diligent within this archive. About <b>{{ minutesLeft }}</b> minute(s) remain.</p>
          </div>

          <button @click="finishReading" :disabled="!isComplete"
            :class="['btn-finish', isComplete ? 'btn-active' : 'btn-disabled']">
            <template v-if="isComplete">
              ✓ Conclude &amp; Claim Certificate
            </template>
            <template v-else>
              Locked · {{ minutesLeft }}m remaining
            </template>
          </button>
        </section>
      </div>

      <!-- Error -->
      <div v-else class="state-card error">
        <div class="state-emoji">❌</div>
        <p class="state-title">Failed to load manuscript details.</p>
        <button class="btn-retry" @click="router.push('/home')">Return to Library</button>
      </div>
    </main>

    <!-- Success Popup -->
    <transition name="modal">
      <div v-if="showSuccess" class="modal-overlay" @click.self="showSuccess = false">
        <div class="modal-card" role="dialog" aria-modal="true">
          <div class="confetti">
            <span v-for="n in 12" :key="n" :style="{ '--i': n }"></span>
          </div>
          <div class="success-icon">✠</div>
          <h3>Scholarship Achieved! 🎉</h3>
          <p>
            Thou hast thoroughly examined <b>{{ ebook?.title }}</b>.<br />
            Thy certificate of merit is prepared.
          </p>
          <div class="modal-actions">
            <button class="btn-later" @click="showSuccess = false">Later</button>
            <button class="btn-claim" @click="claimFromModal">Claim Certificate</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const ebook = ref(null)
const isLoading = ref(true)
const readingSeconds = ref(0)
const isIdle = ref(false)
let timer = null
let idleTimer = null

const maxMinutes = computed(() => ebook.value ? Number(ebook.value.estimated_reading_time || 10) : 10)
const maxSeconds = computed(() => maxMinutes.value * 60)

const safePdfUrl = computed(() => {
  const url = ebook.value?.pdf_url || ''
  if (!url) return ''
  const m = url.match(/\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/)
  return m ? `https://drive.google.com/file/d/${m[1]}/preview` : url
})

const formatDuration = (totalSeconds) => {
  const t = Math.max(0, Math.floor(Number(totalSeconds) || 0))
  const m = Math.floor(t / 60)
  const sec = t % 60
  if (m > 0) return `${m}m ${String(sec).padStart(2, '0')}s`
  return `${sec}s`
}
const currentTimeText = computed(() => formatDuration(readingSeconds.value))
const requiredTimeText = computed(() => formatDuration(maxSeconds.value))
const isComplete = computed(() => readingSeconds.value >= maxSeconds.value)
const extraTimeText = computed(() => formatDuration(Math.max(0, readingSeconds.value - maxSeconds.value)))
const minutesLeft = computed(() => Math.max(0, Math.ceil((maxSeconds.value - readingSeconds.value) / 60)))

const showSuccess = ref(false)
watch(isComplete, (done, wasDone) => {
  if (done && !wasDone) { showSuccess.value = true }
})

const claimFromModal = () => {
  showSuccess.value = false
  finishReading()
}

const progressPercentage = computed(() => {
  if (maxSeconds.value === 0) return 0
  const percent = Math.floor((readingSeconds.value / maxSeconds.value) * 100)
  return percent > 100 ? 100 : percent
})

const circumference = 2 * Math.PI * 52
const ringOffset = computed(() => circumference - (progressPercentage.value / 100) * circumference)

const statusText = computed(() => {
  if (isComplete.value) return 'Mastered'
  if (isIdle.value || !windowFocused.value || isInactive.value) return 'Paused'
  return 'Studying'
})
const statusClass = computed(() => {
  if (isComplete.value) return 'done'
  if (isIdle.value || !windowFocused.value || isInactive.value) return 'paused'
  return 'active'
})

const API = 'http://localhost:5000/api'
let lastSavedSeconds = -1
const progressReady = ref(false)
const windowFocused = ref(true)
const isInactive = ref(false)
const pointerInViewer = ref(false)

const IDLE_MS = 10000
const IDLE_MS_IN_VIEWER = 30000

const getUserId = () => {
  try {
    const raw = localStorage.getItem('user')
    if (!raw || raw === 'user') return null
    if (!raw.startsWith('{')) return raw
    const u = JSON.parse(raw)
    return u ? (u.id || u.user_id || null) : null
  } catch (e) { return null }
}

const localKey = () => `reading-progress:${getUserId() || 'guest'}:${ebook.value?.id}`
const readLocal = () => { try { return Number(localStorage.getItem(localKey())) || 0 } catch (e) { return 0 } }
const writeLocal = () => { try { localStorage.setItem(localKey(), String(readingSeconds.value)) } catch (e) {} }

const loadProgress = async () => {
  if (!ebook.value) return
  let saved = readLocal()
  const userId = getUserId()
  if (userId) {
    try {
      const res = await axios.get(`${API}/progress/${userId}/${ebook.value.id}`)
      if (res.data?.success) {
        saved = Math.max(saved, Number(res.data.data?.reading_seconds) || 0)
      }
    } catch (err) {}
  }
  readingSeconds.value = saved
  lastSavedSeconds = -1
  progressReady.value = true
  await nextTick()
  showSuccess.value = false
}

const saveProgress = () => {
  if (!ebook.value || !progressReady.value) return
  writeLocal()
  const userId = getUserId()
  if (!userId) return
  if (readingSeconds.value === lastSavedSeconds) return
  lastSavedSeconds = readingSeconds.value

  fetch(`${API}/progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, ebook_id: ebook.value.id, reading_seconds: readingSeconds.value }),
    keepalive: true
  }).catch(() => { lastSavedSeconds = -1 })
}

const fetchEbookDetail = async () => {
  try {
    const ebookId = route.params.id
    const response = await axios.get(`${API}/ebooks`)
    if (response.data.success) {
      const found = response.data.data.find(item => item.id == ebookId)
      if (found) {
        ebook.value = found
        await loadProgress()
      }
    }
  } catch (err) {
  } finally {
    progressReady.value = true
    isLoading.value = false
  }
}

const goIdle = () => { isIdle.value = true; saveProgress() }
const resetIdleTimer = () => {
  isIdle.value = false
  clearTimeout(idleTimer)
  idleTimer = setTimeout(goIdle, pointerInViewer.value ? IDLE_MS_IN_VIEWER : IDLE_MS)
}

const onViewerEnter = () => { pointerInViewer.value = true; resetIdleTimer() }
const onViewerLeave = () => { pointerInViewer.value = false; resetIdleTimer() }
const handleVisibility = () => { if (document.hidden) { isIdle.value = true; saveProgress() } }

const onWindowBlur = () => {
  setTimeout(() => {
    if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
      windowFocused.value = true
      resetIdleTimer()
    } else {
      windowFocused.value = false
      saveProgress()
    }
  }, 0)
}
const onWindowFocus = () => { windowFocused.value = true; resetIdleTimer() }
const onBeforeUnload = () => saveProgress()

onMounted(() => {
  fetchEbookDetail()
  resetIdleTimer()
  window.addEventListener('mousemove', resetIdleTimer)
  window.addEventListener('keydown', resetIdleTimer)
  window.addEventListener('scroll', resetIdleTimer)
  window.addEventListener('touchstart', resetIdleTimer)
  window.addEventListener('blur', onWindowBlur)
  window.addEventListener('focus', onWindowFocus)
  window.addEventListener('beforeunload', onBeforeUnload)
  document.addEventListener('visibilitychange', handleVisibility)

  timer = setInterval(() => {
    if (!ebook.value || !progressReady.value || isInactive.value) return
    const active = !isIdle.value && !document.hidden && windowFocused.value
    if (active) {
      readingSeconds.value += 1
      if (readingSeconds.value % 5 === 0) writeLocal()
      if (readingSeconds.value % 15 === 0) saveProgress()
    }
  }, 1000)
})

onDeactivated(() => { isInactive.value = true; saveProgress() })
onActivated(() => { if (isInactive.value) { isInactive.value = false; resetIdleTimer() } })
onUnmounted(() => {
  clearInterval(timer)
  clearTimeout(idleTimer)
  window.removeEventListener('mousemove', resetIdleTimer)
  window.removeEventListener('keydown', resetIdleTimer)
  window.removeEventListener('scroll', resetIdleTimer)
  window.removeEventListener('touchstart', resetIdleTimer)
  window.removeEventListener('blur', onWindowBlur)
  window.removeEventListener('focus', onWindowFocus)
  window.removeEventListener('beforeunload', onBeforeUnload)
  document.removeEventListener('visibilitychange', handleVisibility)
  saveProgress()
})

const finishReading = async () => {
  saveProgress()
  const actualMinutes = Math.max(Math.ceil(maxMinutes.value), Math.floor(readingSeconds.value / 60))
  try {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    const userId = storedUser ? storedUser.id : null
    const fallbackUsername = storedUser ? (storedUser.username || storedUser.name) : 'Scholar'

    const claimRes = await axios.post('http://localhost:5000/api/certificates/claim', {
      user_id: userId,
      ebook_id: ebook.value.id,
      reading_duration_minutes: actualMinutes
    })

    if (claimRes.data.success) {
      alert('🎉 ' + claimRes.data.message)
      const finalUsername = claimRes.data.certificate_data?.username || fallbackUsername

      const pdfRes = await axios.post('http://localhost:5000/api/certificates/generate', {
        userName: finalUsername,
        ebookTitle: ebook.value.title,
        readingMinutes: actualMinutes,
        readingSeconds: Math.floor(readingSeconds.value)
      }, { responseType: 'blob' })

      const blob = new Blob([pdfRes.data], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = `${ebook.value.title}-Certificate.pdf`
      link.click()

      router.push('/my-certificates')
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to generate certificate.')
  }
}
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
  --green: #2f4a33;

  min-height: 100vh;
  background-color: var(--paper);
  background-image:
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.24  0 0 0 0 0.1  0 0 0 0.16 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"),
    radial-gradient(ellipse at 20% 0%, rgba(176, 141, 60, 0.18), transparent 55%),
    radial-gradient(ellipse at 100% 100%, rgba(122, 31, 31, 0.1), transparent 50%);
  font-family: 'IM Fell English', 'Cormorant Garamond', Georgia, serif;
  color: var(--ink);
}

/* Topbar */
.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(42, 26, 13, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid var(--gold);
}
.topbar-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.topbar-spacer { flex: 1; }
.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #f6ead0;
  background: #3a250f;
  border: 1px solid var(--gold);
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-back:hover { background: var(--gold); color: #2a1a0d; }

.brand {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--gold-light);
  font-family: 'Cinzel', serif;
  font-weight: 700;
  letter-spacing: 0.15em;
  font-size: 14px;
}
.brand-icon { color: var(--gold); }

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 24px 60px;
}
.reader { display: flex; flex-direction: column; gap: 24px; }
.card {
  background: var(--paper-light);
  border: 2px solid var(--brown);
  border-radius: 4px;
  box-shadow: 6px 8px 0 rgba(74, 47, 20, 0.22);
}

/* Hero */
.hero {
  position: relative;
  padding: 36px 24px;
  background:
    repeating-linear-gradient(45deg, rgba(227, 199, 118, 0.05) 0 2px, transparent 2px 14px),
    linear-gradient(180deg, #2a1a0d 0%, #3b2412 100%);
  border: 2px solid var(--gold);
  border-radius: 4px;
  box-shadow: 0 12px 30px -14px rgba(0, 0, 0, 0.6);
  color: #fff;
}
.hero-frame {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 10px;
}
.corner {
  position: absolute;
  font-size: 24px;
  color: var(--gold-light);
  line-height: 1;
  background: #33200f;
  padding: 0 4px;
}
.tl { top: -20px; left: -10px; }
.tr { top: -20px; right: -10px; transform: scaleX(-1); }
.bl { bottom: -20px; left: -10px; transform: scaleY(-1); }
.br { bottom: -20px; right: -10px; transform: scale(-1, -1); }

.hero-left { position: relative; z-index: 1; min-width: 0; flex: 1; }
.category-badge {
  display: inline-block;
  padding: 5px 12px;
  font-family: 'Cinzel', serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #3a250f;
  background: linear-gradient(180deg, #f1d98f, #c9a24a);
  border: 1px solid #8a6a22;
  border-radius: 2px;
}
.book-title {
  margin: 12px 0 10px;
  font-family: 'Playfair Display', serif;
  font-size: clamp(24px, 4vw, 36px);
  line-height: 1.2;
  font-weight: 800;
  color: #f6ead0;
}
.ornament {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0 14px;
  max-width: 220px;
}
.ornament span { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--gold-light), transparent); }
.ornament i { font-style: normal; font-size: 18px; color: var(--gold-light); }

.hero-meta { display: flex; flex-wrap: wrap; gap: 10px; }
.meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 14px;
  background: rgba(51, 32, 15, 0.7);
  border: 1px solid var(--gold);
  border-radius: 2px;
  font-size: 13.5px;
  font-style: italic;
  color: #e4d3ac;
}
.meta-chip .dot { width: 8px; height: 8px; border-radius: 50%; background: #94a3b8; }
.meta-chip.active .dot { background: #4ade80; box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.25); animation: pulse 1.6s infinite; }
.meta-chip.paused .dot { background: #fbbf24; }
.meta-chip.done .dot { background: #34d399; }

.hero-cover-wrap {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  width: 100px;
  height: 140px;
  border-radius: 2px;
  overflow: hidden;
  box-shadow: 6px 8px 16px rgba(0, 0, 0, 0.5);
  border: 2px solid var(--gold);
  background: var(--paper-dark);
}
.hero-cover-img { width: 100%; height: 100%; object-fit: cover; filter: sepia(0.3); }

/* Ring / Wax Seal Style */
.ring-wrap { position: relative; z-index: 1; flex-shrink: 0; width: 120px; height: 120px; }
.ring { width: 100%; height: 100%; transform: rotate(-90deg); }
.ring-bg { fill: rgba(51, 32, 15, 0.5); stroke: var(--brown); stroke-width: 8; }
.ring-fg { fill: none; stroke: var(--gold); stroke-width: 8; stroke-linecap: round; transition: stroke-dashoffset 0.8s ease; }
.ring-center {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  color: #f6ead0;
}
.ring-percent { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 800; line-height: 1; }
.ring-percent small { font-size: 14px; }
.ring-label { font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold-light); }

/* Progress Card */
.progress-card { padding: 24px 28px; }
.progress-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 18px; }
.timer { display: flex; align-items: center; gap: 14px; }
.timer-icon { width: 44px; height: 44px; display: grid; place-items: center; font-size: 20px; background: var(--paper-dark); border: 1px solid var(--gold); border-radius: 4px; }
.timer-label { font-family: 'Cinzel', serif; font-size: 11px; color: var(--ink-soft); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
.timer-value { font-size: 14.5px; color: var(--ink-soft); }
.timer-value strong { font-size: 22px; color: var(--brown); font-family: 'Playfair Display', serif; }
.extra-time { color: var(--green); font-weight: 700; font-size: 0.85em; }

.idle-alert {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 8px 16px; background: #3a250f; border: 1px solid var(--gold);
  color: var(--gold-light); font-size: 12.5px; font-style: italic; border-radius: 2px;
}
.pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--gold); animation: pulse 1.4s infinite; }

.bar {
  position: relative; height: 12px; padding: 1px;
  background: var(--paper-dark); border: 1.5px solid var(--brown); border-radius: 2px;
  box-shadow: inset 0 1px 3px rgba(43, 29, 14, 0.35); overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: repeating-linear-gradient(45deg, #7a1f1f 0 6px, #5a1616 6px 12px);
  border-radius: 1px; transition: width 0.8s ease;
}
.bar-legend { display: flex; justify-content: space-between; margin-top: 8px; font-family: 'Cinzel', serif; font-size: 10.5px; color: var(--ink-soft); font-weight: 700; text-transform: uppercase; }

/* Viewer */
.viewer {
  background: var(--paper-light);
  border: 2px solid var(--brown);
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 6px 8px 0 rgba(74, 47, 20, 0.22);
}
.viewer-bar {
  display: flex; align-items: center; gap: 14px; padding: 12px 18px;
  background: var(--paper-dark); border-bottom: 2px solid var(--brown);
}
.traffic { display: flex; gap: 7px; }
.traffic i { width: 11px; height: 11px; border-radius: 50%; display: block; border: 1px solid #3a0c0c; }
.traffic i:nth-child(1) { background: #8a2525; }
.traffic i:nth-child(2) { background: #b08d3c; }
.traffic i:nth-child(3) { background: #2f4a33; }
.viewer-title { flex: 1; text-align: center; font-family: 'Cinzel', serif; font-size: 12px; font-weight: 700; color: var(--brown); letter-spacing: 0.1em; }
.viewer-spacer { width: 47px; }

.viewer-body { position: relative; }
.viewer-frame { display: block; width: 100%; height: 720px; border: none; background: #e5d4a8; }
.drive-blocker { position: absolute; top: 0; right: 0; width: 76px; height: 76px; z-index: 5; background: transparent; }
.no-link { padding: 80px 20px; text-align: center; color: var(--ink-soft); font-style: italic; }
.no-link-icon { font-size: 44px; margin-bottom: 8px; }

/* Action */
.action-card { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 24px 28px; flex-wrap: wrap; }
.action-text h4 { margin: 0 0 4px; font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 800; color: var(--brown); }
.action-text p { margin: 0; color: var(--ink-soft); font-style: italic; font-size: 14.5px; }

.btn-finish {
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  padding: 14px 26px; font-family: 'Cinzel', serif; font-size: 13px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase; border-radius: 3px; cursor: pointer; transition: all 0.2s;
}
.btn-active {
  color: #f6ead0; background: linear-gradient(180deg, #2f4a33, #1a2e1e);
  border: 2px solid #111d33; box-shadow: 0 4px 0 #111d33;
}
.btn-active:hover { transform: translateY(-1px); box-shadow: 0 5px 0 #111d33; filter: brightness(1.1); }
.btn-disabled { background: var(--paper-dark); color: var(--ink-soft); border: 2px solid var(--brown); cursor: not-allowed; }

/* States */
.state-card { max-width: 420px; margin: 80px auto; padding: 48px 32px; text-align: center; background: var(--paper-light); border: 3px double var(--brown); border-radius: 4px; }
.state-title { margin: 14px 0 4px; font-family: 'Playfair Display', serif; font-size: 20px; color: var(--brown); font-weight: 700; }
.state-sub { margin: 0; color: var(--ink-soft); font-style: italic; font-size: 14px; }
.spinner { width: 42px; height: 42px; margin: 0 auto; border: 3px solid var(--paper-dark); border-top-color: var(--burgundy); border-radius: 50%; animation: spin 0.9s linear infinite; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 20px; background: rgba(42, 26, 13, 0.7); backdrop-filter: blur(4px); }
.modal-card { position: relative; width: 100%; max-width: 420px; padding: 40px 32px 28px; text-align: center; background: var(--paper-light); border: 3px double var(--brown); border-radius: 4px; box-shadow: 0 20px 50px rgba(0,0,0,0.6); overflow: hidden; }
.modal-card h3 { margin: 16px 0 8px; font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 800; color: var(--brown); }
.modal-card p { margin: 0 0 24px; color: var(--ink-soft); font-style: italic; font-size: 15px; line-height: 1.6; }
.modal-card p b { color: var(--ink); font-style: normal; }

.success-icon {
  width: 72px; height: 72px; margin: 0 auto; display: grid; place-items: center;
  color: var(--gold-light); background: var(--burgundy); border: 2px solid var(--gold); border-radius: 50%;
  font-size: 32px; box-shadow: 0 6px 16px rgba(0,0,0,0.4);
}
.modal-actions { display: flex; gap: 12px; }
.btn-later, .btn-claim {
  flex: 1; padding: 12px 16px; font-family: 'Cinzel', serif; font-size: 12px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase; border-radius: 3px; cursor: pointer; transition: all 0.2s;
}
.btn-later { background: var(--paper-dark); border: 2px solid var(--brown); color: var(--brown); }
.btn-later:hover { background: var(--gold-light); }
.btn-claim { background: linear-gradient(180deg, #2f4a33, #1a2e1e); border: 2px solid #111d33; color: #f6ead0; box-shadow: 0 3px 0 #111d33; }
.btn-claim:hover { transform: translateY(-1px); }

.confetti { position: absolute; inset: 0; pointer-events: none; }
.confetti span {
  position: absolute; top: 38%; left: 50%; width: 8px; height: 14px; border-radius: 2px;
  background: var(--gold); opacity: 0; animation: burst 1.1s ease-out forwards;
  transform: rotate(calc(var(--i) * 30deg)) translateY(0);
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
@keyframes burst {
  0% { opacity: 1; transform: rotate(calc(var(--i) * 30deg)) translateY(0); }
  100% { opacity: 0; transform: rotate(calc(var(--i) * 30deg + 90deg)) translateY(-140px); }
}

@media (max-width: 768px) {
  .hero-frame { flex-direction: column; text-align: center; }
  .hero-cover-wrap { width: 110px; height: 150px; }
  .ornament { margin: 8px auto 14px; }
  .action-card { flex-direction: column; text-align: center; }
  .btn-finish { width: 100%; }
}
</style>