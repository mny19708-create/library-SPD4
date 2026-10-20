<template>
	<div v-if="!student" v-translate="locale" class="registration-page" :class="{ 'dark-theme': darkTheme }" :lang="locale">
		<button class="theme-toggle registration-theme-toggle" type="button" :aria-label="darkTheme ? 'ប្តូរទៅពណ៌ស' : 'ប្តូរទៅពណ៌ងងឹត'" @click="toggleTheme">
			<span aria-hidden="true">{{ darkTheme ? '☀' : '☾' }}</span>{{ darkTheme ? 'ពណ៌ស' : 'ពណ៌ងងឹត' }}
		</button>
		<button class="language-toggle registration-language-toggle" type="button" @click="toggleLocale">{{ locale === 'km' ? 'English' : 'ខ្មែរ' }}</button>
		<aside class="registration-story">
			<a class="registration-brand" href="#home"><span class="brand-mark">L</span><span><strong>Leafline</strong><small>បណ្ណាល័យសាកលវិទ្យាល័យ</small></span></a>
			<div class="story-copy"><p class="story-eyebrow">សម្រាប់និស្សិតសាកលវិទ្យាល័យ</p><h1>កន្លែងសិក្សាល្អ<br>ចាប់ផ្ដើមពីអ្នក។</h1><p>បង្កើតគណនីនិស្សិត ដើម្បីកក់បន្ទប់ និងប្រើសេវាកម្មបណ្ណាល័យ។</p><div class="story-list"><span><i>១</i> បំពេញព័ត៌មាននិស្សិត</span><span><i>២</i> ជ្រើសរើសឆ្នាំសិក្សា</span><span><i>៣</i> ចាប់ផ្ដើមសិក្សា</span></div></div>
			<div class="story-footer">សេវាកម្មបណ្ណាល័យ Leafline <span>·</span> ២០២៦</div>
		</aside>
		<main class="registration-main">
			<div class="registration-mobile-brand"><span class="brand-mark">L</span><span><strong>Leafline</strong><small>បណ្ណាល័យសាកលវិទ្យាល័យ</small></span></div>
			<div class="registration-form-wrap">
				<div class="form-heading"><p class="form-eyebrow">ចូលរួមជាមួយបណ្ណាល័យ</p><h2>បង្កើតគណនីនិស្សិត</h2><p>សូមបំពេញព័ត៌មានខាងក្រោម ដើម្បីបន្ត។</p></div>
				<form class="registration-form" @submit.prevent="registerStudent">
					<div class="form-grid">
						<label class="field full-field">ឈ្មោះពេញ<input v-model.trim="registration.fullName" type="text" autocomplete="name" placeholder="ឧ. សុខ ដារ៉ា" required minlength="2"></label>
						<label class="field">លេខសម្គាល់និស្សិត<input v-model.trim="registration.studentId" type="text" autocomplete="off" placeholder="ឧ. 2026-12345" required></label>
						<label class="field">អ៊ីមែលសាកលវិទ្យាល័យ<input v-model.trim="registration.email" type="email" autocomplete="email" placeholder="name@university.edu" required></label>
						<label class="field">មហាវិទ្យាល័យ<select v-model="registration.faculty" required><option disabled value="">ជ្រើសរើសមហាវិទ្យាល័យ</option><option v-for="faculty in faculties" :key="faculty.value" :value="faculty.value">{{ faculty.label }}</option></select></label>
						<label class="field">ឆ្នាំសិក្សា<select v-model="registration.year" required><option disabled value="">ជ្រើសរើសឆ្នាំសិក្សា</option><option v-for="year in studyYears" :key="year.value" :value="year.value">{{ year.label }}</option></select></label>
						<label class="field">លេខទូរស័ព្ទ <span class="optional">(មិនបាច់ក៏បាន)</span><input v-model.trim="registration.phone" type="tel" autocomplete="tel" placeholder="0xx xxx xxx"></label>
						<label class="field">ពាក្យសម្ងាត់<input v-model="registration.password" type="password" autocomplete="new-password" placeholder="យ៉ាងតិច ៨ តួអក្សរ" required minlength="8"></label>
						<label class="field full-field">បញ្ជាក់ពាក្យសម្ងាត់<input v-model="registration.confirmPassword" type="password" autocomplete="new-password" placeholder="វាយពាក្យសម្ងាត់ម្ដងទៀត" required minlength="8"></label>
					</div>
					<p v-if="registrationError" class="registration-error" role="alert">{{ registrationError }}</p>
					<label class="terms-check"><input v-model="registration.accepted" type="checkbox" required><span>ខ្ញុំបញ្ជាក់ថា ព័ត៌មានខាងលើត្រឹមត្រូវ និងជានិស្សិតរបស់សាកលវិទ្យាល័យ។</span></label>
					<button class="register-button" type="submit" :disabled="registering">{{ registering ? 'កំពុងបង្កើតគណនី…' : 'ចុះឈ្មោះ និងបន្ត' }} <span>→</span></button>
					<p class="privacy-note">ពាក្យសម្ងាត់ប្រើសម្រាប់បញ្ជាក់គណនីប៉ុណ្ណោះ។ វាមិនត្រូវបានរក្សាទុកនៅលើឧបករណ៍នេះទេ។</p>
				</form>
			</div>
		</main>
	</div>
	<div v-else v-translate="locale" class="app-frame" :class="{ 'dark-theme': darkTheme, 'dashboard-theme': darkTheme && currentPage === 'dashboard' }" :lang="locale">
		<aside class="sidebar" :class="{ 'sidebar-open': menuOpen }">
			<a class="brand" href="#home" @click.prevent="navigate('dashboard')">
				<span class="brand-mark">L</span>
				<span class="brand-copy"><strong>Leafline</strong><small>បណ្ណាល័យសាកលវិទ្យាល័យ</small></span>
			</a>

			<div class="campus-label">សេវាកម្មបណ្ណាល័យ</div>
			<nav class="main-nav" aria-label="ម៉ឺនុយមេ">
				<button v-for="item in navigationItems" :key="item.id" class="nav-item" :class="{ active: currentPage === item.id }" @click="navigate(item.id)">
					<span class="nav-icon" aria-hidden="true">{{ item.icon }}</span>
					<span>{{ item.label }}</span>
					<span v-if="item.id === 'loans'" class="nav-count">2</span>
					<span v-else-if="item.id === 'cart' && cartCount" class="nav-count">{{ cartCount }}</span>
				</button>
			</nav>

			<div class="sidebar-spacer"></div>
			<div class="points-card">
				<div class="points-top"><span class="sparkle">✳</span><span>ពិន្ទុសិក្សា</span></div>
				<strong>1,240 <small>ពិន្ទុ</small></strong>
				<div class="points-track"><span></span></div>
				<p>ខ្វះ 260 ពិន្ទុទៀត ដល់រង្វាន់បន្ទាប់</p>
			</div>
				<div class="profile-area">
					<div class="profile-button"><span class="avatar">{{ initials }}</span><span class="profile-copy"><strong data-no-translate>{{ student.fullName }}</strong><small>{{ facultyName }} · {{ yearName }}</small></span></div>
					<button class="signout-button" type="button" @click="signOut">ចាកចេញពីគណនី <span>↪</span></button>
				</div>
		</aside>

		<main class="main-area">
			<header class="topbar">
				<button class="menu-toggle" aria-label="បើកម៉ឺនុយ" @click="menuOpen = !menuOpen">☰</button>
				<div class="breadcrumbs"><span>បណ្ណាល័យ</span><span class="crumb-separator">/</span><strong>{{ activeTitle }}</strong></div>
				<div class="topbar-actions">
					<button class="theme-toggle" type="button" :aria-label="darkTheme ? 'ប្តូរទៅពណ៌ស' : 'ប្តូរទៅពណ៌ងងឹត'" @click="toggleTheme">
						<span aria-hidden="true">{{ darkTheme ? '☀' : '☾' }}</span>{{ darkTheme ? 'ពណ៌ស' : 'ពណ៌ងងឹត' }}
					</button>
					<button class="language-toggle" type="button" :aria-label="locale === 'km' ? 'Switch to English' : 'ប្តូរទៅភាសាខ្មែរ'" @click="toggleLocale">{{ locale === 'km' ? 'EN' : 'ខ្មែរ' }}</button>
					  <span class="open-status"><i></i> បើកដំណើរការ <b>ដល់ម៉ោង ១០ យប់</b></span>
					  <span class="icon-button" aria-label="ការជូនដំណឹង">♧<i class="notification-dot"></i></span>
					<span class="top-avatar">{{ initials }}</span>
				</div>
			</header>

			<section class="page-content">
				<component :is="activeComponent" @navigate="navigate" />
			</section>
			<footer class="page-footer"><span>សេវាកម្មបណ្ណាល័យ Leafline</span><span>រៀនដោយរីករាយ រីកចម្រើនជាមួយគ្នា</span></footer>
		</main>
			<button v-if="menuOpen" class="mobile-scrim" aria-label="បិទម៉ឺនុយ" @click="menuOpen = false"></button>
	</div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, provide, ref } from 'vue';
import DashboardView from '@/views/DashboardView.vue';
import RoomMap from '@/views/RoomMap.vue';
import CatalogView from '@/views/CatalogView.vue';
import UserLoans from '@/views/UserLoans.vue';
import CartView from '@/views/CartView.vue';
import api, { apiConfigured } from '@/services/api';

const navigation = [
	{ id: 'dashboard', label: 'ទំព័រដើម', icon: '⌂' },
	{ id: 'rooms', label: 'កក់បន្ទប់សិក្សា', icon: '▦' },
	{ id: 'catalog', label: 'ស្វែងរកសៀវភៅ', icon: '▤' },
	{ id: 'loans', label: 'សៀវភៅខ្ចី', icon: '↗' },
	{ id: 'cart', label: 'កន្ត្រក', icon: '🛒' },
];

const pages = {
	dashboard: DashboardView,
	rooms: RoomMap,
	catalog: CatalogView,
	loans: UserLoans,
	cart: CartView,
};
const currentPage = ref('dashboard');
const menuOpen = ref(false);
const darkTheme = ref(localStorage.getItem('leafline_theme') !== 'light');
const locale = ref(localStorage.getItem('leafline_locale') === 'en' ? 'en' : 'km');
const cartCount = ref(0);
const student = ref(null);
const registering = ref(false);
const registrationError = ref('');
const registration = ref({ fullName: '', studentId: '', email: '', faculty: '', year: '', phone: '', password: '', confirmPassword: '', accepted: false });
const faculties = [
	{ value: 'engineering', label: 'វិស្វកម្ម' },
	{ value: 'science', label: 'វិទ្យាសាស្ត្រ' },
	{ value: 'business', label: 'គ្រប់គ្រង និងពាណិជ្ជកម្ម' },
	{ value: 'health', label: 'វិទ្យាសាស្ត្រសុខាភិបាល' },
	{ value: 'arts', label: 'សិល្បៈ និងមនុស្សសាស្ត្រ' },
	{ value: 'law', label: 'នីតិសាស្ត្រ' },
	{ value: 'other', label: 'ផ្សេងៗ' },
];
const studyYears = [1, 2, 3, 4, 5, 6].map((year) => ({ value: String(year), label: `ឆ្នាំទី ${khmerNumber(year)}` }));
const activeComponent = computed(() => pages[currentPage.value]);
const navigationItems = computed(() => navigation.map((item) => ({
	...item,
	label: locale.value === 'en' ? ({
		dashboard: 'Home',
		rooms: 'Book a room',
		catalog: 'Find books',
		loans: 'My loans',
		cart: 'Cart',
	}[item.id] ?? item.label) : item.label,
})));
const activeTitle = computed(() => navigationItems.value.find((item) => item.id === currentPage.value)?.label ?? 'ទំព័រដើម');
const facultyName = computed(() => faculties.find((faculty) => faculty.value === student.value?.faculty)?.label ?? 'និស្សិត');
const yearName = computed(() => student.value?.year === 'postgraduate' ? 'ក្រោយបរិញ្ញាបត្រ' : `ឆ្នាំទី ${khmerNumber(student.value?.year ?? '')}`);
const initials = computed(() => student.value?.fullName?.trim().split(/\s+/).slice(0, 2).map((part) => [...part][0]).join('') ?? 'ន');

provide('studentProfile', student);
provide('locale', locale);

try {
	student.value = JSON.parse(localStorage.getItem('leafline_student') || 'null');
} catch {
	localStorage.removeItem('leafline_student');
}

function khmerNumber(value) { return String(value).replace(/\d/g, (digit) => '០១២៣៤៥៦៧៨៩'[Number(digit)]); }

function toggleTheme() {
	darkTheme.value = !darkTheme.value;
	localStorage.setItem('leafline_theme', darkTheme.value ? 'dark' : 'light');
}

function toggleLocale() {
	locale.value = locale.value === 'km' ? 'en' : 'km';
	localStorage.setItem('leafline_locale', locale.value);
}

function refreshCartCount() {
	try {
		const savedCart = JSON.parse(localStorage.getItem('leafline_book_cart') || '[]');
		cartCount.value = Array.isArray(savedCart)
			? savedCart.reduce((total, item) => total + Number(item.quantity || 1), 0)
			: 0;
	} catch (error) {
		console.error('Unable to read the book cart:', error);
		cartCount.value = 0;
	}
}

async function registerStudent() {
	registrationError.value = '';
	if (registration.value.password !== registration.value.confirmPassword) {
		registrationError.value = 'ពាក្យសម្ងាត់ទាំងពីរមិនត្រូវគ្នាទេ។';
		return;
	}
	registering.value = true;
	try {
		if (apiConfigured) {
			const { data } = await api.post('/auth/register', {
				full_name: registration.value.fullName,
				student_id: registration.value.studentId,
				email: registration.value.email,
				faculty: registration.value.faculty,
				year: registration.value.year,
				phone: registration.value.phone,
				password: registration.value.password,
			});
			if (data?.token) localStorage.setItem('token', data.token);
		}
		const profile = {
			fullName: registration.value.fullName,
			studentId: registration.value.studentId,
			email: registration.value.email,
			faculty: registration.value.faculty,
			year: registration.value.year,
			phone: registration.value.phone,
		};
		localStorage.setItem('leafline_student', JSON.stringify(profile));
		student.value = profile;
		registration.value.password = '';
		registration.value.confirmPassword = '';
	} catch (error) {
		registrationError.value = error.response?.data?.message ?? 'មិនអាចបង្កើតគណនីបានទេ។ សូមពិនិត្យព័ត៌មាន ហើយព្យាយាមម្ដងទៀត។';
	} finally {
		registering.value = false;
	}
}

function signOut() {
	localStorage.removeItem('leafline_student');
	localStorage.removeItem('token');
	student.value = null;
	registrationError.value = '';
	registration.value = { fullName: '', studentId: '', email: '', faculty: '', year: '', phone: '', password: '', confirmPassword: '', accepted: false };
}

function navigate(page) {
	const target = page === 'books' ? 'catalog' : page;
	if (!Object.hasOwn(pages, target)) {
		console.warn(`Unknown library page: ${page}`);
		return;
	}
	currentPage.value = target;
	menuOpen.value = false;
}

onMounted(() => {
	refreshCartCount();
	window.addEventListener('storage', refreshCartCount);
	window.addEventListener('leafline-cart-updated', refreshCartCount);
});
onBeforeUnmount(() => {
	window.removeEventListener('storage', refreshCartCount);
	window.removeEventListener('leafline-cart-updated', refreshCartCount);
});
</script>

<style>
/* =========================================
   LEAFLINE — CLEAN & CUTE UI REFRESH
   Add this at the END of App.vue <style>
========================================= */

/* =====================================================
   🌿 LEAFLINE — CUTE PREMIUM LIBRARY DESIGN
   Vue 3 | Responsive | Light & Dark Mode
===================================================== */

/* 01. DESIGN SYSTEM */
:root {
  color-scheme: light;

  --green: #397957;
  --green-dark: #24543b;
  --green-deep: #193f30;
  --green-light: #eaf5ec;
  --green-soft: #f3f8f1;

  --cream: #fffaf2;
  --pink-soft: #fff0ee;
  --gold-soft: #fff3d9;

  --ink: #293d30;
  --muted: #849087;
  --line: #e5ece4;
  --paper: #ffffff;
  --page-bg: #f6f8f4;

  --radius-sm: 10px;
  --radius-md: 15px;
  --radius-lg: 22px;

  --shadow-sm: 0 4px 15px rgb(38 74 48 / 5%);
  --shadow-md: 0 12px 30px rgb(38 74 48 / 9%);
  --shadow-lg: 0 20px 50px rgb(38 74 48 / 12%);

  --transition: 0.22s ease;
}

/* 02. RESET & BASE */
* {
  box-sizing: border-box;
}

html {
  min-height: 100%;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--page-bg);
  color: var(--ink);
  font-family: Inter, "Noto Sans Khmer", "Khmer OS System",
    system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

button,
input,
select,
textarea {
  font: inherit;
}

button {
  color: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    background var(--transition),
    border-color var(--transition),
    color var(--transition),
    box-shadow var(--transition),
    transform var(--transition);
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  display: block;
  max-width: 100%;
}

input,
select,
textarea {
  max-width: 100%;
}

::selection {
  background: #d8edda;
  color: #214b32;
}

button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
a:focus-visible {
  outline: 3px solid #a6d6b4;
  outline-offset: 3px;
}

/* 03. APP FRAME */
#app {
  min-height: 100vh;
}

.app-frame {
  display: flex;
  min-height: 100vh;
  background: var(--page-bg);
  color: var(--ink);
}

.main-area {
  flex: 1;
  min-width: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
  width: 100%;
  min-width: 0;
  padding: 30px 32px 42px;
  animation: leafline-enter 0.35s ease both;
}

@keyframes leafline-enter {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 04. BRAND & LOGO */
.brand,
.registration-brand,
.registration-mobile-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand {
  margin-bottom: 34px;
}

.brand-mark {
  display: inline-flex;
  flex: 0 0 auto;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(255 255 255 / 18%);
  border-radius: 15px 15px 15px 5px;
  background: linear-gradient(145deg, #b8dfb5, #e0efc8);
  color: #24543b;
  font-family: Georgia, serif;
  font-size: 26px;
  font-weight: 800;
  box-shadow: 0 5px 15px rgb(0 0 0 / 10%);
}

.brand-copy,
.profile-copy,
.registration-brand > span:last-child,
.registration-mobile-brand > span:last-child {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.brand-copy strong,
.registration-brand strong,
.registration-mobile-brand strong {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1.4;
}

.brand-copy small,
.registration-brand small,
.registration-mobile-brand small {
  margin-top: 2px;
  font-size: 10px;
  line-height: 1.7;
  opacity: 0.75;
}

/* 05. SIDEBAR */
.sidebar {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  width: 258px;
  min-width: 258px;
  height: 100vh;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 27px 18px 20px;
  border-right: 1px solid rgb(255 255 255 / 7%);
  background:
    radial-gradient(
      circle at 0% 0%,
      rgb(107 161 110 / 15%),
      transparent 34%
    ),
    linear-gradient(180deg, #193f30 0%, #214b37 100%);
  color: #f4faf3;
  scrollbar-width: thin;
  scrollbar-color: #55765f transparent;
}

.sidebar .brand {
  padding: 0 5px;
}

.campus-label {
  margin: 5px 9px 13px;
  color: #b5cdb8;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
}

.main-nav {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.nav-item {
  position: relative;
  display: flex;
  width: 100%;
  min-height: 47px;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: 12px;
  background: transparent;
  color: #d5e4d6;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
}

.nav-item:hover:not(.active) {
  border-color: rgb(255 255 255 / 7%);
  background: rgb(255 255 255 / 8%);
  color: white;
  transform: translateX(2px);
}

.nav-item.active {
  border-color: #dceedd;
  background: #edf6ee;
  color: #28563b;
  box-shadow: 0 5px 15px rgb(0 0 0 / 8%);
}

.nav-item.active::before {
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: -1px;
  width: 3px;
  border-radius: 0 5px 5px 0;
  background: #e6a16c;
  content: "";
}

.nav-icon {
  display: inline-flex;
  width: 31px;
  height: 31px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(255 255 255 / 8%);
  border-radius: 10px;
  background: rgb(255 255 255 / 7%);
  font-size: 17px;
  line-height: 1;
}

.nav-item.active .nav-icon {
  border-color: #dcebdd;
  background: #dceedd;
}

.nav-count {
  display: inline-flex;
  min-width: 23px;
  height: 23px;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  padding: 0 6px;
  border-radius: 8px;
  background: rgb(255 255 255 / 12%);
  color: inherit;
  font-size: 10px;
  font-weight: 800;
}

.nav-item.active .nav-count {
  background: #d9ead8;
}

.sidebar-spacer {
  flex: 1;
  min-height: 25px;
}

/* 06. POINTS CARD */
.points-card {
  margin-top: 22px;
  padding: 17px;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 17px;
  background:
    radial-gradient(
      circle at 100% 0%,
      rgb(199 226 172 / 14%),
      transparent 50%
    ),
    rgb(255 255 255 / 6%);
}

.points-top {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #d8e8d6;
  font-size: 11px;
  font-weight: 700;
}

.sparkle {
  display: inline-flex;
  width: 26px;
  height: 26px;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: rgb(211 234 180 / 15%);
  color: #d7edb8;
  font-size: 17px;
}

.points-card > strong {
  display: block;
  margin: 10px 0 12px;
  color: white;
  font-size: 25px;
  letter-spacing: -0.6px;
}

.points-card > strong small {
  color: #c1d7c2;
  font-size: 11px;
  font-weight: 500;
}

.points-track {
  height: 7px;
  overflow: hidden;
  border-radius: 20px;
  background: rgb(255 255 255 / 15%);
}

.points-track span {
  display: block;
  width: 83%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #a9d7a6, #dcebb5);
}

.points-card p {
  margin: 10px 0 0;
  color: #c7d9c7;
  font-size: 10px;
  line-height: 1.8;
}

/* 07. PROFILE & SIGN OUT */
.profile-area {
  margin-top: 19px;
  padding-top: 17px;
  border-top: 1px solid rgb(255 255 255 / 12%);
}

.profile-button {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
  padding: 5px 2px 11px;
}

.avatar,
.top-avatar {
  display: inline-flex;
  width: 39px;
  height: 39px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 2px solid rgb(255 255 255 / 70%);
  border-radius: 14px;
  background: linear-gradient(145deg, #f2d9ba, #e7bda2);
  color: #6a4534;
  font-size: 14px;
  font-weight: 800;
}

.profile-copy {
  flex: 1;
  overflow: hidden;
}

.profile-copy strong {
  overflow: hidden;
  color: #f5faf4;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-copy small {
  overflow: hidden;
  margin-top: 3px;
  color: #b9cdbb;
  font-size: 9px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.signout-button {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 11px;
  border: 1px solid rgb(255 255 255 / 9%);
  border-radius: 10px;
  background: rgb(255 255 255 / 5%);
  color: #d4e4d5;
  font-size: 11px;
}

.signout-button:hover {
  border-color: rgb(255 190 170 / 30%);
  background: rgb(255 255 255 / 10%);
  color: white;
}

/* 08. TOPBAR */
.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  min-height: 76px;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 13px 30px;
  border-bottom: 1px solid #e8eee6;
  background: rgb(255 255 255 / 94%);
  backdrop-filter: blur(16px);
}

.breadcrumbs {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
  color: #8a978c;
  font-size: 12px;
}

.breadcrumbs strong {
  overflow: hidden;
  color: #2e6044;
  font-size: 13px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.crumb-separator {
  color: #bdc8bc;
}

.topbar-actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 10px;
}

.theme-toggle,
.language-toggle,
.icon-button {
  position: relative;
  display: inline-flex;
  min-height: 37px;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 11px;
  border: 1px solid #e0e9df;
  border-radius: 11px;
  background: #f8fbf6;
  color: #476451;
  font-size: 11px;
  font-weight: 700;
}

.theme-toggle > span {
  font-size: 15px;
}

.theme-toggle:hover,
.language-toggle:hover,
.icon-button:hover {
  border-color: #9ac4a2;
  background: #edf6ee;
  color: #286344;
  transform: translateY(-1px);
}

.language-toggle {
  min-width: 39px;
  padding: 0 10px;
}

.open-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #66816b;
  font-size: 10px;
  white-space: nowrap;
}

.open-status i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #65b77a;
  box-shadow: 0 0 0 3px #e6f5e8;
}

.open-status b {
  color: #4a6850;
  font-weight: 700;
}

.icon-button {
  width: 38px;
  height: 38px;
  padding: 0;
  font-size: 19px;
}

.notification-dot {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 7px;
  height: 7px;
  border: 1px solid white;
  border-radius: 50%;
  background: #e78372;
}

.top-avatar {
  width: 38px;
  height: 38px;
  border-color: #f1e5d7;
}

/* Mobile menu button */
.menu-toggle {
  display: none;
  width: 39px;
  height: 39px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--line);
  border-radius: 11px;
  background: white;
  color: var(--green-dark);
  font-size: 18px;
}

.menu-toggle:hover {
  background: var(--green-light);
}

.mobile-scrim {
  display: none;
}

/* 09. FOOTER */
.page-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 17px 30px;
  border-top: 1px solid #e8eee6;
  color: #7a897e;
  font-size: 10px;
}

/* 10. REGISTRATION PAGE */
.registration-page {
  position: relative;
  display: grid;
  min-height: 100vh;
  grid-template-columns: minmax(300px, 0.9fr) minmax(0, 1.1fr);
  background:
    radial-gradient(circle at 90% 5%, #edf7e8 0, transparent 32%),
    #f6f8f4;
}

.registration-story {
  position: relative;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  overflow: hidden;
  padding: 42px clamp(28px, 5vw, 72px);
  background:
    radial-gradient(circle at 15% 90%, #3d7654 0, transparent 38%),
    radial-gradient(circle at 95% 10%, #497a53 0, transparent 30%),
    linear-gradient(145deg, #173d2e, #24563e);
  color: white;
}

.registration-brand {
  position: relative;
  z-index: 1;
  align-self: flex-start;
}

.registration-brand strong {
  font-size: 22px;
}

.story-copy {
  position: relative;
  z-index: 1;
  max-width: 460px;
  margin: auto 0;
  padding: 55px 0;
}

.story-eyebrow,
.form-eyebrow {
  margin: 0 0 13px;
  color: #6b9876;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
}

.story-eyebrow {
  color: #c2e2bd;
}

.story-copy h1 {
  margin: 0;
  font-size: clamp(29px, 3.2vw, 45px);
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1.65;
}

.story-copy > p:not(.story-eyebrow) {
  max-width: 360px;
  margin: 17px 0 27px;
  color: #d2e3d3;
  font-size: 13px;
  line-height: 2;
}

.story-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.story-list span {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #e1eee0;
  font-size: 12px;
}

.story-list i {
  display: inline-flex;
  width: 31px;
  height: 31px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(255 255 255 / 16%);
  border-radius: 10px;
  background: rgb(255 255 255 / 9%);
  color: #d5edc7;
  font-size: 12px;
  font-style: normal;
  font-weight: 800;
}

.story-footer {
  position: relative;
  z-index: 1;
  color: #b6d0b9;
  font-size: 10px;
}

.story-footer span {
  padding: 0 7px;
  color: #e6c69d;
}

.registration-main {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: center;
  padding: 55px clamp(22px, 5vw, 76px);
}

.registration-form-wrap {
  width: 100%;
  max-width: 590px;
  padding: clamp(24px, 3.5vw, 43px);
  border: 1px solid #e8eee6;
  border-radius: 24px;
  background: white;
  box-shadow: 0 18px 55px rgb(35 67 46 / 8%);
}

.registration-mobile-brand {
  display: none;
}

.registration-theme-toggle,
.registration-language-toggle {
  position: absolute;
  z-index: 5;
  top: 17px;
}

.registration-theme-toggle {
  right: 18px;
}

.registration-language-toggle {
  right: 130px;
}

.form-heading {
  margin-bottom: 25px;
}

.form-heading h2 {
  margin: 0;
  color: #254734;
  font-size: clamp(22px, 2.5vw, 29px);
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1.65;
}

.form-heading > p:last-child {
  margin: 8px 0 0;
  color: #879388;
  font-size: 12px;
  line-height: 1.9;
}

/* Registration form fields */
.registration-form {
  width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 17px 14px;
}

.field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 7px;
  color: #45594a;
  font-size: 11px;
  font-weight: 700;
}

.full-field {
  grid-column: 1 / -1;
}

.optional {
  color: #9aa59a;
  font-size: 10px;
  font-weight: 500;
}

.field input,
.field select {
  display: block;
  width: 100%;
  min-width: 0;
  min-height: 47px;
  padding: 0 12px;
  border: 1px solid #dfe8dd;
  border-radius: 11px;
  background: #fbfdf9;
  color: #344b39;
  font-size: 12px;
  font-weight: 400;
  transition: border-color var(--transition), box-shadow var(--transition);
}

.field input::placeholder {
  color: #b0bbb0;
}

.field input:hover,
.field select:hover {
  border-color: #b8d2be;
}

.field input:focus,
.field select:focus {
  border-color: #43865e;
  outline: none;
  box-shadow: 0 0 0 4px rgb(67 134 94 / 10%);
}

.field select {
  cursor: pointer;
}

.registration-error {
  margin: 15px 0 0;
  padding: 11px 13px;
  border: 1px solid #f2d1cc;
  border-radius: 11px;
  background: #fff2f0;
  color: #b5473e;
  font-size: 11px;
  line-height: 1.8;
}

.terms-check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 20px 0;
  color: #778479;
  font-size: 10px;
  line-height: 1.9;
  cursor: pointer;
}

.terms-check input {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  margin: 3px 0 0;
  accent-color: var(--green);
  cursor: pointer;
}

.register-button {
  display: flex;
  width: 100%;
  min-height: 49px;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 11px 17px;
  border: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, #438963, #2e6c49);
  color: white;
  font-size: 12px;
  font-weight: 800;
  box-shadow: 0 7px 18px rgb(52 120 88 / 20%);
}

.register-button > span {
  font-size: 18px;
  transition: transform var(--transition);
}

.register-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgb(52 120 88 / 26%);
}

.register-button:hover:not(:disabled) > span {
  transform: translateX(4px);
}

.privacy-note {
  margin: 17px 0 0;
  color: #98a197;
  font-size: 10px;
  line-height: 1.9;
  text-align: center;
}

/* 11. DASHBOARD COMPONENTS */
#app .page-content .welcome-row {
  position: relative;
  overflow: hidden;
  border: 1px solid #dfebdf;
  border-radius: 22px;
  background:
    radial-gradient(circle at 95% 0%, #fff5e7 0, transparent 35%),
    linear-gradient(125deg, #eaf5eb, #f5f7eb);
  box-shadow: var(--shadow-sm);
}

#app .page-content .welcome-copy h1 {
  color: #254533;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1.65;
}

#app .page-content .welcome-copy h1 em {
  color: #47855d;
  font-style: normal;
}

#app .page-content .primary-action {
  display: inline-flex;
  min-height: 43px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 17px;
  border: 0;
  border-radius: 11px;
  background: linear-gradient(135deg, #438963, #2e6c49);
  color: white;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 5px 14px rgb(52 120 88 / 15%);
}

#app .page-content .primary-action:hover {
  background: #245d40;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgb(52 120 88 / 22%);
}

#app .page-content .reading-note {
  border: 1px solid #efe4d1;
  border-radius: 16px;
  background: linear-gradient(135deg, #fffaf1, #fffdf8);
}

/* Statistic cards */
#app .page-content .stat-card,
#app .page-content .panel {
  border: 1px solid #e6ece5;
  border-radius: 17px;
  background: white;
  box-shadow: var(--shadow-sm);
}

#app .page-content .stat-card {
  transition: transform var(--transition), box-shadow var(--transition);
}

#app .page-content .stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

#app .page-content .panel-heading h2,
#app .page-content .streak-panel h2 {
  color: #304b38;
  font-weight: 800;
}

/* 12. CATALOG & BOOKS */
#app .page-content .search-box {
  min-height: 47px;
  border: 1px solid #e1e9e0;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 12px rgb(32 60 42 / 3%);
  transition: border-color var(--transition), box-shadow var(--transition);
}

#app .page-content .search-box:focus-within {
  border-color: #76aa84;
  box-shadow: 0 0 0 4px rgb(67 134 94 / 9%);
}

#app .page-content .book-card {
  overflow: hidden;
  border: 1px solid #e5ece4;
  border-radius: 17px;
  background: white;
  box-shadow: var(--shadow-sm);
  transition:
    transform var(--transition),
    box-shadow var(--transition),
    border-color var(--transition);
}

#app .page-content .book-card:hover {
  transform: translateY(-5px);
  border-color: #d3e6d4;
  box-shadow: var(--shadow-md);
}

#app .page-content .book-details h3 {
  color: #304b38;
  font-weight: 800;
  line-height: 1.7;
}

#app .page-content .hold-button {
  min-height: 37px;
  padding: 8px 13px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
}

/* 13. ROOM BOOKING */
#app .page-content .room-summary,
#app .page-content .floor-layout,
#app .page-content .room-card-item,
#app .page-content .selection-row {
  border-radius: 15px;
}

#app .page-content .room-card-item {
  transition: transform var(--transition), box-shadow var(--transition);
}

#app .page-content .room-card-item:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

#app .page-content .reserve-button,
#app .page-content .checkin-button,
#app .page-content .verify-button {
  min-height: 39px;
  padding: 8px 13px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
}

/* 14. LOANS & HOLDS */
#app .page-content .loan-card,
#app .page-content .hold-card,
#app .page-content .loan-stats article {
  border: 1px solid #e5ece5;
  border-radius: 15px;
  background: white;
  box-shadow: var(--shadow-sm);
}

#app .page-content .action-buttons button {
  min-height: 34px;
  padding: 7px 10px;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 700;
}

/* 15. CART & GENERAL FORMS */
#app .page-content .cart-item,
#app .page-content .cart-summary,
#app .page-content .cart-empty {
  border: 1px solid var(--line);
  border-radius: 17px;
  background: white;
  box-shadow: var(--shadow-sm);
}

#app .page-content .cart-item {
  transition: box-shadow var(--transition), border-color var(--transition);
}

#app .page-content .cart-item:hover {
  border-color: #d4e5d4;
  box-shadow: var(--shadow-md);
}

#app .page-content .cart-summary {
  padding: 22px;
}

#app .page-content .place-holds {
  min-height: 44px;
  border: 0;
  border-radius: 11px;
  background: var(--green);
  color: white;
  font-weight: 800;
}

#app .page-content .place-holds:hover {
  background: var(--green-dark);
  transform: translateY(-1px);
}

#app .page-content input:not([type="checkbox"]):not([type="radio"]),
#app .page-content select,
#app .page-content textarea {
  border-radius: 10px;
}

#app .page-content button:disabled {
  transform: none;
  box-shadow: none;
}

/* 16. TABLES & BADGES */
#app .page-content table {
  width: 100%;
  border-collapse: collapse;
}

#app .page-content th {
  background: #f4f8f2;
  color: #526c57;
  font-size: 11px;
  font-weight: 800;
  text-align: left;
}

#app .page-content th,
#app .page-content td {
  padding: 12px 14px;
  border-bottom: 1px solid #e9eee7;
}

#app .page-content tr:last-child td {
  border-bottom: 0;
}

#app .page-content tbody tr:hover {
  background: #f8fbf6;
}

/* 17. DARK MODE */
.dark-theme {
  color-scheme: dark;

  --ink: #e4e9e4;
  --muted: #a3afa5;
  --line: #303a33;
  --paper: #202a24;
  --page-bg: #171e19;
  --green-light: #293b2e;
  --green-soft: #202c23;

  --shadow-sm: 0 4px 15px rgb(0 0 0 / 12%);
  --shadow-md: 0 12px 30px rgb(0 0 0 / 18%);
  --shadow-lg: 0 20px 50px rgb(0 0 0 / 24%);
}

.dark-theme.app-frame {
  background: #171e19;
  color: #e4e9e4;
}

.dark-theme .main-area {
  background: #171e19;
}

.dark-theme .topbar {
  border-color: #303a33;
  background: rgb(30 39 32 / 95%);
}

.dark-theme .breadcrumbs {
  color: #a5b1a6;
}

.dark-theme .breadcrumbs strong {
  color: #b5dfbd;
}

.dark-theme .crumb-separator {
  color: #5e7162;
}

.dark-theme .theme-toggle,
.dark-theme .language-toggle,
.dark-theme .icon-button,
.dark-theme .menu-toggle {
  border-color: #39483d;
  background: #253128;
  color: #d4e4d6;
}

.dark-theme .theme-toggle:hover,
.dark-theme .language-toggle:hover,
.dark-theme .icon-button:hover,
.dark-theme .menu-toggle:hover {
  border-color: #668f6b;
  background: #2d4031;
}

.dark-theme .notification-dot {
  border-color: #253128;
}

.dark-theme .open-status {
  color: #a8c9ad;
}

.dark-theme .open-status b {
  color: #d4e7d4;
}

.dark-theme .open-status i {
  box-shadow: 0 0 0 3px #263b2b;
}

.dark-theme .page-footer {
  border-color: #303a33;
  color: #a0aca1;
}

.dark-theme .registration-page {
  background:
    radial-gradient(circle at 90% 5%, #293b2c 0, transparent 32%),
    #171e19;
}

.dark-theme .registration-form-wrap {
  border-color: #303a33;
  background: #202a24;
  color: #e4e9e4;
  box-shadow: none;
}

.dark-theme .form-heading h2 {
  color: #e1eee2;
}

.dark-theme .form-heading > p:last-child,
.dark-theme .privacy-note {
  color: #a0ada1;
}

.dark-theme .field {
  color: #d4e2d5;
}

.dark-theme .field input,
.dark-theme .field select {
  border-color: #39483d;
  background: #19231c;
  color: #e4e9e4;
}

.dark-theme .field input::placeholder {
  color: #78867a;
}

.dark-theme .terms-check {
  color: #b1beb2;
}

.dark-theme .registration-error {
  border-color: #66413b;
  background: #382723;
  color: #ffc0b4;
}

.dark-theme .nav-item.active {
  border-color: #3b5740;
  background: #2b4030;
  color: #d8f0da;
}

.dark-theme .nav-item.active .nav-icon {
  border-color: #3b5740;
  background: #354c38;
}

.dark-theme #app .page-content .welcome-row {
  border-color: #39483d;
  background: linear-gradient(125deg, #243b2b, #2b3428);
}

.dark-theme #app .page-content .welcome-copy h1 {
  color: #e4eee3;
}

.dark-theme #app .page-content .welcome-copy h1 em {
  color: #a6d6b0;
}

.dark-theme #app .page-content .reading-note {
  border-color: #514632;
  background: #302b20;
  color: #eee1c9;
}

.dark-theme #app .page-content .stat-card,
.dark-theme #app .page-content .panel,
.dark-theme #app .page-content .book-card,
.dark-theme #app .page-content .loan-card,
.dark-theme #app .page-content .hold-card,
.dark-theme #app .page-content .loan-stats article,
.dark-theme #app .page-content .cart-item,
.dark-theme #app .page-content .cart-summary,
.dark-theme #app .page-content .cart-empty {
  border-color: #303a33;
  background: #202a24;
  color: #e4e9e4;
  box-shadow: none;
}

.dark-theme #app .page-content .stat-card:hover,
.dark-theme #app .page-content .book-card:hover,
.dark-theme #app .page-content .cart-item:hover {
  border-color: #4a6950;
  box-shadow: var(--shadow-md);
}

.dark-theme #app .page-content .panel-heading h2,
.dark-theme #app .page-content .streak-panel h2,
.dark-theme #app .page-content .book-details h3 {
  color: #e1eee2;
}

.dark-theme #app .page-content .search-box,
.dark-theme #app .page-content input:not([type="checkbox"]):not([type="radio"]),
.dark-theme #app .page-content select,
.dark-theme #app .page-content textarea {
  border-color: #39483d;
  background: #19231c;
  color: #e4e9e4;
}

.dark-theme #app .page-content .search-box:focus-within {
  border-color: #76aa84;
}

.dark-theme #app .page-content th {
  background: #29372c;
  color: #c8dfca;
}

.dark-theme #app .page-content th,
.dark-theme #app .page-content td {
  border-color: #303a33;
}

.dark-theme #app .page-content tbody tr:hover {
  background: #263128;
}

/* 18. TABLET */
@media (max-width: 1100px) {
  .sidebar {
    width: 230px;
    min-width: 230px;
    padding-right: 14px;
    padding-left: 14px;
  }

  .topbar {
    padding-right: 22px;
    padding-left: 22px;
  }

  .page-content {
    padding: 25px 22px 35px;
  }

  .open-status b {
    display: none;
  }

  .registration-story {
    padding-right: 30px;
    padding-left: 30px;
  }

  .registration-main {
    padding-right: 28px;
    padding-left: 28px;
  }
}

/* 19. MOBILE SIDEBAR & TOPBAR */
@media (max-width: 800px) {
  .app-frame {
    display: block;
  }

  .sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    width: min(290px, 85vw);
    min-width: 0;
    height: 100dvh;
    transform: translateX(-105%);
    transition: transform 0.28s ease;
    box-shadow: none;
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
    box-shadow: 15px 0 45px rgb(0 0 0 / 18%);
  }

  .mobile-scrim {
    position: fixed;
    inset: 0;
    z-index: 90;
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
    background: rgb(16 30 20 / 48%);
    backdrop-filter: blur(2px);
  }

  .menu-toggle {
    display: inline-flex;
  }

  .main-area {
    width: 100%;
    min-height: 100vh;
  }

  .topbar {
    position: sticky;
    top: 0;
    min-height: 68px;
    gap: 12px;
    padding: 12px 17px;
  }

  .topbar-actions {
    gap: 7px;
  }

  .page-content {
    padding: 24px 18px 32px;
  }

  .page-footer {
    padding: 16px 18px;
  }

  .registration-page {
    grid-template-columns: 1fr;
  }

  .registration-story {
    display: none;
  }

  .registration-main {
    min-height: 100vh;
    padding: 75px 20px 35px;
  }

  .registration-mobile-brand {
    display: flex;
    justify-content: center;
    margin-bottom: 23px;
  }

  .registration-form-wrap {
    max-width: 560px;
    padding: 27px;
    border-radius: 20px;
  }
}

/* 20. SMALL MOBILE */
@media (max-width: 560px) {
  .topbar {
    min-height: 62px;
    gap: 9px;
    padding: 10px 12px;
  }

  .breadcrumbs {
    flex: 1;
    gap: 6px;
    font-size: 10px;
  }

  .breadcrumbs strong {
    font-size: 11px;
  }

  .topbar-actions {
    gap: 6px;
  }

  .theme-toggle {
    min-height: 34px;
    gap: 4px;
    padding: 0 8px;
    font-size: 10px;
  }

  .theme-toggle > span {
    font-size: 14px;
  }

  .language-toggle {
    min-width: 34px;
    min-height: 34px;
    padding: 0 7px;
    font-size: 10px;
  }

  .open-status,
  .top-avatar {
    display: none;
  }

  .icon-button {
    width: 34px;
    height: 34px;
    min-height: 34px;
  }

  .page-content {
    padding: 19px 13px 27px;
  }

  .page-footer {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
    padding: 14px 13px;
    font-size: 9px;
  }

  #app .page-content .welcome-row {
    border-radius: 17px;
  }

  #app .page-content .stat-card,
  #app .page-content .panel,
  #app .page-content .book-card,
  #app .page-content .loan-card,
  #app .page-content .hold-card {
    border-radius: 13px;
  }

  .registration-main {
    align-items: flex-start;
    padding: 75px 13px 24px;
  }

  .registration-mobile-brand {
    margin-bottom: 19px;
  }

  .registration-form-wrap {
    padding: 21px 17px;
    border-radius: 17px;
  }

  .form-heading {
    margin-bottom: 21px;
  }

  .form-heading h2 {
    font-size: 23px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .full-field {
    grid-column: auto;
  }

  .field input,
  .field select {
    min-height: 46px;
  }

  .registration-theme-toggle {
    top: 12px;
    right: 12px;
  }

  .registration-language-toggle {
    top: 12px;
    right: 119px;
  }

  .terms-check {
    margin: 17px 0;
  }

  .privacy-note {
    font-size: 9px;
  }
}

/* 21. VERY SMALL SCREENS */
@media (max-width: 360px) {
  .topbar {
    gap: 6px;
    padding-right: 8px;
    padding-left: 8px;
  }

  .breadcrumbs {
    max-width: 105px;
  }

  .theme-toggle {
    width: 34px;
    justify-content: center;
    overflow: hidden;
    gap: 0;
    padding: 0;
    font-size: 0;
  }

  .theme-toggle > span {
    font-size: 15px;
  }

  .topbar-actions {
    gap: 5px;
  }

  .page-content {
    padding-right: 10px;
    padding-left: 10px;
  }

  .registration-form-wrap {
    padding: 18px 13px;
  }
}

/* 22. ACCESSIBILITY */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>