<template>
  <div class="page">
    <HeaderHome />

    <!-- Detail -->
    <div v-if="ebook" class="wrap">
      <!-- Hero backdrop -->
      <section class="hero">
        <div class="hero-frame">
          <div class="corner tl">❧</div>
          <div class="corner tr">❧</div>
          <div class="corner bl">❧</div>
          <div class="corner br">❧</div>

          <button @click="router.back()" class="btn-back">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            Back to Catalog
          </button>

          <div class="hero-content">
            <!-- Book Cover / Cloudinary -->
            <div class="book-stage">
              <div v-if="ebook.image_url" class="real-book-cover-wrap">
                <img :src="ebook.image_url" :alt="ebook.title" class="real-book-cover-img" />
              </div>
              <div v-else class="book">
                <div class="book-spine"></div>
                <div class="book-cover">
                  <span class="cover-icon">✠</span>
                  <span class="cover-title">{{ ebook.title }}</span>
                  <span class="cover-line"></span>
                </div>
                <div class="book-pages"></div>
              </div>
              <div class="book-shadow"></div>
            </div>

            <!-- Info -->
            <div class="info">
              <span class="category-badge">{{ ebook.category_name || 'General' }}</span>
              <h1>{{ ebook.title }}</h1>
              <div class="ornament"><span></span><i>❦</i><span></span></div>

              <div class="chips">
                <span class="chip" v-if="ebook.estimated_reading_time">⌛ {{ ebook.estimated_reading_time }} min read</span>
                <span class="chip" v-if="createdDate">📅 Published: {{ createdDate }}</span>
                <span class="chip">🎓 Certificate of Merit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Body -->
      <div class="body">
        <article class="card about">
          <h3>About This Volume</h3>
          <div class="mini-ornament">— ❦ —</div>
          <p class="description">
            {{ ebook.description || 'No description provided for this volume...' }}
          </p>
        </article>

        <aside class="card cta">
          <div class="cta-top">
            <div class="cta-icon">📜</div>
            <h4>Begin Thy Study</h4>
            <p>Read online at your leisure and earn an official certificate.</p>
          </div>

          <ul class="perks">
            <li><span class="tick">✓</span> Access the library anytime</li>
            <li><span class="tick">✓</span> Precise reading progress</li>
            <li><span class="tick">✓</span> Earn a merit certificate</li>
          </ul>

          <button @click="startReading" class="btn-read">
            Read Now
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </button>
        </aside>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-else-if="isLoading" class="wrap">
      <div class="sk-hero">
        <div class="sk sk-book"></div>
        <div class="sk-lines">
          <div class="sk sk-l w30"></div>
          <div class="sk sk-l w80 tall"></div>
          <div class="sk sk-l w50"></div>
        </div>
      </div>
      <p class="loading">Consulting the archives...</p>
    </div>

    <!-- Not found -->
    <div v-else class="no-data">
      <div class="no-icon">📜</div>
      <p>Alas, this volume could not be found!</p>
      <button class="btn-read small" @click="router.back()">← Return</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import HeaderHome from '@/components/HeaderHome.vue'

const route = useRoute()
const router = useRouter()

const ebook = ref(null)
const isLoading = ref(true)

const fetchEbookDetail = async () => {
  try {
    const ebookId = route.params.id
    const res = await axios.get(`/api/ebooks/${ebookId}`)
    if (res.data.success) {
      ebook.value = res.data.data
    }
  } catch (err) {
    console.error('Error fetching ebook detail:', err)
  } finally {
    isLoading.value = false
  }
}

const startReading = () => {
  router.push(`/reader/${ebook.value.id}`)
}

const createdDate = computed(() => {
  if (!ebook.value?.created_at) return ''
  const d = new Date(ebook.value.created_at)
  return isNaN(d) ? '' : d.toLocaleDateString()
})

onMounted(() => {
  fetchEbookDetail()
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

/* ============ HERO ============ */
.hero {
  position: relative;
  padding: 44px 20px 100px;
  background:
    repeating-linear-gradient(45deg, rgba(227, 199, 118, 0.05) 0 2px, transparent 2px 14px),
    linear-gradient(180deg, #2a1a0d 0%, #3b2412 100%);
  border-bottom: 6px double var(--gold);
  box-shadow: 0 12px 30px -14px rgba(0, 0, 0, 0.6);
}
.hero-frame {
  position: relative;
  max-width: 960px;
  margin: 0 auto;
  padding: 36px 32px 40px;
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

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  margin-bottom: 28px;
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
.btn-back:hover { background: var(--gold); color: #2a1a0d; transform: translateX(-3px); }

.hero-content { display: flex; align-items: center; gap: 48px; }

/* ---- Book Cover / Cloudinary ---- */
.book-stage { position: relative; flex-shrink: 0; width: 220px; }

.real-book-cover-wrap {
  position: relative;
  width: 220px;
  height: 310px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 8px 12px 24px rgba(0, 0, 0, 0.6);
  border: 2px solid var(--gold);
  transform: rotate(-1deg);
  transition: transform 0.4s ease;
  background: var(--paper-dark);
}
.book-stage:hover .real-book-cover-wrap { transform: rotate(0deg) scale(1.02); }
.real-book-cover-img { width: 100%; height: 100%; object-fit: cover; filter: sepia(0.3) contrast(1.05); }

.book {
  position: relative;
  display: flex;
  width: 210px;
  height: 300px;
  filter: drop-shadow(0 14px 20px rgba(0, 0, 0, 0.6));
}
.book-spine {
  width: 16px;
  background: repeating-linear-gradient(180deg, #b08d3c 0 6px, #8a6a22 6px 8px);
  border-radius: 3px 0 0 3px;
}
.book-cover {
  flex: 1;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  background: linear-gradient(160deg, #f6ead0, #e3d1a1);
  border: 2px solid var(--gold);
  border-radius: 0 4px 4px 0;
}
.cover-icon { font-size: 38px; color: var(--burgundy); }
.cover-title {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: 'Playfair Display', serif;
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
}
.cover-line { width: 36px; height: 2px; background: var(--gold); }
.book-pages {
  position: absolute;
  right: -5px; top: 4px; bottom: 4px;
  width: 6px;
  background: repeating-linear-gradient(#fff, #fff 2px, #d4c297 2px, #d4c297 3px);
  border-radius: 0 3px 3px 0;
}
.book-shadow {
  position: absolute;
  left: 10px; right: 10px; bottom: -24px;
  height: 16px;
  background: radial-gradient(ellipse, rgba(0, 0, 0, 0.7), transparent 70%);
  filter: blur(4px);
}

/* ---- Info ---- */
.info { flex: 1; min-width: 0; color: #f6ead0; }
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
.info h1 {
  margin: 14px 0 10px;
  font-family: 'Playfair Display', serif;
  font-size: clamp(26px, 4.2vw, 40px);
  line-height: 1.15;
  font-weight: 800;
  color: #f6ead0;
  text-shadow: 0 2px 0 #1d1108;
}
.ornament {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0 16px;
  max-width: 260px;
}
.ornament span { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--gold-light), transparent); }
.ornament i { font-style: normal; font-size: 20px; color: var(--gold-light); }

.chips { display: flex; flex-wrap: wrap; gap: 10px; }
.chip {
  padding: 6px 14px;
  font-size: 13.5px;
  font-style: italic;
  background: rgba(51, 32, 15, 0.7);
  border: 1px solid var(--gold);
  border-radius: 2px;
  color: #e4d3ac;
}

/* ============ BODY ============ */
.body {
  position: relative;
  z-index: 2;
  max-width: 960px;
  margin: -50px auto 0;
  padding: 0 20px 70px;
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  align-items: start;
}
.card {
  background: var(--paper-light);
  border: 2px solid var(--brown);
  border-radius: 4px;
  box-shadow: 6px 8px 0 rgba(74, 47, 20, 0.22);
}
.about { padding: 32px 34px; }
.about h3 {
  margin: 0 0 4px;
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 800;
  color: var(--brown);
}
.mini-ornament { margin: 0 0 16px; font-size: 14px; letter-spacing: 0.3em; color: var(--gold); }
.description { margin: 0; font-size: 17px; line-height: 1.85; color: var(--ink); white-space: pre-line; }

.cta { padding: 26px; position: sticky; top: 30px; }
.cta-top { text-align: center; }
.cta-icon { font-size: 38px; margin-bottom: 8px; }
.cta h4 {
  margin: 0 0 6px;
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  font-weight: 800;
  color: var(--brown);
}
.cta p { margin: 0; font-size: 14.5px; font-style: italic; color: var(--ink-soft); line-height: 1.5; }

.perks { list-style: none; margin: 20px 0; padding: 16px 0; display: grid; gap: 10px; border-top: 1px solid var(--gold); border-bottom: 1px solid var(--gold); }
.perks li { display: flex; align-items: center; gap: 10px; font-size: 14.5px; font-weight: 600; color: var(--ink); }
.tick {
  width: 20px; height: 20px;
  display: grid; place-items: center;
  font-size: 11px;
  color: #f6ead0;
  background: var(--burgundy);
  border-radius: 50%;
}

.btn-read {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 20px;
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
.btn-read:hover { transform: translateY(-1px); box-shadow: 0 5px 0 #3a0c0c; filter: brightness(1.1); }
.btn-read:active { transform: translateY(3px); box-shadow: 0 1px 0 #3a0c0c; }
.btn-read svg { transition: transform 0.2s ease; }
.btn-read:hover svg { transform: translateX(3px); }
.btn-read.small { width: auto; padding: 10px 20px; margin-top: 14px; }

/* ============ STATES ============ */
.loading { text-align: center; margin: 40px 0; font-style: italic; color: var(--ink-soft); font-size: 16px; }
.no-data {
  max-width: 440px;
  margin: 90px auto;
  padding: 50px 30px;
  text-align: center;
  background: var(--paper-light);
  border: 3px double var(--brown);
  border-radius: 4px;
}
.no-icon { font-size: 48px; margin-bottom: 8px; }
.no-data p { font-style: italic; color: var(--ink-soft); font-size: 17px; margin-bottom: 16px; }

.sk-hero { display: flex; align-items: center; gap: 40px; max-width: 960px; margin: 50px auto 0; padding: 0 20px; }
.sk { background: linear-gradient(90deg, #e5d4a8 25%, #f3e7c9 50%, #e5d4a8 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 2px; }
.sk-book { width: 220px; height: 310px; flex-shrink: 0; }
.sk-lines { flex: 1; display: grid; gap: 16px; }
.sk-l { height: 16px; }
.sk-l.tall { height: 44px; }
.w30 { width: 30%; } .w50 { width: 50%; } .w80 { width: 80%; }

@keyframes shimmer { to { background-position: -200% 0; } }

/* ============ RESPONSIVE ============ */
@media (max-width: 820px) {
  .hero-content { flex-direction: column; text-align: center; gap: 32px; }
  .chips { justify-content: center; }
  .ornament { margin: 12px auto 16px; }
  .body { grid-template-columns: 1fr; margin-top: -40px; }
  .cta { position: static; }
}
@media (max-width: 520px) {
  .hero { padding: 30px 14px 80px; }
  .hero-frame { padding: 24px 16px 30px; }
  .body { padding: 0 14px 50px; }
  .about { padding: 24px 20px; }
}
</style>