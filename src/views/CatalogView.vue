**CatalogPage.vue — Cute Library Design**

```vue
<template>
  <div class="catalog-page" v-translate="locale" :data-locale="locale">
    <!-- Cute Header -->
    <header class="hero">
      <div class="hero-content">
        <div class="welcome-badge">
          <span>✨</span> Welcome to Leafline Library
        </div>

        <h1>ស្វែងរកសៀវភៅដែលអ្នកស្រឡាញ់ <span>📚</span></h1>

        <p>
          រកឃើញចំណេះដឹងថ្មីៗ និងសៀវភៅល្អៗ
          ដែលកំពុងរង់ចាំអ្នកនៅទីនេះ។
        </p>

        <div class="hero-actions">
          <button class="explore-btn" @click="scrollToBooks">
            <span>🔍</span> ស្វែងរកសៀវភៅ
          </button>

          <button class="cart-btn" @click="goToCart">
            <span class="cart-icon">🛒</span>
            កន្ត្រករបស់ខ្ញុំ
            <span class="cart-count">{{ khmerNumber(cartCount) }}</span>
          </button>
        </div>
      </div>

      <div class="hero-decoration" aria-hidden="true">
        <div class="floating-book book-one">📕</div>
        <div class="floating-book book-two">📗</div>
        <div class="floating-book book-three">📘</div>
        <div class="hero-circle">🌷</div>
        <div class="hero-sparkle sparkle-one">✦</div>
        <div class="hero-sparkle sparkle-two">✧</div>
      </div>
    </header>

    <!-- Page Heading -->
    <section class="section-heading">
      <div>
        <span class="section-kicker">YOUR NEXT FAVORITE BOOK</span>
        <h2>ស្វែងរកសៀវភៅ <span>💚</span></h2>
        <p>ជ្រើសរើសសៀវភៅដែលអ្នកចង់អានថ្ងៃនេះ។</p>
      </div>

      <div class="status-badge">
        <span class="status-dot"></span>
        {{ demoMode ? 'ទិន្នន័យគំរូ' : 'ទិន្នន័យបណ្ណាល័យ' }}
      </div>
    </section>

    <!-- Search -->
    <section ref="booksSection" class="search-panel">
      <label class="search-box">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="ស្វែងរកចំណងជើង អ្នកនិពន្ធ ឬប្រភេទ..."
          autocomplete="off"
          @input="searchBooks"
        />
        <button
          v-if="searchQuery"
          class="clear-search"
          aria-label="សម្អាតការស្វែងរក"
          @click="clearSearch"
        >✕</button>
      </label>

      <button
        class="filter-button"
        :class="{ 'filter-active': showFilters }"
        @click="showFilters = !showFilters"
      >
        <span>🎚️</span> តម្រង
      </button>
    </section>

    <!-- Filters -->
    <section v-if="showFilters" class="filter-panel">
      <span class="filter-title">បង្ហាញសៀវភៅ៖</span>

      <button
        :class="{ active: availability === 'all' }"
        @click="availability = 'all'"
      >📚 ទាំងអស់</button>

      <button
        :class="{ active: availability === 'available' }"
        @click="availability = 'available'"
      >✅ មានក្នុងស្តុក</button>

      <button
        :class="{ active: availability === 'digital' }"
        @click="availability = 'digital'"
      >💻 ឌីជីថល</button>
    </section>

    <!-- Category Tabs -->
    <nav class="category-nav" aria-label="ប្រភេទសៀវភៅ">
      <button
        v-for="category in categories"
        :key="category"
        :class="{ active: activeCategory === category }"
        @click="activeCategory = category"
      >
        <span v-if="category === categories[0]">✨</span>
        <span v-else-if="category === 'ការរចនា'">🎨</span>
        <span v-else-if="category === 'វិទ្យាសាស្ត្រ'">🔬</span>
        <span v-else-if="category === 'ចិត្តវិទ្យា'">🧠</span>
        <span v-else>🌷</span>
        {{ category }}
      </button>
    </nav>

    <!-- Hold Summary -->
    <section v-if="activeHoldCount > 0" class="hold-banner">
      <div class="hold-emoji">🎁</div>
      <div class="hold-copy">
        <strong>អ្នកមានសៀវភៅកំពុងកក់ {{ khmerNumber(activeHoldCount) }} ក្បាល!</strong>
        <p>សូមមកទទួលសៀវភៅក្នុងរយៈពេល ២៤ ម៉ោង។</p>
      </div>
      <button @click="emit('navigate', 'loans')">
        មើលសៀវភៅកក់ <span>→</span>
      </button>
    </section>

    <!-- Notification -->
    <Transition name="notice">
      <div v-if="notice" class="notice-box" role="status">
        <span>💚</span>
        <p>{{ notice }}</p>
        <button aria-label="បិទសារ" @click="notice = ''">✕</button>
      </div>
    </Transition>

    <!-- Results Heading -->
    <div class="results-heading">
      <div>
        <h2>{{ searchQuery ? '🔍 លទ្ធផលស្វែងរក' : '🌟 សៀវភៅណែនាំ' }}</h2>
        <p>
          {{ searchQuery ? `សម្រាប់ “${searchQuery}”` : 'ស្វែងរកចំណេះដឹងថ្មីៗជាមួយយើង' }}
        </p>
      </div>

      <span class="result-count">
        {{ khmerNumber(filteredBooks.length) }} ចំណងជើង
      </span>
    </div>

    <!-- Book Grid -->
    <section class="book-grid" aria-label="បញ្ជីសៀវភៅ">
      <article
        v-for="(book, index) in filteredBooks"
        :key="book.id"
        class="book-card"
      >
        <div
          class="book-cover"
          :class="`cover-${Number(book.cover ?? index) % 4}`"
        >
          <span class="cover-top">✦ LEAFLINE LIBRARY ✦</span>
          <span class="cover-decoration">✿</span>
          <span class="cover-title" data-no-translate>{{ book.coverTitle ?? book.title }}</span>
          <span class="cover-author" data-no-translate>{{ book.author }}</span>
          <span class="cover-spine"></span>
          <span class="cover-sticker">BOOK<br />LOVE</span>
        </div>

        <div class="book-details">
          <div class="book-meta">
            <span class="book-category">
              {{ categoryLabel(book.category) }}
            </span>
            <span class="favorite-icon">♡</span>
          </div>

          <h3 data-no-translate :title="book.title">{{ book.title }}</h3>
          <p class="book-author" data-no-translate>✍️ {{ book.author }}</p>

          <div class="book-info">
            <span
              class="stock"
              :class="{ unavailable: Number(book.stock) < 1 }"
            >
              <span class="stock-dot"></span>
              {{
                Number(book.stock) > 0
                  ? `នៅសល់ ${khmerNumber(book.stock)} ក្បាល`
                  : 'អស់ពីស្តុក'
              }}
            </span>
          </div>

          <p class="book-shelf">📍 {{ book.shelf }}</p>

          <div class="book-actions">
            <button
              class="add-cart-btn"
              :disabled="Number(book.stock) < 1 || inCart(book.id)"
              @click="addToCart(book)"
            >
              <span>{{ inCart(book.id) ? '✓' : '🛒' }}</span>
              {{ inCart(book.id) ? 'ក្នុងកន្ត្រកហើយ' : 'ដាក់ក្នុងកន្ត្រក' }}
            </button>

            <button
              v-if="holdFor(book.id)"
              class="hold-button held-button"
              disabled
            >
              ✓ បានកក់
            </button>

            <button
              v-else
              class="hold-button"
              :disabled="Number(book.stock) < 1"
              @click="holdBook(book)"
            >
              📌 កក់ ២៤ ម៉ោង
            </button>
          </div>
        </div>
      </article>

      <!-- Loading -->
      <div v-if="loading" class="empty-results">
        <div class="empty-emoji">📖</div>
        <h3>កំពុងស្វែងរកសៀវភៅ...</h3>
        <p>សូមរង់ចាំបន្តិច 💚</p>
      </div>

      <!-- Empty -->
      <div
        v-else-if="!filteredBooks.length"
        class="empty-results"
      >
        <div class="empty-emoji">🔎</div>
        <h3>អូ៎! រកមិនឃើញសៀវភៅទេ</h3>
        <p>សាកល្បងប្តូរពាក្យស្វែងរក ឬជ្រើសរើសប្រភេទផ្សេង។</p>
        <button class="reset-btn" @click="resetFilters">
          ✨ សម្អាតការស្វែងរក
        </button>
      </div>
    </section>

    <!-- Footer Note -->
    <footer class="catalog-footer">
      <span class="footer-icon">💌</span>
      <div>
        <strong>អានសៀវភៅ បង្កើនចំណេះដឹង!</strong>
        <p>ការកក់សៀវភៅមានសុពលភាព ២៤ ម៉ោង។ សូមយកបណ្ណសម្គាល់និស្សិតទៅទទួលសៀវភៅ។</p>
      </div>
      <span class="footer-flower">🌼</span>
    </footer>
  </div>
</template>

<script setup>
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  ref
} from 'vue';

import api, { apiConfigured } from '@/services/api';

const emit = defineEmits(['navigate']);
const locale = inject('locale');

const sampleBooks = [
  {
    id: 'bk-1',
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    category: 'ការរចនា',
    stock: 3,
    shelf: '745.2 NOR',
    cover: 0
  },
  {
    id: 'bk-2',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    category: 'ចិត្តវិទ្យា',
    stock: 2,
    shelf: '153.4 KAH',
    cover: 1
  },
  {
    id: 'bk-3',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    category: 'វិទ្យាសាស្ត្រ',
    stock: 0,
    shelf: '523.1 HAW',
    cover: 2
  },
  {
    id: 'bk-4',
    title: 'Ways of Seeing',
    author: 'John Berger',
    category: 'សិល្បៈ និងវប្បធម៌',
    stock: 4,
    shelf: '701.1 BER',
    cover: 3
  },
  {
    id: 'bk-5',
    title: 'The Art of Statistics',
    author: 'David Spiegelhalter',
    category: 'វិទ្យាសាស្ត្រ',
    stock: 1,
    shelf: '519.5 SPI',
    cover: 2
  },
  {
    id: 'bk-6',
    title: 'The Creative Act',
    author: 'Rick Rubin',
    category: 'សិល្បៈ និងវប្បធម៌',
    stock: 5,
    shelf: '700 RUB',
    cover: 0
  }
];

const books = ref([...sampleBooks]);
const searchQuery = ref('');
const activeCategory = ref('សៀវភៅទាំងអស់');
const availability = ref('all');
const showFilters = ref(false);
const loading = ref(false);
const demoMode = ref(true);
const holds = ref([]);
const cart = ref([]);
const now = ref(Date.now());
const notice = ref('');
const booksSection = ref(null);

const categories = [
  'សៀវភៅទាំងអស់',
  'ការរចនា',
  'វិទ្យាសាស្ត្រ',
  'ចិត្តវិទ្យា',
  'សិល្បៈ និងវប្បធម៌'
];

let searchTimer;
let ticker;
let noticeTimer;

const cartCount = computed(() =>
  cart.value.reduce((total, item) => total + Number(item.quantity || 1), 0)
);

const activeHoldCount = computed(() =>
  holds.value.filter(
    hold => new Date(hold.expiresAt).getTime() > now.value
  ).length
);

const filteredBooks = computed(() =>
  books.value.filter(book => {
    const text = `${book.title} ${book.author} ${book.category}`.toLowerCase();

    const matchesText = text.includes(searchQuery.value.trim().toLowerCase());

    const matchesCategory =
      activeCategory.value === categories[0] ||
      book.category === activeCategory.value;

    const matchesAvailability =
      availability.value === 'all' ||
      (
        availability.value === 'available' &&
        Number(book.stock) > 0
      ) ||
      (
        availability.value === 'digital' &&
        book.format === 'digital'
      );

    return matchesText && matchesCategory && matchesAvailability;
  })
);

function khmerNumber(value) {
  return String(value).replace(
    /\d/g,
    digit => '០១២៣៤៥៦៧៨៩'[Number(digit)]
  );
}

function categoryLabel(category) {
  const labels = {
    Design: 'ការរចនា',
    Science: 'វិទ្យាសាស្ត្រ',
    Psychology: 'ចិត្តវិទ្យា',
    'Arts & culture': 'សិល្បៈ និងវប្បធម៌'
  };

  return labels[category] ?? category ?? 'ទូទៅ';
}

function saveHolds() {
  localStorage.setItem(
    'leafline_book_holds',
    JSON.stringify(holds.value)
  );
}

function saveCart() {
  localStorage.setItem(
    'leafline_book_cart',
    JSON.stringify(cart.value)
  );
  window.dispatchEvent(new Event('leafline-cart-updated'));
}

function inCart(bookId) {
  return cart.value.some(
    item => String(item.id) === String(bookId)
  );
}

function addToCart(book) {
  if (Number(book.stock) < 1 || inCart(book.id)) return;

  cart.value.unshift({
    id: book.id,
    title: book.title,
    author: book.author,
    category: book.category,
    cover: book.cover,
    shelf: book.shelf,
    quantity: 1,
    addedAt: new Date().toISOString()
  });

  saveCart();
  notify(`បានបន្ថែម “${book.title}” ទៅក្នុងកន្ត្រកហើយ! 🛒`);
}

function goToCart() {
  emit('navigate', 'cart');
}

function holdFor(bookId) {
  return holds.value.find(
    hold =>
      String(hold.bookId) === String(bookId) &&
      new Date(hold.expiresAt).getTime() > now.value
  );
}

function holdRemaining(hold) {
  const remaining = Math.max(
    0,
    new Date(hold.expiresAt).getTime() - now.value
  );

  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);

  return `${khmerNumber(hours)} ម៉ោង ${khmerNumber(
    String(minutes).padStart(2, '0')
  )} នាទី`;
}

function notify(message) {
  notice.value = message;
  window.clearTimeout(noticeTimer);

  noticeTimer = window.setTimeout(() => {
    notice.value = '';
  }, 4000);
}

function scrollToBooks() {
  booksSection.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
}

function clearSearch() {
  searchQuery.value = '';
  searchBooks();
}

function resetFilters() {
  searchQuery.value = '';
  activeCategory.value = categories[0];
  availability.value = 'all';
  showFilters.value = false;
  searchBooks();
}

function persistBooks(data) {
  books.value = data.map((book, index) => ({
    ...book,
    id: book.id ?? `remote-${index}`,
    title: book.title ?? 'មិនស្គាល់ចំណងជើង',
    author: book.author ?? 'មិនស្គាល់អ្នកនិពន្ធ',
    category: categoryLabel(book.category ?? 'ផ្សេងៗ'),
    stock: Number(book.stock ?? book.available_copies ?? 0),
    shelf: book.shelf ?? 'សួរនៅតុបណ្ណារក្ស',
    cover: index % 4
  }));
}

function searchBooks() {
  window.clearTimeout(searchTimer);

  if (searchQuery.value.trim().length < 2 || !apiConfigured) {
    books.value = [...sampleBooks];
    demoMode.value = true;
    loading.value = false;
    return;
  }

  const query = searchQuery.value.trim();
  loading.value = true;

  searchTimer = window.setTimeout(async () => {
    try {
      const { data } = await api.get('/books/search', {
        params: { q: query }
      });

      if (Array.isArray(data)) {
        persistBooks(data);
        demoMode.value = false;
      }
    } catch {
      books.value = [...sampleBooks];
      demoMode.value = true;
    } finally {
      loading.value = false;
    }
  }, 250);
}

async function holdBook(book) {
  if (Number(book.stock) < 1 || holdFor(book.id)) return;

  let expiresAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  ).toISOString();

  if (apiConfigured) {
    try {
      const { data } = await api.post('/books/hold', {
        book_id: book.id
      });
      if (data?.expires_at) {
        expiresAt = data.expires_at;
      }
    } catch (error) {
      console.error('Unable to place book hold:', error);
      notify('មិនអាចកក់សៀវភៅបានទេ។ សូមពិនិត្យការតភ្ជាប់ ហើយព្យាយាមម្ដងទៀត។');
      return;
    }
  }

  holds.value = [
    ...holds.value.filter(
      hold => String(hold.bookId) !== String(book.id)
    ),
    {
      bookId: book.id,
      title: book.title,
      author: book.author,
      expiresAt
    }
  ];

  saveHolds();
  notify(`បានកក់ “${book.title}” សម្រាប់អ្នករយៈពេល ២៤ ម៉ោង។ 🎁`);
}

function loadCart() {
  try {
    const saved = JSON.parse(
      localStorage.getItem('leafline_book_cart') || '[]'
    );

    cart.value = Array.isArray(saved) ? saved : [];
  } catch {
    cart.value = [];
  }
}

function loadHolds() {
  try {
    const saved = JSON.parse(
      localStorage.getItem('leafline_book_holds') || '[]'
    );

    holds.value = Array.isArray(saved)
      ? saved.filter(
          hold => new Date(hold.expiresAt).getTime() > Date.now()
        )
      : [];

    saveHolds();
  } catch {
    holds.value = [];
  }
}

async function loadBooks() {
  if (!apiConfigured) return;

  try {
    const { data } = await api.get('/books');

    if (Array.isArray(data) && data.length) {
      persistBooks(data);
      demoMode.value = false;
    }
  } catch {
    demoMode.value = true;
  }
}

function refreshCart() {
  loadCart();
}

onMounted(() => {
  loadCart();
  loadHolds();
  loadBooks();

  window.addEventListener('storage', refreshCart);

  ticker = window.setInterval(() => {
    now.value = Date.now();

    holds.value = holds.value.filter(
      hold => new Date(hold.expiresAt).getTime() > now.value
    );

    saveHolds();
  }, 60000);
});

onBeforeUnmount(() => {
  window.clearTimeout(searchTimer);
  window.clearTimeout(noticeTimer);
  window.clearInterval(ticker);
  window.removeEventListener('storage', refreshCart);
});
</script>

<style scoped>
.catalog-page {
  --green: #347653;
  --green-dark: #234d37;
  --green-soft: #eaf5ec;
  --cream: #fffaf0;
  --text: #243b2d;
  --muted: #829087;
  color: var(--text);
  width: 100%;
  max-width: 1250px;
  margin: 0 auto;
  padding: 24px;
  box-sizing: border-box;
  font-family: Inter, "Noto Sans Khmer", sans-serif;
}

button {
  font: inherit;
}

button:focus-visible,
input:focus-visible {
  outline: 3px solid #9acba6;
  outline-offset: 3px;
}

.hero {
  position: relative;
  display: flex;
  min-height: 245px;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  padding: 32px 38px;
  border: 1px solid #e2eadf;
  border-radius: 25px;
  background: linear-gradient(115deg, #f0f8ef 0%, #fff7e9 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 620px;
}

.welcome-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 12px;
  border: 1px solid #dcebdc;
  border-radius: 30px;
  background: rgba(255,255,255,.78);
  color: var(--green);
  font-size: 11px;
  font-weight: 700;
}

.hero h1 {
  margin: 17px 0 10px;
  font-size: clamp(23px, 3vw, 34px);
  font-weight: 800;
  line-height: 1.5;
  letter-spacing: -.6px;
}

.hero h1 span {
  display: inline-block;
}

.hero-content > p {
  max-width: 500px;
  margin: 0;
  color: #748277;
  font-size: 13px;
  line-height: 1.9;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 23px;
}

.explore-btn,
.cart-btn {
  display: inline-flex;
  min-height: 43px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 0 17px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  transition: .2s ease;
}

.explore-btn {
  border: 1px solid var(--green);
  background: var(--green);
  color: white;
  box-shadow: 0 5px 13px #34765322;
}

.explore-btn:hover {
  transform: translateY(-2px);
  background: var(--green-dark);
}

.cart-btn {
  border: 1px solid #dce7db;
  background: white;
  color: var(--green-dark);
}

.cart-btn:hover {
  transform: translateY(-2px);
  border-color: #a8c9ad;
  background: #f9fff9;
}

.cart-icon {
  font-size: 17px;
}

.cart-count {
  display: grid;
  min-width: 22px;
  height: 22px;
  place-items: center;
  padding: 0 5px;
  border-radius: 20px;
  background: #eaf5ec;
  color: var(--green);
  font-size: 11px;
}

.hero-decoration {
  position: relative;
  width: 245px;
  min-width: 180px;
  height: 200px;
}

.hero-circle {
  position: absolute;
  top: 29px;
  right: 28px;
  display: grid;
  width: 140px;
  height: 140px;
  place-items: center;
  border: 1px solid #e4ead6;
  border-radius: 50%;
  background: #ffffffa8;
  font-size: 68px;
  box-shadow: 0 12px 30px #315a3210;
}

.floating-book {
  position: absolute;
  z-index: 1;
  display: grid;
  width: 56px;
  height: 61px;
  place-items: center;
  border: 4px solid white;
  border-radius: 8px 13px 13px 8px;
  background: #fff;
  box-shadow: 0 8px 17px #234d3720;
  font-size: 29px;
}

.book-one {
  top: 8px;
  left: 8px;
  transform: rotate(-15deg);
}

.book-two {
  right: 0;
  bottom: 12px;
  transform: rotate(13deg);
}

.book-three {
  bottom: 0;
  left: 23px;
  transform: rotate(-7deg);
}

.hero-sparkle {
  position: absolute;
  color: #d2a54e;
  font-size: 25px;
}

.sparkle-one {
  top: 2px;
  right: 8px;
}

.sparkle-two {
  bottom: 27px;
  left: 1px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin: 34px 0 18px;
}

.section-kicker {
  color: #80a18a;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.section-heading h2 {
  margin: 5px 0;
  font-size: 23px;
  font-weight: 800;
}

.section-heading h2 span {
  font-size: 19px;
}

.section-heading p {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.8;
}

.status-badge {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #e2eae1;
  border-radius: 25px;
  background: white;
  color: #738175;
  font-size: 10px;
}

.status-dot,
.stock-dot {
  width: 7px;
  height: 7px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #4d9a62;
}

.search-panel {
  display: flex;
  gap: 12px;
  scroll-margin-top: 20px;
}

.search-box {
  display: flex;
  min-width: 0;
  height: 51px;
  flex: 1;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  border: 1px solid #e0e8df;
  border-radius: 14px;
  background: white;
  box-shadow: 0 4px 14px #203d2910;
  transition: .2s ease;
}

.search-box:focus-within {
  border-color: #83b68b;
  box-shadow: 0 0 0 4px #eaf5ec;
}

.search-icon {
  font-size: 17px;
}

.search-box input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text);
  font-size: 12px;
}

.search-box input::placeholder {
  color: #a0aaa2;
}

.clear-search {
  border: 0;
  background: transparent;
  color: #87938a;
  cursor: pointer;
}

.filter-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 17px;
  border: 1px solid #e0e8df;
  border-radius: 14px;
  background: white;
  color: #526858;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  transition: .2s;
}

.filter-button:hover,
.filter-active {
  border-color: #b5d3b8;
  background: #edf7ee;
  color: var(--green);
}

.filter-panel {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 9px;
  margin-top: 13px;
  padding: 15px;
  border: 1px solid #e1eae0;
  border-radius: 15px;
  background: #fcfefb;
}

.filter-title {
  color: #738175;
  font-size: 11px;
  font-weight: 700;
}

.filter-panel button {
  padding: 8px 12px;
  border: 1px solid #e0e8df;
  border-radius: 25px;
  background: white;
  color: #637468;
  cursor: pointer;
  font-size: 10px;
  transition: .2s;
}

.filter-panel button.active {
  border-color: #a7cdaa;
  background: #eaf5ec;
  color: #347653;
  font-weight: 700;
}

.category-nav {
  display: flex;
  gap: 9px;
  margin: 22px 0 20px;
  padding-bottom: 5px;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #d9e6d9 transparent;
}

.category-nav button {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 7px;
  padding: 10px 14px;
  border: 1px solid #e4eae2;
  border-radius: 30px;
  background: white;
  color: #78857b;
  cursor: pointer;
  font-size: 11px;
  transition: .2s ease;
}

.category-nav button:hover {
  border-color: #b8d4b8;
  color: var(--green);
}

.category-nav button.active {
  border-color: #347653;
  background: #347653;
  color: white;
  box-shadow: 0 4px 10px #34765325;
}

.hold-banner {
  display: flex;
  align-items: center;
  gap: 13px;
  margin: 17px 0;
  padding: 15px 17px;
  border: 1px solid #efe4c6;
  border-radius: 16px;
  background: linear-gradient(100deg, #fff9e9, #fffdf6);
}

.hold-emoji {
  display: grid;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 13px;
  background: #fff0ca;
  font-size: 21px;
}

.hold-copy {
  min-width: 0;
}

.hold-copy strong {
  color: #5d5136;
  font-size: 12px;
}

.hold-copy p {
  margin: 4px 0 0;
  color: #897c61;
  font-size: 10px;
  line-height: 1.7;
}

.hold-banner > button {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 7px;
  margin-left: auto;
  padding: 9px 12px;
  border: 1px solid #f0e3bd;
  border-radius: 10px;
  background: white;
  color: #94732e;
  cursor: pointer;
  font-size: 10px;
  font-weight: 700;
}

.notice-box {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 16px 0;
  padding: 12px 15px;
  border: 1px solid #cfe7d0;
  border-radius: 13px;
  background: #f0faf0;
  color: #347653;
}

.notice-box p {
  flex: 1;
  margin: 0;
  font-size: 12px;
  line-height: 1.8;
}

.notice-box button {
  border: 0;
  background: transparent;
  color: #68876d;
  cursor: pointer;
}

.notice-enter-active,
.notice-leave-active {
  transition: all .2s ease;
}

.notice-enter-from,
.notice-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.results-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 29px 0 17px;
}

.results-heading h2 {
  margin: 0;
  font-size: 17px;
  font-weight: 800;
}

.results-heading p {
  margin: 5px 0 0;
  color: #87938a;
  font-size: 11px;
  line-height: 1.8;
}

.result-count {
  flex-shrink: 0;
  padding: 7px 11px;
  border-radius: 25px;
  background: #edf6ed;
  color: #347653;
  font-size: 10px;
  font-weight: 700;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: stretch;
  gap: 20px;
}

.book-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid #e5ebe3;
  border-radius: 18px;
  background: white;
  box-shadow: 0 4px 14px #203d2908;
  transition: transform .22s ease, box-shadow .22s ease;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 14px 30px #203d2913;
}

.book-cover {
  position: relative;
  display: flex;
  min-height: 205px;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  padding: 22px;
  color: #fff9ec;
  isolation: isolate;
}

.cover-0 {
  background: linear-gradient(145deg, #bd8b70, #785145 75%);
}

.cover-1 {
  background: linear-gradient(145deg, #a5b38c, #526b55 75%);
}

.cover-2 {
  background: linear-gradient(145deg, #86aeb5, #415a72 75%);
}

.cover-3 {
  background: linear-gradient(145deg, #e0a58c, #a75e61 75%);
}

.book-cover::after {
  position: absolute;
  z-index: -1;
  top: -50px;
  right: -35px;
  width: 180px;
  height: 180px;
  border: 1px solid #ffffff38;
  border-radius: 50%;
  content: "";
}

.cover-top {
  position: absolute;
  top: 17px;
  left: 22px;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.4px;
  opacity: .85;
}

.cover-decoration {
  position: absolute;
  top: 35px;
  right: 22px;
  color: #fff3ce8a;
  font-size: 70px;
  line-height: 1;
}

.cover-title {
  position: relative;
  z-index: 1;
  max-width: 220px;
  overflow-wrap: anywhere;
  font-family: Georgia, serif;
  font-size: 22px;
  font-weight: 800;
  line-height: 1.25;
  text-shadow: 0 2px 8px #0003;
}

.cover-author {
  position: relative;
  z-index: 1;
  margin-top: 9px;
  font-size: 10px;
  opacity: .9;
}

.cover-spine {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 10px;
  border-right: 1px solid #ffffff38;
  background: #00000015;
}

.cover-sticker {
  position: absolute;
  top: 14px;
  right: 14px;
  display: grid;
  width: 43px;
  height: 43px;
  place-content: center;
  border: 1px solid #ffffff8a;
  border-radius: 50%;
  background: #ffffff24;
  font-size: 7px;
  font-weight: 800;
  line-height: 1.4;
  text-align: center;
  transform: rotate(10deg);
}

.book-details {
  padding: 17px;
}

.book-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.book-category {
  padding: 5px 8px;
  border-radius: 7px;
  background: #eef7ed;
  color: #39774d;
  font-size: 9px;
  font-weight: 700;
}

.favorite-icon {
  color: #db9b9b;
  font-size: 23px;
  line-height: 1;
}

.book-details h3 {
  display: -webkit-box;
  min-height: 42px;
  margin: 11px 0 5px;
  overflow: hidden;
  color: #263c2e;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.55;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.book-author {
  margin: 0;
  color: #869188;
  font-size: 10px;
}

.book-info {
  margin-top: 15px;
}

.stock {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #39774d;
  font-size: 10px;
  font-weight: 700;
}

.stock.unavailable {
  color: #bf655a;
}

.stock.unavailable .stock-dot {
  background: #cf7668;
}

.book-shelf {
  margin: 10px 0 0;
  overflow: hidden;
  color: #98a198;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-actions {
  display: grid;
  gap: 8px;
  margin-top: 16px;
}

.add-cart-btn,
.hold-button {
  display: flex;
  width: 100%;
  min-height: 39px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid #dce9dc;
  border-radius: 11px;
  background: #f4faf3;
  color: #347653;
  cursor: pointer;
  font-size: 11px;
  font-weight: 800;
  transition: .2s ease;
}

.add-cart-btn {
  border-color: #347653;
  background: #347653;
  color: white;
}

.add-cart-btn:hover:not(:disabled) {
  background: #234d37;
  transform: translateY(-1px);
}

.hold-button:hover:not(:disabled) {
  border-color: #a9cfac;
  background: #e7f4e7;
}

.add-cart-btn:disabled,
.hold-button:disabled {
  border-color: #e7ebe5;
  background: #f1f3f0;
  color: #9ca69d;
  cursor: not-allowed;
  transform: none;
}

.held-button {
  border-color: #f0e4c6 !important;
  background: #fff9e9 !important;
  color: #94732e !important;
}

.empty-results {
  grid-column: 1 / -1;
  display: flex;
  min-height: 250px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 25px;
  border: 1px dashed #d8e5d7;
  border-radius: 20px;
  background: #fbfef9;
  text-align: center;
}

.empty-emoji {
  margin-bottom: 12px;
  font-size: 45px;
}

.empty-results h3 {
  margin: 0;
  font-size: 16px;
}

.empty-results p {
  margin: 9px 0 17px;
  color: #89948a;
  font-size: 12px;
  line-height: 1.8;
}

.reset-btn {
  padding: 10px 15px;
  border: 0;
  border-radius: 11px;
  background: #347653;
  color: white;
  cursor: pointer;
  font-size: 11px;
  font-weight: 700;
}

.catalog-footer {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 28px;
  padding: 19px;
  border: 1px solid #e4ebde;
  border-radius: 17px;
  background: linear-gradient(110deg, #f3f9ed, #fff9ec);
}

.footer-icon {
  display: grid;
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 13px;
  background: white;
  font-size: 22px;
}

.catalog-footer strong {
  font-size: 12px;
}

.catalog-footer p {
  margin: 5px 0 0;
  color: #849085;
  font-size: 10px;
  line-height: 1.9;
}

.footer-flower {
  margin-left: auto;
  font-size: 28px;
}

@media (max-width: 900px) {
  .book-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 15px;
  }

  .hero {
    padding: 27px;
  }

  .hero-decoration {
    width: 180px;
    min-width: 150px;
    transform: scale(.9);
    transform-origin: center right;
  }
}

@media (max-width: 600px) {
  .catalog-page {
    padding: 14px;
  }

  .hero {
    min-height: 0;
    padding: 23px 19px;
    border-radius: 20px;
  }

  .hero-decoration {
    position: absolute;
    right: -40px;
    bottom: -30px;
    width: 160px;
    opacity: .23;
    pointer-events: none;
  }

  .hero-content {
    max-width: 100%;
  }

  .hero h1 {
    max-width: 440px;
    font-size: 24px;
  }

  .hero-content > p {
    max-width: 340px;
    font-size: 11px;
  }

  .hero-actions {
    gap: 8px;
  }

  .explore-btn,
  .cart-btn {
    min-height: 40px;
    padding: 0 11px;
    font-size: 10px;
  }

  .section-heading {
    align-items: flex-start;
    margin-top: 26px;
  }

  .section-heading h2 {
    font-size: 20px;
  }

  .section-heading p {
    max-width: 270px;
  }

  .status-badge {
    padding: 7px 9px;
    font-size: 9px;
  }

  .search-box {
    height: 46px;
    gap: 8px;
    padding: 0 11px;
  }

  .search-box input {
    font-size: 10px;
  }

  .filter-button {
    gap: 5px;
    padding: 0 11px;
    font-size: 10px;
  }

  .category-nav {
    gap: 7px;
    margin: 17px 0;
  }

  .category-nav button {
    padding: 9px 11px;
    font-size: 10px;
  }

  .hold-banner {
    flex-wrap: wrap;
    padding: 12px;
  }

  .hold-banner > button {
    width: 100%;
    justify-content: center;
    margin: 0;
  }

  .results-heading h2 {
    font-size: 15px;
  }

  .book-grid {
    gap: 11px;
  }

  .book-cover {
    min-height: 165px;
    padding: 16px;
  }

  .cover-top {
    left: 16px;
    font-size: 7px;
  }

  .cover-title {
    font-size: 18px;
  }

  .cover-sticker {
    top: 12px;
    right: 9px;
    width: 34px;
    height: 34px;
    font-size: 6px;
  }

  .book-details {
    padding: 12px;
  }

  .book-details h3 {
    min-height: 42px;
    font-size: 12px;
  }

  .book-category {
    max-width: calc(100% - 25px);
    overflow: hidden;
    font-size: 8px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .add-cart-btn,
  .hold-button {
    gap: 5px;
    padding: 7px 4px;
    font-size: 9px;
  }

  .catalog-footer {
    align-items: flex-start;
    gap: 10px;
    padding: 13px;
  }

  .footer-icon {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }

  .footer-flower {
    display: none;
  }
}

@media (max-width: 380px) {
  .book-grid {
    grid-template-columns: 1fr;
  }

  .book-card {
    display: grid;
    grid-template-columns: 115px minmax(0, 1fr);
    align-items: stretch;
  }

  .book-cover {
    min-height: 100%;
    padding: 13px;
  }

  .cover-top {
    left: 13px;
    font-size: 6px;
  }

  .cover-title {
    font-size: 15px;
  }

  .cover-decoration {
    right: 8px;
    font-size: 48px;
  }

  .cover-sticker {
    display: none;
  }

  .book-details {
    padding: 12px 10px;
  }

  .book-details h3 {
    font-size: 11px;
  }

  .book-actions {
    gap: 6px;
    margin-top: 12px;
  }

  .add-cart-btn,
  .hold-button {
    min-height: 34px;
    font-size: 9px;
  }

  .section-heading {
    flex-direction: column;
  }
}
</style>
```
