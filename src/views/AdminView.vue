<template>
  <main class="admin-page" :lang="locale">
    <header class="admin-header">
      <a class="admin-brand" href="/" @click.prevent="exit">📚 <span>បណ្ណាល័យ · Admin</span></a>
      <button class="back-button" type="button" @click="exit">← ត្រឡប់ទៅទំព័រដើម</button>
    </header>

    <section v-if="!isAuthenticated" class="admin-login">
      <span class="admin-icon" aria-hidden="true">🔐</span>
      <p class="eyebrow">ADMINISTRATION</p>
      <h1>ចូលគណនីអ្នកគ្រប់គ្រង</h1>
      <p class="description">ប្រើឈ្មោះ និងពាក្យសម្ងាត់ Admin ដែលបានកំណត់នៅ backend។</p>
      <form class="admin-form" @submit.prevent="signIn">
        <label>ឈ្មោះ Admin
          <input v-model.trim="credentials.username" autocomplete="username" required>
        </label>
        <label>ពាក្យសម្ងាត់
          <input v-model="credentials.password" type="password" autocomplete="current-password" required>
          <small class="password-hint">បញ្ចូលពាក្យសម្ងាត់ធម្មតា មិនមែន ADMIN_PASSWORD_HASH ទេ។</small>
        </label>
        <p v-if="error" class="error-message" role="alert">{{ error }}</p>
        <button class="primary-button" type="submit" :disabled="busy">
          {{ busy ? 'កំពុងផ្ទៀងផ្ទាត់…' : 'ចូលផ្នែក Admin →' }}
        </button>
      </form>
    </section>

    <section v-else class="admin-dashboard">
      <div class="dashboard-heading">
        <div>
          <p class="eyebrow">LIBRARY MANAGEMENT</p>
          <h1>គ្រប់គ្រងសៀវភៅ</h1>
          <p class="description">បន្ថែម កែប្រែ ឬលុបសៀវភៅក្នុងកាតាឡុក។</p>
        </div>
        <button class="logout-button" type="button" @click="signOut">ចាកចេញ</button>
      </div>

      <form class="book-form" @submit.prevent="saveBook">
        <h2>{{ editingId ? 'កែព័ត៌មានសៀវភៅ' : 'បន្ថែមសៀវភៅថ្មី' }}</h2>
        <div class="form-grid">
          <label>ចំណងជើងសៀវភៅ *
            <input v-model.trim="bookForm.title" maxlength="255" required>
          </label>
          <label>អ្នកនិពន្ធ *
            <input v-model.trim="bookForm.author" maxlength="255" required>
          </label>
          <label>ប្រភេទ
            <input v-model.trim="bookForm.category">
          </label>
          <label>តំណអាន / Google Drive
            <input v-model.trim="bookForm.drive_link" type="url" placeholder="https://...">
          </label>
          <label class="wide-field">តំណរូបភាពក្រប ឬរូបភាព Base64
            <input v-model.trim="bookForm.cover_image" type="text" placeholder="https://... ឬ data:image/jpeg;base64,...">
          </label>
        </div>
        <p v-if="error" class="error-message" role="alert">{{ error }}</p>
        <div class="form-actions">
          <button v-if="editingId" class="secondary-button" type="button" @click="resetForm">បោះបង់</button>
          <button class="primary-button" type="submit" :disabled="busy">{{ busy ? 'កំពុងរក្សាទុក…' : editingId ? 'រក្សាទុកការកែប្រែ' : 'បន្ថែមសៀវភៅ' }}</button>
        </div>
      </form>

      <p v-if="loadingBooks" class="loading-message" role="status">កំពុងផ្ទុកសៀវភៅ…</p>
      <p v-else-if="!books.length" class="empty-message">មិនទាន់មានសៀវភៅក្នុងកាតាឡុកទេ។</p>
      <section v-else class="book-list" aria-label="បញ្ជីសៀវភៅ">
        <article v-for="book in books" :key="book.id" class="book-row">
          <img v-if="book.cover_image" :src="book.cover_image" alt="" loading="lazy">
          <span v-else class="book-placeholder" aria-hidden="true">📖</span>
          <div class="book-copy">
            <strong>{{ book.title }}</strong>
            <span>{{ book.author }}<template v-if="book.category"> · {{ book.category }}</template></span>
          </div>
          <div class="book-actions">
            <button class="secondary-button" type="button" @click="editBook(book)">កែ</button>
            <button class="delete-button" type="button" :disabled="busy" @click="deleteBook(book)">លុប</button>
          </div>
        </article>
      </section>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api, { apiConfigured } from '@/services/api';

const props = defineProps({ locale: { type: String, default: 'km' } });
const emit = defineEmits(['exit']);
const SESSION_KEY = 'leafline_admin_session';
const credentials = ref({ username: '', password: '' });
const bookForm = ref({ title: '', author: '', category: '', drive_link: '', cover_image: '' });
const books = ref([]);
const editingId = ref(null);
const isAuthenticated = ref(Boolean(localStorage.getItem(SESSION_KEY)));
const busy = ref(false);
const loadingBooks = ref(false);
const error = ref('');

async function loadBooks() {
  loadingBooks.value = true;
  error.value = '';
  try {
    const { data } = await api.get('/admin/books');
    if (!Array.isArray(data)) throw new Error('Admin books API returned an invalid response.');
    books.value = data;
  } catch (requestError) {
    console.error('Unable to load admin books:', requestError);
    if (requestError.response?.status === 401 || requestError.response?.status === 403) {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem('token');
      isAuthenticated.value = false;
    }
    error.value = requestError.response?.data?.message ?? 'មិនអាចផ្ទុកសៀវភៅបានទេ។ សូមពិនិត្យការកំណត់ backend។';
  } finally {
    loadingBooks.value = false;
  }
}

async function signIn() {
  if (!apiConfigured) {
    error.value = 'សូមកំណត់ VITE_API_BASE_URL ក្នុង .env ហើយចាប់ផ្ដើម backend API ជាមុន។';
    return;
  }
  busy.value = true;
  error.value = '';
  try {
    const { data } = await api.post('/admin/login', credentials.value);
    if (!data?.token || data.user?.role !== 'admin') {
      throw new Error('Admin login returned an invalid response.');
    }
    localStorage.setItem('token', data.token);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ username: data.user.username }));
    credentials.value.password = '';
    isAuthenticated.value = true;
    await loadBooks();
  } catch (requestError) {
    console.error('Unable to sign in as admin:', requestError);
    error.value = requestError.response?.data?.message ?? 'មិនអាចចូល Admin បានទេ។ សូមពិនិត្យឈ្មោះ Admin ពាក្យសម្ងាត់ និង server។';
  } finally {
    busy.value = false;
  }
}

function resetForm() {
  editingId.value = null;
  bookForm.value = { title: '', author: '', category: '', drive_link: '', cover_image: '' };
  error.value = '';
}

function editBook(book) {
  editingId.value = book.id;
  bookForm.value = {
    title: book.title ?? '',
    author: book.author ?? '',
    category: book.category ?? '',
    drive_link: book.drive_link ?? '',
    cover_image: book.cover_image ?? '',
  };
  error.value = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function saveBook() {
  busy.value = true;
  error.value = '';
  try {
    if (editingId.value) {
      await api.put(`/admin/books/${editingId.value}`, bookForm.value);
    } else {
      await api.post('/admin/books', bookForm.value);
    }
    resetForm();
    await loadBooks();
  } catch (requestError) {
    console.error('Unable to save admin book:', requestError);
    error.value = requestError.response?.data?.message ?? 'មិនអាចរក្សាទុកសៀវភៅបានទេ។ សូមព្យាយាមម្ដងទៀត។';
  } finally {
    busy.value = false;
  }
}

async function deleteBook(book) {
  if (!window.confirm(`តើអ្នកចង់លុប «${book.title}» មែនទេ?`)) return;
  busy.value = true;
  error.value = '';
  try {
    await api.delete(`/admin/books/${book.id}`);
    if (String(editingId.value) === String(book.id)) resetForm();
    await loadBooks();
  } catch (requestError) {
    console.error('Unable to delete admin book:', requestError);
    error.value = requestError.response?.data?.message ?? 'មិនអាចលុបសៀវភៅបានទេ។ សូមព្យាយាមម្ដងទៀត។';
  } finally {
    busy.value = false;
  }
}

function signOut() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('token');
  emit('exit');
}

function exit() {
  emit('exit');
}

onMounted(() => {
  if (isAuthenticated.value) loadBooks();
});
</script>

<style scoped>
.admin-page{min-height:100vh;padding:24px clamp(16px,5vw,64px) 48px;background:#f6f8f4;color:#293d30;font-family:Inter,"Noto Sans Khmer",sans-serif}
.admin-header{display:flex;align-items:center;justify-content:space-between;gap:14px;padding-bottom:18px;border-bottom:1px solid #e1eade}
.admin-brand{display:flex;align-items:center;gap:9px;color:#24543b;font-size:15px;font-weight:800}
.back-button,.logout-button,.secondary-button,.delete-button{min-height:38px;padding:0 12px;border:1px solid #dfe8de;border-radius:10px;background:#fff;color:#526b59;cursor:pointer;font:inherit;font-size:11px;font-weight:700}
.admin-login{width:min(440px,100%);margin:clamp(60px,12vh,130px) auto;padding:34px;border:1px solid #e1eade;border-radius:22px;background:#fff;box-shadow:0 16px 42px #243b2d0b}
.admin-icon{display:grid;width:48px;height:48px;place-items:center;border-radius:15px;background:#eaf5ec;font-size:23px}
.eyebrow{margin:18px 0 5px;color:#6b9675;font-size:10px;font-weight:800;letter-spacing:1.4px}
h1{margin:0;color:#293d30;font-size:clamp(21px,4vw,28px)}
.description{margin:8px 0 0;color:#78877b;font-size:12px;line-height:1.8}
.admin-form{display:grid;gap:15px;margin-top:24px}
.admin-form label,.form-grid label{display:grid;gap:7px;color:#526b59;font-size:11px;font-weight:700}
.password-hint{color:#849087;font-size:10px;font-weight:400}
input{width:100%;height:43px;padding:0 12px;border:1px solid #dfe8de;border-radius:10px;background:#fff;color:#293d30;font:inherit;font-size:12px}
input:focus{border-color:#76a984;outline:3px solid #e5f2e6}
.primary-button{min-height:43px;padding:0 16px;border:0;border-radius:10px;background:#347653;color:#fff;cursor:pointer;font:inherit;font-size:12px;font-weight:800}
.primary-button:disabled,.delete-button:disabled{opacity:.6;cursor:not-allowed}
.error-message{margin:0;padding:10px 12px;border:1px solid #f0d5cf;border-radius:9px;background:#fff4f1;color:#a45043;font-size:11px;line-height:1.7}
.admin-dashboard{width:min(1050px,100%);margin:35px auto}
.dashboard-heading{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:22px}
.dashboard-heading .eyebrow{margin-top:0}
.book-form{padding:22px;border:1px solid #e1eade;border-radius:17px;background:#fff}
.book-form h2{margin:0 0 17px;font-size:16px}
.form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.wide-field{grid-column:1/-1}
.form-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:16px}
.book-list{display:grid;gap:10px;margin-top:20px}
.book-row{display:flex;min-width:0;align-items:center;gap:14px;padding:12px;border:1px solid #e5ece4;border-radius:13px;background:#fff}
.book-row>img,.book-placeholder{display:grid;width:48px;height:62px;flex-shrink:0;place-items:center;overflow:hidden;border-radius:7px;background:#f0f5ed;color:#397957;object-fit:cover;font-size:24px}
.book-copy{display:grid;min-width:0;flex:1;gap:4px}
.book-copy strong,.book-copy span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.book-copy strong{font-size:12px}
.book-copy span{color:#78877b;font-size:10px}
.book-actions{display:flex;flex-shrink:0;gap:7px}
.delete-button{border-color:#f0d5cf;background:#fff7f5;color:#a45043}
.loading-message,.empty-message{padding:32px;color:#78877b;text-align:center}
@media(max-width:600px){.admin-page{padding:15px 12px 30px}.admin-login{margin:55px auto;padding:23px}.dashboard-heading{align-items:flex-start}.form-grid{grid-template-columns:1fr}.wide-field{grid-column:auto}.book-row{align-items:flex-start;flex-wrap:wrap}.book-copy{padding-top:5px}.book-actions{width:100%;justify-content:flex-end}}
</style>
