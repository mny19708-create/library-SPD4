
<template>
  <main class="dashboard" v-translate="locale" :data-locale="locale">
    <!-- Welcome Header -->
    <header class="welcome-card">
      <div class="welcome-content">
        <span class="welcome-label">
          <span class="sparkle">✦</span>
          បណ្ណាល័យឌីជីថល
        </span>

        <h1>សួស្ដី! រីករាយថ្ងៃសិក្សា <span>🌷</span></h1>

        <p>
          ចាប់ផ្ដើមថ្ងៃថ្មីជាមួយសៀវភៅល្អៗ និងកន្លែងសិក្សាដែលអ្នកចូលចិត្ត។
        </p>

        <div class="welcome-actions">
          <button class="primary-btn" @click="navigateTo('catalog')">
            <span>📚</span>
            ខ្ចីសៀវភៅ
            <span class="arrow">→</span>
          </button>

          <button class="secondary-btn" @click="navigateTo('rooms')">
            <span>🪑</span>
            កក់បន្ទប់សិក្សា
          </button>
        </div>
      </div>

      <div class="welcome-illustration" aria-hidden="true">
        <div class="illustration-circle">
          <span class="book book-one">📘</span>
          <span class="book book-two">📗</span>
          <span class="book book-three">📕</span>
          <span class="plant">🌿</span>
          <span class="floating-star star-one">✦</span>
          <span class="floating-star star-two">✧</span>
        </div>
      </div>
    </header>

    <!-- Statistics -->
    <section class="stats-grid" aria-label="ស្ថិតិបណ្ណាល័យ">
      <article class="stat-card green-card">
        <div class="stat-top">
          <div class="stat-icon green-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9"/>
              <path d="M12 7v5l3 2"/>
            </svg>
          </div>
          <span class="trend positive">↗ 12%</span>
        </div>
        <p class="stat-label">ម៉ោងសិក្សា</p>
        <h2>12.5 <small>ម៉ោង</small></h2>
        <p class="stat-description">អ្នកកំពុងខិតខំបានល្អ 🌱</p>
        <div class="mini-bars">
          <i v-for="(bar, i) in miniBars" :key="i"
             :style="{ height: bar + '%' }"></i>
        </div>
      </article>

      <article class="stat-card coral-card">
        <div class="stat-top">
          <div class="stat-icon coral-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"/>
              <path d="M4 5.5V21M8 7h8M8 11h7"/>
            </svg>
          </div>
          <span class="trend coral-trend">📖 អ្នកអាន</span>
        </div>
        <p class="stat-label">សៀវភៅដែលបានអាន</p>
        <h2>8 <small>ក្បាល</small></h2>
        <p class="stat-description">កំពុងខ្ចី 2 ក្បាល</p>
        <div class="stat-progress">
          <span style="width: 68%"></span>
        </div>
        <p class="progress-caption">គោលដៅប្រចាំខែ 68%</p>
      </article>

      <article class="stat-card gold-card">
        <div class="stat-top">
          <div class="stat-icon gold-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>
            </svg>
          </div>
          <span class="trend gold-trend">🏆 រង្វាន់</span>
        </div>
        <p class="stat-label">ពិន្ទុសិក្សា</p>
        <h2>1,240 <small>ពិន្ទុ</small></h2>
        <p class="stat-description">ខ្វះ 260 ពិន្ទុដល់រង្វាន់បន្ទាប់</p>
        <div class="stat-progress gold-progress">
          <span style="width: 82%"></span>
        </div>
        <p class="progress-caption">រង្វាន់បន្ទាប់ 82%</p>
      </article>
    </section>

    <!-- Analytics -->
    <section class="main-grid">
      <article class="panel analytics-panel">
        <div class="panel-header">
          <div>
            <span class="section-eyebrow">OVERVIEW</span>
            <h2>ស្ថិតិការប្រើប្រាស់បន្ទប់</h2>
            <p>ការប្រើប្រាស់កន្លែងសិក្សាប្រចាំសប្ដាហ៍</p>
          </div>

          <span class="sample-badge">● ទិន្នន័យគំរូ</span>
        </div>

        <div class="chart-legend">
          <span><i class="legend-dot booked-dot"></i> ម៉ោងបានកក់</span>
          <span><i class="legend-dot free-dot"></i> កន្លែងនៅសល់</span>
        </div>

        <div class="chart">
          <div class="y-axis">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>
          </div>

          <div class="chart-area">
            <div class="grid-lines">
              <i v-for="n in 5" :key="n"></i>
            </div>

            <div class="chart-columns">
              <div class="chart-day"
                   v-for="day in chartData"
                   :key="day.label">
                <div class="bar-pair">
                  <div class="bar free-bar"
                       :style="{ height: day.free + '%' }"></div>
                  <div class="bar booked-bar"
                       :style="{ height: day.booked + '%' }"></div>
                </div>
                <span>{{ day.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="analytics-footer">
          <div>
            <span class="footer-label">ការប្រើប្រាស់ជាមធ្យម</span>
            <strong>68%</strong>
          </div>
          <span class="footer-trend">↗ 8% ធៀបនឹងសប្ដាហ៍មុន</span>
        </div>
      </article>

      <!-- Popular Hours -->
      <article class="panel hours-panel">
        <div class="panel-header">
          <div>
            <span class="section-eyebrow">POPULAR TIME</span>
            <h2>ម៉ោងសិក្សាពេញនិយម</h2>
            <p>ពេលវេលាដែលមានអ្នកសិក្សាច្រើន</p>
          </div>
          <span class="time-icon">🕒</span>
        </div>

        <div class="hours-list">
          <div class="hour-item"
               v-for="hour in popularHours"
               :key="hour.label">
            <div class="hour-label">
              <span>{{ hour.label }}</span>
              <strong>{{ hour.value }}%</strong>
            </div>
            <div class="hour-track">
              <span :style="{ width: hour.value + '%' }"
                    :class="{ peak: hour.value >= 90 }"></span>
            </div>
          </div>
        </div>

        <div class="quiet-note">
          <span class="quiet-emoji">🌿</span>
          <div>
            <strong>ចង់សិក្សាដោយស្ងប់ស្ងាត់?</strong>
            <p>អាចមានកន្លែងទំនេរនៅជាន់ទី ២។</p>
          </div>
        </div>
      </article>
    </section>

    <!-- Book Recommendations -->
    <section class="panel books-panel">
      <div class="panel-header">
        <div>
          <span class="section-eyebrow">YOUR NEXT READ</span>
          <h2>សៀវភៅណែនាំសម្រាប់អ្នក 💚</h2>
          <p>ជ្រើសរើសសៀវភៅដែលអ្នកចង់អានបន្ទាប់</p>
        </div>

        <button class="text-link" @click="navigateTo('catalog')">
          មើលសៀវភៅទាំងអស់ →
        </button>
      </div>

      <div class="book-grid">
        <article class="book-card" v-for="book in recommendedBooks"
                 :key="book.id">
          <div class="book-cover" :class="book.color">
            <span class="book-decoration">{{ book.emoji }}</span>
            <span class="book-category">{{ book.category }}</span>
            <strong data-no-translate>{{ book.title }}</strong>
            <span class="cover-subtitle">{{ book.subtitle }}</span>
          </div>

          <div class="book-details">
            <h3 data-no-translate>{{ book.title }}</h3>
            <p data-no-translate>{{ book.author }}</p>

            <div class="book-bottom">
              <span class="available">
                <i></i> {{ book.available ? 'មានសៀវភៅ' : 'អស់សៀវភៅ' }}
              </span>

              <button
                class="borrow-btn"
                :disabled="!book.available"
                @click="borrowBook(book)"
              >
                {{ book.available ? 'ខ្ចីសៀវភៅ +' : 'អស់ស្តុក' }}
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- Schedule -->
    <section class="bottom-grid">
      <article class="panel schedule-panel">
        <div class="panel-header">
          <div>
            <span class="section-eyebrow">UPCOMING</span>
            <h2>កាលវិភាគបន្ទាប់ 📅</h2>
            <p>គម្រោងសិក្សារបស់អ្នក</p>
          </div>

          <button class="text-link" @click="navigateTo('rooms')">
            មើលទាំងអស់ →
          </button>
        </div>

        <div class="booking-row">
          <div class="date-tile">
            <strong>14</strong>
            <span>តុលា</span>
          </div>

          <div class="booking-info">
            <strong>បន្ទប់ស្ងប់ស្ងាត់ · 2B</strong>
            <p>🕑 ម៉ោង ២–៤ រសៀល</p>
            <span>📍 អគារខាងកើត · ជាន់ទី ២</span>
          </div>

          <span class="confirmed-badge">✓ បានបញ្ជាក់</span>
        </div>
      </article>

      <article class="streak-card">
        <div class="streak-top">
          <span class="streak-emoji">🌟</span>
          <span class="streak-tag">STUDY STREAK</span>
        </div>

        <h2>អ្នកកំពុងខិតខំបានល្អ!</h2>
        <p>ការសិក្សាបន្តិចម្តងៗរាល់ថ្ងៃ នឹងនាំអ្នកទៅកាន់គោលដៅ។</p>

        <div class="streak-count">
          <strong>4</strong>
          <span>ថ្ងៃជាប់គ្នា 🔥</span>
        </div>

        <div class="week-dots">
          <div v-for="day in weekDays" :key="day.label"
               class="week-day">
            <span :class="{ completed: day.done }">
              {{ day.done ? '✓' : '·' }}
            </span>
            <small>{{ day.label }}</small>
          </div>
        </div>
      </article>
    </section>

    <!-- Borrow confirmation dialog -->
    <div v-if="selectedBook"
         class="modal-backdrop"
         @click.self="selectedBook = null"
         @keydown.esc="selectedBook = null">
      <section class="borrow-modal"
               role="dialog"
               aria-modal="true"
               aria-labelledby="borrow-title">
        <button class="modal-close" @click="selectedBook = null"
                aria-label="បិទ">×</button>

        <div class="modal-icon">📚</div>
        <span class="section-eyebrow">BOOK REQUEST</span>
        <h2 id="borrow-title">ស្នើសុំខ្ចីសៀវភៅ</h2>
        <p class="modal-description">
          អ្នកបានជ្រើសរើសសៀវភៅ «{{ selectedBook.title }}»
        </p>

        <div class="selected-book">
          <span>{{ selectedBook.emoji }}</span>
          <div>
            <strong>{{ selectedBook.title }}</strong>
            <p>{{ selectedBook.author }}</p>
          </div>
        </div>

        <label class="form-label" for="borrow-date">ថ្ងៃត្រូវការខ្ចី</label>
        <input id="borrow-date" v-model="borrowDate"
               type="date" class="date-input"
               :min="today" required />

        <label class="form-label" for="borrow-duration">រយៈពេលខ្ចី</label>
        <select id="borrow-duration" v-model="borrowDuration"
                class="date-input">
          <option value="7">7 ថ្ងៃ</option>
          <option value="14">14 ថ្ងៃ</option>
          <option value="21">21 ថ្ងៃ</option>
        </select>

        <p v-if="formError" class="form-error">{{ formError }}</p>

        <button class="primary-btn modal-submit" @click="submitBorrow">
          បញ្ជាក់ការស្នើសុំ <span>✓</span>
        </button>

        <button class="modal-cancel" @click="selectedBook = null">
          បោះបង់
        </button>
      </section>
    </div>

    <!-- Success notification -->
    <div v-if="successMessage" class="toast" role="status">
      <span>🎉</span>
      <div>
        <strong>ជោគជ័យ!</strong>
        <p>{{ successMessage }}</p>
      </div>
      <button @click="successMessage = ''" aria-label="បិទ">×</button>
    </div>
  </main>
</template>

<script setup>
import { inject, ref } from 'vue';

const emit = defineEmits(['navigate']);
const locale = inject('locale');

const miniBars = [36, 51, 42, 73, 57, 84, 63];

const chartData = [
  { label: 'ចន្ទ', free: 62, booked: 38 },
  { label: 'អង្គារ', free: 78, booked: 52 },
  { label: 'ពុធ', free: 56, booked: 34 },
  { label: 'ព្រហស្បតិ៍', free: 91, booked: 71 },
  { label: 'សុក្រ', free: 73, booked: 57 },
  { label: 'សៅរ៍', free: 49, booked: 40 },
  { label: 'អាទិត្យ', free: 38, booked: 26 },
];

const popularHours = [
  { label: '១០ ព្រឹក', value: 42 },
  { label: '១២ ថ្ងៃ', value: 64 },
  { label: '២ រសៀល', value: 92 },
  { label: '៤ រសៀល', value: 78 },
  { label: '៦ ល្ងាច', value: 53 },
];

const recommendedBooks = ref([
  {
    id: 1,
    title: 'ទម្លាប់ល្អ',
    subtitle: 'BUILD GOOD HABITS',
    author: 'សៀវភៅអភិវឌ្ឍខ្លួន',
    category: 'SELF GROWTH',
    emoji: '🌱',
    color: 'cover-green',
    available: true,
  },
  {
    id: 2,
    title: 'សិល្បៈនៃការគិត',
    subtitle: 'THINK BETTER',
    author: 'សៀវភៅចំណេះដឹង',
    category: 'KNOWLEDGE',
    emoji: '💡',
    color: 'cover-yellow',
    available: true,
  },
  {
    id: 3,
    title: 'ពិភពវិទ្យាសាស្ត្រ',
    subtitle: 'EXPLORE SCIENCE',
    author: 'សៀវភៅវិទ្យាសាស្ត្រ',
    category: 'SCIENCE',
    emoji: '🔭',
    color: 'cover-blue',
    available: true,
  },
  {
    id: 4,
    title: 'រឿងនិទាន',
    subtitle: 'STORIES & DREAMS',
    author: 'សៀវភៅអានកម្សាន្ត',
    category: 'STORIES',
    emoji: '🦋',
    color: 'cover-pink',
    available: true,
  },
]);

const weekDays = [
  { label: 'ចន្ទ', done: true },
  { label: 'អង្គារ', done: true },
  { label: 'ពុធ', done: true },
  { label: 'ព្រហស្បតិ៍', done: true },
  { label: 'សុក្រ', done: false },
  { label: 'សៅរ៍', done: false },
  { label: 'អាទិត្យ', done: false },
];

const selectedBook = ref(null);
const borrowDate = ref('');
const borrowDuration = ref('7');
const formError = ref('');
const successMessage = ref('');

const today = new Date().toLocaleDateString('en-CA');

function navigateTo(page) {
  emit('navigate', page);
}

function borrowBook(book) {
  if (!book.available) return;

  selectedBook.value = book;
  borrowDate.value = today;
  borrowDuration.value = '7';
  formError.value = '';
  successMessage.value = '';
}

function submitBorrow() {
  if (!selectedBook.value) return;

  if (!borrowDate.value || borrowDate.value < today) {
    formError.value = 'សូមជ្រើសរើសថ្ងៃខ្ចីឱ្យបានត្រឹមត្រូវ។';
    return;
  }

  const bookTitle = selectedBook.value.title;
  const duration = borrowDuration.value;

  // Demo only: connect this action to your backend/API
  // when the real borrowing system is available.
  successMessage.value =
    `បានកត់ត្រាសំណើខ្ចី «${bookTitle}» រយៈពេល ${duration} ថ្ងៃ។`;

  selectedBook.value = null;
}
</script>

<style scoped>
.dashboard {
  --green: #34734a;
  --green-dark: #245b37;
  --green-light: #eaf5ec;
  --text: #24382a;
  --muted: #849087;
  --border: #e7eee8;

  display: grid;
  gap: 24px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 8px;
  color: var(--text);
  box-sizing: border-box;
  font-family: inherit;
}

.dashboard * {
  box-sizing: border-box;
}

button,
input,
select {
  font: inherit;
}

button {
  -webkit-tap-highlight-color: transparent;
}

.welcome-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 250px;
  padding: 34px 38px;
  overflow: hidden;
  border: 1px solid #dcecdf;
  border-radius: 24px;
  background: linear-gradient(120deg, #f0f9f0, #fffaf0);
}

.welcome-content {
  position: relative;
  z-index: 1;
  max-width: 650px;
}

.welcome-label,
.section-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--green);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
}

.sparkle {
  font-size: 17px;
}

.welcome-card h1 {
  margin: 17px 0 10px;
  color: #23442e;
  font-size: clamp(22px, 3vw, 32px);
  line-height: 1.5;
  font-weight: 800;
}

.welcome-card h1 span {
  display: inline-block;
  animation: flower-wave 2.5s ease-in-out infinite;
}

.welcome-card p {
  max-width: 530px;
  margin: 0;
  color: #758278;
  font-size: 13px;
  line-height: 1.9;
}

.welcome-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 23px;
}

.primary-btn,
.secondary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 45px;
  padding: 12px 18px;
  border-radius: 13px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: transform .2s, box-shadow .2s, background .2s;
}

.primary-btn {
  border: 1px solid var(--green);
  background: var(--green);
  color: white;
  box-shadow: 0 6px 15px #34734a24;
}

.primary-btn:hover {
  transform: translateY(-2px);
  background: var(--green-dark);
  box-shadow: 0 9px 22px #34734a35;
}

.secondary-btn {
  border: 1px solid #dce8dd;
  background: #ffffffb8;
  color: var(--green-dark);
}

.secondary-btn:hover {
  background: white;
  transform: translateY(-2px);
}

.arrow {
  font-size: 17px;
}

.welcome-illustration {
  flex: 0 0 210px;
}

.illustration-circle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 190px;
  height: 190px;
  margin: auto;
  border: 1px solid #d8ead8;
  border-radius: 50%;
  background: #ffffff7a;
}

.book {
  position: absolute;
  display: grid;
  width: 64px;
  height: 95px;
  place-items: center;
  border-radius: 9px;
  font-size: 45px;
  filter: drop-shadow(0 8px 7px #284a2c17);
}

.book-one {
  transform: translate(-33px, 7px) rotate(-15deg);
}

.book-two {
  transform: translate(20px, -4px) rotate(9deg);
}

.book-three {
  transform: translate(0, 23px) rotate(3deg);
}

.plant {
  position: absolute;
  right: 7px;
  bottom: 20px;
  font-size: 40px;
}

.floating-star {
  position: absolute;
  color: #c79e45;
  font-size: 27px;
}

.star-one {
  top: 23px;
  left: 24px;
}

.star-two {
  top: 43px;
  right: 19px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.stat-card,
.panel {
  min-width: 0;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: white;
  box-shadow: 0 5px 20px #233b2a08;
  transition: transform .22s, box-shadow .22s, border-color .22s;
}

.stat-card:hover,
.panel:hover {
  transform: translateY(-3px);
  border-color: #d3e6d6;
  box-shadow: 0 12px 28px #233b2a0e;
}

.stat-card {
  position: relative;
  min-height: 205px;
  padding: 22px;
  overflow: hidden;
}

.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.stat-icon {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: 15px;
}

.stat-icon svg {
  width: 23px;
  height: 23px;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.green-icon {
  background: #e6f5e8;
  color: #34734a;
}

.coral-icon {
  background: #fff0e9;
  color: #ce7655;
}

.gold-icon {
  background: #fff5d9;
  color: #b18a34;
}

.trend {
  padding: 6px 9px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
}

.positive {
  background: #e9f7eb;
  color: #34734a;
}

.coral-trend {
  background: #fff1eb;
  color: #c16c4d;
}

.gold-trend {
  background: #fff6df;
  color: #9d782d;
}

.stat-label {
  margin: 17px 0 3px;
  color: #7e8b81;
  font-size: 12px;
  font-weight: 600;
}

.stat-card h2 {
  margin: 0;
  color: #263d2d;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -.8px;
}

.stat-card h2 small {
  color: #8a958d;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0;
}

.stat-description {
  margin: 6px 0 0;
  color: #829087;
  font-size: 10px;
  line-height: 1.7;
}

.mini-bars {
  position: absolute;
  right: 22px;
  bottom: 23px;
  display: flex;
  align-items: end;
  gap: 5px;
  height: 39px;
}

.mini-bars i {
  width: 7px;
  border-radius: 5px 5px 2px 2px;
  background: #c7e6cb;
}

.stat-progress {
  height: 6px;
  margin-top: 13px;
  overflow: hidden;
  border-radius: 20px;
  background: #edf2ed;
}

.stat-progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #83b78c;
}

.gold-progress span {
  background: #d7b15b;
}

.progress-caption {
  margin: 7px 0 0;
  color: #8a958d;
  font-size: 9px;
}

.main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(270px, .85fr);
  gap: 20px;
}

.panel {
  padding: 24px;
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
}

.section-eyebrow {
  margin-bottom: 8px;
  font-size: 9px;
}

.panel-header h2 {
  margin: 0;
  color: #263d2d;
  font-size: 16px;
  line-height: 1.6;
  font-weight: 800;
}

.panel-header p {
  margin: 4px 0 0;
  color: #8a958d;
  font-size: 11px;
  line-height: 1.8;
}

.sample-badge {
  flex: 0 0 auto;
  padding: 7px 10px;
  border: 1px solid #e5eee6;
  border-radius: 10px;
  color: #76877a;
  font-size: 9px;
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 25px;
}

.chart-legend span {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #7e8b81;
  font-size: 10px;
}

.legend-dot {
  width: 9px;
  height: 9px;
  border-radius: 3px;
}

.booked-dot {
  background: #34734a;
}

.free-dot {
  background: #d8eadb;
}

.chart {
  display: flex;
  height: 195px;
  gap: 12px;
  margin-top: 20px;
}

.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 25px;
  color: #a0aaa2;
  font-size: 9px;
}

.chart-area {
  position: relative;
  flex: 1;
  min-width: 0;
}

.grid-lines {
  position: absolute;
  inset: 3px 0 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.grid-lines i {
  border-top: 1px dashed #e9efe9;
}

.chart-columns {
  position: absolute;
  inset: 3px 0 0;
  display: flex;
  justify-content: space-around;
  gap: 3px;
}

.chart-day {
  z-index: 1;
  display: flex;
  width: 13%;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  gap: 9px;
  color: #839087;
  font-size: 9px;
}

.chart-day > span {
  white-space: nowrap;
}

.bar-pair {
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 145px;
}

.bar {
  width: 11px;
  max-height: 100%;
  border-radius: 5px 5px 2px 2px;
  transition: height .4s ease;
}

.free-bar {
  background: #d8eadb;
}

.booked-bar {
  background: #34734a;
}

.analytics-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
  padding-top: 17px;
  border-top: 1px solid #edf2ed;
}

.analytics-footer > div {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-label {
  color: #839087;
  font-size: 10px;
}

.analytics-footer strong {
  color: #34734a;
  font-size: 19px;
}

.footer-trend {
  color: #34734a;
  font-size: 10px;
  font-weight: 700;
}

.time-icon {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 14px;
  background: #fff4e8;
  font-size: 21px;
}

.hours-list {
  display: grid;
  gap: 21px;
  margin-top: 28px;
}

.hour-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 9px;
  color: #647268;
  font-size: 11px;
}

.hour-label strong {
  color: #34734a;
  font-size: 10px;
}

.hour-track {
  height: 9px;
  overflow: hidden;
  border-radius: 20px;
  background: #edf3ed;
}

.hour-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #a9cdb0;
  transition: width .5s ease;
}

.hour-track span.peak {
  background: linear-gradient(90deg, #34734a, #6baa78);
}

.quiet-note {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 28px;
  padding: 15px;
  border: 1px solid #dcecdf;
  border-radius: 14px;
  background: #f0f8f0;
}

.quiet-emoji {
  font-size: 27px;
}

.quiet-note strong {
  color: #356b43;
  font-size: 11px;
}

.quiet-note p {
  margin: 5px 0 0;
  color: #819084;
  font-size: 10px;
  line-height: 1.7;
}

.books-panel {
  overflow: hidden;
}

.text-link {
  flex: 0 0 auto;
  padding: 9px 11px;
  border: 0;
  border-radius: 10px;
  background: #edf7ef;
  color: #34734a;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: background .2s;
}

.text-link:hover {
  background: #dcefe0;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 17px;
  margin-top: 24px;
}

.book-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid #e9efe9;
  border-radius: 15px;
  background: white;
  transition: transform .2s, box-shadow .2s;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 9px 22px #233b2a12;
}

.book-cover {
  position: relative;
  display: flex;
  min-height: 150px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 7px;
  padding: 17px;
  overflow: hidden;
}

.cover-green {
  background: linear-gradient(145deg, #e4f3e4, #cce5ce);
  color: #285c36;
}

.cover-yellow {
  background: linear-gradient(145deg, #fff4d8, #f4e3ad);
  color: #886523;
}

.cover-blue {
  background: linear-gradient(145deg, #e3f0fc, #c6dff5);
  color: #345e87;
}

.cover-pink {
  background: linear-gradient(145deg, #ffedf0, #f6d5e2);
  color: #a24c70;
}

.book-decoration {
  position: absolute;
  top: 15px;
  right: 13px;
  font-size: 35px;
  opacity: .85;
}

.book-category {
  max-width: 100%;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: .7px;
}

.book-cover > strong {
  max-width: 100%;
  font-size: 15px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.cover-subtitle {
  font-size: 8px;
  font-weight: 700;
  letter-spacing: .3px;
}

.book-details {
  padding: 14px;
}

.book-details h3 {
  margin: 0;
  color: #2c4031;
  font-size: 12px;
  line-height: 1.8;
}

.book-details > p {
  margin: 3px 0 13px;
  color: #8a958d;
  font-size: 10px;
}

.book-bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 9px;
}

.available {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #62816a;
  font-size: 9px;
}

.available i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #65ad75;
}

.borrow-btn {
  padding: 8px 10px;
  border: 1px solid #dcecdf;
  border-radius: 9px;
  background: #eff8ef;
  color: #34734a;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
}

.borrow-btn:hover:not(:disabled) {
  background: #dcefe0;
}

.borrow-btn:disabled {
  cursor: not-allowed;
  opacity: .5;
}

.bottom-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(260px, .8fr);
  gap: 20px;
}

.booking-row {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 22px;
  padding-top: 20px;
  border-top: 1px solid #edf2ed;
}

.date-tile {
  display: flex;
  width: 58px;
  height: 65px;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #f4ded4;
  border-radius: 14px;
  background: #fff2eb;
  color: #bd7053;
}

.date-tile strong {
  font-size: 23px;
  line-height: 1.2;
}

.date-tile span {
  margin-top: 3px;
  font-size: 10px;
  font-weight: 700;
}

.booking-info {
  display: grid;
  min-width: 0;
  gap: 6px;
}

.booking-info strong {
  color: #2b4130;
  font-size: 12px;
}

.booking-info p,
.booking-info > span {
  margin: 0;
  color: #839087;
  font-size: 10px;
  line-height: 1.7;
}

.confirmed-badge {
  margin-left: auto;
  padding: 8px 10px;
  border: 1px solid #d6ead8;
  border-radius: 20px;
  background: #edf8ef;
  color: #34734a;
  font-size: 9px;
  font-weight: 700;
  white-space: nowrap;
}

.streak-card {
  padding: 25px;
  border: 1px solid #f0e5c9;
  border-radius: 20px;
  background: linear-gradient(145deg, #fffdf6, #fff5dd);
}

.streak-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.streak-emoji {
  font-size: 29px;
}

.streak-tag {
  padding: 7px 9px;
  border-radius: 9px;
  background: #fff0c9;
  color: #a17b30;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: .8px;
}

.streak-card h2 {
  margin: 18px 0 7px;
  color: #68532b;
  font-size: 16px;
}

.streak-card > p {
  margin: 0;
  color: #948260;
  font-size: 11px;
  line-height: 1.9;
}

.streak-count {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-top: 17px;
}

.streak-count strong {
  color: #b58a35;
  font-size: 37px;
  font-weight: 800;
}

.streak-count span {
  color: #8b754b;
  font-size: 11px;
}

.week-dots {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 15px;
}

.week-day {
  display: grid;
  justify-items: center;
  gap: 7px;
}

.week-day > span {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border: 1px solid #efdfb8;
  border-radius: 10px;
  background: #fffaf0;
  color: #c4a56a;
  font-size: 12px;
}

.week-day > span.completed {
  border-color: #e5c77f;
  background: #f5dfa0;
  color: #8e6c26;
}

.week-day small {
  color: #9b8967;
  font-size: 9px;
}

/* Borrow dialog */
.modal-backdrop {
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 20px;
  overflow-y: auto;
  background: #14251bc0;
  backdrop-filter: blur(5px);
}

.borrow-modal {
  position: relative;
  width: 100%;
  max-width: 430px;
  margin: auto;
  padding: 30px;
  border: 1px solid #e3eee4;
  border-radius: 24px;
  background: white;
  box-shadow: 0 25px 80px #10201630;
  animation: modal-in .22s ease-out;
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 17px;
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 0;
  border-radius: 10px;
  background: #f0f5f0;
  color: #506654;
  font-size: 24px;
  cursor: pointer;
}

.modal-icon {
  display: grid;
  width: 60px;
  height: 60px;
  place-items: center;
  margin-bottom: 20px;
  border-radius: 19px;
  background: #eaf6eb;
  font-size: 30px;
}

.borrow-modal h2 {
  margin: 0;
  color: #294331;
  font-size: 21px;
}

.modal-description {
  margin: 10px 0 20px;
  color: #829087;
  font-size: 12px;
  line-height: 1.8;
}

.selected-book {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
  padding: 14px;
  border: 1px solid #e4eee4;
  border-radius: 14px;
  background: #f7fbf7;
}

.selected-book > span {
  font-size: 30px;
}

.selected-book strong {
  color: #2d4934;
  font-size: 12px;
}

.selected-book p {
  margin: 5px 0 0;
  color: #879288;
  font-size: 10px;
}

.form-label {
  display: block;
  margin: 15px 0 8px;
  color: #4b5f50;
  font-size: 11px;
  font-weight: 700;
}

.date-input {
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid #dfe9df;
  border-radius: 11px;
  outline: none;
  background: white;
  color: #304636;
  font-size: 12px;
}

.date-input:focus {
  border-color: #70a77c;
  box-shadow: 0 0 0 3px #e6f4e8;
}

.form-error {
  color: #c34f4f;
  font-size: 11px;
}

.modal-submit {
  width: 100%;
  margin-top: 22px;
}

.modal-cancel {
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #7d8a80;
  font-size: 12px;
  cursor: pointer;
}

.modal-cancel:hover {
  background: #f4f7f4;
}

.toast {
  position: fixed;
  z-index: 1100;
  right: 24px;
  bottom: 24px;
  display: flex;
  align-items: center;
  gap: 13px;
  width: min(390px, calc(100vw - 32px));
  padding: 17px;
  border: 1px solid #d6ead8;
  border-radius: 16px;
  background: white;
  box-shadow: 0 12px 35px #1b35231c;
  animation: modal-in .25s ease-out;
}

.toast > span {
  font-size: 28px;
}

.toast strong {
  color: #34734a;
  font-size: 13px;
}

.toast p {
  margin: 5px 0 0;
  color: #758278;
  font-size: 11px;
  line-height: 1.7;
}

.toast button {
  align-self: flex-start;
  margin-left: auto;
  border: 0;
  background: transparent;
  color: #78857c;
  font-size: 20px;
  cursor: pointer;
}

@keyframes flower-wave {
  0%, 100% { transform: rotate(0); }
  50% { transform: rotate(12deg); }
}

@keyframes modal-in {
  from { opacity: 0; transform: translateY(10px) scale(.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@media (max-width: 1000px) {
  .welcome-card {
    padding: 27px;
  }

  .welcome-illustration {
    flex-basis: 160px;
  }

  .illustration-circle {
    width: 155px;
    height: 155px;
  }

  .main-grid,
  .bottom-grid {
    grid-template-columns: 1fr;
  }

  .book-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .dashboard {
    gap: 16px;
    padding: 2px;
  }

  .welcome-card {
    min-height: auto;
    padding: 23px 19px;
    border-radius: 19px;
  }

  .welcome-card h1 {
    font-size: 22px;
  }

  .welcome-card p {
    font-size: 12px;
  }

  .welcome-illustration {
    display: none;
  }

  .welcome-actions {
    gap: 9px;
  }

  .primary-btn,
  .secondary-btn {
    padding: 11px 12px;
    font-size: 11px;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 11px;
  }

  .stat-card {
    min-height: 190px;
    padding: 15px;
    border-radius: 16px;
  }

  .stat-card:last-child {
    grid-column: 1 / -1;
    min-height: 175px;
  }

  .stat-card h2 {
    font-size: 25px;
  }

  .stat-icon {
    width: 38px;
    height: 38px;
  }

  .trend {
    font-size: 8px;
  }

  .panel {
    padding: 18px 14px;
    border-radius: 17px;
  }

  .panel-header h2 {
    font-size: 14px;
  }

  .panel-header p {
    font-size: 10px;
  }

  .sample-badge {
    max-width: 100px;
    padding: 6px;
    font-size: 8px;
  }

  .chart {
    height: 175px;
    gap: 7px;
  }

  .bar-pair {
    height: 125px;
    gap: 3px;
  }

  .bar {
    width: 7px;
  }

  .chart-day {
    font-size: 8px;
  }

  .chart-day > span {
    font-size: 7px;
  }

  .chart-legend {
    gap: 11px;
  }

  .chart-legend span {
    font-size: 9px;
  }

  .footer-trend {
    font-size: 9px;
  }

  .book-grid {
    gap: 10px;
  }

  .book-cover {
    min-height: 130px;
    padding: 12px;
  }

  .book-cover > strong {
    font-size: 12px;
  }

  .book-decoration {
    font-size: 28px;
  }

  .book-details {
    padding: 11px;
  }

  .book-details h3 {
    font-size: 11px;
  }

  .book-bottom {
    align-items: flex-start;
    flex-direction: column;
  }

  .text-link {
    padding: 8px;
    font-size: 9px;
  }

  .booking-row {
    flex-wrap: wrap;
    gap: 12px;
  }

  .booking-info {
    flex: 1;
  }

  .confirmed-badge {
    margin-left: 70px;
  }

  .streak-card {
    padding: 21px;
  }

  .borrow-modal {
    padding: 23px;
    border-radius: 20px;
  }

  .toast {
    right: 16px;
    bottom: 16px;
  }
}

@media (max-width: 360px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card:last-child {
    grid-column: auto;
  }

  .welcome-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .book-grid {
    grid-template-columns: 1fr;
  }

  .book-cover {
    min-height: 155px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dashboard *,
  .dashboard *::before,
  .dashboard *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
</style>
