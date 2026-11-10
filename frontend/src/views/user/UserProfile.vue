<template>
  <div class="profile-root">
    <!-- Header Component -->
    <HeaderHome />

    <div class="profile-page">
      <div class="vignette"></div>

      <div class="profile-card">
        <div class="inner-frame"></div>
        <div class="corner tl">❦</div>
        <div class="corner tr">❦</div>
        <div class="corner bl">❦</div>
        <div class="corner br">❦</div>

        <!-- Monogram medallion -->
        <div class="avatar-wrap">
          <div class="avatar">{{ initial }}</div>
          <span class="avatar-ring"></span>
        </div>

        <p class="eyebrow">— Register of the Reader —</p>
        <h2>User Profile</h2>
        <div class="ornament"><span></span><i>❦</i><span></span></div>
        <p class="subtitle">Update thy profile information and account credentials</p>

        <form @submit.prevent="updateProfile" class="profile-form">
          <div class="form-group">
            <label for="username">Username</label>
            <div class="field">
              <span class="ico">♟</span>
              <input id="username" type="text" v-model.trim="form.username" placeholder="Enter your username" required />
            </div>
          </div>

          <div class="form-group">
            <label for="email">Gmail / Email Address</label>
            <div class="field">
              <span class="ico">✉</span>
              <input id="email" type="email" v-model.trim="form.email" placeholder="Enter your email" required />
            </div>
          </div>

          <div class="form-group">
            <label for="password">New Password <span class="optional">(Leave blank to keep current)</span></label>
            <div class="field">
              <span class="ico">⚿</span>
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                placeholder="Enter new password"
                autocomplete="new-password"
              />
              <button type="button" class="eye" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <button type="submit" class="btn-save" :disabled="isLoading">
            <span v-if="isLoading" class="spinner"></span>
            {{ isLoading ? 'Saving Changes...' : 'Save Changes' }}
          </button>
        </form>

        <transition name="pop">
          <div v-if="message" :class="['alert', messageType]">
            <span>{{ messageType === 'success' ? '✔' : '⚠' }}</span>
            {{ message }}
          </div>
        </transition>
      </div>
    </div>

    <FooterHome />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import HeaderHome from '@/components/HeaderHome.vue'
import FooterHome from '@/components/FooterHome.vue'
import axios from 'axios'

const API = 'http://localhost:5000/api/users'

const form = ref({ username: '', email: '', password: '' })
const isLoading = ref(false)
const showPassword = ref(false)
const message = ref('')
const messageType = ref('')
let messageTimer = null

const initial = computed(() => (form.value.username || '?').trim().charAt(0).toUpperCase())

const showMessage = (text, type = 'success') => {
  message.value = text
  messageType.value = type
  clearTimeout(messageTimer)
  messageTimer = setTimeout(() => (message.value = ''), 4000)
}

const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
}

const getUserId = () => {
  const u = getStoredUser()
  return (u && (u.id || u.user_id)) || localStorage.getItem('userId') || null
}

// Load the latest data from the server (fallback: localStorage)
const fetchProfile = async () => {
  const stored = getStoredUser()
  if (stored) {
    form.value.username = stored.username || ''
    form.value.email = stored.email || ''
  }

  const userId = getUserId()
  if (!userId) return
  try {
    const res = await axios.get(`${API}/profile/${userId}`)
    if (res.data.success) {
      form.value.username = res.data.data.username
      form.value.email = res.data.data.email
    }
  } catch (err) {
    console.error('Error fetching profile:', err)
  }
}

const updateProfile = async () => {
  const userId = getUserId()
  if (!userId) {
    showMessage('User ID not found. Please log in again.', 'error')
    return
  }

  isLoading.value = true
  try {
    const payload = {
      username: form.value.username,
      email: form.value.email
    }
    if (form.value.password && form.value.password.trim() !== '') {
      payload.password = form.value.password
    }

    const res = await axios.put(`${API}/profile/${userId}`, payload)

    if (res.data.success) {
      // Keep localStorage in sync so every page shows the new data
      const stored = getStoredUser() || {}
      localStorage.setItem('user', JSON.stringify({
        ...stored,
        id: stored.id || userId,
        username: form.value.username,
        email: form.value.email
      }))
      window.dispatchEvent(new Event('user-updated'))

      form.value.password = ''
      showMessage(res.data.message || 'Profile updated successfully!', 'success')
    } else {
      showMessage(res.data.message || 'Update failed', 'error')
    }
  } catch (err) {
    console.error('Error updating profile:', err)
    showMessage(err.response?.data?.message || 'Could not update profile. Please try again.', 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchProfile)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=IM+Fell+English:ital@0;1&family=Playfair+Display:wght@500;700;800&display=swap');

.profile-root {
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
}

.profile-page {
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px 70px;
  min-height: 100vh;
  font-family: 'IM Fell English', Georgia, 'Noto Serif Khmer', 'Times New Roman', serif;
  color: var(--ink);
  background-color: var(--paper);
  background-image:
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.24  0 0 0 0 0.1  0 0 0 0.16 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"),
    radial-gradient(ellipse at 20% 0%, rgba(176, 141, 60, 0.2), transparent 55%),
    radial-gradient(ellipse at 100% 100%, rgba(122, 31, 31, 0.12), transparent 50%);
}
.vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-shadow: inset 0 0 160px rgba(74, 47, 20, 0.45);
}

/* ================= CARD ================= */
.profile-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
  padding: 70px 38px 38px;
  background:
    radial-gradient(ellipse at center, rgba(255, 255, 255, 0.55), transparent 70%),
    var(--paper-light);
  border: 2px solid var(--brown);
  border-radius: 3px;
  box-shadow: 8px 10px 0 rgba(74, 47, 20, 0.3), 0 30px 50px -20px rgba(43, 29, 14, 0.6);
  animation: rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) backwards;
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

/* Monogram medallion */
.avatar-wrap { position: absolute; top: -46px; left: 50%; transform: translateX(-50%); }
.avatar {
  width: 92px;
  height: 92px;
  display: grid;
  place-items: center;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 40px;
  font-weight: 800;
  color: var(--gold-light);
  background: radial-gradient(circle at 35% 30%, #8a2525 0%, #4a1010 100%);
  border: 4px double var(--gold);
  border-radius: 50%;
  box-shadow: 0 14px 24px -8px rgba(0, 0, 0, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -4px 8px rgba(0, 0, 0, 0.4);
  text-shadow: 0 2px 0 rgba(0, 0, 0, 0.5);
}
.avatar-ring {
  position: absolute;
  inset: -10px;
  border: 2px dashed var(--gold);
  border-radius: 50%;
  animation: spin 24s linear infinite;
}

.eyebrow {
  margin: 0 0 6px;
  text-align: center;
  font-family: 'Cinzel', serif;
  font-size: 11.5px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--burgundy);
}
h2 {
  margin: 0;
  text-align: center;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 32px;
  font-weight: 800;
  color: var(--brown);
}
.ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 10px auto 10px;
  max-width: 240px;
}
.ornament span { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
.ornament i { font-style: normal; font-size: 20px; color: var(--gold); }
.subtitle {
  margin: 0 0 28px;
  text-align: center;
  font-size: 16px;
  font-style: italic;
  color: var(--ink-soft);
}

/* ================= FORM ================= */
.profile-form { display: flex; flex-direction: column; gap: 22px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label {
  font-family: 'Cinzel', serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--brown);
}
.optional {
  font-family: 'IM Fell English', Georgia, serif;
  font-size: 13px;
  font-style: italic;
  font-weight: 400;
  letter-spacing: 0;
  text-transform: none;
  color: var(--ink-soft);
}

.field { position: relative; display: flex; align-items: center; }
.ico {
  position: absolute;
  left: 14px;
  font-size: 17px;
  color: var(--gold);
  pointer-events: none;
}
.field input {
  width: 100%;
  padding: 13px 46px 13px 42px;
  font-family: inherit;
  font-size: 17px;
  color: var(--ink);
  background: var(--paper);
  border: 1.5px solid var(--brown);
  border-radius: 3px;
  outline: none;
  box-shadow: inset 0 2px 5px rgba(74, 47, 20, 0.25);
  transition: all 0.2s ease;
}
.field input::placeholder { color: #8f7650; font-style: italic; }
.field input:focus {
  background: var(--paper-light);
  border-color: var(--burgundy);
  box-shadow: inset 0 2px 5px rgba(74, 47, 20, 0.2), 0 0 0 4px rgba(176, 141, 60, 0.35);
}
.eye {
  position: absolute;
  right: 10px;
  padding: 6px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.btn-save {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 6px;
  padding: 14px;
  font-family: 'Cinzel', serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #f6ead0;
  background: linear-gradient(180deg, #8a2525, #5a1616);
  border: 2px solid #3a0c0c;
  border-radius: 3px;
  box-shadow: 0 5px 0 #3a0c0c, 0 14px 22px -10px rgba(0, 0, 0, 0.55);
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-save:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.1); }
.btn-save:active:not(:disabled) { transform: translateY(4px); box-shadow: 0 1px 0 #3a0c0c; }
.btn-save:disabled { opacity: 0.8; cursor: wait; }
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(246, 234, 208, 0.4);
  border-top-color: #f6ead0;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

/* ================= ALERT ================= */
.alert {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 22px;
  padding: 12px 14px;
  font-size: 16px;
  font-style: italic;
  text-align: center;
  border-radius: 2px;
}
.alert.success { background: #dfe8cf; color: #25421f; border: 1.5px solid var(--green); }
.alert.error { background: #f1d3c9; color: #6e1a12; border: 1.5px solid var(--burgundy); }

.pop-enter-active { animation: rise 0.35s ease both; }
.pop-leave-active { transition: opacity 0.25s ease; }
.pop-leave-to { opacity: 0; }

@keyframes rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 520px) {
  .profile-page { padding: 70px 14px 50px; }
  .profile-card { padding: 66px 22px 28px; }
  h2 { font-size: 27px; }
}
</style>