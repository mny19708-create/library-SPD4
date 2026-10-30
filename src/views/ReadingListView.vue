<template>
  <main class="reading-page" v-translate="locale" :data-locale="locale">
    <header class="reading-heading">
      <div>
        <span class="eyebrow">YOUR BOOKSHELF</span>
        <h1>សៀវភៅដែលបានអាន 📚</h1>
        <p>សៀវភៅដែលអ្នកបានសម្គាល់ថាបានអាន នឹងរក្សាទុកនៅទីនេះ។</p>
      </div>
      <button type="button" class="browse-button" @click="emit('navigate', 'catalog')">ស្វែងរកសៀវភៅ <span>→</span></button>
    </header>
    <p v-if="error" class="reading-error" role="alert">{{ error }}</p>
    <p v-if="warning" class="reading-warning" role="status">{{ warning }}</p>
    <p v-if="loading" class="reading-loading" role="status">កំពុងផ្ទុកបញ្ជីសៀវភៅ...</p>

    <section v-if="!loading && books.length" class="reading-grid" aria-label="សៀវភៅដែលបានអាន">
      <article v-for="book in books" :key="book.id" class="reading-card">
        <img v-if="book.coverUrl" :src="book.coverUrl" :alt="`ក្របសៀវភៅ ${book.title}`" loading="lazy">
        <div v-else class="reading-cover"><span>📖</span></div>
        <div class="reading-details">
          <span class="read-status">✓ បានអាន</span>
          <h2>{{ book.title }}</h2>
          <p>{{ book.author }}</p>
          <small v-if="book.readAt">បានអាននៅ {{ formatDate(book.readAt) }}</small>
          <a v-if="book.onlineUrl" :href="book.onlineUrl" target="_blank" rel="noopener noreferrer">ប្រភពសៀវភៅ ↗</a>
        </div>
        <button type="button" class="remove-button" :aria-label="`លុប ${book.title} ពីសៀវភៅដែលបានអាន`" @click="removeBook(book.id)">×</button>
      </article>
    </section>

    <section v-else-if="!loading" class="empty-reading">
      <span>🌱</span>
      <h2>មិនទាន់មានសៀវភៅដែលបានអានទេ</h2>
      <p>ស្វែងរកសៀវភៅដែលអ្នកចូលចិត្ត ហើយចុច «បានអាន» ដើម្បីរក្សាទុកនៅទីនេះ។</p>
      <button type="button" class="browse-button" @click="emit('navigate', 'catalog')">ចាប់ផ្ដើមស្វែងរកសៀវភៅ <span>→</span></button>
    </section>
  </main>
</template>

<script setup>
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';
import api, { apiConfigured } from '@/services/api';

const emit = defineEmits(['navigate']);
const locale = inject('locale');
const STORAGE_KEY = 'leafline_read_books';
const books = ref([]);
const loading = ref(false);
const error = ref('');
const warning = ref('');

async function loadBooks() {
  loading.value = true;
  error.value = '';
  warning.value = '';
  try {
    const savedBooks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    books.value = Array.isArray(savedBooks) ? savedBooks.filter(book => book && book.id && book.title) : [];

    if (apiConfigured) {
      const { data } = await api.get('/reading-list');
      if (!Array.isArray(data)) throw new Error('Reading-list API returned an invalid response.');
      books.value = data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  } catch (loadError) {
    console.error('Unable to load reading history:', loadError);
    warning.value = books.value.length
      ? 'មិនអាចភ្ជាប់ទៅ server បានទេ។ កំពុងបង្ហាញបញ្ជីដែលបានរក្សាទុកក្នុងឧបករណ៍នេះ។'
      : 'មិនអាចភ្ជាប់ទៅ server បានទេ។ បញ្ជីសៀវភៅក្នុងឧបករណ៍នេះទទេ។';
  } finally {
    loading.value = false;
  }
}

async function removeBook(bookId) {
  error.value = '';
  if (apiConfigured) {
    try {
      await api.delete('/reading-list', { params: { id: bookId } });
    } catch (requestError) {
      console.error('Unable to remove book from reading history:', requestError);
      error.value = 'មិនអាចលុបសៀវភៅនេះបានទេ។ សូមព្យាយាមម្ដងទៀត។';
      return;
    }
  }
  books.value = books.value.filter(book => String(book.id) !== String(bookId));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books.value));
  window.dispatchEvent(new Event('leafline-reading-updated'));
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale.value === 'en' ? 'en-US' : 'km-KH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}
onMounted(() => {
  loadBooks();
  window.addEventListener('storage', loadBooks);
  window.addEventListener('leafline-reading-updated', loadBooks);
});
onBeforeUnmount(() => {
  window.removeEventListener('storage', loadBooks);
  window.removeEventListener('leafline-reading-updated', loadBooks);
});
</script>
<style scoped>
.reading-page{max-width:1180px;margin:0 auto;padding:28px;color:#263b2e;font-family:Inter,"Noto Sans Khmer",sans-serif}
.reading-heading{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:28px;padding:30px;border:1px solid #e1eade;border-radius:22px;background:linear-gradient(115deg,#eff8ef,#fff8ed)}
.eyebrow{color:#6b9675;font-size:10px;font-weight:800;letter-spacing:1.5px}
.reading-heading h1{margin:8px 0;font-size:clamp(22px,3vw,32px)}
.reading-heading p,.reading-details p{color:#78877b;font-size:12px;line-height:1.8}
.browse-button{display:inline-flex;min-height:44px;align-items:center;justify-content:center;gap:12px;padding:0 16px;border:0;border-radius:11px;background:#347653;color:#fff;cursor:pointer;font:inherit;font-size:12px;font-weight:800;white-space:nowrap}
.reading-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(255px,1fr));gap:18px}
.reading-card{position:relative;overflow:hidden;border:1px solid #e3ebe1;border-radius:17px;background:#fff;box-shadow:0 5px 18px #243b2d0a}
.reading-card>img,.reading-cover{display:grid;width:100%;height:190px;place-items:center;object-fit:contain;background:#f7f8f3;color:#397957;font-size:48px}
.reading-details{padding:17px}
.read-status{display:inline-flex;padding:5px 9px;border-radius:20px;background:#e9f5e9;color:#347653;font-size:10px;font-weight:800}
.reading-details h2{margin:10px 0 3px;font-size:15px;line-height:1.6}
.reading-details p{margin:0 0 10px}
.reading-details small{display:block;color:#89958c;font-size:10px}
.reading-details a{display:inline-block;margin-top:12px;color:#347653;font-size:11px;font-weight:700;text-decoration:none}
.remove-button{position:absolute;top:10px;right:10px;width:32px;height:32px;border:1px solid #e7e9e3;border-radius:50%;background:#fffffff0;color:#718077;cursor:pointer;font-size:19px}
.empty-reading{display:flex;min-height:360px;flex-direction:column;align-items:center;justify-content:center;padding:30px;border:1px dashed #d7e5d6;border-radius:20px;background:#fbfdf9;text-align:center}
.reading-error,.reading-warning,.reading-loading{margin:0 0 16px;padding:12px 15px;border-radius:11px;font-size:12px;line-height:1.7}
.reading-error{border:1px solid #f0d5cf;background:#fff4f1;color:#a45043}
.reading-warning{border:1px solid #e7e2ca;background:#fffaf0;color:#7a6940}
.reading-loading{background:#f3f8f1;color:#607366;text-align:center}
.empty-reading>span{font-size:48px}
.empty-reading h2{margin:14px 0 6px;font-size:19px}
.empty-reading p{max-width:460px;margin:0 0 20px;color:#7d897f;font-size:12px;line-height:1.9}
@media(max-width:600px){.reading-page{padding:14px}.reading-heading{align-items:flex-start;flex-direction:column;padding:22px}.reading-grid{grid-template-columns:1fr}.reading-card{display:grid;grid-template-columns:105px minmax(0,1fr);min-height:140px}.reading-card>img,.reading-cover{height:100%;min-height:140px;font-size:36px}.reading-details{padding:13px}.reading-details h2{font-size:12px}.reading-details p{font-size:10px}.reading-details a{font-size:10px}}
</style>
