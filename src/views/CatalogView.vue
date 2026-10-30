<template>
  <div class="catalog-page" v-translate="locale" :data-locale="locale">
    <header class="hero">
      <div class="hero-content">
        <div class="welcome-badge"><span>🌐</span> YOUR ONLINE LIBRARY</div>
        <h1>រកសៀវភៅដែលអ្នកចង់អាន <span>📚</span></h1>
        <p>ស្វែងរកសៀវភៅពីកាតាឡុកអនឡាញ និងបើកអានសៀវភៅដែលអាចអានដោយសេរីនៅទីនេះ។</p>
        <div class="hero-actions">
          <button class="explore-btn" type="button" @click="focusSearch"><span>🔍</span> ចាប់ផ្ដើមស្វែងរក</button>
        </div>
      </div>
      <div class="hero-decoration" aria-hidden="true">
        <div class="floating-book book-one">📕</div><div class="floating-book book-two">📗</div>
        <div class="floating-book book-three">📘</div><div class="hero-circle">🌷</div>
        <div class="hero-sparkle sparkle-one">✦</div><div class="hero-sparkle sparkle-two">✧</div>
      </div>
    </header>

    <section class="section-heading">
      <div><span class="section-kicker">YOUR NEXT FAVORITE BOOK</span><h2>ស្វែងរកសៀវភៅ <span>💚</span></h2>
        <p>ជ្រើសរើសសៀវភៅដែលអ្នកចង់អានថ្ងៃនេះ។</p></div>
      <div class="status-badge"><span class="status-dot"></span>{{ searchTerm ? 'កំពុងស្វែងរកអនឡាញ' : 'សៀវភៅ public domain' }}</div>
    </section>

    <section ref="booksSection" class="search-panel">
      <label class="search-box"><span class="search-icon">🔍</span>
        <input ref="searchInput" v-model="searchQuery" type="search" placeholder="ស្វែងរកសៀវភៅ ឬអ្នកនិពន្ធ..." autocomplete="off" @input="handleSearchInput" />
        <button v-if="searchQuery || selectedTopic" class="clear-search" type="button" aria-label="សម្អាតការស្វែងរក" @click="clearSearch">✕</button>
      </label>
    </section>

    <section class="topic-section" aria-labelledby="topic-heading">
      <div class="topic-heading">
        <div><h2 id="topic-heading">ស្វែងរកតាមប្រធានបទ</h2><p>ជ្រើសរើសប្រធានបទ ដើម្បីរកសៀវភៅដែលពាក់ព័ន្ធ</p></div>
        <button v-if="selectedTopic" class="clear-topic" type="button" @click="clearSearch">សម្អាត ✕</button>
      </div>
      <nav class="topic-grid" aria-label="ប្រធានបទសៀវភៅ">
        <button
          v-for="topic in topics"
          :key="topic.id"
          type="button"
          class="topic-button"
          :class="{ active: selectedTopic?.id === topic.id }"
          :aria-pressed="selectedTopic?.id === topic.id"
          @click="selectTopic(topic)"
        ><span class="topic-icon" aria-hidden="true">{{ topic.icon }}</span><strong>{{ topic.label }}</strong><small>{{ topic.detail }}</small></button>
      </nav>
    </section>

    <nav v-if="!selectedTopic" class="catalog-tabs source-tabs" aria-label="តម្រងប្រភពសៀវភៅ">
      <button type="button" :class="{ active: sourceFilter === 'all' }" @click="sourceFilter = 'all'">សៀវភៅទាំងអស់</button>
      <button type="button" :class="{ active: sourceFilter === 'readable' }" @click="sourceFilter = 'readable'">អាចអានអនឡាញ</button>
      <button type="button" :class="{ active: sourceFilter === 'library' }" @click="sourceFilter = 'library'">ក្នុងបណ្ណាល័យខ្ញុំ</button>
    </nav>

    <div class="results-heading"><div><h2>{{ searchTerm ? '🔍 លទ្ធផលស្វែងរក' : '🌟 ស្វែងរកសៀវភៅអនឡាញ' }}</h2>
      <p>{{ selectedTopic ? `សៀវភៅ ${selectedTopic.label} ដែលមានឯកសារឌីជីថលអាចអានបាន` : searchQuery ? `សម្រាប់ “${searchQuery}”` : 'កាតាឡុកសៀវភៅអានដោយសេរីពី Project Gutenberg និង Open Library' }}</p></div>
      <span class="result-count">{{ khmerNumber(filteredBooks.length) }} ចំណងជើង</span>
    </div>
    <p v-if="readingSyncError" class="reading-sync-error" role="alert">{{ readingSyncError }}</p>
    <p class="online-attribution">សៀវភៅឥតគិតថ្លៃមានកំណត់តាមច្បាប់រក្សាសិទ្ធិនៃប្រទេសនីមួយៗ។ ប្រភព៖ <a href="https://www.gutenberg.org" target="_blank" rel="noopener noreferrer">Project Gutenberg</a> និង <a href="https://openlibrary.org" target="_blank" rel="noopener noreferrer">Open Library</a>.</p>

    <section class="book-grid" aria-label="បញ្ជីសៀវភៅ">
      <article v-for="(book, index) in filteredBooks" :key="book.id" class="book-card">
        <div class="book-cover" :class="`cover-${Number(book.cover ?? index) % 4}`">
          <img v-if="book.coverUrl" class="book-cover-image" :src="book.coverUrl" :alt="`ក្របសៀវភៅ ${book.title}`" loading="lazy" @error="book.coverUrl = ''" />
          <template v-if="!book.coverUrl">
            <span class="cover-top">✦ LIBRARY ✦</span><span class="cover-decoration">✿</span>
            <span class="cover-title" data-no-translate>{{ book.coverTitle ?? book.title }}</span><span class="cover-author" data-no-translate>{{ book.author }}</span>
            <span class="cover-sticker">BOOK<br />LOVE</span>
          </template>
          <span class="cover-spine"></span>
        </div>
        <div class="book-details"><div class="book-meta"><span class="book-category">{{ book.sourceLabel }}</span><span v-if="book.source !== 'library'" class="online-source">អនឡាញ</span></div>
          <h3 data-no-translate :title="book.title">{{ book.title }}</h3><p class="book-author" data-no-translate>✍️ {{ book.author }}</p>
          <div class="book-info"><span class="stock"><span class="stock-dot"></span>{{ book.canRead ? 'អានអនឡាញបាន' : book.ebookAccess === 'borrowable' ? 'ត្រូវខ្ចីមុនអាន' : 'មើលព័ត៌មានសៀវភៅ' }}</span></div>
          <p class="book-shelf">{{ book.publicationYear ? `📅 ${book.publicationYear}` : `📚 ${book.sourceLabel}` }}</p>
          <div class="book-actions">
            <button v-if="book.canRead" class="read-book-btn" type="button" @click="openReader(book)">📖 ចាប់ផ្ដើមអាន</button>
            <a v-else-if="book.onlineUrl" class="read-book-btn source-link" :href="book.onlineUrl" target="_blank" rel="noopener noreferrer">មើលប្រភពសៀវភៅ ↗</a>
            <button v-if="book.canRead" class="mark-read-btn" type="button" :class="{ completed: isRead(book.id) }" @click="toggleRead(book)">{{ isRead(book.id) ? '✓ បានអានហើយ' : 'សម្គាល់ថាបានអាន' }}</button>
          </div>
        </div>
      </article>
      <div v-if="loading" class="empty-results"><div class="empty-emoji">📖</div><h3>កំពុងស្វែងរកសៀវភៅ...</h3><p>សូមរង់ចាំបន្តិច 💚</p></div>
      <div v-else-if="searchError" class="empty-results"><div class="empty-emoji">⚠️</div><h3>មិនអាចស្វែងរកសៀវភៅបានទេ</h3><p>{{ searchError }}</p></div>
      <div v-else-if="!filteredBooks.length" class="empty-results"><div class="empty-emoji">{{ selectedTopic ? '📚' : '🔎' }}</div><h3>{{ selectedTopic ? `មិនទាន់មានសៀវភៅ ${selectedTopic.label} ដែលអាចអានបានទេ` : 'អូ៎! រកមិនឃើញសៀវភៅទេ' }}</h3><p>{{ selectedTopic ? 'យើងបង្ហាញតែសៀវភៅដែលមានឯកសារឌីជីថលសាធារណៈប៉ុណ្ណោះ។ សាកល្បងមើលសៀវភៅបន្ថែម ឬជ្រើសរើសប្រធានបទផ្សេង។' : 'សាកល្បងប្តូរពាក្យស្វែងរក ឬជ្រើសរើសប្រភេទផ្សេង។' }}</p><button class="reset-btn" type="button" @click="selectedTopic ? clearSearch() : resetFilters()">{{ selectedTopic ? 'ជ្រើសរើសប្រធានបទផ្សេង' : '✨ សម្អាតការស្វែងរក' }}</button></div>
    </section>
    <div v-if="onlineHasMore && !loading" class="load-more-wrap"><button class="load-more-btn" type="button" :disabled="loadingMore" @click="loadMoreOnline">{{ loadingMore ? 'កំពុងទាញយក...' : 'មើលសៀវភៅអនឡាញបន្ថែម' }} <span>↓</span></button></div>

    <footer class="catalog-footer"><span class="footer-icon">🌍</span><div><strong>អានសៀវភៅ បង្កើនចំណេះដឹង!</strong><p>អានសៀវភៅឌីជីថលនៅទីនេះ នៅពេលប្រភពសៀវភៅអនុញ្ញាតឲ្យអាន។</p></div><span class="footer-flower">🌼</span></footer>

    <Teleport to="body">
      <div v-if="readerBook" class="reader-overlay" @click.self="closeReader">
        <section class="reader-dialog" role="dialog" aria-modal="true" :aria-label="`អានសៀវភៅ ${readerBook.title}`">
          <header class="reader-header">
            <div class="reader-book-heading"><span class="reader-book-icon">📖</span><div><strong data-no-translate>{{ readerBook.title }}</strong><small data-no-translate>{{ readerBook.author }}</small></div></div>
            <button class="reader-close" type="button" aria-label="បិទសៀវភៅ" @click="closeReader">✕</button>
          </header>
          <div v-if="readerPageCount" class="reader-progress">
            <div class="reader-progress-labels"><span>ទំព័រ {{ khmerNumber(currentReaderPageNumber) }} / {{ khmerNumber(readerPageCount) }}</span><span>{{ Math.max(1, Math.round(((readerPage + 1) / readerPageCount) * 100)) }}%</span></div>
            <div class="reader-progress-track"><span :style="{ width: `${((readerPage + 1) / readerPageCount) * 100}%` }"></span></div>
          </div>
          <div v-if="readerLoading" class="reader-loading" role="status" aria-live="polite">
            <span class="reader-loading-spinner" aria-hidden="true"></span>
            <span>{{ readerContent ? 'កំពុងទាញយកសៀវភៅបន្ត...' : 'កំពុងរៀបចំទំព័រដំបូង...' }}</span>
          </div>
          <p v-if="readerError" class="reader-error">{{ readerError }}</p>
          <div v-if="readerArchivePageCount" class="scan-reader">
            <button class="scan-page-arrow previous" type="button" aria-label="ទំព័រមុន" :disabled="readerPage === 0" @click="changeReaderPage(readerPage - 1)">‹</button>
            <div class="scan-page-stage">
              <div class="scan-page-paper">
                <div v-if="readerImageLoading" class="scan-image-loading">កំពុងបើកទំព័រ... 📖</div>
                <img
                  :key="readerArchivePageUrl"
                  class="scan-page-image"
                  :src="readerArchivePageUrl"
                  :alt="`ទំព័រ ${currentReaderPageNumber} នៃ ${readerBook.title}`"
                  fetchpriority="high"
                  @load="handleArchiveImageLoad"
                  @error="handleArchiveImageError"
                >
              </div>
              <span class="scan-page-number">ទំព័រ {{ khmerNumber(currentReaderPageNumber) }}</span>
            </div>
            <button class="scan-page-arrow next" type="button" aria-label="ទំព័របន្ទាប់" :disabled="readerPage >= readerArchivePageCount - 1" @click="nextReaderPage">›</button>
          </div>
          <div v-else-if="readerPages.length" class="reader-content" data-no-translate>{{ readerPages[readerPage] }}</div>
          <iframe
            v-else-if="readerUrl && !readerLoading && !readerError"
            class="reader-frame"
            :src="readerUrl"
            :title="`ឯកសារអាន៖ ${readerBook.title}`"
            referrerpolicy="no-referrer"
            sandbox="allow-scripts allow-forms allow-downloads"
          ></iframe>
          <div v-else-if="!readerLoading" class="reader-unavailable">
            <span>📚</span><h3>មិនទាន់មានឯកសារអានឌីជីថល</h3>
            <p>{{ readerBook.canRead ? 'មិនអាចបើកឯកសារអានបានទេ។ សូមពិនិត្យអ៊ីនធឺណិត ហើយព្យាយាមម្ដងទៀត។' : readerBook.ebookAccess === 'borrowable' ? 'សៀវភៅនេះត្រូវខ្ចីតាម Open Library មុននឹងអាន។' : 'សៀវភៅនេះមិនមានច្បាប់ឌីជីថលឥតគិតថ្លៃសម្រាប់អានទេ។' }}</p>
            <a v-if="readerBook.onlineUrl" class="reader-external-link" :href="readerBook.onlineUrl" target="_blank" rel="noopener noreferrer">{{ readerBook.ebookAccess === 'borrowable' ? 'ចូលទៅខ្ចីសៀវភៅ' : 'មើលប្រភពសៀវភៅ' }} ↗</a>
          </div>
          <footer v-if="readerPageCount || readerUrl" class="reader-controls">
            <button v-if="readerPageCount" type="button" :disabled="readerPage === 0" @click="changeReaderPage(readerPage - 1)">← ទំព័រមុន</button>
            <label v-if="readerPageCount" class="reader-page-jump">ទៅទំព័រ
              <input :value="readerPage + 1" type="number" min="1" :max="readerPageCount" @change="jumpToReaderPage">
              <span>/ {{ khmerNumber(readerPageCount) }}</span>
            </label>
            <button v-if="readerPageCount" type="button" :disabled="readerPage >= readerPageCount - 1" @click="nextReaderPage">ទំព័របន្ទាប់ →</button>
            <button type="button" @click="markRead(readerBook)">{{ isRead(readerBook.id) ? '✓ បានអានហើយ' : 'សម្គាល់ថាបានអាន' }}</button>
          </footer>
        </section>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue';
import api, { apiConfigured } from '@/services/api';

const emit = defineEmits(['navigate']);
const locale = inject('locale');
const READ_BOOKS_KEY = 'leafline_read_books';
const books = ref([]);
const allBooks = ref([]);
const readBooks = ref([]);
const readingSyncError = ref('');
const searchQuery = ref('');
const selectedTopic = ref(null);
const sourceFilter = ref('all');
const loading = ref(false);
const loadingMore = ref(false);
const searchError = ref('');
const onlineHasMore = ref(false);
const onlinePage = ref(0);
const onlineTotal = ref(0);
const booksSection = ref(null);
const searchInput = ref(null);
const readerBook = ref(null);
const readerPage = ref(0);
const readerContent = ref('');
const readerLoading = ref(false);
const readerError = ref('');
const readerArchive = ref(null);
const readerArchivePages = ref([]);
const readerImageLoading = ref(false);
const gutenbergNext = ref(null);
let searchTimer;
let searchRequest = 0;
let previousBodyOverflow = '';
const prefetchedArchivePages = new Set();
const catalogResponseCache = new Map();

const topics = [
  { id: 'work', label: 'Work', detail: 'ការងារ និងអាជីព', query: 'career work workplace skills management leadership', openLibraryQuery: 'vocational guidance', icon: '💼' },
  { id: 'code', label: 'Code', detail: 'សរសេរកម្មវិធី', query: 'programming coding software development computer science', openLibraryQuery: 'subject:computer programming', icon: '💻' },
  { id: 'excel', label: 'Excel', detail: 'តារាង និងទិន្នន័យ', query: 'Microsoft Excel spreadsheets data analysis', icon: '📊' },
  { id: 'word', label: 'Word', detail: 'សរសេរ និងឯកសារ', query: 'Microsoft Word word processing writing documents', icon: '📝' },
  { id: 'powerpoint', label: 'PowerPoint', detail: 'ធ្វើបទបង្ហាញ', query: 'PowerPoint presentations public speaking presentation design', icon: '📽️' },
  { id: 'business', label: 'Business', detail: 'អាជីវកម្ម', query: 'business entrepreneurship company strategy', icon: '🏢' },
  { id: 'finance', label: 'Finance', detail: 'ហិរញ្ញវត្ថុ', query: 'finance personal money accounting economics', icon: '💰' },
  { id: 'marketing', label: 'Marketing', detail: 'ទីផ្សារ', query: 'marketing advertising digital marketing sales', icon: '📣' },
  { id: 'design', label: 'Design', detail: 'រចនា និងសិល្បៈ', query: 'graphic design creativity art illustration', icon: '🎨' },
  { id: 'science', label: 'Science', detail: 'វិទ្យាសាស្ត្រ', query: 'science biology physics chemistry', icon: '🔬' },
  { id: 'math', label: 'Math', detail: 'គណិតវិទ្យា', query: 'mathematics algebra statistics calculus', icon: '➗' },
  { id: 'language', label: 'Language', detail: 'ភាសា', query: 'language learning English grammar vocabulary', icon: '🌍' },
  { id: 'history', label: 'History', detail: 'ប្រវត្តិសាស្ត្រ', query: 'history world history civilization', icon: '🏛️' },
  { id: 'fiction', label: 'Fiction', detail: 'ប្រលោមលោក', query: 'fiction novels adventure literature', icon: '📖' },
  { id: 'health', label: 'Health', detail: 'សុខភាព', query: 'health wellness psychology nutrition', icon: '🌱' },
];

const searchTerm = computed(() => searchQuery.value.trim() || selectedTopic.value?.query || '');
const openLibrarySearchTerm = computed(() => selectedTopic.value?.openLibraryQuery || searchTerm.value);
const readerArchivePageCount = computed(() => readerArchivePages.value.length);
const readerPageCount = computed(() => readerArchivePageCount.value || readerPages.value.length);
const currentReaderPageNumber = computed(() => {
  const pageNumber = readerArchivePages.value[readerPage.value]?.pageNumber;
  return pageNumber || readerPage.value + 1;
});
const readerArchivePageUrl = computed(() => {
  if (!readerArchive.value || !readerArchivePageCount.value) return '';
  return getArchivePageUrl(readerPage.value);
});
const readerPages = computed(() => {
  if (!readerContent.value.trim()) return [];
  const paragraphs = readerContent.value.split(/\n\s*\n/);
  const pages = [];
  let page = '';
  for (const paragraph of paragraphs) {
    const next = page ? `${page}\n\n${paragraph}` : paragraph;
    if (next.length > 2400 && page) {
      pages.push(page);
      page = paragraph;
    } else {
      page = next;
    }
  }
  if (page) pages.push(page);
  return pages;
});
const readerUrl = computed(() => {
  const rawUrl = readerBook.value?.digitalUrl;
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) return '';
  try {
    const url = new URL(rawUrl, window.location.origin);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
});
const filteredBooks = computed(() => books.value.filter(book => {
  if (selectedTopic.value && !book.canRead) return false;
  return sourceFilter.value === 'all'
    || (sourceFilter.value === 'readable' && book.canRead)
    || (sourceFilter.value === 'library' && book.source === 'library');
}));

function getArchivePageUrl(page) {
  if (!readerArchive.value) return '';
  const imageUrl = new URL(`https://${readerArchive.value.server}/BookReader/BookReaderImages.php`);
  imageUrl.searchParams.set('id', readerArchive.value.id);
  imageUrl.searchParams.set('itemPath', readerArchive.value.dir);
  imageUrl.searchParams.set('server', readerArchive.value.server);
  imageUrl.searchParams.set('page', `n${page}_w800.jpg`);
  return imageUrl.href;
}

function khmerNumber(value) {
  return String(value).replace(/\d/g, digit => '០១២៣៤៥៦៧៨៩'[Number(digit)]);
}

function focusSearch() {
  booksSection.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  searchInput.value?.focus();
}

function selectTopic(topic) {
  selectedTopic.value = topic;
  searchQuery.value = '';
  searchBooks();
}

function handleSearchInput() {
  selectedTopic.value = null;
  searchBooks();
}

async function openReader(book) {
  readerBook.value = book;
  readerPage.value = 0;
  readerContent.value = book.digitalContent ?? book.digital_content ?? '';
  readerArchive.value = null;
  readerArchivePages.value = [];
  readerImageLoading.value = false;
  prefetchedArchivePages.clear();
  readerError.value = '';
  readerLoading.value = Boolean(book.archiveId || book.textUrl);
  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  if (book.archiveId) {
    readerImageLoading.value = true;
    try {
      await loadArchivePages(book);
    } catch (error) {
      console.error('Unable to load scanned book pages:', error);
      readerError.value = 'មិនអាចបើកទំព័រសៀវភៅនេះបានទេ។ សូមព្យាយាមម្ដងទៀត ឬចូលទៅប្រភពសៀវភៅ។';
    } finally {
      readerLoading.value = false;
    }
  } else if (book.textUrl) {
    try {
      const response = await fetchWithTimeout(book.textUrl, 5000);
      if (!response.ok) throw new Error(`Book text request failed with status ${response.status}.`);
      await readGutenbergText(response);
    } catch (error) {
      try {
        const archiveEdition = await findPublicArchiveEdition(book);
        if (!archiveEdition) throw new Error('No matching public scan was found for this title.');
        readerImageLoading.value = true;
      } catch (fallbackError) {
        console.error('Unable to load book text or a matching public scan:', error, fallbackError);
        readerError.value = 'មិនអាចបើកអត្ថបទ ឬទំព័រសៀវភៅបានទេ។ សៀវភៅនេះនៅតែអាចបើកពីប្រភពដើមបាន។';
      }
    } finally {
      readerLoading.value = false;
    }
  }
}

function nextReaderPage() {
  if (readerPage.value >= readerPageCount.value - 1) return;
  changeReaderPage(readerPage.value + 1);
}

function changeReaderPage(page) {
  if (page < 0 || page >= readerPageCount.value) return;
  readerPage.value = page;
  readerImageLoading.value = Boolean(readerArchivePageCount.value);
  if (readerPage.value === readerPageCount.value - 1 && readerBook.value) {
    markRead(readerBook.value);
  }
}

function handleArchiveImageLoad() {
  readerImageLoading.value = false;
  for (const page of [readerPage.value - 1, readerPage.value + 1]) {
    if (page < 0 || page >= readerArchivePageCount.value) continue;
    const url = getArchivePageUrl(page);
    if (prefetchedArchivePages.has(url)) continue;
    prefetchedArchivePages.add(url);
    const image = new Image();
    image.src = url;
  }
}

function jumpToReaderPage(event) {
  const page = Number(event.target.value);
  if (!Number.isInteger(page)) return;
  changeReaderPage(Math.min(Math.max(page - 1, 0), readerPageCount.value - 1));
}

function handleArchiveImageError() {
  readerImageLoading.value = false;
  readerError.value = 'មិនអាចបើករូបភាពទំព័រនេះបានទេ។ សូមសាកល្បងម្តងទៀត។';
}

function closeReader() {
  if (readerPageCount.value && readerPage.value === readerPageCount.value - 1 && readerBook.value) {
    markRead(readerBook.value);
  }
  readerBook.value = null;
  readerContent.value = '';
  readerArchive.value = null;
  readerArchivePages.value = [];
  readerImageLoading.value = false;
  prefetchedArchivePages.clear();
  readerError.value = '';
  document.body.style.overflow = previousBodyOverflow;
}

function cleanGutenbergText(text) {
  return text
    .replace(/^\uFEFF/, '')
    .replace(/^.*?\*\*\*\s*START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[^]*?\*\*\*\s*/i, '')
    .replace(/\s*\*\*\*\s*END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[^]*$/i, '')
    .trim();
}

async function loadReadBooks() {
  try {
    const saved = JSON.parse(localStorage.getItem(READ_BOOKS_KEY) || '[]');
    readBooks.value = Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error('Unable to load read books:', error);
    readBooks.value = [];
  }
  if (!apiConfigured) return;

  try {
    const { data } = await api.get('/reading-list');
    if (!Array.isArray(data)) throw new Error('Reading-list API returned an invalid response.');
    readBooks.value = data;
    localStorage.setItem(READ_BOOKS_KEY, JSON.stringify(data));
    readingSyncError.value = '';
  } catch (error) {
    console.error('Unable to load reading history from account:', error);
    readingSyncError.value = 'មិនអាចភ្ជាប់បញ្ជីសៀវភៅទៅគណនីបានទេ។ សូមចូលគណនីឡើងវិញ ឬពិនិត្យការភ្ជាប់។';
  }
}

function isRead(bookId) {
  return readBooks.value.some(book => String(book.id) === String(bookId));
}

function markRead(book) {
  const record = {
    id: book.id,
    title: book.title,
    author: book.author,
    coverUrl: book.coverUrl ?? '',
    onlineUrl: book.onlineUrl ?? '',
    readAt: new Date().toISOString(),
  };
  readBooks.value = [record, ...readBooks.value.filter(item => String(item.id) !== String(book.id))];
  localStorage.setItem(READ_BOOKS_KEY, JSON.stringify(readBooks.value));
  if (!apiConfigured) {
    window.dispatchEvent(new Event('leafline-reading-updated'));
  } else {
    api.put('/reading-list', record).then(() => {
      readingSyncError.value = '';
      window.dispatchEvent(new Event('leafline-reading-updated'));
    }).catch(error => {
      console.error('Unable to sync reading history:', error);
      readingSyncError.value = 'មិនអាចរក្សាទុកសៀវភៅនេះទៅគណនីបានទេ។ សូមចូលគណនីឡើងវិញ ហើយព្យាយាមម្ដងទៀត។';
    });
  }
}

async function toggleRead(book) {
  if (isRead(book.id)) {
    if (apiConfigured) {
      try {
        await api.delete('/reading-list', { params: { id: book.id } });
        readingSyncError.value = '';
      } catch (error) {
        console.error('Unable to remove book from account reading history:', error);
        readingSyncError.value = 'មិនអាចធ្វើបច្ចុប្បន្នភាពបញ្ជីសៀវភៅបានទេ។ សូមព្យាយាមម្ដងទៀត។';
        return;
      }
    }
    readBooks.value = readBooks.value.filter(item => String(item.id) !== String(book.id));
    localStorage.setItem(READ_BOOKS_KEY, JSON.stringify(readBooks.value));
    window.dispatchEvent(new Event('leafline-reading-updated'));
    return;
  }
  markRead(book);
}

function handleReaderKeydown(event) {
  if (!readerBook.value) return;
  if (event.key === 'Escape') closeReader();
  if (event.key === 'ArrowLeft' && readerPage.value > 0) changeReaderPage(readerPage.value - 1);
  if (event.key === 'ArrowRight' && readerPage.value < readerPageCount.value - 1) {
    nextReaderPage();
  }
}

function clearSearch() {
  searchQuery.value = '';
  selectedTopic.value = null;
  searchBooks();
}

function resetFilters() {
  searchQuery.value = '';
  selectedTopic.value = null;
  sourceFilter.value = 'all';
  searchBooks();
}

function normalizeOpenLibraryBook(book, index) {
  const archiveIds = Array.isArray(book.ia) ? book.ia.filter(Boolean) : book.ia ? [book.ia] : [];
  const archiveId = archiveIds[0] ?? '';
  const ebookAccess = book.ebook_access ?? 'none';
  const editionId = book.edition_key?.[0];
  const workPath = typeof book.key === 'string' ? book.key : '';
  const canRead = Boolean(archiveId && ebookAccess === 'public');
  return {
    id: `openlibrary:${workPath}:${editionId ?? index}`,
    title: book.title ?? 'Untitled',
    author: book.author_name?.join(', ') ?? 'Unknown author',
    source: 'openlibrary',
    sourceLabel: 'Open Library',
    canRead,
    ebookAccess,
    archiveIds,
    archiveId,
    cover: index % 4,
    coverUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : '',
    digitalUrl: canRead ? `https://archive.org/stream/${encodeURIComponent(archiveId)}?ui=embed` : '',
    onlineUrl: editionId
      ? `https://openlibrary.org/books/${encodeURIComponent(editionId)}`
      : workPath
        ? `https://openlibrary.org${workPath}`
        : 'https://openlibrary.org/',
    publicationYear: book.first_publish_year ?? null
  };
}

function titleTokens(value) {
  const ignoredWords = new Set(['a', 'an', 'and', 'for', 'in', 'of', 'the', 'to', 'with']);
  return String(value ?? '')
    .normalize('NFKD')
    .toLocaleLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .match(/[a-z0-9]+/g)
    ?.filter(token => !ignoredWords.has(token)) ?? [];
}

function archiveTitleMatches(bookTitle, archiveTitle) {
  const expected = titleTokens(bookTitle);
  const actual = new Set(titleTokens(archiveTitle));
  if (!expected.length || !actual.size) return false;
  const matches = expected.filter(token => actual.has(token)).length;
  return matches >= Math.ceil(expected.length / 2);
}

async function verifyOpenLibraryBook(book) {
  if (!book.canRead || !book.archiveIds.length) return book;
  for (const archiveId of book.archiveIds.slice(0, 3)) {
    try {
      const response = await fetchWithTimeout(`https://archive.org/metadata/${encodeURIComponent(archiveId)}`);
      if (!response.ok) throw new Error(`Archive.org metadata request failed with status ${response.status}.`);
      const data = await response.json();
      if (archiveTitleMatches(book.title, data.metadata?.title)) {
        return {
          ...book,
          archiveId,
          digitalUrl: `https://archive.org/stream/${encodeURIComponent(archiveId)}?ui=embed`,
        };
      }
    } catch (error) {
      console.warn(`Unable to verify Archive.org scan "${archiveId}" for "${book.title}":`, error);
    }
  }
  console.warn(`No matching public scan was found for "${book.title}".`);
  return { ...book, canRead: false, digitalUrl: '' };
}

async function loadArchivePages(book) {
  const metadataResponse = await fetchWithTimeout(`https://archive.org/metadata/${encodeURIComponent(book.archiveId)}`);
  if (!metadataResponse.ok) throw new Error(`Archive metadata request failed with status ${metadataResponse.status}.`);
  const metadata = await metadataResponse.json();
  const pageNumbersFile = metadata.files?.find(file => file.name.endsWith('_page_numbers.json'));
  if (!metadata.server || !metadata.dir || !pageNumbersFile) {
    throw new Error('The public scan is missing its page information.');
  }
  const pageNumbersUrl = new URL(
    `/download/${encodeURIComponent(book.archiveId)}/${encodeURIComponent(pageNumbersFile.name)}`,
    'https://archive.org',
  );
  const pagesResponse = await fetchWithTimeout(pageNumbersUrl);
  if (!pagesResponse.ok) throw new Error(`Archive page information request failed with status ${pagesResponse.status}.`);
  const pageData = await pagesResponse.json();
  if (!Array.isArray(pageData.pages) || pageData.pages.length === 0) {
    throw new Error('The public scan does not contain readable pages.');
  }
  readerArchive.value = { id: book.archiveId, server: metadata.server, dir: metadata.dir };
  readerArchivePages.value = pageData.pages;
}

async function findPublicArchiveEdition(book) {
  const result = await fetchOpenLibrary(`title:"${book.title}"`);
  const candidates = (result.docs ?? [])
    .map(normalizeOpenLibraryBook)
    .filter(candidate => candidate.canRead && archiveTitleMatches(book.title, candidate.title))
    .slice(0, 5);
  for (const candidate of candidates) {
    const verifiedCandidate = await verifyOpenLibraryBook(candidate);
    if (!verifiedCandidate.canRead) continue;
    try {
      await loadArchivePages(verifiedCandidate);
      return verifiedCandidate;
    } catch (error) {
      console.warn(`Unable to load scanned pages for "${verifiedCandidate.title}":`, error);
      readerArchive.value = null;
      readerArchivePages.value = [];
    }
  }
  return null;
}

function normalizeGutenbergBook(book) {
  const formats = book.formats ?? {};
  const textUrl = Object.entries(formats).find(([format, url]) => format.startsWith('text/plain') && url)?.[1] ?? '';
  return {
    id: `gutenberg:${book.id}`,
    title: book.title ?? 'Untitled',
    author: book.authors?.map(author => author.name).join(', ') || 'Unknown author',
    source: 'gutenberg',
    sourceLabel: 'Project Gutenberg',
    canRead: Boolean(textUrl),
    textUrl,
    digitalUrl: textUrl,
    ebookAccess: 'public',
    coverUrl: formats['image/jpeg'] ?? '',
    onlineUrl: `https://www.gutenberg.org/ebooks/${book.id}`,
    publicationYear: null,
  };
}

function mergeBooks(...groups) {
  const seen = new Set();
  return groups.flat().filter(book => {
    const identity = `${book.title}::${book.author}`.normalize('NFKC').toLocaleLowerCase();
    if (seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
}

async function fetchOpenLibrary(query, page = 0) {
  const params = new URLSearchParams({
    q: query,
    fields: 'key,title,author_name,first_publish_year,cover_i,edition_key,ia,ebook_access',
    limit: '20',
    offset: String(page * 20)
  });
  return fetchCatalogJson(`https://openlibrary.org/search.json?${params}`, 'Open Library search');
}

async function fetchGutenberg(query, url = '') {
  const endpoint = url || `https://gutendex.com/books/${query ? `?search=${encodeURIComponent(query)}` : ''}`;
  return fetchCatalogJson(endpoint, 'Project Gutenberg search');
}

async function fetchCatalogJson(url, source) {
  const cached = catalogResponseCache.get(url);
  if (cached && cached.expiresAt > Date.now()) return cached.promise;

  const request = fetchWithTimeout(url).then(async response => {
    if (!response.ok) throw new Error(`${source} failed with status ${response.status}.`);
    return response.json();
  });
  catalogResponseCache.set(url, { expiresAt: Number.POSITIVE_INFINITY, promise: request });

  try {
    const data = await request;
    catalogResponseCache.set(url, { expiresAt: Date.now() + 60_000, promise: Promise.resolve(data) });
    if (catalogResponseCache.size > 40) {
      catalogResponseCache.delete(catalogResponseCache.keys().next().value);
    }
    return data;
  } catch (error) {
    catalogResponseCache.delete(url);
    throw error;
  }
}

async function readGutenbergText(response) {
  if (!response.body?.getReader) {
    readerContent.value = cleanGutenbergText(await response.text());
    return;
  }

  const stream = response.body.getReader();
  const decoder = new TextDecoder();
  let text = '';
  let lastPublishedLength = 0;

  while (true) {
    const { done, value } = await stream.read();
    text += decoder.decode(value, { stream: !done });
    if (done || (text.length >= 4096 && (lastPublishedLength === 0 || text.length - lastPublishedLength >= 128 * 1024))) {
      const content = cleanGutenbergText(text);
      if (content && (content.length >= 2400 || done)) {
        readerContent.value = content;
        readerLoading.value = !done;
        lastPublishedLength = text.length;
      }
    }
    if (done) break;
  }
}

async function fetchWithTimeout(url, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    window.clearTimeout(timeout);
  }
}

function searchBooks() {
  window.clearTimeout(searchTimer);
  const requestId = ++searchRequest;
  const query = searchTerm.value;
  books.value = [];
  allBooks.value = [];
  loadingMore.value = false;
  searchError.value = '';
  onlineHasMore.value = false;
  onlinePage.value = 0;
  onlineTotal.value = 0;
  gutenbergNext.value = null;
  if (query.length < 2) {
    if (query) {
      books.value = [];
      loading.value = false;
      return;
    }
    loading.value = true;
    searchTimer = window.setTimeout(() => loadFeaturedBooks(requestId), 50);
    return;
  }
  loading.value = true;
  searchTimer = window.setTimeout(async () => {
    const results = await Promise.allSettled([
      fetchOpenLibrary(openLibrarySearchTerm.value),
      selectedTopic.value ? Promise.resolve({ results: [], next: null }) : fetchGutenberg(query),
      apiConfigured ? api.get('/books/search', { params: { q: query } }) : Promise.resolve({ data: [] })
    ]);
    if (requestId !== searchRequest) return;
    await applySearchResults(results, requestId);
  }, 300);
}

async function loadFeaturedBooks(requestId) {
  const results = await Promise.allSettled([
    fetchOpenLibrary('classic literature'),
    fetchGutenberg(),
    apiConfigured ? api.get('/books') : Promise.resolve({ data: [] })
  ]);
  if (requestId !== searchRequest) return;
  await applySearchResults(results, requestId);
}

async function applySearchResults(results, requestId) {
  const [openLibraryResult, gutenbergResult, libraryResult] = results;
  const openLibraryBooks = [];
  const gutenbergBooks = [];
  let failedSources = 0;
  if (openLibraryResult.status === 'fulfilled') {
    const docs = Array.isArray(openLibraryResult.value.docs) ? openLibraryResult.value.docs : [];
    const normalizedBooks = docs.map(normalizeOpenLibraryBook);
    openLibraryBooks.push(...(selectedTopic.value
      ? await Promise.all(normalizedBooks.map(verifyOpenLibraryBook))
      : normalizedBooks));
    onlineTotal.value = Number(openLibraryResult.value.numFound ?? docs.length);
    onlineHasMore.value = onlineTotal.value > docs.length;
  } else {
    failedSources++;
    console.error('Unable to search Open Library:', openLibraryResult.reason);
  }
  if (gutenbergResult.status === 'fulfilled') {
    const entries = Array.isArray(gutenbergResult.value.results) ? gutenbergResult.value.results : [];
    gutenbergBooks.push(...entries.map(normalizeGutenbergBook));
    gutenbergNext.value = gutenbergResult.value.next ?? null;
  } else {
    failedSources++;
    console.error('Unable to search Project Gutenberg:', gutenbergResult.reason);
  }
  const libraryBooks = libraryResult.status === 'fulfilled' && Array.isArray(libraryResult.value.data)
    ? libraryResult.value.data.map((book, index) => ({
      ...book,
      id: book.id ?? `library:${index}`,
      source: 'library',
      title: book.title ?? 'មិនស្គាល់ចំណងជើង',
      author: book.author ?? 'មិនស្គាល់អ្នកនិពន្ធ',
      coverUrl: book.cover_url ?? book.coverUrl ?? '',
      onlineUrl: book.online_url ?? '',
      digitalUrl: book.digital_url ?? book.digitalUrl ?? book.ebook_url ?? book.pdf_url ?? '',
      digitalContent: book.digital_content ?? book.digitalContent ?? book.full_text ?? book.content ?? '',
      canRead: Boolean(book.digital_content || book.digitalContent || book.full_text || book.content || book.digital_url || book.digitalUrl || book.ebook_url || book.pdf_url),
      ebookAccess: 'public',
      sourceLabel: 'បណ្ណាល័យរបស់ខ្ញុំ',
      publicationYear: book.publication_year ?? null,
    }))
    : [];
  if (libraryResult.status === 'rejected') {
    console.error('Unable to load library records:', libraryResult.reason);
  }
  allBooks.value = mergeBooks(gutenbergBooks, openLibraryBooks, libraryBooks);
  books.value = allBooks.value;
  if (!books.value.length && failedSources === 2 && !libraryBooks.length) {
    searchError.value = 'មិនអាចភ្ជាប់ទៅកាតាឡុកសៀវភៅបានទេ។ សូមពិនិត្យអ៊ីនធឺណិត ហើយព្យាយាមម្ដងទៀត។';
  } else if (!books.value.length && searchTerm.value) {
    searchError.value = 'រកមិនឃើញសៀវភៅដែលត្រូវនឹងពាក្យស្វែងរកនេះទេ។';
  }
  loading.value = requestId === searchRequest ? false : loading.value;
}

async function loadMoreOnline() {
  if (loadingMore.value || !onlineHasMore.value) return;
  loadingMore.value = true;
  const requestId = searchRequest;
  const query = searchTerm.value;
  try {
    const nextPage = onlinePage.value + 1;
    const [openLibraryResult, gutenbergResult] = await Promise.allSettled([
      fetchOpenLibrary(openLibrarySearchTerm.value || 'classic literature', nextPage),
      gutenbergNext.value ? fetchGutenberg(query, gutenbergNext.value) : Promise.resolve(null),
    ]);
    if (requestId !== searchRequest) return;
    const moreBooks = [];
    if (openLibraryResult.status === 'fulfilled') {
      const docs = Array.isArray(openLibraryResult.value.docs) ? openLibraryResult.value.docs : [];
      const normalizedBooks = docs.map(normalizeOpenLibraryBook);
      moreBooks.push(...(selectedTopic.value
        ? await Promise.all(normalizedBooks.map(verifyOpenLibraryBook))
        : normalizedBooks));
      onlineTotal.value = Number(openLibraryResult.value.numFound ?? onlineTotal.value);
    } else {
      console.error('Unable to load more Open Library results:', openLibraryResult.reason);
    }
    if (gutenbergResult.status === 'fulfilled' && gutenbergResult.value) {
      moreBooks.push(...(gutenbergResult.value.results ?? []).map(normalizeGutenbergBook));
      gutenbergNext.value = gutenbergResult.value.next ?? null;
    }
    books.value = mergeBooks(books.value, moreBooks);
    allBooks.value = books.value;
    onlinePage.value = nextPage;
    onlineHasMore.value = Boolean(gutenbergNext.value) || onlineTotal.value > (nextPage + 1) * 20;
  } catch (error) {
    console.error('Unable to load more online books:', error);
  } finally {
    loadingMore.value = false;
  }
}

onMounted(() => {
  loadReadBooks();
  searchBooks();
  window.addEventListener('keydown', handleReaderKeydown);
  window.addEventListener('storage', loadReadBooks);
  window.addEventListener('leafline-reading-updated', loadReadBooks);
});

onBeforeUnmount(() => {
  window.clearTimeout(searchTimer);
  document.body.style.overflow = previousBodyOverflow;
  window.removeEventListener('keydown', handleReaderKeydown);
  window.removeEventListener('storage', loadReadBooks);
  window.removeEventListener('leafline-reading-updated', loadReadBooks);
});
</script>

<style scoped>
.catalog-page{--green:#347653;--green-dark:#234d37;--green-soft:#eaf5ec;--cream:#fffaf0;--text:#243b2d;--muted:#829087;width:100%;max-width:1250px;margin:0 auto;padding:24px;box-sizing:border-box;color:var(--text);font-family:Inter,"Noto Sans Khmer",sans-serif}
button{font:inherit}button:focus-visible,input:focus-visible{outline:3px solid #9acba6;outline-offset:3px}
.hero{position:relative;display:flex;min-height:245px;align-items:center;justify-content:space-between;overflow:hidden;padding:32px 38px;border:1px solid #e2eadf;border-radius:25px;background:linear-gradient(115deg,#f0f8ef,#fff7e9)}
.hero-content{position:relative;z-index:2;max-width:620px}.welcome-badge{display:inline-flex;align-items:center;gap:7px;padding:7px 12px;border:1px solid #dcebdc;border-radius:30px;background:#ffffffc7;color:var(--green);font-size:11px;font-weight:700}
.hero h1{margin:17px 0 10px;font-size:clamp(23px,3vw,34px);font-weight:800;line-height:1.5;letter-spacing:-.6px}.hero-content>p{max-width:500px;margin:0;color:#748277;font-size:13px;line-height:1.9}.hero-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:23px}
.explore-btn{display:inline-flex;min-height:45px;align-items:center;justify-content:center;gap:9px;padding:0 16px;border-radius:12px;cursor:pointer;font-size:12px;font-weight:700;transition:transform .2s ease,background .2s ease,box-shadow .2s ease}
.explore-btn{border:1px solid var(--green);background:var(--green);color:#fff;box-shadow:0 5px 13px #34765322}.explore-btn:hover{transform:translateY(-2px);background:var(--green-dark)}
.hero-decoration{position:relative;width:245px;min-width:180px;height:200px}.hero-circle{position:absolute;top:29px;right:28px;display:grid;width:140px;height:140px;place-items:center;border:1px solid #e4ead6;border-radius:50%;background:#ffffffa8;font-size:68px;box-shadow:0 12px 30px #315a3210}.floating-book{position:absolute;z-index:1;display:grid;width:56px;height:61px;place-items:center;border:4px solid white;border-radius:8px 13px 13px 8px;background:#fff;box-shadow:0 8px 17px #234d3720;font-size:29px}.book-one{top:8px;left:8px;transform:rotate(-15deg)}.book-two{right:0;bottom:12px;transform:rotate(13deg)}.book-three{bottom:0;left:23px;transform:rotate(-7deg)}.hero-sparkle{position:absolute;color:#d2a54e;font-size:25px}.sparkle-one{top:2px;right:8px}.sparkle-two{bottom:27px;left:1px}
.section-heading{display:flex;align-items:center;justify-content:space-between;gap:15px;margin:34px 0 18px}.section-kicker{color:#80a18a;font-size:9px;font-weight:800;letter-spacing:1.5px}.section-heading h2{margin:5px 0;font-size:23px;font-weight:800}.section-heading p{margin:0;color:var(--muted);font-size:12px;line-height:1.8}.status-badge{display:inline-flex;flex-shrink:0;align-items:center;gap:8px;padding:8px 12px;border:1px solid #e2eae1;border-radius:25px;background:#fff;color:#738175;font-size:10px}.status-dot,.stock-dot{width:7px;height:7px;flex-shrink:0;border-radius:50%;background:#4d9a62}
.search-panel{display:flex;gap:12px;scroll-margin-top:20px}.search-box{display:flex;min-width:0;height:51px;flex:1;align-items:center;gap:12px;padding:0 16px;border:1px solid #e0e8df;border-radius:14px;background:#fff;box-shadow:0 4px 14px #203d2910;transition:.2s}.search-box:focus-within{border-color:#83b68b;box-shadow:0 0 0 4px #eaf5ec}.search-icon{font-size:17px}.search-box input{width:100%;min-width:0;border:0;outline:0;background:transparent;color:var(--text);font-size:12px}.search-box input::placeholder{color:#a0aaa2}.clear-search{border:0;background:transparent;color:#87938a;cursor:pointer}

.results-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:29px 0 17px}.results-heading h2{margin:0;font-size:17px;font-weight:800}.results-heading p{margin:5px 0 0;color:#87938a;font-size:11px;line-height:1.8}.result-count{flex-shrink:0;padding:7px 11px;border-radius:25px;background:#edf6ed;color:#347653;font-size:10px;font-weight:700}
.book-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:stretch;gap:20px}.book-card{min-width:0;overflow:hidden;border:1px solid #e5ebe3;border-radius:18px;background:#fff;box-shadow:0 4px 14px #203d2908;transition:transform .22s,box-shadow .22s}.book-card:hover{transform:translateY(-5px);box-shadow:0 14px 30px #203d2913}.book-cover{position:relative;display:flex;min-height:205px;flex-direction:column;justify-content:flex-end;overflow:hidden;padding:22px;color:#fff9ec;isolation:isolate}.cover-0{background:linear-gradient(145deg,#bd8b70,#785145 75%)}.cover-1{background:linear-gradient(145deg,#a5b38c,#526b55 75%)}.cover-2{background:linear-gradient(145deg,#86aeb5,#415a72 75%)}.cover-3{background:linear-gradient(145deg,#e0a58c,#a75e61 75%)}.book-cover::after{position:absolute;z-index:-1;top:-50px;right:-35px;width:180px;height:180px;border:1px solid #ffffff38;border-radius:50%;content:""}.cover-top{position:absolute;top:17px;left:22px;font-size:8px;font-weight:800;letter-spacing:1.4px;opacity:.85}.cover-decoration{position:absolute;top:35px;right:22px;color:#fff3ce8a;font-size:70px;line-height:1}.cover-title{position:relative;z-index:1;max-width:220px;overflow-wrap:anywhere;font-family:Georgia,serif;font-size:22px;font-weight:800;line-height:1.25;text-shadow:0 2px 8px #0003}.cover-author{position:relative;z-index:1;margin-top:9px;font-size:10px;opacity:.9}.cover-spine{position:absolute;top:0;bottom:0;left:0;width:10px;border-right:1px solid #ffffff38;background:#00000015}.cover-sticker{position:absolute;top:14px;right:14px;display:grid;width:43px;height:43px;place-content:center;border:1px solid #ffffff8a;border-radius:50%;background:#ffffff24;font-size:7px;font-weight:800;line-height:1.4;text-align:center;transform:rotate(10deg)}
.book-details{padding:17px}.book-meta{display:flex;align-items:center;justify-content:space-between;gap:8px}.book-category{padding:5px 8px;border-radius:7px;background:#eef7ed;color:#39774d;font-size:9px;font-weight:700}.favorite-icon{color:#db9b9b;font-size:23px;line-height:1}.book-details h3{display:-webkit-box;min-height:42px;margin:11px 0 5px;overflow:hidden;color:#263c2e;font-size:14px;font-weight:800;line-height:1.55;overflow-wrap:anywhere;-webkit-box-orient:vertical;-webkit-line-clamp:2}.book-author{margin:0;color:#869188;font-size:10px}.book-info{margin-top:15px}.stock{display:inline-flex;align-items:center;gap:7px;color:#39774d;font-size:10px;font-weight:700}.stock.unavailable{color:#bf655a}.stock.unavailable .stock-dot{background:#cf7668}.book-shelf{margin:10px 0 0;overflow:hidden;color:#98a198;font-size:10px;text-overflow:ellipsis;white-space:nowrap}.book-actions{display:grid;gap:8px;margin-top:16px}.add-cart-btn,.hold-button,.read-book-btn{display:flex;width:100%;min-height:39px;align-items:center;justify-content:center;gap:8px;padding:8px 10px;border:1px solid #dce9dc;border-radius:11px;background:#f4faf3;color:#347653;cursor:pointer;font-size:11px;font-weight:800;transition:.2s}.read-book-btn{border-color:#d9c99c;background:#fff9e9;color:#715b2c}.read-book-btn:hover{transform:translateY(-1px);border-color:#c9ad68;background:#fff1cc}.add-cart-btn{border-color:#347653;background:#347653;color:#fff}.add-cart-btn:hover:not(:disabled){transform:translateY(-1px);background:#234d37}.hold-button:hover:not(:disabled){border-color:#a9cfac;background:#e7f4e7}.add-cart-btn:disabled,.hold-button:disabled{border-color:#e7ebe5;background:#f1f3f0;color:#9ca69d;cursor:not-allowed;transform:none}.held-button{border-color:#f0e4c6!important;background:#fff9e9!important;color:#94732e!important}
.empty-results{grid-column:1/-1;display:flex;min-height:250px;flex-direction:column;align-items:center;justify-content:center;padding:25px;border:1px dashed #d8e5d7;border-radius:20px;background:#fbfef9;text-align:center}.empty-emoji{margin-bottom:12px;font-size:45px}.empty-results h3{margin:0;font-size:16px}.empty-results p{margin:9px 0 17px;color:#89948a;font-size:12px;line-height:1.8}.reset-btn{padding:10px 15px;border:0;border-radius:11px;background:#347653;color:#fff;cursor:pointer;font-size:11px;font-weight:700}
.catalog-footer{display:flex;align-items:center;gap:14px;margin-top:28px;padding:19px;border:1px solid #e4ebde;border-radius:17px;background:linear-gradient(110deg,#f3f9ed,#fff9ec)}.footer-icon{display:grid;width:43px;height:43px;flex-shrink:0;place-items:center;border-radius:13px;background:#fff;font-size:22px}.catalog-footer strong{font-size:12px}.catalog-footer p{margin:5px 0 0;color:#849085;font-size:10px;line-height:1.9}.footer-flower{margin-left:auto;font-size:28px}
.reader-overlay{position:fixed;inset:0;z-index:2147483001;display:grid;place-items:center;padding:18px;background:#15251cbb;backdrop-filter:blur(5px)}
.reader-dialog{display:flex;width:min(900px,100%);max-height:min(92vh,1000px);flex-direction:column;overflow:hidden;border:1px solid #e6e0ce;border-radius:20px;background:#faf7ed;box-shadow:0 24px 80px #0005}
.reader-header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 20px;border-bottom:1px solid #e9e3d4;background:#fffdf7}
.reader-book-heading{display:flex;min-width:0;align-items:center;gap:12px}.reader-book-icon{display:grid;width:42px;height:42px;flex-shrink:0;place-items:center;border-radius:13px;background:#e9f3e8;font-size:21px}.reader-book-heading div{display:grid;gap:3px;min-width:0}.reader-book-heading strong{overflow:hidden;color:#294733;font-size:14px;text-overflow:ellipsis;white-space:nowrap}.reader-book-heading small{color:#788477;font-size:11px}.reader-close{width:38px;height:38px;flex-shrink:0;border:1px solid #e5e8df;border-radius:11px;background:#fff;color:#647168;cursor:pointer;font-size:15px}.reader-progress{display:grid;gap:8px;padding:13px 24px 0;color:#6f806f;font-size:10px;font-weight:700}.reader-progress-track{height:5px;overflow:hidden;border-radius:10px;background:#e7e7d8}.reader-progress-track span{display:block;height:100%;border-radius:inherit;background:#5d9366;transition:width .2s ease}.reader-content{width:min(680px,calc(100% - 40px));min-height:300px;max-height:65vh;align-self:center;margin:18px 20px;padding:clamp(24px,6vw,58px);overflow:auto;border:1px solid #e9e1cf;background:#fffdf7;box-shadow:0 8px 25px #5e523012;color:#3c3a32;font-family:Georgia,"Noto Sans Khmer",serif;font-size:17px;line-height:2.1;white-space:pre-wrap;overflow-wrap:anywhere}.reader-frame{width:100%;height:min(72vh,760px);border:0;background:#fff}.reader-unavailable{display:flex;min-height:340px;flex-direction:column;align-items:center;justify-content:center;padding:32px;text-align:center}.reader-unavailable>span{font-size:48px}.reader-unavailable h3{margin:15px 0 6px;color:#385742;font-size:17px}.reader-unavailable p{max-width:470px;margin:0;color:#788477;font-size:12px;line-height:1.9}.reader-controls{display:flex;justify-content:space-between;gap:12px;padding:13px 20px;border-top:1px solid #e9e3d4;background:#fffdf7}.reader-controls button{min-height:40px;padding:0 15px;border:1px solid #cddfcf;border-radius:11px;background:#f0f7ef;color:#347653;cursor:pointer;font:inherit;font-size:11px;font-weight:800}.reader-controls button:disabled{border-color:#e6e8e2;background:#f4f4f0;color:#a2aaa2;cursor:not-allowed}
.reader-progress-labels{display:flex;align-items:center;justify-content:space-between;gap:12px}
.scan-reader{position:relative;display:flex;min-height:0;flex:1;align-items:center;justify-content:center;padding:12px 64px 8px;background:radial-gradient(ellipse at center,#eeeadd 0,#e4e1d6 72%,#d9d6cc 100%)}
.scan-page-stage{display:flex;min-width:0;max-width:100%;max-height:100%;flex-direction:column;align-items:center;gap:8px}
.scan-page-paper{position:relative;display:grid;min-width:min(560px,100%);min-height:280px;max-width:100%;max-height:min(66vh,760px);place-items:center;overflow:auto;border:1px solid #d8d1c3;background:#fffdf8;box-shadow:0 12px 38px #29271b26}
.scan-page-image{display:block;width:auto;height:auto;max-width:min(100%,880px);max-height:min(66vh,760px);object-fit:contain}
.scan-image-loading{position:absolute;z-index:1;display:grid;inset:0;place-items:center;background:#fffdf8d9;color:#607366;font-size:13px;font-weight:700}
.scan-page-number{color:#70786f;font-size:10px;font-weight:700}
.scan-page-arrow{position:absolute;z-index:2;top:50%;display:grid;width:44px;height:56px;place-items:center;border:1px solid #fff9;border-radius:13px;background:#fffdf0e8;color:#356047;box-shadow:0 5px 18px #29271b1c;cursor:pointer;font:inherit;font-size:42px;line-height:1;transform:translateY(-50%);transition:background .15s,transform .15s}
.scan-page-arrow:hover:not(:disabled){background:#fff;transform:translateY(-50%) scale(1.05)}
.scan-page-arrow:disabled{opacity:.35;cursor:not-allowed}
.scan-page-arrow.previous{left:14px}
.scan-page-arrow.next{right:14px}
.reader-page-jump{display:flex;align-items:center;gap:7px;color:#6f806f;font-size:10px;font-weight:700}
.reader-page-jump input{width:56px;height:38px;padding:0 7px;border:1px solid #dce5d9;border-radius:9px;background:#fff;color:#31543b;text-align:center;font:inherit}
.reader-controls{align-items:center;flex-wrap:wrap}
.reader-controls button:last-child{margin-left:auto}
.reader-error{margin:10px 20px 0;padding:10px 13px;border:1px solid #f0d5cf;border-radius:10px;background:#fff4f1;color:#a45043;font-size:11px;line-height:1.7}
@media(max-width:900px){.book-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:15px}.hero{padding:27px}.hero-decoration{width:180px;min-width:150px;transform:scale(.9);transform-origin:center right}}
@media(max-width:600px){.topic-section{margin:16px 0 12px;padding:12px;border-radius:14px}.topic-heading h2{font-size:13px}.topic-heading p{max-width:245px;font-size:9px}.topic-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.topic-button{min-height:54px;grid-template-columns:24px minmax(0,1fr);column-gap:5px;padding:7px 6px;border-radius:10px}.topic-icon{width:23px;height:23px;border-radius:7px;font-size:13px}.topic-button strong{font-size:10px}.topic-button small{font-size:7px}.source-tabs{gap:6px}.source-tabs button{min-height:34px;padding:0 10px;font-size:9px}}
@media(max-width:600px){.scan-reader{padding:10px 44px 7px}.scan-page-paper{min-width:0;min-height:240px;max-height:62vh}.scan-page-image{max-height:62vh}.scan-page-arrow{width:34px;height:46px;border-radius:10px;font-size:34px}.scan-page-arrow.previous{left:5px}.scan-page-arrow.next{right:5px}.reader-controls{justify-content:center;gap:7px;padding:10px}.reader-controls button:last-child{margin-left:0}.reader-page-jump{gap:4px}.reader-page-jump input{width:46px;height:36px}.reader-controls button{min-height:36px;padding:0 9px;font-size:9px}}
@media(max-width:600px){.catalog-page{padding:14px}.hero{min-height:0;padding:23px 19px;border-radius:20px}.hero-decoration{position:absolute;right:-40px;bottom:-30px;width:160px;opacity:.23;pointer-events:none}.hero-content{max-width:100%}.hero h1{max-width:440px;font-size:24px}.hero-content>p{max-width:340px;font-size:11px}.hero-actions{gap:8px}.explore-btn,.cart-btn{min-height:40px;gap:6px;padding:0 10px;font-size:10px}.section-heading{align-items:flex-start;margin-top:26px}.section-heading h2{font-size:20px}.section-heading p{max-width:270px}.status-badge{padding:7px 9px;font-size:9px}.search-box{height:46px;gap:8px;padding:0 11px}.search-box input{font-size:10px}.filter-button{gap:5px;padding:0 11px;font-size:10px}.category-nav{gap:7px;margin:17px 0}.category-nav button{padding:9px 11px;font-size:10px}.hold-banner{flex-wrap:wrap;padding:12px}.hold-banner>button{width:100%;justify-content:center;margin:0}.results-heading h2{font-size:15px}.book-grid{gap:11px}.book-cover{min-height:165px;padding:16px}.cover-top{left:16px;font-size:7px}.cover-title{font-size:18px}.cover-sticker{top:12px;right:9px;width:34px;height:34px;font-size:6px}.book-details{padding:12px}.book-details h3{min-height:42px;font-size:12px}.book-category{max-width:calc(100% - 25px);overflow:hidden;font-size:8px;text-overflow:ellipsis;white-space:nowrap}.add-cart-btn,.hold-button,.read-book-btn{gap:5px;padding:7px 4px;font-size:9px}.catalog-footer{align-items:flex-start;gap:10px;padding:13px}.footer-icon{width:36px;height:36px;font-size:18px}.footer-flower{display:none}.reader-overlay{padding:8px}.reader-dialog{max-height:96vh;border-radius:15px}.reader-header{padding:12px}.reader-content{width:calc(100% - 20px);min-height:250px;max-height:68vh;margin:10px;padding:23px;font-size:15px}.reader-progress{padding:11px 14px 0}.reader-controls{padding:10px 12px}.reader-controls button{min-height:38px;padding:0 10px;font-size:10px}.reader-frame{height:75vh}.reader-unavailable{min-height:280px;padding:22px}}
@media(max-width:600px){.floating-cart-wrap{right:max(12px,env(safe-area-inset-right));top:50%;bottom:auto;gap:9px}.floating-cart-bot{min-height:54px;gap:8px;padding:7px 14px 7px 7px}.cart-bot-art{width:39px;height:39px;font-size:22px}.floating-cart-count{left:36px}.floating-cart-label{font-size:11px}.cart-bot-message{width:min(310px,calc(100vw - 24px));padding:13px 11px 11px;gap:8px}.cart-bot-check{width:31px;height:31px;font-size:18px}.cart-bot-message strong{font-size:11px}.cart-bot-message p{font-size:10px}.cart-bot-view{padding:8px;font-size:9px}}
@media(max-width:380px){.book-grid{grid-template-columns:1fr}.book-card{display:grid;grid-template-columns:115px minmax(0,1fr);align-items:stretch}.book-cover{min-height:100%;padding:13px}.cover-top{left:13px;font-size:6px}.cover-title{font-size:15px}.cover-decoration{right:8px;font-size:48px}.cover-sticker{display:none}.book-details{padding:12px 10px}.book-details h3{font-size:11px}.book-actions{gap:6px;margin-top:12px}.add-cart-btn,.hold-button{min-height:34px;font-size:9px}.section-heading{flex-direction:column}}
.book-cover-image{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#fff;padding:8px;box-sizing:border-box}
.online-source{padding:5px 8px;border-radius:7px;background:#eaf2ff;color:#42638d;font-size:9px;font-weight:700}
.load-more-wrap{display:flex;justify-content:center;margin:22px 0}
.load-more-btn{display:flex;min-height:44px;align-items:center;gap:10px;padding:0 18px;border:1px solid #c8ddcb;border-radius:12px;background:#f1f8ef;color:#347653;cursor:pointer;font:inherit;font-size:12px;font-weight:800}
.load-more-btn:disabled{opacity:.65;cursor:wait}
.reader-external-link{display:inline-flex;align-items:center;gap:7px;margin-top:18px;padding:11px 15px;border-radius:10px;background:#347653;color:#fff;font-size:11px;font-weight:800;text-decoration:none}
.online-attribution{margin:-8px 0 16px;color:#829087;font-size:10px;line-height:1.7}
.online-attribution a{color:#347653;font-weight:700}
.topic-section{margin:20px 0 14px;padding:17px;border:1px solid #e3ebe0;border-radius:17px;background:linear-gradient(135deg,#f8fbf6,#fffdf8)}
.topic-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:13px}
.topic-heading h2{margin:0;color:#2f513a;font-size:14px;font-weight:800}
.topic-heading p{margin:4px 0 0;color:#849087;font-size:10px}
.clear-topic{flex-shrink:0;padding:6px 9px;border:1px solid #dce8db;border-radius:9px;background:#fff;color:#607366;cursor:pointer;font:inherit;font-size:10px;font-weight:700}
.topic-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:8px}
.topic-button{display:grid;min-width:0;min-height:58px;grid-template-columns:32px minmax(0,1fr);grid-template-rows:1fr 1fr;align-items:center;column-gap:8px;padding:8px 10px;border:1px solid #e2e9df;border-radius:12px;background:#fff;color:#425b48;cursor:pointer;text-align:left;transition:border-color .18s,background .18s,transform .18s}
.topic-button:hover{transform:translateY(-1px);border-color:#a9c9aa;background:#f5faf3}
.topic-button.active{border-color:#347653;background:#eaf5ec;box-shadow:0 0 0 2px #34765316}
.topic-icon{display:grid;width:30px;height:30px;grid-row:1/3;place-items:center;border-radius:9px;background:#f0f5ed;font-size:16px}
.topic-button strong{align-self:end;overflow:hidden;font-size:11px;text-overflow:ellipsis;white-space:nowrap}
.topic-button small{align-self:start;overflow:hidden;color:#89958b;font-size:8px;text-overflow:ellipsis;white-space:nowrap}
.topic-button.active .topic-icon{background:#d9ecda}
.source-tabs{margin:0 0 8px}
.catalog-tabs{display:flex;flex-wrap:wrap;gap:9px;margin:20px 0 8px}
.catalog-tabs button{min-height:38px;padding:0 14px;border:1px solid #e1e9e0;border-radius:22px;background:#fff;color:#627267;cursor:pointer;font:inherit;font-size:11px;font-weight:700}
.catalog-tabs button.active{border-color:#347653;background:#347653;color:#fff}
.book-actions .read-book-btn,.book-actions .mark-read-btn{display:flex;min-height:39px;align-items:center;justify-content:center;gap:8px;padding:8px 10px;border:1px solid #347653;border-radius:11px;background:#347653;color:#fff;cursor:pointer;font-size:11px;font-weight:800;text-decoration:none}
.book-actions .mark-read-btn{border-color:#dce9dc;background:#f4faf3;color:#347653}
.book-actions .mark-read-btn.completed{border-color:#b9d7be;background:#eaf5ec;color:#285b3c}
.book-actions .source-link{border-color:#dce9dc;background:#f4faf3;color:#347653}
.reader-loading{display:flex;min-height:54px;align-items:center;justify-content:center;gap:10px;padding:12px 20px;color:#607366;font-size:12px;font-weight:700}
.reader-loading-spinner{width:17px;height:17px;flex-shrink:0;border:2px solid #dce9dc;border-top-color:#347653;border-radius:50%;animation:reader-spin .75s linear infinite}
.reading-sync-error{margin:0 0 14px;padding:10px 13px;border:1px solid #f0d5cf;border-radius:10px;background:#fff4f1;color:#a45043;font-size:11px;line-height:1.7}
@keyframes reader-spin{to{transform:rotate(360deg)}}
@media(prefers-reduced-motion:reduce){.reader-loading-spinner{animation-duration:1.8s}}
.reader-error{color:#b45245}
</style>
