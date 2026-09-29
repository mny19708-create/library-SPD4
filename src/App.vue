<template>
	<div v-if="!student" class="registration-page">
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
	<div v-else class="app-frame">
		<aside class="sidebar" :class="{ 'sidebar-open': menuOpen }">
			<a class="brand" href="#home" @click.prevent="navigate('dashboard')">
				<span class="brand-mark">L</span>
				<span class="brand-copy"><strong>Leafline</strong><small>បណ្ណាល័យសាកលវិទ្យាល័យ</small></span>
			</a>

			<div class="campus-label">សេវាកម្មបណ្ណាល័យ</div>
			<nav class="main-nav" aria-label="ម៉ឺនុយមេ">
				<button v-for="item in navigation" :key="item.id" class="nav-item" :class="{ active: currentPage === item.id }" @click="navigate(item.id)">
					<span class="nav-icon" aria-hidden="true">{{ item.icon }}</span>
					<span>{{ item.label }}</span>
					<span v-if="item.id === 'loans'" class="nav-count">2</span>
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
					<div class="profile-button"><span class="avatar">{{ initials }}</span><span class="profile-copy"><strong>{{ student.fullName }}</strong><small>{{ facultyName }} · {{ yearName }}</small></span></div>
					<button class="signout-button" type="button" @click="signOut">ចាកចេញពីគណនី <span>↪</span></button>
				</div>
		</aside>

		<main class="main-area">
			<header class="topbar">
				<button class="menu-toggle" aria-label="បើកម៉ឺនុយ" @click="menuOpen = !menuOpen">☰</button>
				<div class="breadcrumbs"><span>បណ្ណាល័យ</span><span class="crumb-separator">/</span><strong>{{ activeTitle }}</strong></div>
				<div class="topbar-actions">
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
import { computed, provide, ref } from 'vue';
import DashboardView from '@/views/DashboardView.vue';
import RoomMap from '@/views/RoomMap.vue';
import CatalogView from '@/views/CatalogView.vue';
import UserLoans from '@/views/UserLoans.vue';
import api, { apiConfigured } from '@/services/api';

const navigation = [
	{ id: 'dashboard', label: 'ទំព័រដើម', icon: '⌂' },
	{ id: 'rooms', label: 'កក់បន្ទប់សិក្សា', icon: '▦' },
	{ id: 'catalog', label: 'ស្វែងរកសៀវភៅ', icon: '▤' },
	{ id: 'loans', label: 'សៀវភៅខ្ចី', icon: '↗' },
];

const pages = {
	dashboard: DashboardView,
	rooms: RoomMap,
	catalog: CatalogView,
	loans: UserLoans,
};
const currentPage = ref('dashboard');
const menuOpen = ref(false);
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
const activeTitle = computed(() => navigation.find((item) => item.id === currentPage.value)?.label ?? 'ទំព័រដើម');
const facultyName = computed(() => faculties.find((faculty) => faculty.value === student.value?.faculty)?.label ?? 'និស្សិត');
const yearName = computed(() => student.value?.year === 'postgraduate' ? 'ក្រោយបរិញ្ញាបត្រ' : `ឆ្នាំទី ${khmerNumber(student.value?.year ?? '')}`);
const initials = computed(() => student.value?.fullName?.trim().split(/\s+/).slice(0, 2).map((part) => [...part][0]).join('') ?? 'ន');

provide('studentProfile', student);

try {
	student.value = JSON.parse(localStorage.getItem('leafline_student') || 'null');
} catch {
	localStorage.removeItem('leafline_student');
}

function khmerNumber(value) { return String(value).replace(/\d/g, (digit) => '០១២៣៤៥៦៧៨៩'[Number(digit)]); }

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
	currentPage.value = page;
	menuOpen.value = false;
}
</script>

<style>
:root {
	font-family: 'Noto Sans Khmer', 'Khmer OS System', sans-serif;
	color: #202a25;
	background: #f4f6f2;
	font-synthesis: none;
	text-rendering: optimizeLegibility;
	-webkit-font-smoothing: antialiased;
	--ink: #202a25;
	--muted: #78817b;
	--line: #e7ebe6;
	--green: #237b5a;
	--green-dark: #184d3b;
	--green-pale: #e9f4ed;
	--coral: #df7358;
	--paper: #fff;
}

* { box-sizing: border-box; }
body { min-width: 320px; min-height: 100vh; margin: 0; line-height: 1.65; }
button, input, select { font: inherit; }
button { color: inherit; }
.app-frame { min-height: 100vh; }
.registration-page { display: grid; min-height: 100vh; grid-template-columns: minmax(310px, .82fr) minmax(540px, 1.18fr); background: #f6f7f3; }
.registration-story { position: relative; display: flex; min-height: 100vh; flex-direction: column; overflow: hidden; padding: 34px clamp(28px, 5vw, 68px) 25px; background: #193f32; color: #f5faf6; }
.registration-story::after { position: absolute; right: -160px; bottom: 80px; width: 420px; height: 420px; border: 1px solid #ffffff20; border-radius: 50%; box-shadow: 0 0 0 48px #ffffff08, 0 0 0 98px #ffffff06; content: ''; pointer-events: none; }
.registration-brand, .registration-mobile-brand { display: flex; align-items: center; gap: 12px; color: inherit; text-decoration: none; }
.registration-brand > span:last-child, .registration-mobile-brand > span:last-child { display: grid; gap: 2px; }
.registration-brand strong, .registration-mobile-brand strong { font-size: 18px; }
.registration-brand small, .registration-mobile-brand small { color: #bfd2c5; font-size: 12px; }
.story-copy { position: relative; z-index: 1; width: min(430px, 100%); margin: auto 0; padding: 70px 0; }
.story-eyebrow, .form-eyebrow { margin: 0 0 13px; color: #edb27d; font-size: 14px; font-weight: 600; }
.story-copy h1 { margin: 0; color: #fff; font-size: 36px; font-weight: 600; line-height: 1.55; }
.story-copy > p:not(.story-eyebrow) { max-width: 370px; margin: 16px 0 0; color: #d2e0d6; font-size: 16px; line-height: 1.8; }
.story-list { display: grid; gap: 12px; margin-top: 34px; color: #e1ebe4; font-size: 14px; }
.story-list span { display: flex; align-items: center; gap: 10px; }
.story-list i { display: grid; width: 29px; height: 29px; place-items: center; border: 1px solid #ffffff45; border-radius: 50%; color: #f0b780; font-size: 13px; font-style: normal; }
.story-footer { position: relative; z-index: 1; color: #b6cbbd; font-size: 12px; }
.story-footer span { padding: 0 5px; color: #eda775; }
.registration-main { display: grid; align-content: center; justify-items: center; padding: 46px clamp(24px, 5vw, 74px); }
.registration-mobile-brand { display: none; }
.registration-form-wrap { width: min(660px, 100%); }
.form-heading { margin-bottom: 24px; }
.form-eyebrow { margin-bottom: 7px; color: #47805c; }
.form-heading h2 { margin: 0; color: #223a2e; font-size: 28px; font-weight: 600; line-height: 1.5; }
.form-heading > p:last-child { margin: 5px 0 0; color: #66746a; font-size: 14px; }
.registration-form { display: grid; gap: 16px; }
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 15px 14px; }
.field { display: grid; min-width: 0; gap: 6px; color: #36473b; font-size: 13px; font-weight: 600; }
.field input, .field select { width: 100%; height: 46px; min-width: 0; padding: 0 12px; border: 1px solid #d7ded6; border-radius: 5px; outline: none; background: #fff; color: #293a2f; font-size: 14px; font-weight: 400; }
.field input::placeholder { color: #929c94; }
.field input:focus, .field select:focus { border-color: #39825a; box-shadow: 0 0 0 3px #39825a18; }
.full-field { grid-column: 1 / -1; }
.optional { color: #8a958c; font-size: 11px; font-weight: 400; }
.terms-check { display: flex; align-items: flex-start; gap: 9px; color: #56645a; font-size: 13px; line-height: 1.7; }
.terms-check input { width: 17px; height: 17px; flex: 0 0 auto; margin: 3px 0 0; accent-color: #287755; }
.registration-error { margin: -5px 0; color: #a64535; font-size: 13px; }
.register-button { display: flex; min-height: 48px; align-items: center; justify-content: center; gap: 10px; border: 0; border-radius: 5px; background: #267754; color: #fff; cursor: pointer; font-size: 15px; font-weight: 600; }
.register-button:hover { background: #1b6346; }
.register-button:disabled { background: #91ae9a; cursor: wait; }
.privacy-note { margin: -5px 0 0; color: #78847b; font-size: 11px; line-height: 1.7; text-align: center; }
.sidebar { position: fixed; z-index: 5; inset: 0 auto 0 0; display: flex; width: 252px; flex-direction: column; padding: 28px 18px 18px; background: #193f32; color: #f6faf7; }
.brand { display: flex; align-items: center; gap: 11px; margin: 0 8px 49px; color: inherit; text-decoration: none; }
.brand-mark { display: grid; width: 38px; height: 38px; place-items: center; border-radius: 12px 12px 12px 4px; background: #e6a16c; color: #203d31; font-size: 24px; font-weight: 700; }
.brand-copy { display: grid; gap: 3px; }
.brand-copy strong { font-size: 17px; letter-spacing: 0; }
.brand-copy small { color: #a9c0b4; font-size: 11px; font-weight: 600; }
.campus-label { margin: 0 12px 12px; color: #b2c9bb; font-size: 13px; font-weight: 600; }
.main-nav { display: grid; gap: 5px; }
.nav-item { display: flex; min-height: 48px; align-items: center; gap: 13px; padding: 0 12px; border: 0; border-radius: 7px; background: transparent; color: #d3e0d8; cursor: pointer; text-align: left; font-size: 14px; transition: background .16s ease, color .16s ease; }
.nav-item:hover { background: #285542; color: white; }
.nav-item.active { background: #e7f2e9; color: #204b38; font-weight: 700; }
.nav-icon { display: grid; width: 20px; place-items: center; font-size: 19px; line-height: 1; }
.nav-count { display: grid; width: 20px; height: 20px; margin-left: auto; place-items: center; border-radius: 50%; background: #dcece1; color: #246044; font-size: 10px; }
.sidebar-spacer { flex: 1; min-height: 40px; }
.points-card { padding: 15px 14px 13px; border: 1px solid #3a614e; border-radius: 8px; background: #214a39; }
.points-top { display: flex; align-items: center; gap: 7px; color: #c9ddcf; font-size: 12px; font-weight: 600; }
.sparkle { color: #edb075; font-size: 16px; }
.points-card > strong { display: block; margin-top: 10px; font-size: 25px; }
.points-card > strong small { color: #bbd0c3; font-size: 12px; font-weight: 500; }
.points-track { height: 4px; margin-top: 10px; overflow: hidden; border-radius: 4px; background: #466957; }
.points-track span { display: block; width: 82%; height: 100%; border-radius: inherit; background: #e6a16c; }
.points-card p { margin: 8px 0 0; color: #d3e1d7; font-size: 12px; }
.profile-button { display: flex; align-items: center; gap: 10px; margin-top: 16px; padding: 12px 4px 2px; border: 0; border-top: 1px solid #345744; background: transparent; color: inherit; text-align: left; }
.profile-area { margin-top: 15px; padding-top: 11px; border-top: 1px solid #345744; }
.profile-area .profile-button { margin: 0; padding: 0; border: 0; }
.signout-button { display: flex; width: 100%; align-items: center; justify-content: space-between; margin-top: 7px; padding: 5px 3px; border: 0; background: transparent; color: #d3e0d8; cursor: pointer; font-size: 12px; text-align: left; }
.signout-button:hover { color: #fff; }
.avatar, .top-avatar { display: grid; flex: 0 0 auto; width: 34px; height: 34px; place-items: center; border-radius: 50%; background: #e5bd98; color: #513928; font-size: 11px; font-weight: 700; }
.profile-copy { display: grid; gap: 3px; }
.profile-copy strong { font-size: 11px; }
.profile-copy small { color: #c2d4c9; font-size: 12px; }
.profile-more { margin-left: auto; color: #acc1b5; font-size: 22px; }
.main-area { min-height: 100vh; margin-left: 252px; }
.topbar { position: sticky; z-index: 3; top: 0; display: flex; height: 65px; align-items: center; justify-content: space-between; padding: 0 40px; border-bottom: 1px solid var(--line); background: rgba(255,255,255,.95); backdrop-filter: blur(10px); }
.breadcrumbs { display: flex; align-items: center; gap: 10px; color: #69766e; font-size: 13px; }
.breadcrumbs strong { color: #354039; font-weight: 600; }
.crumb-separator { color: #bdc5bf; }
.topbar-actions { display: flex; align-items: center; gap: 19px; }
.open-status { display: flex; align-items: center; gap: 7px; color: #40584a; font-size: 12px; }
.open-status i { width: 7px; height: 7px; border-radius: 50%; background: #4aad75; box-shadow: 0 0 0 3px #e7f4eb; }
.open-status b { color: #828e86; font-weight: 500; }
.icon-button { position: relative; width: 32px; height: 32px; border: 1px solid var(--line); border-radius: 50%; background: white; cursor: pointer; font-size: 16px; }
.notification-dot { position: absolute; top: 5px; right: 5px; width: 6px; height: 6px; border: 1px solid white; border-radius: 50%; background: var(--coral); }
.top-avatar { width: 30px; height: 30px; font-size: 10px; }
.page-content { width: min(1180px, 100%); min-height: calc(100vh - 112px); margin: 0 auto; padding: 32px 40px 46px; animation: reveal .24s ease both; }
.page-footer { display: flex; justify-content: space-between; padding: 16px 40px 22px; border-top: 1px solid var(--line); color: #657169; font-size: 12px; }
.menu-toggle, .mobile-scrim { display: none; }
.page-content :is(.eyebrow,.stat-heading,.stat-bottom,.reward-caption,.panel-heading p,.chart-legend,.chart-y,.chart-day,.analytics-foot,.hour-row,.quiet-note p,.link-button,.booking-info span,.confirmed-tag,.catalog-status,.search-box input,.search-box kbd,.filter-panel button,.filter-panel > span,.category-tabs button,.collection-count,.book-category,.book-author,.stock,.shelf,.hold-button,.held-button,.hold-summary strong,.hold-summary small,.catalog-notice,.results-heading > span,.catalog-footnote,.live-indicator,.room-summary small,.summary-side span,.summary-side strong,.notice,.booking-message span,.booking-message strong,.checkin-timer,.checkin-button,.floor-tabs button,.map-legend,.layout-label,.room-type,.room-capacity,.room-state,.floor-footer,.selection-row small,.selection-row strong,.reserve-button,.policy-note,.modal-copy,.checkin-modal label,.checkin-modal input,.demo-code,.code-error,.reminder-toggle,.loan-stats small,.section-heading p,.renew-note,.loan-category,.loan-info > p,.due-progress > span,.action-buttons button,.fee-link,.hold-info small,.hold-expiry span,.hold-expiry strong,.cancel-hold,.policy-banner p,.policy-hours,.empty-state p,.empty-state strong,.reading-note p,.note-caption,.primary-action,.text-action) { font-size: 14px !important; letter-spacing: 0; line-height: 1.6; }
button:focus-visible, input:focus-visible, select:focus-visible { outline: 3px solid #e4a372; outline-offset: 2px; }
@keyframes reveal { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 800px) {
	.registration-page { grid-template-columns: 1fr; }
	.registration-story { min-height: auto; padding: 20px 25px 25px; }
	.registration-story::after { right: -80px; bottom: -205px; width: 300px; height: 300px; }
	.story-copy { padding: 30px 0 8px; }
	.story-copy h1 { font-size: 27px; }
	.story-copy > p:not(.story-eyebrow), .story-list, .story-footer { display: none; }
	.story-eyebrow { margin-bottom: 5px; font-size: 12px; }
	.registration-main { padding: 28px 24px 35px; }
	.sidebar { transform: translateX(-100%); transition: transform .2s ease; }
	.sidebar.sidebar-open { transform: translateX(0); }
	.main-area { margin-left: 0; }
	.menu-toggle { display: grid; width: 32px; height: 32px; place-items: center; border: 0; background: transparent; cursor: pointer; font-size: 19px; }
	.topbar { justify-content: flex-start; gap: 10px; padding: 0 18px; }
	.topbar-actions { gap: 12px; margin-left: auto; }
	.open-status b { display: none; }
	.page-content { min-height: calc(100vh - 108px); padding: 25px 20px 36px; }
	.page-footer { padding: 14px 20px 18px; }
	.mobile-scrim { position: fixed; z-index: 4; inset: 0; display: block; border: 0; background: rgba(16,35,26,.36); }
}
@media (max-width: 460px) {
	.registration-story { padding: 18px 20px 19px; }
	.story-copy { padding-top: 21px; }
	.story-copy h1 { font-size: 24px; }
	.registration-main { padding: 23px 20px 30px; }
	.form-heading h2 { font-size: 24px; }
	.form-grid { grid-template-columns: 1fr; gap: 13px; }
	.full-field { grid-column: auto; }
	.topbar { height: 58px; }
	.breadcrumbs { gap: 6px; font-size: 11px; }
	.icon-button { display: none; }
	.page-footer span:last-child { display: none; }
}
</style>
