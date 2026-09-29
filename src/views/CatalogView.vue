<template>
	<div class="catalog-page">
		<div class="catalog-heading"><div><p class="eyebrow">សៀវភៅល្អៗ កំពុងរង់ចាំអ្នក</p><h1>ស្វែងរកសៀវភៅ</h1><p class="subheading">ស្វែងរកសៀវភៅដែលអ្នកចង់អាន ក្នុងបណ្ណាល័យសាកលវិទ្យាល័យ។</p></div><span class="catalog-status"><i></i> ទិន្នន័យគំរូ</span></div>

		<section class="search-panel"><label class="search-box"><span aria-hidden="true">⌕</span><input v-model="searchQuery" type="search" placeholder="វាយចំណងជើង ឈ្មោះអ្នកនិពន្ធ ឬមុខវិជ្ជា..." autocomplete="off" @input="searchBooks"></label><button class="filter-button" aria-label="តម្រងស្វែងរក" @click="showFilters = !showFilters">☷ <span>តម្រង</span></button></section>

		<div v-if="showFilters" class="filter-panel"><span>បង្ហាញ៖</span><button :class="{ active: availability === 'all' }" @click="availability = 'all'">សៀវភៅទាំងអស់</button><button :class="{ active: availability === 'available' }" @click="availability = 'available'">មានសៀវភៅទំនេរ</button><button :class="{ active: availability === 'digital' }" @click="availability = 'digital'">សៀវភៅឌីជីថល</button></div>

		<div class="catalog-tools"><div class="category-tabs"><button v-for="category in categories" :key="category" :class="{ active: activeCategory === category }" @click="activeCategory = category">{{ category }}</button></div><span class="collection-count">{{ khmerNumber(filteredBooks.length) }} ចំណងជើង <span v-if="demoMode" class="demo-label">ទិន្នន័យគំរូ</span></span></div>

		<div v-if="holds.length" class="hold-summary"><span class="hold-icon">↗</span><span><strong>កំពុងរក្សាទុកសៀវភៅ {{ khmerNumber(activeHoldCount) }} ក្បាល</strong><small>សូមមកទទួលក្នុងរយៈពេល ២៤ ម៉ោង។</small></span><button @click="$emit('navigate', 'loans')">មើលសៀវភៅដែលបានកក់ →</button></div>
		<div v-if="notice" class="catalog-notice"><span>✓</span>{{ notice }}<button aria-label="Dismiss message" @click="notice = ''">×</button></div>

		<div class="results-heading"><h2>{{ searchQuery ? `លទ្ធផលសម្រាប់ “${searchQuery}”` : 'សៀវភៅដែលមានអ្នកអានច្រើន' }}</h2><span>{{ loading ? 'កំពុងស្វែងរក…' : 'តម្រៀបតាមភាពពាក់ព័ន្ធ' }}</span></div>
		<section class="book-grid" aria-label="លទ្ធផលស្វែងរកសៀវភៅ">
			<article v-for="(book, index) in filteredBooks" :key="book.id" class="book-card">
				<div class="book-cover" :class="`cover-${book.cover ?? index % 4}`"><span class="cover-imprint">បណ្ណាល័យ<br>លីហ្វឡាញ</span><span class="cover-title">{{ book.coverTitle ?? book.title }}</span><span class="cover-author">{{ book.author }}</span><span class="cover-spine"></span></div>
				<div class="book-details"><span class="book-category">{{ categoryLabel(book.category) }}</span><h3>{{ book.title }}</h3><p class="book-author">{{ book.author }}</p><div class="book-bottom"><span class="stock" :class="{ unavailable: book.stock < 1 }"><i></i>{{ book.stock > 0 ? `នៅសល់ ${khmerNumber(book.stock)} ក្បាល` : 'អស់ពីស្តុក' }}</span><span class="shelf">{{ book.shelf }}</span></div><button v-if="holdFor(book.id)" class="held-button" disabled>បានកក់ · {{ holdRemaining(holdFor(book.id)) }}</button><button v-else class="hold-button" :disabled="book.stock < 1" @click="holdBook(book)">កក់ទុក ២៤ ម៉ោង <span>→</span></button></div>
			</article>
			<div v-if="!filteredBooks.length && !loading" class="empty-results"><span>⌕</span><h3>រកមិនឃើញសៀវភៅទេ</h3><p>សូមសាកល្បងស្វែងរកដោយពាក្យផ្សេង។</p><button @click="searchQuery = ''; activeCategory = categories[0]; availability = 'all'">សម្អាតការស្វែងរក</button></div>
		</section>
		<p class="catalog-footnote"><span>ⓘ</span> ការកក់មានសុពលភាព ២៤ ម៉ោង។ សូមយកបណ្ណសម្គាល់និស្សិតទៅទទួលសៀវភៅនៅតុបណ្ណារក្ស។</p>
	</div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import api, { apiConfigured } from '@/services/api';

defineEmits(['navigate']);
const sampleBooks = [
	{ id: 'bk-1', title: 'The Design of Everyday Things', author: 'Don Norman', category: 'ការរចនា', stock: 3, shelf: 'ការរចនា · 745.2 NOR', cover: 0 },
	{ id: 'bk-2', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', category: 'ចិត្តវិទ្យា', stock: 2, shelf: 'វិទ្យាសាស្ត្រសង្គម · 153.4 KAH', cover: 1 },
	{ id: 'bk-3', title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'វិទ្យាសាស្ត្រ', stock: 0, shelf: 'វិទ្យាសាស្ត្រ · 523.1 HAW', cover: 2 },
	{ id: 'bk-4', title: 'Ways of Seeing', author: 'John Berger', category: 'សិល្បៈ និងវប្បធម៌', stock: 4, shelf: 'សិល្បៈ · 701.1 BER', cover: 3 },
	{ id: 'bk-5', title: 'The Art of Statistics', author: 'David Spiegelhalter', category: 'វិទ្យាសាស្ត្រ', stock: 1, shelf: 'គណិតវិទ្យា · 519.5 SPI', cover: 2 },
	{ id: 'bk-6', title: 'The Creative Act', author: 'Rick Rubin', category: 'សិល្បៈ និងវប្បធម៌', stock: 5, shelf: 'សិល្បៈ · 700 RUB', cover: 0 },
];
const books = ref(sampleBooks);
const searchQuery = ref('');
const activeCategory = ref('សៀវភៅទាំងអស់');
const availability = ref('all');
const showFilters = ref(false);
const loading = ref(false);
const demoMode = ref(true);
const holds = ref([]);
const now = ref(Date.now());
const notice = ref('');
const categories = ['សៀវភៅទាំងអស់', 'ការរចនា', 'វិទ្យាសាស្ត្រ', 'ចិត្តវិទ្យា', 'សិល្បៈ និងវប្បធម៌'];
let searchTimer;
let ticker;
let noticeTimer;

const activeHoldCount = computed(() => holds.value.filter((hold) => new Date(hold.expiresAt).getTime() > now.value).length);
const filteredBooks = computed(() => books.value.filter((book) => {
	const matchesText = `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(searchQuery.value.trim().toLowerCase());
	const matchesCategory = activeCategory.value === categories[0] || book.category === activeCategory.value;
	const matchesAvailability = availability.value === 'all' || (availability.value === 'available' ? book.stock > 0 : book.format === 'digital');
	return matchesText && matchesCategory && matchesAvailability;
}));

function persistHolds() { localStorage.setItem('leafline_book_holds', JSON.stringify(holds.value)); }
function khmerNumber(value) { return String(value).replace(/\d/g, (digit) => '០១២៣៤៥៦៧៨៩'[Number(digit)]); }
function categoryLabel(category) {
	const labels = { Design: 'ការរចនា', Science: 'វិទ្យាសាស្ត្រ', Psychology: 'ចិត្តវិទ្យា', 'Arts & culture': 'សិល្បៈ និងវប្បធម៌' };
	return labels[category] ?? category;
}
function holdFor(bookId) { return holds.value.find((hold) => String(hold.bookId) === String(bookId) && new Date(hold.expiresAt).getTime() > now.value); }
function holdRemaining(hold) {
	const remaining = Math.max(0, new Date(hold.expiresAt).getTime() - now.value);
	const hours = Math.floor(remaining / 3600000);
	const minutes = Math.floor((remaining % 3600000) / 60000);
	return `${khmerNumber(hours)} ម៉ោង ${khmerNumber(String(minutes).padStart(2, '0'))} នាទី`;
}
function notify(message) {
	notice.value = message;
	window.clearTimeout(noticeTimer);
	noticeTimer = window.setTimeout(() => { notice.value = ''; }, 5000);
}
function searchBooks() {
	window.clearTimeout(searchTimer);
	if (searchQuery.value.trim().length < 2 || !apiConfigured) { books.value = sampleBooks; demoMode.value = true; loading.value = false; return; }
	const query = searchQuery.value.trim();
	loading.value = true;
	searchTimer = window.setTimeout(async () => {
		try {
			const { data } = await api.get('/books/search', { params: { q: query } });
			if (Array.isArray(data)) {
				books.value = data.map((book, index) => ({ ...book, id: book.id ?? `remote-${index}`, title: book.title ?? 'មិនស្គាល់ចំណងជើង', author: book.author ?? 'មិនស្គាល់អ្នកនិពន្ធ', category: book.category ?? 'ផ្សេងៗ', stock: book.stock ?? book.available_copies ?? 0, shelf: book.shelf ?? 'សួរនៅតុបណ្ណារក្ស', cover: index % 4 }));
				demoMode.value = false;
			}
		} catch {
			books.value = sampleBooks;
			demoMode.value = true;
		} finally { loading.value = false; }
	}, 250);
}
async function holdBook(book) {
	if (book.stock < 1 || holdFor(book.id)) return;
	const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
	if (apiConfigured) {
		try { await api.post('/books/hold', { book_id: book.id }); } catch { /* Keep the hold workflow usable in demo mode. */ }
	}
	holds.value = [...holds.value.filter((hold) => String(hold.bookId) !== String(book.id)), { bookId: book.id, title: book.title, author: book.author, expiresAt }];
	persistHolds();
	notify(`បានកក់ “${book.title}” សម្រាប់អ្នករយៈពេល ២៤ ម៉ោង។`);
}

onMounted(async () => {
	try {
		const saved = JSON.parse(localStorage.getItem('leafline_book_holds') || '[]');
		holds.value = Array.isArray(saved) ? saved.filter((hold) => new Date(hold.expiresAt).getTime() > Date.now()) : [];
		persistHolds();
	} catch { holds.value = []; }
	if (apiConfigured) {
		try {
			const { data } = await api.get('/books');
			if (Array.isArray(data) && data.length) {
				books.value = data.map((book, index) => ({ ...book, id: book.id ?? `remote-${index}`, title: book.title ?? 'មិនស្គាល់ចំណងជើង', author: book.author ?? 'មិនស្គាល់អ្នកនិពន្ធ', category: book.category ?? 'ផ្សេងៗ', stock: book.stock ?? book.available_copies ?? 0, shelf: book.shelf ?? 'សួរនៅតុបណ្ណារក្ស', cover: index % 4 }));
				demoMode.value = false;
			}
		} catch { demoMode.value = true; }
	}
	ticker = window.setInterval(() => { now.value = Date.now(); holds.value = holds.value.filter((hold) => new Date(hold.expiresAt).getTime() > now.value); persistHolds(); }, 60000);
});
onBeforeUnmount(() => { window.clearTimeout(searchTimer); window.clearTimeout(noticeTimer); window.clearInterval(ticker); });
</script>

<style scoped>
.catalog-page { color: #27372d; }
.catalog-heading { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 20px; }
.eyebrow { margin: 0 0 6px; color: #548468; font-size: 9px; font-weight: 700; letter-spacing: 1.1px; }
h1 { margin: 0; color: #223a2e; font-size: 26px; font-weight: 600; letter-spacing: 0; }
.subheading { margin: 5px 0 0; color: #89928c; font-size: 11px; }
.catalog-status { display: flex; align-items: center; gap: 7px; color: #859188; font-size: 9px; white-space: nowrap; }
.catalog-status i { width: 6px; height: 6px; border-radius: 50%; background: #51a575; }
.search-panel { display: flex; gap: 8px; }
.search-box { display: flex; height: 43px; flex: 1; align-items: center; gap: 10px; padding: 0 12px; border: 1px solid #e0e6df; border-radius: 5px; background: white; }
.search-box > span { color: #568169; font-size: 22px; line-height: 1; }
.search-box input { width: 100%; min-width: 0; border: 0; outline: 0; color: #35483a; font-size: 10px; }
.search-box input::placeholder { color: #a0a8a2; }
.search-box kbd { flex: 0 0 auto; padding: 3px 5px; border: 1px solid #e9ece8; border-radius: 3px; color: #a0a8a2; font-size: 8px; }
.filter-button { display: flex; align-items: center; gap: 7px; padding: 0 13px; border: 1px solid #e0e6df; border-radius: 5px; background: white; color: #66756b; cursor: pointer; font-size: 10px; }
.filter-panel { display: flex; flex-wrap: wrap; align-items: center; gap: 7px; margin-top: 9px; padding: 10px; border: 1px solid #e7ebe6; border-radius: 5px; background: white; }
.filter-panel > span { margin-right: 4px; color: #849087; font-size: 9px; }
.filter-panel button { padding: 6px 9px; border: 1px solid #e6ebe5; border-radius: 12px; background: white; color: #778279; cursor: pointer; font-size: 8px; }
.filter-panel button.active { border-color: #43835e; background: #edf5ee; color: #38734f; }
.catalog-tools { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin: 17px 0 12px; border-bottom: 1px solid #e4e9e3; }
.category-tabs { display: flex; gap: 15px; overflow-x: auto; }
.category-tabs button { position: relative; padding: 0 0 10px; border: 0; background: transparent; color: #89938c; cursor: pointer; font-size: 9px; white-space: nowrap; }
.category-tabs button.active { color: #34774f; font-weight: 700; }
.category-tabs button.active::after { position: absolute; right: 0; bottom: -1px; left: 0; height: 2px; background: #44875f; content: ''; }
.collection-count { display: flex; flex: 0 0 auto; align-items: center; gap: 8px; padding-bottom: 9px; color: #969e98; font-size: 8px; }
.demo-label { padding: 3px 5px; border-radius: 3px; background: #f7f0e5; color: #a47a4e; font-size: 7px; font-weight: 700; letter-spacing: .4px; }
.hold-summary { display: flex; align-items: center; gap: 10px; margin: 12px 0; padding: 10px 12px; border: 1px solid #e6deca; border-radius: 5px; background: #faf7ed; }
.hold-icon { display: grid; width: 28px; height: 28px; place-items: center; border-radius: 50%; background: #f1e7cd; color: #a77d45; }
.hold-summary strong, .hold-summary small { display: block; }
.hold-summary strong { color: #675a3e; font-size: 9px; }
.hold-summary small { margin-top: 3px; color: #938a75; font-size: 8px; }
.hold-summary button { margin-left: auto; border: 0; background: transparent; color: #867143; cursor: pointer; font-size: 8px; font-weight: 600; }
.catalog-notice { display: flex; align-items: center; gap: 8px; margin: 10px 0; padding: 9px 11px; border: 1px solid #d7e8d9; border-radius: 4px; background: #f0f7f0; color: #4a7956; font-size: 9px; }
.catalog-notice > span { font-weight: 700; }
.catalog-notice button { margin-left: auto; border: 0; background: transparent; color: inherit; cursor: pointer; }
.results-heading { display: flex; align-items: baseline; justify-content: space-between; margin: 17px 0 10px; }
.results-heading h2 { margin: 0; color: #39483d; font-size: 12px; font-weight: 700; }
.results-heading > span { color: #a0a7a1; font-size: 8px; }
.book-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
.book-card { min-width: 0; overflow: hidden; border: 1px solid #e5e9e4; border-radius: 5px; background: white; transition: transform .16s ease, box-shadow .16s ease; }
.book-card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px #2636290d; }
.book-cover { position: relative; display: flex; height: 138px; flex-direction: column; justify-content: flex-end; overflow: hidden; padding: 14px 15px; color: #f7f1e8; }
.cover-0 { background-color: #8b5949; background-image: radial-gradient(ellipse at 85% 18%, #c68a58 0 10%, transparent 11%), linear-gradient(135deg, #956b4f 0%, #5c483f 100%); }
.cover-1 { background-color: #667860; background-image: radial-gradient(ellipse at 84% 14%, #bbc092 0 9%, transparent 10%), linear-gradient(150deg, #768367 0%, #354b45 100%); }
.cover-2 { background-color: #536d7a; background-image: radial-gradient(ellipse at 79% 22%, #d2a86f 0 9%, transparent 10%), linear-gradient(150deg, #567885 0%, #33465b 100%); }
.cover-3 { background-color: #bb765b; background-image: radial-gradient(ellipse at 82% 20%, #e4bd84 0 11%, transparent 12%), linear-gradient(150deg, #b87054 0%, #75494d 100%); }
.cover-imprint { position: absolute; top: 13px; left: 15px; color: #f4e8ce; font-size: 6px; font-weight: 700; letter-spacing: 1px; line-height: 1.5; opacity: .82; }
.cover-title { z-index: 1; max-width: 180px; font-family: Georgia, serif; font-size: 18px; line-height: 1.05; text-shadow: 0 1px 8px #26322650; }
.cover-author { z-index: 1; margin-top: 6px; font-size: 8px; opacity: .83; }
.cover-spine { position: absolute; top: 0; bottom: 0; left: 0; width: 7px; border-right: 1px solid #ffffff2b; background: #26362c25; }
.book-details { padding: 11px 12px 12px; }
.book-category { color: #56836a; font-size: 7px; font-weight: 700; letter-spacing: .6px; text-transform: uppercase; }
.book-details h3 { display: -webkit-box; min-height: 30px; margin: 5px 0 3px; overflow: hidden; color: #35453a; font-size: 11px; font-weight: 700; line-height: 1.35; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.book-author { margin: 0; color: #89928c; font-size: 8px; }
.book-bottom { display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-top: 10px; padding-top: 8px; border-top: 1px solid #f0f2ef; }
.stock { display: flex; align-items: center; gap: 5px; color: #538261; font-size: 8px; }
.stock i { width: 5px; height: 5px; border-radius: 50%; background: #59a16c; }
.stock.unavailable { color: #9b8178; }
.stock.unavailable i { background: #c58a70; }
.shelf { overflow: hidden; color: #a0a7a1; font-size: 7px; text-overflow: ellipsis; white-space: nowrap; }
.hold-button, .held-button { display: flex; width: 100%; height: 30px; align-items: center; justify-content: center; gap: 6px; margin-top: 10px; border: 1px solid #dfe9df; border-radius: 4px; background: #f3f8f3; color: #477a55; cursor: pointer; font-size: 8px; font-weight: 600; }
.hold-button:hover { border-color: #90b49a; background: #e9f4ea; }
.hold-button:disabled { border-color: #eceeeb; background: #f5f6f4; color: #a1a7a2; cursor: not-allowed; }
.held-button { border-color: #eae4d4; background: #faf7ee; color: #957b49; cursor: default; }
.empty-results { grid-column: 1 / -1; display: grid; min-height: 230px; align-content: center; justify-items: center; border: 1px dashed #dce4dc; border-radius: 6px; background: #fbfcfa; text-align: center; }
.empty-results > span { color: #81a08a; font-size: 29px; }
.empty-results h3 { margin: 8px 0 0; color: #425448; font-size: 14px; }
.empty-results p { margin: 5px 0 13px; color: #929b94; font-size: 9px; }
.empty-results button { padding: 7px 11px; border: 0; border-radius: 4px; background: #e8f2e9; color: #397451; cursor: pointer; font-size: 9px; }
.catalog-footnote { display: flex; align-items: center; gap: 6px; margin: 14px 0 0; color: #929b94; font-size: 8px; }
.catalog-footnote span { color: #7a9c80; font-size: 12px; }
@media (max-width: 850px) { .book-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
@media (max-width: 520px) { .catalog-heading { align-items: flex-start; } .catalog-status { max-width: 110px; white-space: normal; text-align: right; } .book-grid { gap: 8px; } .book-cover { height: 118px; padding: 10px; } .cover-title { font-size: 16px; } .cover-imprint { left: 10px; } .category-tabs { gap: 12px; } .collection-count { font-size: 7px; } .demo-label { display: none; } }
@media (max-width: 380px) { .book-grid { grid-template-columns: 1fr; } .book-card { display: grid; grid-template-columns: 112px minmax(0,1fr); } .book-cover { height: 100%; min-height: 155px; } .book-bottom { flex-wrap: wrap; } }
</style>
