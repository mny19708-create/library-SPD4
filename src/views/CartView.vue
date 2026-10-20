<template>
	<main class="cart-page" v-translate="locale" :data-locale="locale">
		<header class="cart-heading">
			<div>
				<p class="eyebrow">🛒 កន្ត្រកសៀវភៅ</p>
				<h1>សៀវភៅដែលបានជ្រើសរើស</h1>
				<p class="subheading">ពិនិត្យសៀវភៅរបស់អ្នក មុនពេលកក់ទុក ២៤ ម៉ោង។</p>
			</div>
			<button class="back-catalog" @click="emit('navigate', 'catalog')">← ត្រឡប់ទៅបញ្ជីសៀវភៅ</button>
		</header>

		<p v-if="notice" class="cart-notice" :class="{ error: noticeKind === 'error' }" role="status">
			{{ notice }}
			<button aria-label="បិទសារ" @click="notice = ''">×</button>
		</p>

		<section v-if="cart.length" class="cart-layout">
			<div class="cart-list">
				<article v-for="book in cart" :key="book.id" class="cart-item">
					<div class="cart-cover" :class="`cover-${Number(book.cover ?? 0) % 4}`">📖</div>
					<div class="cart-book-info">
						<span>{{ book.category }}</span>
						<h2 data-no-translate>{{ book.title }}</h2>
						<p data-no-translate>{{ book.author }}</p>
						<small>📍 {{ book.shelf }}</small>
					</div>
					<button class="remove-item" :aria-label="`ដក ${book.title} ចេញពីកន្ត្រក`" @click="removeBook(book.id)">ដកចេញ</button>
				</article>
			</div>

			<aside class="cart-summary">
				<h2>សរុបការកក់</h2>
				<div><span>សៀវភៅ</span><strong>{{ cart.length }}</strong></div>
				<div><span>រយៈពេលរក្សាទុក</span><strong>២៤ ម៉ោង</strong></div>
				<p>សៀវភៅនឹងត្រូវរក្សាទុករយៈពេល ២៤ ម៉ោង បន្ទាប់ពីកក់។</p>
				<button class="place-holds" :disabled="submitting" @click="placeHolds">
					{{ submitting ? 'កំពុងដំណើរការ...' : 'កក់សៀវភៅទាំងអស់' }} <span>→</span>
				</button>
				<button class="clear-cart" :disabled="submitting" @click="clearCart">សម្អាតកន្ត្រក</button>
				<button class="view-holds" @click="emit('navigate', 'loans')">មើលការកក់របស់ខ្ញុំ</button>
			</aside>
		</section>

		<section v-else class="cart-empty">
			<span class="empty-cart-icon">🛒</span>
			<h2>កន្ត្រកទទេ</h2>
			<p>បន្ថែមសៀវភៅពីបញ្ជីស្វែងរក ដើម្បីបន្ត។</p>
			<button @click="emit('navigate', 'catalog')">បន្តស្វែងរកសៀវភៅ <span>→</span></button>
		</section>
	</main>
</template>

<script setup>
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';
import api, { apiConfigured } from '@/services/api';

const emit = defineEmits(['navigate']);
const locale = inject('locale');
const cart = ref([]);
const notice = ref('');
const noticeKind = ref('success');
const submitting = ref(false);
const cartStorageKey = 'leafline_book_cart';
const holdsStorageKey = 'leafline_book_holds';

function notify(message, kind = 'success') {
	notice.value = message;
	noticeKind.value = kind;
}

function loadCart() {
	try {
		const saved = JSON.parse(localStorage.getItem(cartStorageKey) || '[]');
		cart.value = Array.isArray(saved) ? saved : [];
	} catch (error) {
		console.error('Unable to read saved book cart:', error);
		cart.value = [];
		notify('មិនអាចអានកន្ត្រកបានទេ។ សូមព្យាយាមផ្ទុកទំព័រឡើងវិញ។', 'error');
	}
}

function saveCart() {
	localStorage.setItem(cartStorageKey, JSON.stringify(cart.value));
	window.dispatchEvent(new Event('leafline-cart-updated'));
}

function removeBook(bookId) {
	cart.value = cart.value.filter(book => String(book.id) !== String(bookId));
	saveCart();
}

function clearCart() {
	cart.value = [];
	saveCart();
}

function saveHolds(newHolds) {
	let holds = [];
	try {
		const saved = JSON.parse(localStorage.getItem(holdsStorageKey) || '[]');
		holds = Array.isArray(saved)
			? saved.filter(hold => new Date(hold.expiresAt).getTime() > Date.now())
			: [];
	} catch (error) {
		console.error('Unable to read saved book holds:', error);
	}
	const byBookId = new Map(holds.map(hold => [String(hold.bookId), hold]));
	for (const hold of newHolds) byBookId.set(String(hold.bookId), hold);
	localStorage.setItem(holdsStorageKey, JSON.stringify([...byBookId.values()]));
}

async function placeHolds() {
	if (submitting.value || cart.value.length === 0) return;
	submitting.value = true;
	const heldBooks = [];
	let failure = null;

	try {
		for (const book of cart.value) {
			let serverHold = {};
			if (apiConfigured) {
				try {
					const response = await api.post('/books/hold', { book_id: book.id });
					serverHold = response.data ?? {};
				} catch (error) {
					failure = error;
					break;
				}
			}
			heldBooks.push({
				bookId: book.id,
				title: book.title,
				author: book.author,
				expiresAt: serverHold.expires_at ?? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
			});
		}
	} finally {
		if (heldBooks.length) {
			saveHolds(heldBooks);
			const heldIds = new Set(heldBooks.map(book => String(book.bookId)));
			cart.value = cart.value.filter(book => !heldIds.has(String(book.id)));
			saveCart();
		}
		submitting.value = false;
	}

	if (failure) {
		console.error('Unable to place all book holds:', failure);
		notify(
			heldBooks.length
				? `បានកក់ ${heldBooks.length} ក្បាល។ សៀវភៅដែលនៅសល់នៅក្នុងកន្ត្រក ព្រោះការកក់មិនជោគជ័យ។`
				: 'មិនអាចកក់សៀវភៅបានទេ។ សូមពិនិត្យការតភ្ជាប់ ហើយព្យាយាមម្ដងទៀត។',
			'error',
		);
		return;
	}

	notify('កក់សៀវភៅជោគជ័យ។ អ្នកអាចមើលស្ថានភាពនៅទំព័រសៀវភៅខ្ចី។');
}

onMounted(() => {
	loadCart();
	window.addEventListener('storage', loadCart);
	window.addEventListener('leafline-cart-updated', loadCart);
});
onBeforeUnmount(() => {
	window.removeEventListener('storage', loadCart);
	window.removeEventListener('leafline-cart-updated', loadCart);
});
</script>

```html
<style scoped>
/* ========================================
   🌿 LEAFLINE — CUTE SHOPPING CART
======================================== */

.cart-page {
  --green: #397653;
  --green-dark: #28583e;
  --green-light: #eaf5eb;
  --text: #293d30;
  --muted: #7b897e;
  --border: #e4ede4;
  --cream: #fffdf8;
  --danger: #d16b65;

  width: 100%;
  color: var(--text);
  font-family: Inter, "Noto Sans Khmer", sans-serif;
  animation: cartFadeIn 0.45s ease;
}

@keyframes cartFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 🌸 Header */

.cart-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 26px;
}

.cart-heading h1 {
  margin: 0;
  color: var(--green-dark);
  font-size: clamp(25px, 3vw, 32px);
  font-weight: 800;
  letter-spacing: -0.8px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin: 0 0 8px;
  color: var(--green);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.6px;
}

.eyebrow::before {
  content: "✿";
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border-radius: 8px;
  background: #eaf5eb;
  color: #4b8a61;
  font-size: 15px;
}

.subheading {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.8;
}

/* ✨ Buttons */

.back-catalog,
.view-holds {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 16px;
  border: 1px solid #dce9dd;
  border-radius: 12px;
  background: #fff;
  color: var(--green);
  font: inherit;
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.back-catalog::before {
  content: "←";
  font-size: 16px;
}

.back-catalog:hover,
.view-holds:hover {
  transform: translateY(-2px);
  background: var(--green-light);
  box-shadow: 0 5px 14px #39765312;
}

/* 📚 Main layout */

.cart-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 310px;
  align-items: start;
  gap: 22px;
}

.cart-list {
  display: grid;
  gap: 14px;
}

/* 🧸 Book cards */

.cart-item,
.cart-summary,
.cart-empty {
  border: 1px solid var(--border);
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 5px 22px rgba(41, 75, 49, 0.045);
}

.cart-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 17px;
  padding: 17px;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.cart-item:hover {
  transform: translateY(-3px);
  border-color: #c9dfcd;
  box-shadow: 0 10px 26px rgba(41, 75, 49, 0.09);
}

.cart-cover {
  display: grid;
  width: 76px;
  height: 94px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #ffffffa6;
  border-radius: 12px;
  font-size: 30px;
  box-shadow: inset 0 0 0 1px #ffffff66;
  transition: transform 0.25s ease;
}

.cart-item:hover .cart-cover {
  transform: rotate(-3deg) scale(1.04);
}

.cover-0 {
  background: linear-gradient(145deg, #e6f4e5, #cce7d0);
}

.cover-1 {
  background: linear-gradient(145deg, #fff3df, #f4dfbd);
}

.cover-2 {
  background: linear-gradient(145deg, #e8f1fb, #cfdef2);
}

.cover-3 {
  background: linear-gradient(145deg, #fbeaf2, #f0d5e4);
}

.cart-book-info {
  min-width: 0;
  flex: 1;
}

.cart-book-info > span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 9px;
  border-radius: 7px;
  background: #edf7ee;
  color: #4c8259;
  font-size: 10px;
  font-weight: 800;
}

.cart-book-info h2 {
  margin: 9px 0 5px;
  color: var(--text);
  font-size: 15px;
  font-weight: 750;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.cart-book-info p {
  margin: 0 0 7px;
  color: #758479;
  font-size: 12px;
  line-height: 1.7;
}

.cart-book-info small {
  color: #96a197;
  font-size: 11px;
}

/* 🗑️ Remove button */

.remove-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: 0 0 auto;
  padding: 9px 12px;
  border: 1px solid #f3dedb;
  border-radius: 10px;
  background: #fff8f7;
  color: #b95b53;
  font: inherit;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-item::before {
  content: "♡";
  font-size: 15px;
}

.remove-item:hover {
  transform: translateY(-1px);
  border-color: #e9b9b3;
  background: #ffefec;
}

/* 🧾 Summary card */

.cart-summary {
  position: sticky;
  top: 20px;
  display: grid;
  gap: 17px;
  padding: 22px;
  background: linear-gradient(180deg, #ffffff 0%, #fcfefb 100%);
}

.cart-summary h2 {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0;
  color: var(--green-dark);
  font-size: 18px;
  font-weight: 800;
}

.cart-summary h2::before {
  content: "✧";
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 10px;
  background: #eaf5eb;
  color: var(--green);
  font-size: 20px;
}

.cart-summary > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  color: #728075;
  font-size: 12px;
}

.cart-summary > div strong {
  color: var(--text);
}

.cart-summary p {
  margin: 0;
  padding: 12px;
  border: 1px dashed #dce9dc;
  border-radius: 11px;
  background: #f6faf5;
  color: #718174;
  font-size: 11px;
  line-height: 1.9;
}

/* 💚 Place hold / checkout button */

.place-holds,
.cart-empty button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 46px;
  padding: 11px 16px;
  border: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, #43865b, #2f6c49);
  color: #fff;
  font: inherit;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 5px 12px #34785820;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.place-holds::before {
  content: "♡";
  font-size: 17px;
}

.place-holds:hover:not(:disabled),
.cart-empty button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px #34785830;
  filter: brightness(1.06);
}

.place-holds:active:not(:disabled) {
  transform: scale(0.98);
}

.place-holds:disabled {
  opacity: 0.6;
  cursor: wait;
  box-shadow: none;
}

/* 🧹 Clear cart */

.clear-cart {
  justify-self: center;
  padding: 7px 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #bd6961;
  font: inherit;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease;
}

.clear-cart::before {
  content: "⌫ ";
  font-size: 14px;
}

.clear-cart:hover {
  background: #fff0ee;
}

/* 🌷 Notice messages */

.cart-notice {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  margin-bottom: 17px;
  border: 1px solid #cfe6d4;
  border-radius: 13px;
  background: #f0f8f1;
  color: #356c49;
  font-size: 12px;
  line-height: 1.8;
  box-shadow: 0 4px 12px #39765308;
}

.cart-notice.error {
  border-color: #f0d8d4;
  background: #fff6f4;
  color: #a64d42;
}

.cart-notice button {
  display: grid;
  width: 27px;
  height: 27px;
  flex: 0 0 auto;
  place-items: center;
  border: 0;
  border-radius: 8px;
  background: #ffffffa8;
  color: inherit;
  font-size: 17px;
  cursor: pointer;
}

/* 🌼 Empty cart */

.cart-empty {
  display: grid;
  min-height: 320px;
  align-content: center;
  justify-items: center;
  gap: 13px;
  padding: 30px 22px;
  text-align: center;
  background:
    radial-gradient(circle at top right, #edf7ed 0, transparent 35%),
    linear-gradient(145deg, #fff, #fdfefb);
}

.empty-cart-icon {
  display: grid;
  width: 88px;
  height: 88px;
  place-items: center;
  border: 1px solid #e0eee0;
  border-radius: 28px;
  background: linear-gradient(145deg, #edf8ed, #dcefdc);
  font-size: 42px;
  box-shadow: 0 8px 22px #39765312;
  animation: cuteFloat 3s ease-in-out infinite;
}

@keyframes cuteFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.cart-empty h2,
.cart-empty p {
  margin: 0;
}

.cart-empty h2 {
  color: var(--green-dark);
  font-size: 21px;
  font-weight: 800;
}

.cart-empty p {
  max-width: 360px;
  color: #7b897e;
  font-size: 13px;
  line-height: 1.9;
}

.cart-empty button {
  min-width: 165px;
  margin-top: 7px;
}

/* 📱 Tablet */

@media (max-width: 900px) {
  .cart-layout {
    grid-template-columns: minmax(0, 1fr) 270px;
    gap: 14px;
  }

  .cart-item {
    gap: 12px;
    padding: 14px;
  }

  .cart-summary {
    padding: 18px;
  }
}

/* 📱 Mobile */

@media (max-width: 700px) {
  .cart-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 15px;
  }

  .cart-heading h1 {
    font-size: 26px;
  }

  .cart-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 17px;
  }

  .cart-summary {
    position: static;
    order: -1;
  }

  .cart-summary h2 {
    font-size: 17px;
  }

  .cart-item {
    border-radius: 15px;
  }
}

/* 📱 Small phones */

@media (max-width: 460px) {
  .cart-heading h1 {
    font-size: 23px;
  }

  .cart-item {
    align-items: flex-start;
    gap: 10px;
    padding: 11px;
  }

  .cart-cover {
    width: 52px;
    height: 68px;
    border-radius: 9px;
    font-size: 21px;
  }

  .cart-book-info h2 {
    margin-top: 7px;
    font-size: 13px;
  }

  .cart-book-info p {
    font-size: 11px;
  }

  .remove-item {
    gap: 4px;
    padding: 7px;
    font-size: 10px;
  }

  .cart-summary {
    gap: 14px;
    padding: 16px;
  }

  .cart-empty {
    min-height: 270px;
    padding: 22px 14px;
  }

  .empty-cart-icon {
    width: 74px;
    height: 74px;
    border-radius: 23px;
    font-size: 36px;
  }
}

/* ♿ Respect reduced-motion preference */

@media (prefers-reduced-motion: reduce) {
  .cart-page,
  .empty-cart-icon {
    animation: none;
  }

  .cart-item,
  .cart-cover,
  .back-catalog,
  .view-holds,
  .remove-item,
  .place-holds,
  .cart-empty button {
    transition: none;
  }
}
</style>
```