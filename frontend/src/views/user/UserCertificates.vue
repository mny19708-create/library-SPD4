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

<<<<<<< HEAD
          <div class="card-actions">
            <button
              @click="openCustomizer(cert)"
              class="btn-customize"
            >
              🎨 Customize Template
            </button>

            <button
              @click="downloadPDF(cert)"
              class="btn-download"
              :disabled="downloadingId === cert.id"
            >
              <span v-if="downloadingId === cert.id" class="spinner"></span>
              <template v-else>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>
                Quick PDF
              </template>
            </button>
          </div>
=======
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
>>>>>>> feature/ebookfullstack
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

<<<<<<< HEAD
    <!-- ================= CUSTOMIZE TEMPLATE MODAL ================= -->
    <div v-if="showModal && selectedCert" class="modal-backdrop" @click.self="closeModal">
      <div class="modal-box">
        <div class="modal-header">
          <h2>🎨 Customize Certificate Template</h2>
          <button class="btn-close" @click="closeModal">✕</button>
        </div>

        <div class="modal-body">
          <!-- Left: Controls -->
          <div class="controls-panel">
            <div class="form-group">
              <label>1. ជ្រើសរើសម៉ូដ Template (Select Style)</label>
              <div class="template-options">
                <button
                  v-for="tpl in templates"
                  :key="tpl.id"
                  type="button"
                  :class="['tpl-btn', { active: customForm.templateId === tpl.id }]"
                  @click="customForm.templateId = tpl.id; customForm.customBg = ''"
                >
                  {{ tpl.icon }} {{ tpl.name }}
                </button>
              </div>
            </div>

            <div class="form-group">
              <label>ឬ Upload រូបភាព Template ផ្ទាល់ខ្លួន (Custom Background)</label>
              <input type="file" accept="image/*" @change="handleBgUpload" class="file-input" />
              <button v-if="customForm.customBg" type="button" class="btn-clear-bg" @click="customForm.customBg = ''">
                លុបរូបភាពផ្ទាល់ខ្លួន
              </button>
            </div>

            <div class="form-group">
              <label>2. ឈ្មោះលើសញ្ញាបត្រ (Recipient Name)</label>
              <input v-model="customForm.recipientName" type="text" placeholder="បញ្ចូលឈ្មោះរបស់អ្នក..." />
            </div>

            <div class="form-group">
              <label>3. ចំណងជើងសញ្ញាបត្រ (Certificate Title)</label>
              <input v-model="customForm.heading" type="text" placeholder="Certificate of Completion" />
            </div>

            <div class="form-group">
              <label>4. ពាក្យបញ្ជាក់បន្ថែម (Subtitle / Note)</label>
              <input v-model="customForm.note" type="text" placeholder="Has successfully completed reading..." />
            </div>

            <div class="form-group">
              <label>5. ពណ៌ត្រា (Seal Color)</label>
              <div class="color-swatches">
                <button
                  v-for="(w, idx) in waxes"
                  :key="idx"
                  type="button"
                  :class="['swatch', { active: customForm.waxIndex === idx }]"
                  :style="{ background: `radial-gradient(circle at 35% 30%, ${w[0]}, ${w[1]})` }"
                  @click="customForm.waxIndex = idx"
                ></button>
              </div>
            </div>

            <div class="form-group checkboxes">
              <label><input type="checkbox" v-model="customForm.showMinutes" /> បង្ហាញរយៈពេលអាន</label>
              <label><input type="checkbox" v-model="customForm.showDate" /> បង្ហាញកាលបរិច្ឆេទ</label>
            </div>
          </div>

          <!-- Right: Live Preview -->
          <div class="preview-panel">
            <div
              id="printable-certificate"
              :class="['cert-preview', `tpl-${customForm.templateId}`]"
              :style="customForm.customBg ? { backgroundImage: `url(${customForm.customBg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}"
            >
              <div class="preview-border">
                <p class="pv-heading">{{ customForm.heading || 'Certificate of Completion' }}</p>
                <div class="pv-divider">— ❦ —</div>
                <p class="pv-sub">This certifies that</p>
                <h2 class="pv-name">{{ customForm.recipientName || 'Student Name' }}</h2>
                <p class="pv-note">{{ customForm.note || 'has successfully completed the volume' }}</p>
                <h3 class="pv-book">“{{ selectedCert.ebook_title }}”</h3>

                <div class="pv-footer">
                  <div class="pv-meta">
                    <span v-if="customForm.showDate && issuedDate(selectedCert)">
                      Date: <strong>{{ issuedDate(selectedCert) }}</strong>
                    </span>
                    <span v-if="customForm.showMinutes">
                      Duration: <strong>{{ formatMinutes(certMinutes(selectedCert)) }}</strong>
                    </span>
                  </div>

                  <div
                    class="pv-wax"
                    :style="{ background: `radial-gradient(circle at 35% 30%, ${waxes[customForm.waxIndex][0]}, ${waxes[customForm.waxIndex][1]})` }"
                  >
                    <span>★</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-secondary" @click="closeModal">បោះបង់ (Cancel)</button>
          <button type="button" class="btn-print" @click="printCustomCertificate">
            🖨️ Save / Print Custom PDF
          </button>
          <button
            type="button"
            class="btn-download modal-dl"
            @click="downloadCustomFromServer"
            :disabled="downloadingCustom"
          >
            {{ downloadingCustom ? 'Generating...' : '📥 Download Server PDF' }}
          </button>
        </div>
      </div>
    </div>

=======
>>>>>>> feature/ebookfullstack
    <FooterHome />
  </div>
</template>

<script setup>
<<<<<<< HEAD
import { ref, reactive, computed, onMounted } from 'vue'
=======
import { ref, computed, onMounted } from 'vue'
>>>>>>> feature/ebookfullstack
import axios from 'axios'
import HeaderHome from '@/components/HeaderHome.vue'
import FooterHome from '@/components/FooterHome.vue'

const certificates = ref([])
const isLoading = ref(true)
const downloadingId = ref(null)
const downloadingAll = ref(false)
const allProgress = ref(0)

<<<<<<< HEAD
// Customizer states
const showModal = ref(false)
const selectedCert = ref(null)
const downloadingCustom = ref(false)

const templates = [
  { id: 'classic', name: 'Classic Royal', icon: '📜' },
  { id: 'modern', name: 'Modern Clean', icon: '✨' },
  { id: 'emerald', name: 'Emerald Scholar', icon: '🌿' }
]

const customForm = reactive({
  templateId: 'classic',
  recipientName: '',
  heading: 'Certificate of Completion',
  note: 'is hereby awarded this diploma for successfully completing',
  waxIndex: 0,
  showMinutes: true,
  showDate: true,
  customBg: ''
})

=======
>>>>>>> feature/ebookfullstack
const totalMinutes = computed(() =>
  certificates.value.reduce((sum, c) => sum + certMinutes(c), 0)
)

<<<<<<< HEAD
=======
// minutes the user really read (seconds are the most exact value)
>>>>>>> feature/ebookfullstack
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

<<<<<<< HEAD
// Open Customizer Modal
const openCustomizer = (cert) => {
  const storedUser = getStoredUser()
  selectedCert.value = cert
  customForm.recipientName = storedUser ? (storedUser.username || storedUser.name || 'Student') : 'Student'
  customForm.heading = 'Certificate of Completion'
  customForm.note = 'is hereby awarded this diploma for successfully completing'
  customForm.templateId = 'classic'
  customForm.customBg = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedCert.value = null
}

// Handle User Uploaded Background Image
const handleBgUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    customForm.customBg = e.target.result
  }
  reader.readAsDataURL(file)
}

// Print / Save custom template directly as PDF via browser print dialog
const printCustomCertificate = () => {
  window.print()
}

// Send custom options to backend API (if backend supports custom fields)
const downloadCustomFromServer = async () => {
  if (!selectedCert.value) return
  downloadingCustom.value = true
  try {
    const response = await axios.post('/api/certificates/generate', {
      userName: customForm.recipientName,
      ebookTitle: selectedCert.value.ebook_title,
      readingMinutes: certMinutes(selectedCert.value),
      readingSeconds: Number(selectedCert.value.reading_seconds) || undefined,
      templateId: customForm.templateId,
      heading: customForm.heading,
      note: customForm.note
    }, {
      responseType: 'blob'
    })

    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${selectedCert.value.ebook_title}-${customForm.templateId}-Certificate.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => window.URL.revokeObjectURL(url), 1000)
  } catch (err) {
    console.error('Error downloading custom PDF:', err)
    alert('Failed to generate server PDF. You can use "Save / Print Custom PDF" instead.')
  } finally {
    downloadingCustom.value = false
  }
}

=======
>>>>>>> feature/ebookfullstack
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

<<<<<<< HEAD
=======
// Save every certificate, one after another (small pause so the browser accepts multiple downloads)
>>>>>>> feature/ebookfullstack
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

<<<<<<< HEAD
=======
// Wax seal colours: burgundy, forest green, navy, umber, plum
>>>>>>> feature/ebookfullstack
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

<<<<<<< HEAD
.card-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-customize {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 14px;
  font-family: 'Cinzel', serif;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #3a250f;
  background: linear-gradient(180deg, #f1d98f, #d4af54);
  border: 2px solid #8a6a22;
  border-radius: 3px;
  box-shadow: 0 3px 0 #8a6a22;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-customize:hover { filter: brightness(1.06); transform: translateY(-1px); }

=======
>>>>>>> feature/ebookfullstack
.btn-download {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
<<<<<<< HEAD
  padding: 11px 16px;
  font-family: 'Cinzel', serif;
  font-size: 12.5px;
=======
  padding: 12px 16px;
  font-family: 'Cinzel', serif;
  font-size: 13px;
>>>>>>> feature/ebookfullstack
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

<<<<<<< HEAD
/* ================= MODAL CUSTOMIZER ================= */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(20, 12, 5, 0.78);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  overflow-y: auto;
}
.modal-box {
  width: 100%;
  max-width: 1040px;
  background: var(--paper-light);
  border: 3px double var(--brown);
  border-radius: 6px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.65);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 92vh;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 22px;
  background: #2a1a0d;
  color: var(--gold-light);
  border-bottom: 2px solid var(--gold);
}
.modal-header h2 { margin: 0; font-family: 'Cinzel', serif; font-size: 18px; }
.btn-close {
  background: transparent;
  border: none;
  color: var(--gold-light);
  font-size: 20px;
  cursor: pointer;
}
.modal-body {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 20px;
  padding: 20px;
  overflow-y: auto;
}
.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group label {
  font-family: 'Cinzel', 'Noto Serif Khmer', serif;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--brown);
}
.form-group input[type="text"] {
  padding: 8px 10px;
  border: 1px solid var(--gold);
  background: #fffdf7;
  border-radius: 3px;
  font-family: inherit;
  font-size: 14px;
  color: var(--ink);
}
.template-options {
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;
}
.tpl-btn {
  padding: 8px 10px;
  text-align: left;
  background: var(--paper);
  border: 1px solid var(--gold);
  border-radius: 3px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  color: var(--ink);
}
.tpl-btn.active {
  background: var(--brown);
  color: var(--gold-light);
  border-color: var(--brown);
}
.file-input { font-size: 12px; }
.btn-clear-bg {
  align-self: flex-start;
  font-size: 12px;
  color: var(--burgundy);
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
}
.color-swatches { display: flex; gap: 10px; }
.swatch {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
}
.swatch.active { border-color: #000; transform: scale(1.15); }
.checkboxes { flex-direction: row; gap: 16px; flex-wrap: wrap; }
.checkboxes label { display: flex; align-items: center; gap: 6px; font-weight: normal; cursor: pointer; }

/* Preview Certificate Styles */
.preview-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dfd2b5;
  padding: 16px;
  border-radius: 4px;
  border: 1px dashed var(--brown);
}
.cert-preview {
  width: 100%;
  aspect-ratio: 1.414 / 1; /* A4 Landscape */
  padding: 20px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
}
.preview-border {
  width: 100%;
  height: 100%;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.82);
}

/* Template 1: Classic Royal */
.tpl-classic {
  background: #faf1d9;
  border: 8px double #4a2f14;
}
.tpl-classic .preview-border {
  border: 2px solid #b08d3c;
  background: transparent;
}

/* Template 2: Modern Clean */
.tpl-modern {
  background: #ffffff;
  border: 10px solid #1e293b;
  font-family: 'Playfair Display', Georgia, serif;
}
.tpl-modern .preview-border {
  border: 1px solid #cbd5e1;
  background: #ffffff;
}
.tpl-modern .pv-heading { color: #0f172a; }
.tpl-modern .pv-name { color: #1d4ed8; border-bottom-color: #93c5fd; }

/* Template 3: Emerald Scholar */
.tpl-emerald {
  background: #f0fdf4;
  border: 8px solid #14532d;
}
.tpl-emerald .preview-border {
  border: 2px dashed #15803d;
  background: rgba(255, 255, 255, 0.85);
}
.tpl-emerald .pv-heading { color: #14532d; }
.tpl-emerald .pv-name { color: #166534; }

.pv-heading {
  margin: 0;
  font-family: 'Cinzel', serif;
  font-size: clamp(16px, 2.2vw, 24px);
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--burgundy);
}
.pv-divider { margin: 6px 0; color: var(--gold); font-size: 16px; }
.pv-sub { margin: 4px 0; font-style: italic; font-size: 14px; color: var(--ink-soft); }
.pv-name {
  margin: 6px 0 10px;
  font-family: 'Playfair Display', 'Noto Serif Khmer', serif;
  font-size: clamp(22px, 3vw, 34px);
  font-weight: 800;
  color: var(--brown);
  border-bottom: 2px solid var(--gold);
  padding: 0 24px 4px;
}
.pv-note { margin: 4px 0; font-size: 14px; color: var(--ink); }
.pv-book {
  margin: 6px 0 18px;
  font-family: 'Playfair Display', 'Noto Serif Khmer', serif;
  font-size: clamp(16px, 2vw, 21px);
  font-weight: 700;
  color: var(--ink);
}
.pv-footer {
  width: 100%;
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 16px;
}
.pv-meta {
  display: flex;
  flex-direction: column;
  text-align: left;
  font-size: 12.5px;
  color: var(--ink-soft);
  gap: 4px;
}
.pv-wax {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #ffe9b8;
  font-size: 22px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 22px;
  background: var(--paper);
  border-top: 1px solid var(--gold);
  flex-wrap: wrap;
}
.btn-secondary {
  padding: 10px 18px;
  background: transparent;
  border: 1px solid var(--brown);
  color: var(--brown);
  border-radius: 3px;
  cursor: pointer;
  font-weight: 600;
}
.btn-print {
  padding: 10px 18px;
  background: #1e3a8a;
  color: #fff;
  border: 2px solid #172554;
  border-radius: 3px;
  font-family: 'Cinzel', serif;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
}
.modal-dl { width: auto; }

=======
>>>>>>> feature/ebookfullstack
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

<<<<<<< HEAD
/* ================= PRINT STYLES (Save Custom Certificate as PDF) ================= */
@media print {
  body * { visibility: hidden; }
  #printable-certificate, #printable-certificate * {
    visibility: visible;
  }
  #printable-certificate {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    margin: 0;
    box-shadow: none;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

@media (max-width: 820px) {
  .modal-body { grid-template-columns: 1fr; }
}

=======
>>>>>>> feature/ebookfullstack
@media (max-width: 640px) {
  .hero { padding: 30px 14px 80px; }
  .hero-frame { padding: 38px 16px 30px; }
  .hero-stats { gap: 14px; padding: 10px 16px; }
  .content { padding: 0 14px 50px; }
  .cert-grid { grid-template-columns: 1fr; }
}
<<<<<<< HEAD
</style>
=======
</style>
>>>>>>> feature/ebookfullstack
