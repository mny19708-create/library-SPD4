<template>
  <footer class="footer">
    <!-- Stats -->
    <div class="stats-wrap">
      <div class="ledger-title">
        <span></span><i>❦ The Library Ledger ❦</i><span></span>
      </div>

      <div class="stats">
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-info">
            <strong>{{ display.books }}</strong>
            <span>Total Books</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <strong>{{ display.users }}</strong>
            <span>Total Users</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🎓</div>
          <div class="stat-info">
            <strong>{{ display.certificates }}</strong>
            <span>Total Certificates</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- 1. Brand -->
      <div class="col brand-col">
        <div class="logo">
          <span class="logo-icon">📖</span>
          <span class="logo-text">Ebook Platform</span>
        </div>
        <p class="description">
          An advanced digital book and PDF reading platform. Empower thy learning, explore new knowledge, and earn certificates with ease.
        </p>
        <div class="features-badge">
          <span>⚡ Fast PDF Reader</span>
          <span>🎓 Certificates</span>
        </div>
      </div>

      <!-- 2. Quick Links -->
      <div class="col">
        <h4>Quick Links</h4>
        <ul>
          <li><router-link to="/home">Home</router-link></li>
          <li><router-link to="/catalog">Book Catalog</router-link></li>
          <li><router-link to="/my-certificates">My Certificates</router-link></li>
        </ul>
      </div>

      <!-- 3. Categories -->
      <div class="col">
        <h4>Categories</h4>
        <ul>
          <li><a href="#">Law &amp; Policy</a></li>
          <li><a href="#">Technology</a></li>
          <li><a href="#">Self-Help</a></li>
          <li><a href="#">Business</a></li>
        </ul>
      </div>

      <!-- 4. Contact -->
      <div class="col contact-col">
        <h4>Contact Us</h4>
        <div class="contact-item">
          <span class="ci-icon">✉</span>
          <div><small>Email</small><span>support@ebookplatform.com</span></div>
        </div>
        <div class="contact-item">
          <span class="ci-icon">❖</span>
          <div><small>Website</small><span>www.ebookplatform.com</span></div>
        </div>

        <div class="social-links">
          <a href="#" class="social-icon" title="Telegram" aria-label="Telegram">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M21.9 4.6a1.2 1.2 0 0 0-1.2-.2L2.6 11.3a1.1 1.1 0 0 0 .1 2.1l4.5 1.4 1.7 5.3a1.1 1.1 0 0 0 1.9.4l2.5-2.6 4.7 3.5a1.2 1.2 0 0 0 1.9-.7l3-15.1a1.2 1.2 0 0 0-.4-1zM9.9 14.2l8.4-5.2-6.6 6.2-.3 3z"/></svg>
          </a>
          <a href="#" class="social-icon" title="Facebook" aria-label="Facebook">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M13.5 22v-8.2h2.8l.4-3.3h-3.2V8.4c0-.9.3-1.6 1.6-1.6h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.3h2.8V22h3.4z"/></svg>
          </a>
          <a href="#" class="social-icon" title="YouTube" aria-label="YouTube">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z"/></svg>
          </a>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="bottom">
      <div class="bottom-container">
        <p>&copy; {{ year }} Ebook Learning Platform. All Rights Reserved.</p>
        <div class="bottom-links">
          <a href="#">Privacy Policy</a>
          <span>✦</span>
          <a href="#">Terms of Service</a>
        </div>
        <button class="to-top" @click="scrollTop" aria-label="Back to top">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import axios from 'axios'

const year = new Date().getFullYear()
const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

// Values shown on screen (animated count-up). "—" until data arrives.
const display = reactive({ books: '—', users: '—', certificates: '—' })

const countUp = (key, target) => {
  const end = Number(target) || 0
  const duration = 1200
  const start = performance.now()
  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - t, 3)
    display[key] = Math.round(end * eased).toLocaleString()
    if (t < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

const API = '/api'

// Count items from a list endpoint (supports [..], {data:[..]} or {count:n})
const getCount = async (path) => {
  const res = await axios.get(`${API}${path}`)
  const body = res.data
  if (Array.isArray(body)) return body.length
  if (Array.isArray(body?.data)) return body.data.length
  if (typeof body?.count === 'number') return body.count
  throw new Error(`Unexpected response from ${path}`)
}

const fetchStats = async () => {
  // 1) Preferred: one endpoint returning all totals
  try {
    const res = await axios.get(`${API}/stats`)
    if (res.data?.success) {
      const d = res.data.data || {}
      countUp('books', d.total_ebooks ?? d.total_books ?? 0)
      countUp('users', d.total_users ?? 0)
      countUp('certificates', d.total_certificates ?? 0)
      return
    }
  } catch (e) {
    // Open DevTools (F12) > Console to see why: 404 = route not loaded, 500 = server error
    console.warn('[Footer] /api/stats failed:', e.response?.status || e.message)
  }

  // 2) Fallback: count each total from its own existing endpoint
  const targets = [
    ['books', '/ebooks'],
    ['users', '/users'],
    ['certificates', '/certificates']
  ]
  const results = await Promise.allSettled(targets.map(([, path]) => getCount(path)))
  results.forEach((r, i) => {
    const [key, path] = targets[i]
    if (r.status === 'fulfilled') {
      countUp(key, r.value)
    } else {
      console.warn(`[Footer] Could not load ${path}:`, r.reason?.response?.status || r.reason?.message)
    }
  })
}

onMounted(fetchStats)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=IM+Fell+English:ital@0;1&family=Playfair+Display:wght@700;800&display=swap');

.footer {
  --paper-light: #faf1d9;
  --brown: #4a2f14;
  --gold: #b08d3c;
  --gold-light: #e3c776;
  --burgundy: #7a1f1f;

  position: relative;
  overflow: hidden;
  margin-top: 70px;
  color: #cdb98a;
  font-family: 'IM Fell English', Georgia, 'Noto Serif Khmer', 'Times New Roman', serif;
  background:
    repeating-linear-gradient(45deg, rgba(227, 199, 118, 0.045) 0 2px, transparent 2px 14px),
    linear-gradient(180deg, #2a1a0d 0%, #1f1308 100%);
  border-top: 6px double var(--gold);
}

/* ===== Stats (ledger) ===== */
.stats-wrap { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 48px 24px 0; }
.ledger-title {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 26px;
}
.ledger-title span { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
.ledger-title i {
  font-family: 'Cinzel', serif;
  font-style: normal;
  font-size: 13px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--gold-light);
  white-space: nowrap;
}
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.stat-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 20px 22px;
  background: rgba(227, 199, 118, 0.06);
  border: 2px solid var(--gold);
  border-radius: 3px;
  outline: 1px solid rgba(227, 199, 118, 0.35);
  outline-offset: -7px;
  transition: all 0.3s ease;
}
.stat-card:hover {
  transform: translateY(-4px);
  background: rgba(227, 199, 118, 0.12);
  box-shadow: 0 16px 28px -14px rgba(0, 0, 0, 0.8);
}
.stat-icon {
  width: 58px;
  height: 58px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  font-size: 25px;
  background: radial-gradient(circle at 35% 30%, #8a2525 0%, #4a1010 100%);
  border: 3px double var(--gold);
  border-radius: 50%;
  box-shadow: 0 8px 14px -4px rgba(0, 0, 0, 0.6), inset 0 2px 3px rgba(255, 255, 255, 0.2);
}
.stat-info { display: flex; flex-direction: column; line-height: 1.15; }
.stat-info strong {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 34px;
  font-weight: 800;
  color: var(--gold-light);
  font-variant-numeric: tabular-nums;
  text-shadow: 0 2px 0 rgba(0, 0, 0, 0.5);
}
.stat-info span {
  margin-top: 4px;
  font-family: 'Cinzel', serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #b9a578;
}

/* ===== Main grid ===== */
.container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 52px 24px 48px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.6fr;
  gap: 44px;
}

.logo { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
.logo-icon {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  font-size: 22px;
  background: var(--paper-light);
  border: 2px solid var(--gold);
  border-radius: 50%;
  box-shadow: 0 0 0 3px #2a1a0d, 0 0 0 4px var(--gold-light);
}
.logo-text {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(180deg, #f6dc8a 0%, #b08d3c 60%, #8a6a22 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.description {
  margin: 0 0 22px;
  max-width: 380px;
  font-size: 16px;
  font-style: italic;
  line-height: 1.7;
  color: #d6c698;
}
.features-badge { display: flex; flex-wrap: wrap; gap: 10px; }
.features-badge span {
  padding: 6px 14px;
  font-family: 'Cinzel', serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gold-light);
  background: rgba(227, 199, 118, 0.08);
  border: 1px solid rgba(227, 199, 118, 0.45);
  border-radius: 2px;
}

.col h4 {
  position: relative;
  margin: 0 0 24px;
  padding-bottom: 12px;
  font-family: 'Cinzel', serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #f6ead0;
}
.col h4::after {
  content: '❦';
  position: absolute;
  left: 0;
  bottom: -6px;
  padding-right: 10px;
  font-size: 15px;
  line-height: 1;
  color: var(--gold);
  background: #28190b;
}
.col h4::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 2px;
  height: 1px;
  background: linear-gradient(90deg, var(--gold), transparent);
}
.col ul { list-style: none; margin: 0; padding: 0; }
.col ul li { margin-bottom: 14px; }
.col ul a {
  position: relative;
  display: inline-block;
  font-size: 16.5px;
  color: #cdb98a;
  text-decoration: none;
  transition: all 0.25s ease;
}
.col ul a::before {
  content: '❧';
  position: absolute;
  left: -20px;
  opacity: 0;
  color: var(--gold-light);
  transition: all 0.25s ease;
}
.col ul a:hover { color: #fff4d6; padding-left: 20px; }
.col ul a:hover::before { opacity: 1; left: 0; }

/* contact */
.contact-item { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.ci-icon {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  font-size: 17px;
  color: var(--gold-light);
  background: rgba(227, 199, 118, 0.08);
  border: 1px solid var(--gold);
  border-radius: 50%;
}
.contact-item small {
  display: block;
  font-family: 'Cinzel', serif;
  font-size: 10.5px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #9d8a60;
}
.contact-item span:not(.ci-icon) { font-size: 15.5px; color: #eadcb8; word-break: break-all; }

.social-links { display: flex; gap: 12px; margin-top: 22px; }
.social-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  color: var(--gold-light);
  background: transparent;
  border: 1.5px solid var(--gold);
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.3s ease;
}
.social-icon:hover {
  color: #3a250f;
  background: linear-gradient(180deg, #f1d98f, #c9a24a);
  transform: translateY(-4px) rotate(-6deg);
  box-shadow: 0 10px 18px -6px rgba(0, 0, 0, 0.7);
}

/* ===== Bottom ===== */
.bottom {
  position: relative;
  z-index: 1;
  background: rgba(10, 5, 2, 0.6);
  border-top: 1px solid rgba(227, 199, 118, 0.4);
}
.bottom-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-size: 14.5px;
  color: #a8956a;
}
.bottom-container p { margin: 0; font-style: italic; }
.bottom-links { display: flex; align-items: center; gap: 12px; }
.bottom-links span { color: var(--gold); font-size: 11px; }
.bottom-links a { color: #a8956a; text-decoration: none; transition: color 0.2s; }
.bottom-links a:hover { color: var(--gold-light); }
.to-top {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  color: var(--gold-light);
  background: transparent;
  border: 1.5px solid var(--gold);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.25s ease;
}
.to-top:hover {
  color: #f6ead0;
  background: var(--burgundy);
  border-color: #b04545;
  transform: translateY(-3px);
}

/* ===== Responsive ===== */
@media (max-width: 900px) {
  .container { grid-template-columns: 1fr 1fr; }
  .brand-col { grid-column: 1 / -1; }
  .stats { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .stats-wrap { padding-top: 38px; }
  .ledger-title i { font-size: 11px; letter-spacing: 0.2em; }
  .container { grid-template-columns: 1fr; gap: 34px; padding-top: 40px; }
  .bottom-container { flex-direction: column; text-align: center; }
}
</style>
