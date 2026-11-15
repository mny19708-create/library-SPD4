<template>
  <div class="page-container">
    <div class="header-section">
      <div class="emblem">📜</div>
      <h2>Scholar Registry &amp; Reading Annals</h2>
      <p class="subtitle">— Track scholar activities and reading progress across the realm —</p>
      <div class="ornament"><span></span><i>❦</i><span></span></div>
    </div>

    <!-- User Reading Progress Table Card -->
    <div class="card">
      <div class="card-header">
        <h3>📋 Scholar Progress Records</h3>
        <button @click="fetchUserProgress" class="btn-refresh">🔄 Consult Anew</button>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Registry ID</th>
              <th>Scholar Name</th>
              <th>Volume Title</th>
              <th>Current Page</th>
              <th>Reading Span</th>
              <th>Last Consulted</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="progress in userProgressList" :key="progress.id">
              <td>#{{ progress.id }}</td>
              <td><strong>{{ progress.user_name || 'Scholar #' + progress.user_id }}</strong></td>
              <td>{{ progress.ebook_title || 'Volume #' + progress.ebook_id }}</td>
              <td>Page {{ progress.current_page }}</td>
              <td><span class="time-chip">⏱️ {{ progress.reading_duration_minutes || 0 }} mins</span></td>
              <td class="date-cell">{{ new Date(progress.last_read_at).toLocaleString() }}</td>
            </tr>
            <tr v-if="userProgressList.length === 0">
              <td colspan="6" class="no-data">📜 Alas, no reading progress records available yet</td>
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

const userProgressList = ref([])

// Fetch User Reading Progress from Backend API
const fetchUserProgress = async () => {
  try {
    const res = await axios.get('/api/progress/admin/all')
    if (res.data.success) {
      userProgressList.value = res.data.data
    }
  } catch (err) {
    console.error('Error fetching user reading progress:', err)
  }
}

onMounted(fetchUserProgress)
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
  max-width: 1200px;
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
  border: 2px solid #4a2f14;
  box-shadow: 6px 10px 0 rgba(74, 47, 20, 0.25), 0 16px 30px -12px rgba(43, 29, 14, 0.4);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #e3c776;
  padding-bottom: 12px;
}

.card-header h3 {
  margin: 0;
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  color: #4a2f14;
}

.btn-refresh {
  background: linear-gradient(180deg, #b08d3c, #8a6a22);
  color: #2b1d0e;
  border: 2px solid #6b5334;
  padding: 8px 16px;
  border-radius: 3px;
  cursor: pointer;
  font-family: 'Cinzel', serif;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  box-shadow: 0 3px 0 #6b5334;
  transition: all 0.2s ease;
}

.btn-refresh:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

.table-responsive { overflow-x: auto; }

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, .data-table td {
  padding: 14px;
  text-align: left;
  border-bottom: 1px solid #d4c297;
}

.data-table th {
  background-color: #e5d4a8;
  font-family: 'Cinzel', serif;
  font-size: 11.5px;
  letter-spacing: 0.1em;
  color: #4a2f14;
  font-weight: 700;
}

.data-table tbody tr:hover {
  background: #f3e7c9;
}

.time-chip {
  padding: 3px 8px;
  font-size: 13px;
  font-style: italic;
  color: #6b5334;
  background: #faf1d9;
  border: 1px solid #b08d3c;
  border-radius: 2px;
}

.date-cell {
  color: #6b5334;
  font-style: italic;
  white-space: nowrap;
}

.no-data {
  text-align: center;
  color: #6b5334;
  font-style: italic;
  padding: 30px;
}
</style>