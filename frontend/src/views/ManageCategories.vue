<template>
  <div class="page-container">
    <div class="header-section">
      <div class="emblem">🏷️</div>
      <h2>Category Archive Management</h2>
      <p class="subtitle">— Establish and organize thy subjects and volumes —</p>
      <div class="ornament"><span></span><i>❦</i><span></span></div>
    </div>

    <!-- Form for Adding or Editing Category -->
    <div class="card form-card">
      <div class="card-header-ornament"></div>
      <h3>{{ isEditing ? '✏️ Edit Subject Archive' : '➕ Register New Subject' }}</h3>
      
      <form @submit.prevent="saveCategory">
        <div class="form-group">
          <label>Subject Title:</label>
          <input v-model="categoryName" type="text" required placeholder="e.g. Ancient Philosophy, Advanced Architecture..." />
        </div>

        <div class="form-actions">
          <button type="submit" :class="isEditing ? 'btn-update' : 'btn-submit'">
            {{ isEditing ? 'Update Subject' : 'Record Subject' }}
          </button>
          <button v-if="isEditing" type="button" @click="resetForm" class="btn-cancel">Abort</button>
        </div>
      </form>
    </div>

    <!-- Categories Table -->
    <div class="card table-card">
      <div class="card-header-ornament"></div>
      <h3>📚 Cataloged Subjects ({{ categories.length }})</h3>
      
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Registry ID</th>
              <th>Subject Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in categories" :key="cat.id">
              <td>#{{ cat.id }}</td>
              <td><strong>{{ cat.name }}</strong></td>
              <td class="action-buttons">
                <button @click="editCategory(cat)" class="btn-edit">Modify</button>
                <button @click="deleteCategory(cat.id)" class="btn-delete">Exile</button>
              </td>
            </tr>
            <tr v-if="categories.length === 0">
              <td colspan="3" class="no-data">📜 Alas, no subject archives are recorded yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const categories = ref([])
const categoryName = ref('')
const isEditing = ref(false)
const editId = ref(null)

// Fetch Categories
const fetchCategories = async () => {
  try {
    const res = await axios.get('/api/categories')
    if (res.data.success) categories.value = res.data.data
  } catch (err) {
    console.error('Error fetching categories:', err)
  }
}

// Save or Update Category
const saveCategory = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`/api/categories/${editId.value}`, { name: categoryName.value })
      alert('✨ Subject archive updated successfully!')
    } else {
      await axios.post('/api/categories', { name: categoryName.value })
      alert('✨ New subject registered into the archives!')
    }
    fetchCategories()
    resetForm()
  } catch (err) {
    alert(err.response?.data?.message || err.message)
  }
}

// Trigger Edit Mode
const editCategory = (cat) => {
  isEditing.value = true
  editId.value = cat.id
  categoryName.value = cat.name
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Delete Category
const deleteCategory = async (id) => {
  if (confirm('⚠️ Dost thou truly wish to exile this subject archive?')) {
    try {
      await axios.delete(`/api/categories/${id}`)
      fetchCategories()
    } catch (err) {
      alert('Failed to delete category')
    }
  }
}

// Reset Form
const resetForm = () => {
  isEditing.value = false
  editId.value = null
  categoryName.value = ''
}

onMounted(fetchCategories)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=IM+Fell+English:ital@0;1&family=Playfair+Display:wght@500;700;800&family=Cormorant+Garamond:wght@500;600;700&display=swap');

.page-container {
  padding: 40px 20px;
  background-color: #f3e7c9;
  background-image: 
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.24  0 0 0 0 0.1  0 0 0 0.16 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"),
    radial-gradient(ellipse at 20% 0%, rgba(176, 141, 60, 0.18), transparent 55%),
    radial-gradient(ellipse at 100% 100%, rgba(122, 31, 31, 0.1), transparent 50%);
  min-height: 85vh;
  font-family: 'IM Fell English', 'Cormorant Garamond', Georgia, serif;
  color: #2b1d0e;
  max-width: 1000px;
  margin: 0 auto;
}

.header-section {
  text-align: center;
  margin-bottom: 30px;
}

.emblem {
  font-size: 28px;
  color: #b08d3c;
  margin-bottom: 4px;
}

.header-section h2 {
  font-family: 'Playfair Display', serif;
  font-size: 32px;
  font-weight: 800;
  color: #4a2f14;
  margin: 0;
}

.subtitle {
  color: #6b5334;
  font-style: italic;
  font-size: 16px;
  margin-top: 6px;
}

.ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin: 14px auto 0;
  max-width: 220px;
}
.ornament span { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, #b08d3c, transparent); }
.ornament i { font-style: normal; color: #b08d3c; }

.card {
  background: #faf1d9;
  padding: 30px;
  border-radius: 4px;
  margin-bottom: 30px;
  box-shadow: 6px 10px 0 rgba(74, 47, 20, 0.25), 0 16px 30px -12px rgba(43, 29, 14, 0.4);
  border: 2px solid #4a2f14;
  position: relative;
}

.card h3 {
  font-family: 'Playfair Display', serif;
  color: #4a2f14;
  font-size: 22px;
  margin-top: 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #e3c776;
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 8px;
  color: #4a2f14;
}

.form-group input {
  width: 100%;
  padding: 12px;
  font-family: inherit;
  font-size: 16px;
  background: #f3e7c9;
  border: 1.5px solid #b08d3c;
  border-radius: 2px;
  box-sizing: border-box;
  color: #2b1d0e;
  outline: none;
  box-shadow: inset 0 1px 3px rgba(74, 47, 20, 0.15);
}
.form-group input:focus {
  border-color: #4a2f14;
  box-shadow: inset 0 1px 3px rgba(74, 47, 20, 0.2), 0 0 0 3px rgba(176, 141, 60, 0.25);
}

.form-actions {
  display: flex;
  gap: 12px;
}

.btn-submit, .btn-update, .btn-cancel {
  padding: 11px 22px;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-submit {
  background: linear-gradient(180deg, #2f4a33, #1a2e1e);
  color: #f6ead0;
  border: 2px solid #111d33;
  box-shadow: 0 3px 0 #111d33;
}
.btn-submit:hover { filter: brightness(1.1); transform: translateY(-1px); }

.btn-update {
  background: linear-gradient(180deg, #b08d3c, #8a6a22);
  color: #2b1d0e;
  border: 2px solid #6b5334;
  box-shadow: 0 3px 0 #6b5334;
}
.btn-update:hover { filter: brightness(1.1); transform: translateY(-1px); }

.btn-cancel {
  background: #6b5334;
  color: #f6ead0;
  border: 2px solid #4a2f14;
}
.btn-cancel:hover { background: #4a2f14; }

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.data-table th, .data-table td {
  padding: 14px;
  text-align: left;
  border-bottom: 1px solid #d4c297;
}

.data-table th {
  background-color: #e5d4a8;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  letter-spacing: 0.1em;
  color: #4a2f14;
  font-weight: 700;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn-edit, .btn-delete {
  padding: 6px 14px;
  font-family: 'Cinzel', serif;
  font-size: 11px;
  font-weight: 700;
  border-radius: 2px;
  cursor: pointer;
  border: 1px solid;
}

.btn-edit {
  background-color: #2b3a4a;
  color: #f6ead0;
  border-color: #1a232b;
}
.btn-edit:hover { background-color: #1a232b; }

.btn-delete {
  background-color: #7a1f1f;
  color: #f6ead0;
  border-color: #3a0c0c;
}
.btn-delete:hover { background-color: #5a1616; }

.no-data {
  text-align: center;
  color: #6b5334;
  font-style: italic;
  padding: 25px;
}
</style>