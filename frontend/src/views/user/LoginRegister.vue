<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="emblem">✠</div>
        <h2>The Grand Library</h2>
        <p>{{ isLogin ? 'Authenticate to enter the archives' : 'Register a scholar account' }}</p>
      </div>

      <!-- Tab Switcher -->
      <div class="auth-tabs">
        <button :class="{ active: isLogin }" @click="isLogin = true">Sign In</button>
        <button :class="{ active: !isLogin }" @click="isLogin = false">Enroll</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit">
        <div v-if="!isLogin" class="form-group">
          <label>Scholar Username</label>
          <input v-model="form.username" type="text" placeholder="e.g. dara_scholar" required />
        </div>

        <div class="form-group">
          <label>Electronic Mail</label>
          <input v-model="form.email" type="email" placeholder="e.g. dara@archive.org" required />
        </div>

        <div class="form-group">
          <label>Secret Passcode</label>
          <input v-model="form.password" type="password" placeholder="••••••••" required />
        </div>

        <button type="submit" class="btn-submit">
          {{ isLogin ? 'Enter Archives' : 'Complete Enrollment' }}
        </button>
      </form>

      <div class="auth-footer">
        <p v-if="isLogin">
          Lacking an account? <a href="#" @click.prevent="isLogin = false">Enroll here</a>
        </p>
        <p v-else>
          Already enrolled? <a href="#" @click.prevent="isLogin = true">Sign in here</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLogin = ref(true)

const form = ref({
  username: '',
  email: '',
  password: ''
})

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      const res = await axios.post('/api/users/login', {
        email: form.value.email,
        password: form.value.password
      })

      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user))
        alert('🎉 Welcome back to the library!')
        router.push('/home')
      }
    } else {
      const res = await axios.post('/api/users/register', {
        username: form.value.username,
        email: form.value.email,
        password: form.value.password
      })

      if (res.data.success) {
        alert('✨ Enrollment successful! Please sign in with thy credentials.')
        isLogin.value = true
        form.value.password = ''
      }
    }
  } catch (err) {
    console.error('Auth error:', err.response?.data || err.message)
    alert(err.response?.data?.message || 'An error occurred during authentication.')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=IM+Fell+English:ital@0;1&family=Playfair+Display:wght@500;700;800&family=Cormorant+Garamond:wght@500;600;700&display=swap');

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f3e7c9;
  background-image:
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.24  0 0 0 0 0.1  0 0 0 0.16 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"),
    radial-gradient(ellipse at 20% 0%, rgba(176, 141, 60, 0.18), transparent 55%),
    radial-gradient(ellipse at 100% 100%, rgba(122, 31, 31, 0.1), transparent 50%);
  font-family: 'IM Fell English', 'Cormorant Garamond', Georgia, serif;
  color: #2b1d0e;
  padding: 20px;
}

.auth-card {
  background: #faf1d9;
  padding: 36px 32px;
  border-radius: 4px;
  width: 100%;
  max-width: 420px;
  box-shadow: 6px 10px 0 rgba(74, 47, 20, 0.3), 0 20px 40px -16px rgba(43, 29, 14, 0.5);
  border: 2px solid #4a2f14;
}

.auth-header {
  text-align: center;
  margin-bottom: 24px;
}

.emblem {
  font-size: 28px;
  color: #b08d3c;
  margin-bottom: 4px;
}

.auth-header h2 {
  font-family: 'Playfair Display', serif;
  color: #4a2f14;
  margin: 0 0 6px;
  font-size: 26px;
  font-weight: 800;
}

.auth-header p {
  color: #6b5334;
  font-style: italic;
  font-size: 15px;
  margin: 0;
}

.auth-tabs {
  display: flex;
  margin-bottom: 24px;
  border-bottom: 2px solid #b08d3c;
}

.auth-tabs button {
  flex: 1;
  background: none;
  border: none;
  padding: 10px;
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #6b5334;
  cursor: pointer;
}

.auth-tabs button.active {
  color: #f6ead0;
  background: #7a1f1f;
  border-bottom: 2px solid #7a1f1f;
  margin-bottom: -2px;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 11.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #4a2f14;
  margin-bottom: 6px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  font-family: inherit;
  font-size: 16px;
  color: #2b1d0e;
  background: #f3e7c9;
  border: 1.5px solid #b08d3c;
  border-radius: 2px;
  box-sizing: border-box;
  outline: none;
  box-shadow: inset 0 1px 3px rgba(74, 47, 20, 0.2);
}

.form-group input:focus {
  border-color: #4a2f14;
  box-shadow: inset 0 1px 3px rgba(74, 47, 20, 0.2), 0 0 0 3px rgba(176, 141, 60, 0.3);
}

.btn-submit {
  width: 100%;
  background: linear-gradient(180deg, #8a2525, #5a1616);
  color: #f6ead0;
  padding: 14px;
  border: 2px solid #3a0c0c;
  border-radius: 3px;
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  margin-top: 10px;
  box-shadow: 0 4px 0 #3a0c0c;
  transition: all 0.2s;
}

.btn-submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 0 #3a0c0c;
  filter: brightness(1.1);
}

.btn-submit:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 #3a0c0c;
}

.auth-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #6b5334;
  font-style: italic;
}

.auth-footer a {
  color: #7a1f1f;
  text-decoration: none;
  font-weight: bold;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>