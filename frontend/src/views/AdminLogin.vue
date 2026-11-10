<template>
  <div class="admin-login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-icon">1🛡️</div>
        <h2>Admin Portal</h2>
        <p>Sign in to access Ebook Master Admin</p>
      </div>

      <form @submit.prevent="handleAdminLogin">
        <div class="form-group">
          <label>Admin Email</label>
          <input v-model="form.email" type="email" placeholder="admin@ebook.com" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input v-model="form.password" type="password" placeholder="••••••••" required />
        </div>

        <button type="submit" class="btn-login" :disabled="isLoading">
          {{ isLoading ? 'Signing in...' : 'Login to Dashboard' }}
        </button>
      </form>

      <div class="login-footer">
        <router-link to="/auth">← Go back to User Portal</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(false)

const form = ref({
  email: '',
  password: ''
})

const handleAdminLogin = async () => {
  try {
    isLoading.value = true
    
    // ហៅ API ទៅកាន់ Backend តាមរយៈ Relative Path
    const res = await axios.post('/api/admin/login', {
      email: form.value.email,
      password: form.value.password
    })

    if (res.data.success) {
      // រក្សាទុក Token ពិតប្រាកដក្នុង LocalStorage
      localStorage.setItem('adminToken', res.data.token)
      
      alert('Admin Login Successful!')
      router.push('/dashboard') // បញ្ជូនទៅកាន់ Admin Dashboard
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Invalid admin credentials!')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* រក្សា Style ដែនមានស្រាប់របស់អ្នកដដែល */
.admin-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #0f172a;
  font-family: Arial, sans-serif;
}
.login-card {
  background: white;
  padding: 35px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  border-top: 5px solid #0ea5e9;
}
.login-header { text-align: center; margin-bottom: 25px; }
.logo-icon { font-size: 40px; margin-bottom: 10px; }
.login-header h2 { color: #0f172a; margin: 0 0 5px 0; }
.login-header p { color: #64748b; font-size: 13px; margin: 0; }
.form-group { margin-bottom: 18px; }
.form-group label { display: block; font-weight: bold; font-size: 13px; color: #334155; margin-bottom: 6px; }
.form-group input { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; box-sizing: border-box; }
.form-group input:focus { outline: none; border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1); }
.btn-login { width: 100%; background: #0ea5e9; color: white; padding: 12px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; transition: background 0.3s ease; margin-top: 10px; }
.btn-login:hover:not(:disabled) { background: #0284c7; }
.btn-login:disabled { background: #cbd5e1; cursor: not-allowed; }
.login-footer { text-align: center; margin-top: 20px; font-size: 13px; }
.login-footer a { color: #64748b; text-decoration: none; }
.login-footer a:hover { color: #0ea5e9; text-decoration: underline; }
</style>