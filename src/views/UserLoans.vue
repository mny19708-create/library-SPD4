from pathlib import Path

code = r'''<template>
  <main class="loans-page" v-translate="locale" :data-locale="locale">
    <header class="page-header">
      <div>
        <span class="eyebrow"><span class="leaf-icon">🌿</span> LIBRARY</span>
        <h1>សៀវភៅរបស់ខ្ញុំ 📚</h1>
        <p>គ្រប់គ្រងការកក់ ការខ្ចី និងពេលវេលាត្រូវសងសៀវភៅ។</p>
      </div>
      <button class="catalog-btn" type="button" @click="navigateCatalog">＋ ស្វែងរកសៀវភៅ</button>
    </header>

    <Transition name="notice">
      <div v-if="notice" class="notice" :class="notice.type" role="status">
        <span>{{ notice.type === 'error' ? '⚠️' : '🌱' }}</span>
        <p>{{ notice.message }}</p>
        <button type="button" aria-label="បិទសារ" @click="notice = null">×</button>
      </div>
    </Transition>

    <!-- Large clickable category cards -->
    <section class="stats-grid" aria-label="ស្ថិតិសៀវភៅ">
      <button type="button" class="stat-card" :class="{ selected: currentTab === 'active' }" :aria-pressed="currentTab === 'active'" @click="currentTab = 'active'">
        <div class="stat-icon icon-green">📖</div>
        <div class="stat-content"><span>កំពុងខ្ចី</span><strong>{{ activeLoans.length }}</strong><small>សៀវភៅដែលកំពុងប្រើ</small></div>
        <span class="stat-arrow">↗</span>
      </button>
      <button type="button" class="stat-card" :class="{ selected: currentTab === 'holds' }" :aria-pressed="currentTab === 'holds'" @click="currentTab = 'holds'">
        <div class="stat-icon icon-gold">🔖</div>
        <div class="stat-content"><span>បានកក់</span><strong>{{ activeHolds.length }}</strong><small>រង់ចាំចាប់ផ្ដើមខ្ចី</small></div>
        <span class="stat-arrow">↗</span>
      </button>
      <button type="button" class="stat-card" :class="{ selected: currentTab === 'history' }" :aria-pressed="currentTab === 'history'" @click="currentTab = 'history'">
        <div class="stat-icon icon-blue">✅</div>
        <div class="stat-content"><span>បានសង</span><strong>{{ returnedLoans.length }}</strong><small>ប្រវត្តិសៀវភៅដែលបានសង</small></div>
        <span class="stat-arrow">↗</span>
      </button>
    </section>

    <!-- Reservations -->
    <section v-if="currentTab === 'holds'" class="section-panel">
      <div class="section-heading">
        <div><span class="section-kicker">YOUR RESERVATIONS</span><h2>🔖 សៀវភៅដែលបានកក់</h2><p>ជ្រើសរើសរយៈពេលខ្ចី មុនពេលចាប់ផ្ដើមខ្ចីសៀវភៅ។</p></div>
        <span class="section-total">{{ activeHolds.length }} ក្បាល</span>
      </div>
      <div v-if="activeHolds.length" class="book-list">
        <article v-for="hold in activeHolds" :key="hold.bookId" class="book-card">
          <div class="book-cover" :class="coverClass(hold)"><span class="cover-decoration">✦</span><span class="cover-emoji">📚</span><small>BOOK</small></div>
          <div class="book-details">
            <span class="status-badge badge-hold"><i></i> បានកក់</span>
            <h3 data-no-translate>{{ hold.title }}</h3>
            <p class="author">✍️ {{ hold.author || 'មិនទាន់មានឈ្មោះអ្នកនិពន្ធ' }}</p>
            <p v-if="hold.category" class="book-meta">📂 {{ hold.category }}</p>
            <p v-if="hold.shelf" class="book-meta">📍 {{ hold.shelf }}</p>
            <p class="book-meta">🗓️ កក់នៅ៖ {{ formatDateTime(hold.reservedAt || hold.createdAt) }}</p>
            <p v-if="hold.expiresAt" class="book-meta">⏳ ផុតកំណត់៖ {{ formatDateTime(hold.expiresAt) }}</p>
          </div>
          <div class="book-actions">
            <label :for="`duration-${hold.bookId}`">⏰ រយៈពេលខ្ចី</label>
            <select :id="`duration-${hold.bookId}`" v-model="durations[String(hold.bookId)]" class="duration-select">
              <option value="1">១ ម៉ោង</option><option value="3">៣ ម៉ោង</option><option value="6">៦ ម៉ោង</option><option value="12">១២ ម៉ោង</option><option value="24">១ ថ្ងៃ</option><option value="72">៣ ថ្ងៃ</option><option value="168">៧ ថ្ងៃ</option><option value="custom">កំណត់ដោយខ្លួនឯង</option>
            </select>
            <div v-if="durations[String(hold.bookId)] === 'custom'" class="custom-duration">
              <div><label :for="`days-${hold.bookId}`">ថ្ងៃ</label><input :id="`days-${hold.bookId}`" v-model.number="customDays[String(hold.bookId)]" type="number" min="0" max="365"></div>
              <div><label :for="`hours-${hold.bookId}`">ម៉ោង</label><input :id="`hours-${hold.bookId}`" v-model.number="customHours[String(hold.bookId)]" type="number" min="0" max="23"></div>
            </div>
            <p class="duration-hint">🕒 {{ durationLabel(hold.bookId) }}</p>
            <button class="primary-btn" type="button" :disabled="busyId === String(hold.bookId)" @click="startBorrowing(hold)">{{ busyId === String(hold.bookId) ? 'កំពុងដំណើរការ...' : '▶ ចាប់ផ្ដើមខ្ចី' }}</button>
            <button class="text-btn danger-text" type="button" :disabled="!!busyId" @click="cancelHold(hold)">បោះបង់ការកក់</button>
          </div>
        </article>
      </div>
      <EmptyState v-else icon="🔖" title="មិនទាន់មានសៀវភៅកក់ទេ" description="ចូលទៅបញ្ជីសៀវភៅ ហើយកក់សៀវភៅដែលអ្នកចង់អាន។" button-label="ទៅបញ្ជីសៀវភៅ" @action="navigateCatalog" />
    </section>

    <!-- Active loans -->
    <section v-else-if="currentTab === 'active'" class="section-panel">
      <div class="section-heading">
        <div><span class="section-kicker">CURRENTLY READING</span><h2>📖 សៀវភៅកំពុងខ្ចី</h2><p>មើលម៉ោងចាប់ផ្ដើម និងពេលវេលានៅសល់មុនសង។</p></div>
        <span class="section-total">{{ activeLoans.length }} ក្បាល</span>
      </div>
      <div v-if="activeLoans.length" class="book-list">
        <article v-for="loan in activeLoans" :key="loan.id" class="book-card">
          <div class="book-cover" :class="coverClass(loan)"><span class="cover-decoration">✦</span><span class="cover-emoji">📖</span><small>BOOK</small></div>
          <div class="book-details">
            <span class="status-badge" :class="loanStatusClass(loan)"><i></i>{{ loanStatus(loan) }}</span>
            <h3 data-no-translate>{{ loan.title }}</h3>
            <p class="author">✍️ {{ loan.author || 'មិនទាន់មានឈ្មោះអ្នកនិពន្ធ' }}</p>
            <div class="time-details">
              <div><span>🟢 ចាប់ផ្ដើមខ្ចី</span><strong>{{ formatDateTime(loan.borrowedAt) }}</strong></div>
              <div><span>🔔 ត្រូវសងនៅ</span><strong>{{ formatDateTime(loan.dueAt) }}</strong></div>
              <div><span>⏱️ រយៈពេលខ្ចី</span><strong>{{ hoursLabel(loan.durationHours) }}</strong></div>
            </div>
            <div class="countdown-box" :class="{ overdue: isOverdue(loan) }"><span>{{ isOverdue(loan) ? '⚠️ ហួសពេលកំណត់' : '⏳ ពេលវេលានៅសល់' }}</span><strong>{{ countdown(loan.dueAt) }}</strong></div>
          </div>
          <div class="book-actions active-actions">
            <button class="return-btn" type="button" :disabled="!!busyId" @click="askReturn(loan)">✓ សងសៀវភៅ</button>
          </div>
        </article>
      </div>
      <EmptyState v-else icon="🌿" title="មិនទាន់មានសៀវភៅកំពុងខ្ចី" description="ចាប់ផ្ដើមខ្ចីសៀវភៅដែលបានកក់ ដើម្បីមើលពេលវេលាខ្ចីនៅទីនេះ។" button-label="មើលសៀវភៅដែលបានកក់" @action="currentTab = 'holds'" />
    </section>

    <!-- Returned history -->
    <section v-else class="section-panel">
      <div class="section-heading">
        <div><span class="section-kicker">YOUR READING HISTORY</span><h2>✅ ប្រវត្តិសៀវភៅដែលបានសង</h2><p>សៀវភៅដែលអ្នកបានសងរួច និងពេលវេលាសង។</p></div>
        <span class="section-total">{{ returnedLoans.length }} ក្បាល</span>
      </div>
      <div v-if="returnedLoans.length" class="book-list">
        <article v-for="loan in returnedLoans" :key="loan.id" class="book-card returned-card">
          <div class="book-cover cover-returned"><span class="cover-emoji">📗</span><small>BOOK</small></div>
          <div class="book-details">
            <span class="status-badge badge-returned">✓ បានសងរួច</span>
            <h3 data-no-translate>{{ loan.title }}</h3>
            <p class="author">✍️ {{ loan.author || 'មិនទាន់មានឈ្មោះអ្នកនិពន្ធ' }}</p>
            <p class="book-meta">🟢 ចាប់ផ្ដើមខ្ចី៖ {{ formatDateTime(loan.borrowedAt) }}</p>
            <p class="book-meta">✅ ថ្ងៃសង៖ {{ formatDateTime(loan.returnedAt) }}</p>
          </div>
          <div class="book-actions"><button class="text-btn danger-text" type="button" @click="removeHistory(loan)">លុបចេញពីប្រវត្តិ</button></div>
        </article>
      </div>
      <EmptyState v-else icon="📚" title="មិនទាន់មានប្រវត្តិសងសៀវភៅ" description="ពេលអ្នកសងសៀវភៅរួច ប្រវត្តិនឹងបង្ហាញនៅទីនេះ។" />
    </section>

    <aside class="policy-card"><div class="policy-icon">💡</div><div><h3>គន្លឹះក្នុងការខ្ចីសៀវភៅ</h3><p>អ្នកអាចជ្រើសរើសរយៈពេលខ្ចីតាមតម្រូវការ។ ពេលចុចចាប់ផ្ដើមខ្ចី ប្រព័ន្ធនឹងកត់ត្រាម៉ោងចាប់ផ្ដើម និងគណនាម៉ោងត្រូវសងដោយស្វ័យប្រវត្តិ។ សូមសងសៀវភៅឱ្យទាន់ពេល។</p></div></aside>

    <!-- Confirmation modal -->
    <Transition name="modal-fade">
      <div v-if="showReturnModal && selectedReturnLoan" class="modal-overlay" @click.self="closeReturnModal">
        <section class="return-modal" role="dialog" aria-modal="true" aria-labelledby="return-title">
          <button class="modal-close" type="button" aria-label="បិទ" :disabled="!!busyId" @click="closeReturnModal">×</button>
          <div class="modal-illustration">📚</div>
          <span class="modal-eyebrow">LIBRARY 🌿</span>
          <h2 id="return-title">តើអ្នកពិតជាចង់សងសៀវភៅមែនទេ?</h2>
          <p class="modal-description">សូមពិនិត្យព័ត៌មានសៀវភៅមុនពេលបញ្ជាក់ការសង។</p>
          <div class="return-book-info">
            <div class="return-book-icon">📖</div>
            <div><strong>{{ selectedReturnLoan.title }}</strong><span>✍️ {{ selectedReturnLoan.author || 'មិនទាន់មានឈ្មោះអ្នកនិពន្ធ' }}</span><small>🗓️ ថ្ងៃត្រូវសង៖ {{ formatDateTime(selectedReturnLoan.dueAt) }}</small></div>
          </div>
          <p class="modal-reminder">💚 ក្រោយពេលសង សៀវភៅនេះនឹងផ្លាស់ទៅប្រវត្តិសង។</p>
          <div class="modal-actions">
            <button class="modal-cancel" type="button" :disabled="!!busyId" @click="closeReturnModal">ទេ ត្រឡប់ក្រោយ</button>
            <button class="modal-confirm" type="button" :disabled="!!busyId" @click="confirmReturn">{{ busyId ? 'កំពុងសង...' : '✓ បាទ/ចាស សងសៀវភៅ' }}</button>
          </div>
        </section>
      </div>
    </Transition>

    <!-- Thank-you / reading bot message -->
    <Transition name="modal-fade">
      <div v-if="showThankYou" class="modal-overlay" @click.self="closeThankYou">
        <section class="thankyou-modal" role="dialog" aria-modal="true" aria-labelledby="thankyou-title">
          <button class="modal-close" type="button" aria-label="បិទ" @click="closeThankYou">×</button>
          <div class="thankyou-decoration">🌿 ✨ 🌷</div>
          <div class="thankyou-icon">🤖</div>
          <span class="modal-eyebrow">YOUR READING FRIEND</span>
          <h2 id="thankyou-title">អរគុណដែលបានអានជាមួយយើង! 💚</h2>
          <p>សៀវភៅត្រូវបានសងដោយជោគជ័យ។ អរគុណដែលបានប្រើប្រាស់បណ្ណាល័យ។ សូមអញ្ជើញមកម្ដងទៀតនៅថ្ងៃក្រោយ ដើម្បីខ្ចីសៀវភៅថ្មីៗ និងបន្តដំណើរអានដ៏រីករាយជាមួយយើង! 📚</p>
          <div class="thankyou-note">🌱 សៀវភៅល្អៗ កំពុងរង់ចាំអ្នក!</div>
          <button class="thankyou-button" type="button" @click="closeThankYou(); navigateCatalog()">🌷 ស្វែងរកសៀវភៅថ្មី</button>
          <button class="thankyou-secondary" type="button" @click="closeThankYou">ត្រឡប់ទៅប្រវត្តិសង</button>
        </section>
      </div>
    </Transition>
  </main>
</template>

<script setup>
import { computed, defineComponent, h, inject, onBeforeUnmount, onMounted, ref } from 'vue';
import api, { apiConfigured } from '@/services/api';

const emit = defineEmits(['navigate']);
const locale = inject('locale', ref('km'));

const HOLDS_KEY = 'leafline_book_holds';
const LOANS_KEY = 'leafline_active_loans';
const HISTORY_KEY = 'leafline_returned_loans';

const currentTab = ref('holds');
const holds = ref([]);
const loans = ref([]);
const returnedLoans = ref([]);
const now = ref(Date.now());
const notice = ref(null);
const busyId = ref('');
const durations = ref({});
const customDays = ref({});
const customHours = ref({});
const showReturnModal = ref(false);
const selectedReturnLoan = ref(null);
const showThankYou = ref(false);
let ticker = null;
let noticeTimer = null;

const activeHolds = computed(() => holds.value.filter(hold => {
  if (!hold.expiresAt) return true;
  const expiry = new Date(hold.expiresAt).getTime();
  return Number.isNaN(expiry) || expiry > now.value;
}));
const activeLoans = computed(() => loans.value.filter(loan => !loan.returnedAt));

function readArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch (error) {
    console.error(`Unable to read ${key}:`, error);
    return [];
  }
}
function writeArray(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch (error) { console.error(`Unable to save ${key}:`, error); notify('មិនអាចរក្សាទុកទិន្នន័យបានទេ។', 'error'); }
}
function saveHolds() { writeArray(HOLDS_KEY, holds.value); }
function saveLoans() { writeArray(LOANS_KEY, loans.value); }
function saveHistory() { writeArray(HISTORY_KEY, returnedLoans.value); }

function notify(message, type = 'success') {
  notice.value = { message, type };
  if (noticeTimer) window.clearTimeout(noticeTimer);
  noticeTimer = window.setTimeout(() => { notice.value = null; }, 6000);
}

function loadData() {
  holds.value = readArray(HOLDS_KEY).filter(hold => hold && hold.bookId != null && hold.title);
  loans.value = readArray(LOANS_KEY).filter(loan => loan && loan.id != null && loan.title);
  returnedLoans.value = readArray(HISTORY_KEY).filter(loan => loan && loan.id != null && loan.title);
  for (const hold of holds.value) {
    const key = String(hold.bookId);
    if (!durations.value[key]) durations.value[key] = '3';
  }
  const validHolds = holds.value.filter(hold => {
    if (!hold.expiresAt) return true;
    const expiry = new Date(hold.expiresAt).getTime();
    return Number.isNaN(expiry) || expiry > Date.now();
  });
  if (validHolds.length !== holds.value.length) {
    holds.value = validHolds;
    saveHolds();
  }
}
function coverClass(book) {
  const value = String(book.bookId ?? book.id ?? book.title ?? 'leafline');
  let hash = 0;
  for (const char of value) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return `cover-${hash % 4}`;
}
function formatDateTime(value) {
  if (!value) return 'មិនទាន់មានទិន្នន័យ';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'មិនទាន់មានទិន្នន័យ';
  return new Intl.DateTimeFormat(locale.value === 'en' ? 'en-US' : 'km-KH', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(date);
}
function selectedHours(bookId) {
  const key = String(bookId);
  const selected = durations.value[key];
  if (selected === 'custom') {
    const days = Number(customDays.value[key] || 0);
    const hours = Number(customHours.value[key] || 0);
    if (!Number.isInteger(days) || !Number.isInteger(hours) || days < 0 || days > 365 || hours < 0 || hours > 23) return 0;
    return days * 24 + hours;
  }
  return Number(selected);
}
function durationLabel(bookId) {
  const hours = selectedHours(bookId);
  if (!Number.isFinite(hours) || hours <= 0) return 'សូមកំណត់រយៈពេលឱ្យបានត្រឹមត្រូវ';
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  const parts = [];
  if (days) parts.push(`${days} ថ្ងៃ`);
  if (remainingHours) parts.push(`${remainingHours} ម៉ោង`);
  return `ខ្ចីរយៈពេល ${parts.join(' ')}`;
}
function hoursLabel(value) {
  const hours = Number(value) || 0;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  const parts = [];
  if (days) parts.push(`${days} ថ្ងៃ`);
  if (remainingHours) parts.push(`${remainingHours} ម៉ោង`);
  return parts.join(' ') || '០ ម៉ោង';
}
function countdown(dueAt) {
  const due = new Date(dueAt).getTime();
  if (Number.isNaN(due)) return 'មិនស្គាល់ពេលវេលា';
  const remaining = due - now.value;
  const abs = Math.abs(remaining);
  const days = Math.floor(abs / 86400000);
  const hours = Math.floor((abs % 86400000) / 3600000);
  const minutes = Math.floor((abs % 3600000) / 60000);
  const seconds = Math.floor((abs % 60000) / 1000);
  const time = [hours, minutes, seconds].map(n => String(n).padStart(2, '0')).join(':');
  if (remaining < 0) return `ហួស ${days ? `${days} ថ្ងៃ ` : ''}${time}`;
  return `${days ? `${days} ថ្ងៃ ` : ''}${time}`;
}
function isOverdue(loan) {
  const due = new Date(loan.dueAt).getTime();
  return Number.isFinite(due) && due <= now.value;
}
function loanStatus(loan) {
  if (isOverdue(loan)) return 'ហួសពេលសង';
  if (new Date(loan.dueAt).getTime() - now.value <= 3600000) return 'ជិតដល់ម៉ោងសង';
  return 'កំពុងខ្ចី';
}
function loanStatusClass(loan) {
  if (isOverdue(loan)) return 'badge-overdue';
  if (new Date(loan.dueAt).getTime() - now.value <= 3600000) return 'badge-soon';
  return 'badge-active';
}

async function startBorrowing(hold) {
  const key = String(hold.bookId);
  if (busyId.value) return;
  const durationHours = selectedHours(hold.bookId);
  if (!Number.isFinite(durationHours) || durationHours <= 0) {
    notify('សូមជ្រើសរើសរយៈពេលខ្ចីឱ្យបានត្រឹមត្រូវ។', 'error');
    return;
  }
  if (activeLoans.value.some(loan => String(loan.bookId) === key)) {
    notify('សៀវភៅនេះកំពុងខ្ចីរួចហើយ។', 'error');
    return;
  }
  busyId.value = key;
  try {
    const borrowedAt = new Date();
    const dueAt = new Date(borrowedAt.getTime() + durationHours * 3600000);
    let serverData = {};
    if (apiConfigured) {
      const response = await api.post('/loans/borrow', {
        book_id: hold.bookId, duration_hours: durationHours,
        borrowed_at: borrowedAt.toISOString(), due_at: dueAt.toISOString(),
      });
      serverData = response.data?.loan ?? response.data ?? {};
      if (serverData.success === false) throw new Error(serverData.message || 'ការខ្ចីមិនជោគជ័យ');
    }
    const loan = {
      id: String(serverData.id ?? `loan-${hold.bookId}-${Date.now()}`),
      bookId: hold.bookId, title: hold.title, author: hold.author || '',
      category: hold.category || '', shelf: hold.shelf || '', cover: hold.cover ?? 0,
      borrowedAt: serverData.borrowed_at || borrowedAt.toISOString(),
      dueAt: serverData.due_at || dueAt.toISOString(), durationHours, returnedAt: null,
    };
    loans.value.push(loan);
    saveLoans();
    holds.value = holds.value.filter(item => String(item.bookId) !== key);
    saveHolds();
    window.dispatchEvent(new Event('leafline-loans-updated'));
    window.dispatchEvent(new Event('leafline-holds-updated'));
    currentTab.value = 'active';
    notify(`បានចាប់ផ្ដើមខ្ចី «${hold.title}» ជោគជ័យ!`);
  } catch (error) {
    console.error('Unable to start borrowing:', error);
    notify(apiConfigured ? (error.response?.data?.message || error.message || 'មិនអាចខ្ចីសៀវភៅបានទេ។') : 'មិនអាចចាប់ផ្ដើមខ្ចីបានទេ។ សូមព្យាយាមម្ដងទៀត។', 'error');
  } finally { busyId.value = ''; }
}

function askReturn(loan) {
  selectedReturnLoan.value = loan;
  showReturnModal.value = true;
}
function closeReturnModal() {
  if (busyId.value) return;
  showReturnModal.value = false;
  selectedReturnLoan.value = null;
}
function closeThankYou() { showThankYou.value = false; }

async function confirmReturn() {
  const loan = selectedReturnLoan.value;
  if (!loan || busyId.value) return;
  const key = String(loan.id);
  busyId.value = key;
  try {
    const returnedAt = new Date().toISOString();
    if (apiConfigured) {
      const response = await api.post('/loans/return', { loan_id: loan.id, book_id: loan.bookId });
      if (response.data?.success === false) throw new Error(response.data.message || 'ការសងមិនជោគជ័យ');
    }
    returnedLoans.value.unshift({ ...loan, returnedAt });
    loans.value = loans.value.filter(item => String(item.id) !== key);
    saveHistory();
    saveLoans();
    window.dispatchEvent(new Event('leafline-loans-updated'));
    window.dispatchEvent(new Event('leafline-holds-updated'));
    showReturnModal.value = false;
    selectedReturnLoan.value = null;
    currentTab.value = 'history';
    showThankYou.value = true;
    notify(`បានសងសៀវភៅ «${loan.title}» រួចរាល់។`);
  } catch (error) {
    console.error('Unable to return book:', error);
    notify(error.response?.data?.message || error.message || 'មិនអាចកត់ត្រាការសងបានទេ។ សូមព្យាយាមម្ដងទៀត។', 'error');
  } finally { busyId.value = ''; }
}

async function cancelHold(hold) {
  const key = String(hold.bookId);
  if (busyId.value) return;
  if (!window.confirm(`តើអ្នកចង់បោះបង់ការកក់ «${hold.title}» មែនទេ?`)) return;
  busyId.value = key;
  try {
    if (apiConfigured) await api.post('/books/cancel-hold', { book_id: hold.bookId });
    holds.value = holds.value.filter(item => String(item.bookId) !== key);
    saveHolds();
    window.dispatchEvent(new Event('leafline-holds-updated'));
    notify(`បានបោះបង់ការកក់ «${hold.title}»។`);
  } catch (error) {
    console.error('Unable to cancel hold:', error);
    notify(error.response?.data?.message || 'មិនអាចបោះបង់ការកក់បានទេ។', 'error');
  } finally { busyId.value = ''; }
}
function removeHistory(loan) {
  if (!window.confirm(`លុប «${loan.title}» ចេញពីប្រវត្តិនេះមែនទេ?`)) return;
  returnedLoans.value = returnedLoans.value.filter(item => String(item.id) !== String(loan.id));
  saveHistory();
  notify('បានលុបចេញពីប្រវត្តិ។');
}
function navigateCatalog() { emit('navigate', 'catalog'); }
function handleStorage(event) {
  if (!event.key || [HOLDS_KEY, LOANS_KEY, HISTORY_KEY].includes(event.key)) loadData();
}
function handleLocalUpdate() { loadData(); }

onMounted(() => {
  loadData();
  window.addEventListener('storage', handleStorage);
  window.addEventListener('leafline-cart-updated', handleLocalUpdate);
  window.addEventListener('leafline-holds-updated', handleLocalUpdate);
  window.addEventListener('leafline-loans-updated', handleLocalUpdate);
  ticker = window.setInterval(() => { now.value = Date.now(); }, 1000);
});
onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorage);
  window.removeEventListener('leafline-cart-updated', handleLocalUpdate);
  window.removeEventListener('leafline-holds-updated', handleLocalUpdate);
  window.removeEventListener('leafline-loans-updated', handleLocalUpdate);
  if (ticker) window.clearInterval(ticker);
  if (noticeTimer) window.clearTimeout(noticeTimer);
});

const EmptyState = defineComponent({
  props: {
    icon: { type: String, default: '📚' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    buttonLabel: { type: String, default: '' },
  },
  emits: ['action'],
  setup(props, { emit: childEmit }) {
    return () => h('div', { class: 'empty-state' }, [
      h('div', { class: 'empty-illustration' }, props.icon),
      h('h3', props.title),
      h('p', props.description),
      props.buttonLabel ? h('button', {
        class: 'primary-btn empty-action', type: 'button', onClick: () => childEmit('action'),
      }, props.buttonLabel) : null,
    ]);
  },
});
</script>

<style scoped>
.loans-page{--green:#397653;--green-dark:#28573d;--green-light:#edf7ee;--text:#293d30;--muted:#7b897e;--border:#e5ede5;max-width:1240px;margin:0 auto;padding:26px;color:var(--text);font-family:Inter,"Noto Sans Khmer",sans-serif;animation:page-enter .4s ease}
@keyframes page-enter{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.page-header{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:28px}
.eyebrow{display:flex;align-items:center;gap:9px;margin:0 0 11px;color:var(--green);font-size:10px;font-weight:800;letter-spacing:1.6px}
.leaf-icon{display:grid;width:30px;height:30px;place-items:center;border-radius:10px;background:#eaf5eb;font-size:17px}
.page-header h1{margin:0;color:var(--green-dark);font-size:clamp(24px,3vw,34px);font-weight:850}
.page-header p{margin:9px 0 0;color:var(--muted);font-size:12px;line-height:1.9}
.catalog-btn,.primary-btn,.return-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:43px;padding:11px 16px;border:0;border-radius:12px;background:linear-gradient(135deg,#43865b,#2e6947);color:#fff;font:inherit;font-size:12px;font-weight:750;cursor:pointer;box-shadow:0 5px 14px #3976531b;transition:transform .2s,box-shadow .2s,opacity .2s}
.catalog-btn:hover,.primary-btn:hover:not(:disabled),.return-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 20px #3976532a}
button:disabled{opacity:.55;cursor:wait}
.notice{display:flex;align-items:center;gap:12px;margin-bottom:20px;padding:13px 16px;border:1px solid #d4e8d6;border-radius:13px;background:#f0f8f0;color:#326747;font-size:12px;line-height:1.8}
.notice.error{border-color:#f0d6d2;background:#fff5f3;color:#a74d43}.notice p{flex:1;margin:0}.notice button{border:0;background:transparent;color:inherit;font-size:22px;cursor:pointer}
.notice-enter-active,.notice-leave-active{transition:opacity .2s,transform .2s}.notice-enter-from,.notice-leave-to{opacity:0;transform:translateY(-5px)}
.stats-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-bottom:32px}
.stat-card{position:relative;display:flex;align-items:center;gap:16px;width:100%;min-width:0;padding:23px 20px;overflow:hidden;border:1px solid #e2ece3;border-radius:21px;background:linear-gradient(145deg,#fff,#fafffa);box-shadow:0 5px 20px #2a53330d;color:var(--text);font-family:inherit;text-align:left;cursor:pointer;transition:transform .25s,border-color .25s,box-shadow .25s,background .25s}
.stat-card:before{content:"";position:absolute;top:0;left:0;width:4px;height:0;border-radius:0 0 5px 0;background:#397653;transition:height .25s}.stat-card:hover{transform:translateY(-5px);border-color:#b8d8bd;box-shadow:0 14px 32px #2a53331c}.stat-card:hover:before,.stat-card.selected:before{height:100%}.stat-card.selected{border-color:#83b98d;background:linear-gradient(145deg,#f0faf1,#fff);box-shadow:0 8px 25px #3976531f}.stat-card:focus-visible{outline:3px solid #8bc99a;outline-offset:4px}
.stat-icon{display:grid;place-items:center;flex:0 0 58px;width:58px;height:58px;border-radius:19px;font-size:27px;transition:transform .25s}.stat-card:hover .stat-icon{transform:scale(1.08) rotate(-4deg)}.icon-green{background:linear-gradient(135deg,#e1f5e5,#c8e9ce)}.icon-gold{background:linear-gradient(135deg,#fff4d8,#ffe7a9)}.icon-blue{background:linear-gradient(135deg,#e5edff,#ceddff)}
.stat-content{display:grid;gap:5px;min-width:0}.stat-content>span{color:#77877a;font-size:12px;font-weight:700}.stat-content strong{color:var(--green-dark);font-size:31px;font-weight:850;line-height:1.25;font-variant-numeric:tabular-nums}.stat-content small{color:#8b998e;font-size:10px;line-height:1.8}.stat-arrow{position:absolute;top:14px;right:16px;color:#a1b6a4;font-size:18px;opacity:.7;transition:color .2s,transform .2s}.stat-card:hover .stat-arrow,.stat-card.selected .stat-arrow{color:var(--green);transform:translate(2px,-2px);opacity:1}
.section-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px}.section-kicker{display:block;margin-bottom:5px;color:#8aa18d;font-size:9px;font-weight:800;letter-spacing:1.5px}.section-heading h2{margin:0;color:var(--green-dark);font-size:18px;font-weight:850}.section-heading p{margin:6px 0 0;color:var(--muted);font-size:11px;line-height:1.8}.section-total{flex:0 0 auto;padding:8px 12px;border:1px solid #deebdf;border-radius:10px;background:#f4faf4;color:#477552;font-size:10px;font-weight:750}
.book-list{display:grid;gap:15px}.book-card{display:grid;grid-template-columns:90px minmax(0,1fr) 205px;align-items:center;gap:20px;padding:20px;border:1px solid var(--border);border-radius:19px;background:#fff;box-shadow:0 4px 18px #243d2c0a;transition:border-color .2s,transform .2s,box-shadow .2s}.book-card:hover{border-color:#cde0d0;transform:translateY(-2px);box-shadow:0 9px 24px #243d2c12}
.book-cover{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;width:90px;height:118px;overflow:hidden;border-radius:9px 13px 13px 9px;color:#fff;box-shadow:inset 5px 0 #00000012,0 5px 12px #0000000b}.cover-0{background:linear-gradient(145deg,#82aa82,#36664c)}.cover-1{background:linear-gradient(145deg,#e3b77d,#9b7048)}.cover-2{background:linear-gradient(145deg,#8aabc9,#4a6b91)}.cover-3{background:linear-gradient(145deg,#d59db3,#985a79)}.cover-returned{background:linear-gradient(145deg,#a9c8a7,#62866b)}.cover-decoration{position:absolute;top:8px;right:10px;opacity:.8}.cover-emoji{font-size:32px}.book-cover small{font-size:7px;font-weight:800;letter-spacing:1.5px}
.book-details{min-width:0}.status-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 9px;border-radius:7px;font-size:9px;font-weight:750}.status-badge i{width:6px;height:6px;border-radius:50%;background:currentColor}.badge-hold{background:#fff5e2;color:#9a702b}.badge-active{background:#eaf6ec;color:#357449}.badge-soon{background:#fff2e3;color:#b87327}.badge-overdue{background:#fff0ed;color:#bb4d41}.badge-returned{background:#edf3fa;color:#4d719b}
.book-details h3{margin:9px 0 6px;color:#293e30;font-size:15px;font-weight:800;line-height:1.7;overflow-wrap:anywhere}.author{margin:0 0 7px;color:#738278;font-size:11px;line-height:1.7}.book-meta{margin:6px 0 0;color:#839087;font-size:10px;line-height:1.8;overflow-wrap:anywhere}
.book-actions{display:grid;align-content:center;gap:10px;min-width:0}.book-actions>label{color:#52675a;font-size:10px;font-weight:750}.duration-select,.custom-duration input{width:100%;min-width:0;padding:10px;border:1px solid #dce8de;border-radius:9px;outline:none;background:#fbfdfb;color:#385641;font:inherit;font-size:11px}.duration-select:focus,.custom-duration input:focus{border-color:#5b966b;box-shadow:0 0 0 3px #39765312}.custom-duration{display:grid;grid-template-columns:1fr 1fr;gap:8px}.custom-duration>div{display:grid;gap:5px}.custom-duration label{color:var(--muted);font-size:10px}.duration-hint{margin:0;color:#5b8565;font-size:10px;line-height:1.8}.primary-btn{width:100%;min-height:42px}.text-btn{padding:8px;border:0;border-radius:8px;background:transparent;color:var(--green);font:inherit;font-size:10px;font-weight:700;cursor:pointer}.text-btn:hover{background:var(--green-light)}.danger-text{color:#b45c54}.danger-text:hover{background:#fff2f0}
.time-details{display:grid;gap:10px;margin-top:15px}.time-details>div{display:grid;gap:4px}.time-details span{color:#859188;font-size:10px}.time-details strong{color:#425a49;font-size:11px;font-weight:700;line-height:1.8;overflow-wrap:anywhere}.countdown-box{display:grid;gap:5px;margin-top:14px;padding:12px;border:1px solid #dcebdc;border-radius:11px;background:#f1f8f0}.countdown-box>span{color:#66836b;font-size:10px}.countdown-box strong{color:#2f7046;font-size:18px;font-weight:800;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}.countdown-box.overdue{border-color:#f1d8d3;background:#fff4f1}.countdown-box.overdue>span,.countdown-box.overdue strong{color:#b74e42}.return-btn{width:100%;background:linear-gradient(135deg,#5285b5,#3c6793)}.active-actions{align-self:end}
.empty-state{display:grid;justify-items:center;align-content:center;gap:11px;min-height:250px;padding:30px 20px;border:1px dashed #d5e4d7;border-radius:19px;background:linear-gradient(145deg,#fff,#f8fcf7);text-align:center}.empty-illustration{display:grid;width:74px;height:74px;place-items:center;border:1px solid #dfeddf;border-radius:24px;background:#edf7ed;font-size:34px}.empty-state h3{margin:0;color:var(--green-dark);font-size:16px;font-weight:800}.empty-state p{max-width:370px;margin:0;color:var(--muted);font-size:11px;line-height:2}.empty-action{width:auto;margin-top:5px}
.policy-card{display:flex;align-items:flex-start;gap:13px;margin-top:28px;padding:18px;border:1px solid #eee4cd;border-radius:16px;background:linear-gradient(120deg,#fffaf0,#fffdf8)}.policy-icon{display:grid;width:40px;height:40px;flex:0 0 auto;place-items:center;border-radius:13px;background:#fff0ce;font-size:21px}.policy-card h3{margin:0 0 6px;color:#6c5834;font-size:12px;font-weight:800}.policy-card p{margin:0;color:#8c7a5b;font-size:10px;line-height:2}.returned-card{background:#fcfefc}

/* Modal design */
.modal-overlay{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:18px;overflow-y:auto;background:#172d1f80;backdrop-filter:blur(8px)}
.return-modal,.thankyou-modal{position:relative;width:min(100%,470px);padding:30px;border:1px solid #e0ede1;border-radius:26px;background:linear-gradient(155deg,#fff,#f5fbf4);box-shadow:0 25px 90px #183a2438;text-align:center}
.modal-close{position:absolute;top:13px;right:15px;display:grid;width:34px;height:34px;place-items:center;border:0;border-radius:11px;background:#edf5ed;color:#42684c;font-size:24px;cursor:pointer}
.modal-illustration,.thankyou-icon{display:grid;width:76px;height:76px;place-items:center;margin:4px auto 18px;border:1px solid #dcebdc;border-radius:25px;background:linear-gradient(145deg,#eaf7e8,#d9efda);font-size:36px}
.modal-eyebrow{display:block;margin-bottom:10px;color:#52805c;font-size:10px;font-weight:800;letter-spacing:1.5px}
.return-modal h2,.thankyou-modal h2{margin:0;color:#28573d;font-size:21px;font-weight:850;line-height:1.8}
.modal-description,.thankyou-modal>p{margin:10px 0 20px;color:#77877a;font-size:12px;line-height:2}
.return-book-info{display:flex;align-items:center;gap:14px;padding:15px;border:1px solid #deebdd;border-radius:17px;background:#fff;text-align:left}
.return-book-icon{display:grid;width:55px;height:65px;flex:0 0 auto;place-items:center;border-radius:10px;background:linear-gradient(145deg,#a4cba0,#427751);color:#fff;font-size:27px}
.return-book-info>div:last-child{display:grid;min-width:0;gap:6px}.return-book-info strong{color:#2c5037;font-size:13px;line-height:1.7;overflow-wrap:anywhere}.return-book-info span,.return-book-info small{color:#819084;font-size:10px;line-height:1.8;overflow-wrap:anywhere}
.modal-reminder{margin:16px 0;padding:11px;border-radius:11px;background:#edf7ec;color:#517858;font-size:10px;line-height:1.9}.modal-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.modal-cancel,.modal-confirm,.thankyou-button{min-height:44px;padding:11px 12px;border:0;border-radius:12px;font:inherit;font-size:11px;font-weight:750;cursor:pointer;transition:transform .2s,opacity .2s}.modal-cancel{border:1px solid #dce8dc;background:#fff;color:#597360}.modal-confirm,.thankyou-button{background:linear-gradient(135deg,#4d9560,#2d6844);color:#fff;box-shadow:0 5px 14px #39765320}.modal-cancel:hover,.modal-confirm:hover,.thankyou-button:hover{transform:translateY(-2px)}
.thankyou-modal{background:radial-gradient(ellipse at top,#e6f5e3 0,transparent 55%),linear-gradient(155deg,#fff,#f5fbf4)}.thankyou-decoration{margin:8px 0 12px;color:#709b70;font-size:19px;letter-spacing:8px}.thankyou-icon{border-radius:50%;background:linear-gradient(145deg,#dff3dc,#bde3ba);font-size:34px;animation:thankyou-pop .45s ease both}
@keyframes thankyou-pop{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:scale(1)}}
.thankyou-note{margin:18px 0;padding:13px;border:1px dashed #cfe2cd;border-radius:13px;background:#f0f8ee;color:#4a7952;font-size:12px;font-weight:750}.thankyou-button{width:100%;min-height:46px}.thankyou-secondary{margin-top:12px;padding:10px;border:0;background:transparent;color:#66816a;font:inherit;font-size:11px;cursor:pointer}.thankyou-secondary:hover{color:#28573d}
.modal-fade-enter-active,.modal-fade-leave-active{transition:opacity .22s ease,transform .22s ease}.modal-fade-enter-from,.modal-fade-leave-to{opacity:0;transform:scale(.98)}
@media(max-width:900px){.loans-page{padding:20px}.stats-grid{gap:12px}.stat-card{gap:11px;padding:20px 14px;border-radius:17px}.stat-icon{flex-basis:46px;width:46px;height:46px;border-radius:14px;font-size:23px}.stat-content strong{font-size:26px}.book-card{grid-template-columns:75px minmax(0,1fr);gap:16px}.book-cover{width:75px;height:100px}.book-actions{grid-column:2}.active-actions{max-width:260px}}
@media(max-width:600px){.loans-page{padding:16px 12px}.page-header{align-items:flex-start;flex-direction:column;gap:16px}.catalog-btn{width:100%}.stats-grid{grid-template-columns:1fr;gap:11px;margin-bottom:25px}.stat-card{min-height:94px;padding:17px}.stat-icon{flex-basis:50px;width:50px;height:50px}.stat-content strong{font-size:25px}.stat-arrow{top:50%;right:18px;transform:translateY(-50%)}.stat-card:hover .stat-arrow,.stat-card.selected .stat-arrow{transform:translate(2px,calc(-50% - 2px))}.section-heading h2{font-size:15px}.section-total{padding:7px 9px}.book-card{grid-template-columns:60px minmax(0,1fr);gap:12px;padding:13px;border-radius:15px}.book-cover{width:60px;height:82px;border-radius:8px}.cover-emoji{font-size:24px}.book-cover small{font-size:6px}.book-details h3{font-size:13px}.book-actions{grid-column:1/-1;padding-top:12px;border-top:1px solid #edf1ed}.active-actions{max-width:none}.countdown-box strong{font-size:17px}.policy-card{padding:13px}.return-modal,.thankyou-modal{padding:26px 18px 20px;border-radius:21px}.return-modal h2,.thankyou-modal h2{font-size:18px}.modal-actions{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.loans-page{animation:none}*,*::before,*::after{scroll-behavior:auto!important;transition:none!important}.stat-card:hover{transform:none}.thankyou-icon{animation:none}}
</style>
'''

path = Path("/mnt/data/Loans.vue")
path.write_text(code, encoding="utf-8")
print(f"Created complete Vue component: {path.name} ({len(code.splitlines())} lines, {path.stat().st_size} bytes)")