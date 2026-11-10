<template>
  <div class="page">
    <!-- Hero / Header -->
    <section class="hero">
      <div class="hero-inner">
        <div>
          <span class="eyebrow">— Archival Management —</span>
          <h2>Manage Ebook Volumes</h2>
          <p class="subtitle">Record, update, and manage literary volumes within the Grand Library.</p>
        </div>
        <div class="hero-count">
          <strong>{{ ebooks.length }}</strong>
          <span>Total Volumes</span>
        </div>
      </div>
    </section>

    <div class="content">
      <!-- Form for Adding or Editing Ebook -->
      <div class="card form-card" :class="{ editing: isEditing }">
        <div class="card-head">
          <div class="head-icon" :class="isEditing ? 'amber' : 'burgundy'">{{ isEditing ? '✏️' : '➕' }}</div>
          <div>
            <h3>{{ isEditing ? 'Modify Volume Archive' : 'Catalog New Volume' }}</h3>
            <p>{{ isEditing ? 'Update the sacred details below, then record thy changes.' : 'Fill in the scroll details to publish a new volume.' }}</p>
          </div>
          <span v-if="isEditing" class="editing-badge">Editing Mode</span>
        </div>

        <form @submit.prevent="saveEbook">
          <div class="form-grid">
            <div class="form-group span-2">
              <label>Volume Title</label>
              <input v-model="form.title" type="text" placeholder="e.g. Chronicles of Ancient Philosophy..." required />
            </div>

            <div class="form-group">
              <label>Subject Archive (Category)</label>
              <select v-model="form.category_id" required class="form-select">
                <option disabled value="">-- Select Subject --</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div class="form-group span-3">
              <label>Volume Description</label>
              <textarea v-model="form.description" placeholder="Summarize the contents of this noble volume..." rows="4" required></textarea>
            </div>

            <div class="form-group">
              <label>Estimated Reading Time</label>
              <div class="input-suffix">
                <input v-model.number="form.estimated_reading_time" type="number" min="1" required />
                <span>mins</span>
              </div>
            </div>

            <div class="form-group span-2">
              <label>Cover Image URL (Cloudinary)</label>
              <input v-model="form.image_url" type="text" placeholder="https://res.cloudinary.com/.../image.jpg" required />
              <small class="hint">យក Link រូបភាពពី <code>Cloudinary Media Library</code> មកដាក់ទីនេះ។</small>
            </div>

            <div class="form-group span-3">
              <label>Google Drive PDF Preview Link</label>
              <input v-model="form.drive_link" type="text" placeholder="https://drive.google.com/file/d/.../preview" required />
              <small class="hint">Use a link ending with <code>/preview</code> so the PDF displays properly in the reader.</small>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" :class="isEditing ? 'btn-update' : 'btn-submit'" :disabled="isSaving">
              <span v-if="isSaving" class="btn-spinner"></span>
              {{ isSaving ? 'Recording...' : (isEditing ? 'Update Volume' : 'Record Volume') }}
            </button>
            <button v-if="isEditing" type="button" @click="resetForm" class="btn-cancel">Abort</button>
          </div>
        </form>
      </div>

      <!-- Ebooks Table -->
      <div class="card table-card">
        <div class="table-top">
          <div class="card-head tight">
            <div class="head-icon gold">📚</div>
            <div>
              <h3>Archived Volumes <span class="count-pill">{{ ebooks.length }}</span></h3>
              <p>All literary works currently registered in the system</p>
            </div>
          </div>

          <div class="search">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
            <input v-model="searchQuery" type="text" placeholder="Search by title or subject..." />
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Volume Title</th>
                <th>Subject</th>
                <th>Reading Time</th>
                <th>Drive Link</th>
                <th class="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="isLoading">
                <tr v-for="n in 4" :key="'sk' + n"><td colspan="5"><div class="sk"></div></td></tr>
              </template>

              <template v-else>
                <tr v-for="ebook in filteredEbooks" :key="ebook.id" :class="{ 'row-editing': isEditing && editId === ebook.id }">
                  <td>
                    <div class="title-cell">
                      <img 
                        v-if="ebook.image_url" 
                        :src="ebook.image_url" 
                        alt="Cover" 
                        class="mini-cover-img" 
                      />
                      <span v-else class="mini-cover">📘</span>
                      <strong>{{ ebook.title }}</strong>
                    </div>
                  </td>
                  <td><span class="badge-cat">{{ getCategoryName(ebook.category_id) }}</span></td>
                  <td><span class="time-chip">⌛ {{ ebook.estimated_reading_time }} mins</span></td>
                  <td>
                    <a :href="ebook.pdf_url" target="_blank" rel="noopener" class="link-preview">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>
                      Consult
                    </a>
                  </td>
                  <td class="action-buttons">
                    <button @click="editEbook(ebook)" class="btn-edit">Modify</button>
                    <button @click="askDelete(ebook)" class="btn-delete">Exile</button>
                  </td>
                </tr>

                <tr v-if="filteredEbooks.length === 0">
                  <td colspan="5" class="no-data">
                    <div class="no-icon">{{ searchQuery ? '🔍' : '📜' }}</div>
                    {{ searchQuery ? 'Alas, no volumes match thy search' : 'No volume archives available yet' }}
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <transition name="modal">
      <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
        <div class="modal-card" role="dialog" aria-modal="true">
          <div class="modal-icon">⚠️</div>
          <h4>Exile this volume?</h4>
          <p>
            <b>{{ deleteTarget.title }}</b> will be permanently removed from the archives. This action cannot be undone.
          </p>
          <div class="modal-actions">
            <button class="btn-cancel-soft" @click="deleteTarget = null">Cancel</button>
            <button class="btn-danger" @click="confirmDelete">Confirm Exile</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">
        <span class="toast-icon">{{ toast.type === 'success' ? '✓' : '!' }}</span>
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const ebooks = ref([])
const categories = ref([])
const isEditing = ref(false)
const editId = ref(null)
const isLoading = ref(true)
const isSaving = ref(false)
const searchQuery = ref('')
const deleteTarget = ref(null)

const form = ref({
  title: '',
  description: '',
  drive_link: '',
  image_url: '',
  category_id: '',
  estimated_reading_time: 15
})

// Toast
const toast = ref({ show: false, type: 'success', message: '' })
let toastTimer = null
const showToast = (message, type = 'success') => {
  toast.value = { show: true, type, message }
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value.show = false), 3200)
}

// Fetch Ebooks
const fetchEbooks = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/ebooks')
    if (res.data.success) {
      ebooks.value = res.data.data
    }
  } catch (err) {
    console.error('Error fetching ebooks:', err)
  } finally {
    isLoading.value = false
  }
}

// Fetch Categories
const fetchCategories = async () => {
  try {
    const res = await axios.get('/api/categories')
    if (res.data.success) {
      categories.value = res.data.data
    }
  } catch (err) {
    console.error('Error fetching categories:', err)
  }
}

const getCategoryName = (catId) => {
  const cat = categories.value.find(c => c.id === catId)
  return cat ? cat.name : 'General'
}

const filteredEbooks = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return ebooks.value
  return ebooks.value.filter(e =>
    (e.title || '').toLowerCase().includes(q) ||
    getCategoryName(e.category_id).toLowerCase().includes(q)
  )
})

const saveEbook = async () => {
  isSaving.value = true
  try {
    if (isEditing.value) {
      await axios.put(`/api/ebooks/${editId.value}`, form.value)
      showToast('✨ Volume archive updated successfully!')
    } else {
      await axios.post('/api/ebooks/add', form.value)
      showToast('✨ New volume registered successfully!')
    }
    await fetchEbooks()
    resetForm()
  } catch (err) {
    showToast(err.response?.data?.message || err.message, 'error')
  } finally {
    isSaving.value = false
  }
}

const editEbook = (ebook) => {
  isEditing.value = true
  editId.value = ebook.id
  form.value = {
    title: ebook.title,
    description: ebook.description || '',
    drive_link: ebook.pdf_url,
    image_url: ebook.image_url || '',
    category_id: ebook.category_id,
    estimated_reading_time: ebook.estimated_reading_time
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const askDelete = (ebook) => { deleteTarget.value = ebook }
const confirmDelete = async () => {
  const target = deleteTarget.value
  deleteTarget.value = null
  if (!target) return
  try {
    await axios.delete(`/api/ebooks/${target.id}`)
    showToast('Volume successfully exiled')
    fetchEbooks()
  } catch (err) {
    showToast('Failed to exile volume', 'error')
  }
}

const resetForm = () => {
  isEditing.value = false
  editId.value = null
  form.value = {
    title: '',
    description: '',
    drive_link: '',
    image_url: '',
    category_id: '',
    estimated_reading_time: 15
  }
}

onMounted(() => {
  fetchEbooks()
  fetchCategories()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=IM+Fell+English:ital@0;1&family=Playfair+Display:wght@500;700;800&family=Cormorant+Garamond:wght@500;600;700&display=swap');

.page {
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
.hero-count {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 28px;
  background: #33200f;
  border: 2px solid #b08d3c;
  border-radius: 4px;
}
.hero-count strong {
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  font-weight: 800;
  color: #e3c776;
  line-height: 1.1;
}
.hero-count span {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #f6ead0;
  opacity: 0.85;
}

/* ================= CONTENT ================= */
.content {
  max-width: 1200px;
  margin: -45px auto 0;
  padding: 0 20px 60px;
  display: grid;
  gap: 30px;
  position: relative;
  z-index: 2;
}

.card {
  background: #faf1d9;
  padding: 32px;
  border: 2px solid #4a2f14;
  border-radius: 4px;
  box-shadow: 6px 10px 0 rgba(74, 47, 20, 0.25), 0 18px 36px -16px rgba(43, 29, 14, 0.4);
}
.form-card.editing {
  border-color: #b08d3c;
  box-shadow: 0 0 0 3px rgba(176, 141, 60, 0.3), 6px 10px 0 rgba(74, 47, 20, 0.25);
}

.card-head {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e3c776;
  padding-bottom: 14px;
}
.card-head.tight {
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
}
.card-head h3 {
  margin: 0;
  font-family: 'Playfair Display', serif;
  font-size: 21px;
  font-weight: 800;
  color: #4a2f14;
  display: flex;
  align-items: center;
  gap: 10px;
}
.card-head p {
  margin: 4px 0 0;
  font-size: 14.5px;
  font-style: italic;
  color: #6b5334;
}
.head-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  font-size: 22px;
  border-radius: 4px;
  border: 1.5px solid #4a2f14;
  box-shadow: inset 0 2px 4px rgba(74, 47, 20, 0.2);
}
.head-icon.burgundy { background: #7a1f1f; color: #f6ead0; }
.head-icon.amber { background: #b08d3c; color: #2b1d0e; }
.head-icon.gold { background: #e5d4a8; color: #4a2f14; }

.editing-badge {
  margin-left: auto;
  padding: 6px 14px;
  font-family: 'Cinzel', serif;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #f6ead0;
  background: #7a1f1f;
  border: 1px solid #3a0c0c;
  border-radius: 2px;
}
.count-pill {
  padding: 2px 10px;
  font-size: 13px;
  font-family: 'Cinzel', serif;
  color: #4a2f14;
  background: #e5d4a8;
  border: 1px solid #b08d3c;
  border-radius: 2px;
}

/* ----- form ----- */
.form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.span-2 { grid-column: span 2; }
.span-3 { grid-column: span 3; }

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #4a2f14;
}
.form-group input,
.form-group textarea,
.form-select {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  font-size: 16px;
  font-family: inherit;
  color: #2b1d0e;
  background: #f3e7c9;
  border: 1.5px solid #b08d3c;
  border-radius: 2px;
  outline: none;
  box-shadow: inset 0 1px 3px rgba(74, 47, 20, 0.15);
  transition: all .2s ease;
}
.form-group textarea { resize: vertical; min-height: 100px; line-height: 1.6; }
.form-group input::placeholder, .form-group textarea::placeholder { color: #8f7650; }
.form-group input:focus, .form-group textarea:focus, .form-select:focus {
  border-color: #4a2f14;
  box-shadow: inset 0 1px 3px rgba(74, 47, 20, 0.2), 0 0 0 3px rgba(176, 141, 60, 0.25);
}
.input-suffix { position: relative; }
.input-suffix input { padding-right: 54px; }
.input-suffix span {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  font-style: italic;
  color: #6b5334;
  pointer-events: none;
}
.hint { display: block; margin-top: 6px; font-size: 12.5px; font-style: italic; color: #6b5334; }
.hint code { padding: 1px 4px; font-size: 12px; color: #7a1f1f; background: #e5d4a8; border-radius: 2px; }

.form-actions { margin-top: 24px; display: flex; gap: 12px; }
.btn-submit, .btn-update, .btn-cancel {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 24px;
  font-family: 'Cinzel', serif;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 3px;
  cursor: pointer;
  transition: all .2s ease;
}
.btn-submit {
  color: #f6ead0;
  background: linear-gradient(180deg, #2f4a33, #1a2e1e);
  border: 2px solid #111d33;
  box-shadow: 0 3px 0 #111d33;
}
.btn-update {
  color: #2b1d0e;
  background: linear-gradient(180deg, #b08d3c, #8a6a22);
  border: 2px solid #6b5334;
  box-shadow: 0 3px 0 #6b5334;
}
.btn-submit:hover:not(:disabled), .btn-update:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
.btn-submit:disabled, .btn-update:disabled { opacity: .6; cursor: not-allowed; }
.btn-cancel {
  color: #f6ead0;
  background: #6b5334;
  border: 2px solid #4a2f14;
}
.btn-cancel:hover { background: #4a2f14; }
.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(246,234,208,.4);
  border-top-color: #f6ead0;
  border-radius: 50%;
  animation: spin .8s linear infinite;
}

/* ----- table ----- */
.table-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.search { position: relative; width: 100%; max-width: 300px; }
.search svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #6b5334; }
.search input {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 16px 11px 42px;
  font-size: 15px;
  font-family: inherit;
  font-style: italic;
  color: #2b1d0e;
  background: #f3e7c9;
  border: 1.5px solid #b08d3c;
  border-radius: 2px;
  outline: none;
}
.search input:focus { border-color: #4a2f14; box-shadow: 0 0 0 3px rgba(176,141,60,0.25); }

.table-responsive { overflow-x: auto; }
.data-table { width: 100%; min-width: 780px; border-collapse: collapse; }
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
.th-actions { text-align: right !important; }
.data-table td {
  padding: 14px;
  font-size: 15px;
  vertical-align: middle;
  border-bottom: 1px solid #d4c297;
}
.data-table tbody tr:hover { background: #f3e7c9; }
.row-editing { background: #fceecb !important; }

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
.mini-cover-img {
  width: 34px;
  height: 46px;
  object-fit: cover;
  border-radius: 2px;
  border: 1px solid #b08d3c;
  flex-shrink: 0;
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
.link-preview {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  font-weight: 700;
  color: #7a1f1f;
  text-decoration: none;
}
.link-preview:hover { text-decoration: underline; }

.action-buttons { text-align: right; white-space: nowrap; }
.btn-edit, .btn-delete {
  padding: 6px 14px;
  margin-left: 8px;
  font-family: 'Cinzel', serif;
  font-size: 11px;
  font-weight: 700;
  border-radius: 2px;
  cursor: pointer;
  border: 1px solid;
}
.btn-edit {
  color: #f6ead0;
  background: #2b3a4a;
  border-color: #1a232b;
}
.btn-edit:hover { background: #1a232b; }
.btn-delete {
  color: #f6ead0;
  background: #7a1f1f;
  border-color: #3a0c0c;
}
.btn-delete:hover { background: #5a1616; }

.no-data {
  text-align: center;
  color: #6b5334;
  font-style: italic;
  padding: 40px 14px !important;
}
.no-icon { font-size: 40px; margin-bottom: 6px; }

.sk {
  height: 44px;
  border-radius: 2px;
  background: linear-gradient(90deg, #e5d4a8 25%, #faf1d9 50%, #e5d4a8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

/* ----- modal ----- */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(43,29,14,.6);
  backdrop-filter: blur(4px);
}
.modal-card {
  width: 100%;
  max-width: 400px;
  padding: 34px 30px 26px;
  text-align: center;
  background: #faf1d9;
  border: 2px solid #4a2f14;
  border-radius: 4px;
  box-shadow: 6px 10px 0 rgba(74, 47, 20, 0.4);
}
.modal-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 14px;
  display: grid;
  place-items: center;
  font-size: 26px;
  background: #f8d7da;
  border: 1px solid #dc3545;
  border-radius: 50%;
}
.modal-card h4 {
  margin: 0 0 8px;
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  color: #4a2f14;
}
.modal-card p {
  margin: 0 0 24px;
  font-size: 15px;
  font-style: italic;
  line-height: 1.6;
  color: #6b5334;
}
.modal-card p b { color: #4a2f14; font-style: normal; }
.modal-actions { display: flex; gap: 12px; }
.btn-cancel-soft, .btn-danger {
  flex: 1;
  padding: 12px;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 3px;
  cursor: pointer;
}
.btn-cancel-soft {
  color: #f6ead0;
  background: #6b5334;
  border: 1px solid #4a2f14;
}
.btn-cancel-soft:hover { background: #4a2f14; }
.btn-danger {
  color: #f6ead0;
  background: #7a1f1f;
  border: 1px solid #3a0c0c;
}
.btn-danger:hover { background: #5a1616; }

/* ----- toast ----- */
.toast {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 120;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 22px;
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #f6ead0;
  border-radius: 3px;
  box-shadow: 4px 6px 0 rgba(0,0,0,0.3);
  border: 1px solid;
}
.toast.success { background: #2f4a33; border-color: #111d33; }
.toast.error { background: #7a1f1f; border-color: #3a0c0c; }
.toast-icon {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  font-size: 12px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
}

/* ----- transitions & keyframes ----- */
.modal-enter-active, .modal-leave-active { transition: opacity .25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.toast-enter-active, .toast-leave-active { transition: all .35s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(20px); }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes shimmer { to { background-position: -200% 0; } }

@media (max-width: 860px) {
  .form-grid { grid-template-columns: 1fr; }
  .span-2, .span-3 { grid-column: span 1; }
}
@media (max-width: 640px) {
  .hero { padding: 30px 18px 80px; }
  .content { padding: 0 14px 40px; }
  .card { padding: 22px 18px; }
  .search { max-width: none; }
}
</style>
