<template>
	<div v-if="!student" v-translate="locale" class="registration-page" :class="{ 'dark-theme': darkTheme }" :lang="locale">
		<button class="theme-toggle registration-theme-toggle" type="button" :aria-label="darkTheme ? 'ប្តូរទៅពណ៌ស' : 'ប្តូរទៅពណ៌ងងឹត'" @click="toggleTheme">
			<span aria-hidden="true">{{ darkTheme ? '☀' : '☾' }}</span>{{ darkTheme ? 'ពណ៌ស' : 'ពណ៌ងងឹត' }}
		</button>
		<button class="language-toggle registration-language-toggle" type="button" @click="toggleLocale">{{ locale === 'km' ? 'English' : 'ខ្មែរ' }}</button>
		<aside class="registration-story">
			<a class="registration-brand" href="#home"><span><strong>បណ្ណាល័យ</strong></span></a>
			<div class="story-copy"><p class="story-eyebrow">សៀវភៅសម្រាប់អ្នកអានគ្រប់រូប</p><h1>ស្វែងរកសៀវភៅ<br>ហើយចាប់ផ្ដើមអាន។</h1><p>បង្កើតគណនី ដើម្បីរក្សាទុកបញ្ជីសៀវភៅដែលអ្នកបានអាន។</p><div class="story-list"><span><i>១</i> ស្វែងរកសៀវភៅតាមអនឡាញ</span><span><i>២</i> បើកអានសៀវភៅឌីជីថល</span><span><i>៣</i> រក្សាទុកសៀវភៅដែលបានអាន</span></div></div>
			<div class="registration-book-art" aria-hidden="true">
				<div class="book-art-glow"></div>
				<div class="book-art-card"><span>YOUR NEXT CHAPTER</span><strong>READ<br>ANYWHERE</strong><i>✦</i></div>
				<div class="book-art-book book-art-book-one">📘</div>
				<div class="book-art-book book-art-book-two">📗</div>
				<div class="book-art-book book-art-book-three">📕</div>
			</div>
			<div class="story-footer">សេវាកម្មបណ្ណាល័យ <span>·</span> ២០២៦</div>
		</aside>
		<main class="registration-main">
			<div class="registration-mobile-brand"><span><strong>បណ្ណាល័យ</strong></span></div>
			<div class="registration-form-wrap">
				<div class="form-heading"><p class="form-eyebrow">{{ isLogin ? (locale === 'km' ? 'ស្វាគមន៍ការត្រឡប់មកវិញ' : 'WELCOME BACK') : 'ចូលរួមជាមួយបណ្ណាល័យ' }}</p><h2>{{ isLogin ? (locale === 'km' ? 'ចូលគណនីរបស់អ្នក' : 'Sign in to your account') : (locale === 'km' ? 'បង្កើតគណនីនិស្សិត' : 'Create a student account') }}</h2><p>{{ isLogin ? (locale === 'km' ? 'បញ្ចូលអ៊ីមែល និងពាក្យសម្ងាត់ ដើម្បីបន្តអាន។' : 'Enter your email and password to continue reading.') : 'សូមបំពេញព័ត៌មានខាងក្រោម ដើម្បីបន្ត។' }}</p></div>
				<form v-if="isLogin" class="registration-form login-form" @submit.prevent="loginStudent">
					<label class="field">អ៊ីមែលសាកលវិទ្យាល័យ<input v-model.trim="loginForm.email" type="email" autocomplete="email" placeholder="name@university.edu" required></label>
					<label class="field">ពាក្យសម្ងាត់
						<div class="password-input-wrap">
							<input v-model="loginForm.password" :type="showLoginPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="បញ្ចូលពាក្យសម្ងាត់" required>
							<button class="password-toggle" type="button" :aria-label="showLoginPassword ? (locale === 'km' ? 'លាក់ពាក្យសម្ងាត់' : 'Hide password') : (locale === 'km' ? 'បង្ហាញពាក្យសម្ងាត់' : 'Show password')" :aria-pressed="showLoginPassword" @click="showLoginPassword = !showLoginPassword">
								<svg aria-hidden="true" viewBox="0 0 24 24">
									<template v-if="showLoginPassword"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></template>
									<template v-else><path d="m3 3 18 18M10.6 5.2A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a15.7 15.7 0 0 1-3.1 3.8M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7a10.5 10.5 0 0 0 4-.8" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></template>
								</svg>
							</button>
						</div>
					</label>
					<p v-if="registrationError" class="registration-error" role="alert">{{ registrationError }}</p>
					<button class="register-button" type="submit" :disabled="registering">{{ registering ? (locale === 'km' ? 'កំពុងចូលគណនី…' : 'Signing in…') : (locale === 'km' ? 'ចូលគណនី' : 'Sign in') }} <span>→</span></button>
					<p class="auth-switch">{{ locale === 'km' ? 'មិនទាន់មានគណនីមែនទេ?' : 'New here?' }} <button type="button" @click="switchAuthMode(false)">{{ locale === 'km' ? 'បង្កើតគណនី' : 'Create an account' }}</button></p>
				</form>
				<form v-else class="registration-form" @submit.prevent="registerStudent">
					<div class="form-grid">
						<label class="field">ឈ្មោះពេញ<input v-model.trim="registration.fullName" type="text" autocomplete="name" placeholder="ឧ. សុខ ដារ៉ា" required minlength="2"></label>
						<label class="field">លេខសម្គាល់និស្សិត<input v-model.trim="registration.studentId" type="text" autocomplete="off" placeholder="ឧ. 2026-12345" required></label>
						<label class="field">អ៊ីមែលសាកលវិទ្យាល័យ<input v-model.trim="registration.email" type="email" autocomplete="email" placeholder="name@university.edu" required></label>
						<label class="field">មហាវិទ្យាល័យ<select v-model="registration.faculty" required><option disabled value="">ជ្រើសរើសមហាវិទ្យាល័យ</option><option v-for="faculty in faculties" :key="faculty.value" :value="faculty.value">{{ faculty.label }}</option></select></label>
						<label class="field">ឆ្នាំសិក្សា<select v-model="registration.year" required><option disabled value="">ជ្រើសរើសឆ្នាំសិក្សា</option><option v-for="year in studyYears" :key="year.value" :value="year.value">{{ year.label }}</option></select></label>
						<label class="field">លេខទូរស័ព្ទ <span class="optional">(មិនបាច់ក៏បាន)</span><input v-model.trim="registration.phone" type="tel" autocomplete="tel" placeholder="0xx xxx xxx"></label>
						<label class="field">ពាក្យសម្ងាត់
							<div class="password-input-wrap">
								<input v-model="registration.password" :type="showRegistrationPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="យ៉ាងតិច ៨ តួអក្សរ" required minlength="8">
								<button class="password-toggle" type="button" :aria-label="showRegistrationPassword ? (locale === 'km' ? 'លាក់ពាក្យសម្ងាត់' : 'Hide password') : (locale === 'km' ? 'បង្ហាញពាក្យសម្ងាត់' : 'Show password')" :aria-pressed="showRegistrationPassword" @click="showRegistrationPassword = !showRegistrationPassword">
									<svg aria-hidden="true" viewBox="0 0 24 24">
										<template v-if="showRegistrationPassword"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></template>
										<template v-else><path d="m3 3 18 18M10.6 5.2A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a15.7 15.7 0 0 1-3.1 3.8M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7a10.5 10.5 0 0 0 4-.8" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></template>
									</svg>
								</button>
							</div>
						</label>
						<label class="field">បញ្ជាក់ពាក្យសម្ងាត់
							<div class="password-input-wrap">
								<input v-model="registration.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="វាយពាក្យសម្ងាត់ម្ដងទៀត" required minlength="8">
								<button class="password-toggle" type="button" :aria-label="showConfirmPassword ? (locale === 'km' ? 'លាក់ពាក្យសម្ងាត់' : 'Hide password') : (locale === 'km' ? 'បង្ហាញពាក្យសម្ងាត់' : 'Show password')" :aria-pressed="showConfirmPassword" @click="showConfirmPassword = !showConfirmPassword">
									<svg aria-hidden="true" viewBox="0 0 24 24">
										<template v-if="showConfirmPassword"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></template>
										<template v-else><path d="m3 3 18 18M10.6 5.2A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a15.7 15.7 0 0 1-3.1 3.8M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7a10.5 10.5 0 0 0 4-.8" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></template>
									</svg>
								</button>
							</div>
						</label>
					</div>
					<p v-if="registrationError" class="registration-error" role="alert">{{ registrationError }}</p>
					<label class="terms-check"><input v-model="registration.accepted" type="checkbox" required><span>ខ្ញុំបញ្ជាក់ថា ព័ត៌មានខាងលើត្រឹមត្រូវ និងជានិស្សិតរបស់សាកលវិទ្យាល័យ។</span></label>
					<button class="register-button" type="submit" :disabled="registering">{{ registering ? 'កំពុងបង្កើតគណនី…' : 'ចុះឈ្មោះ និងបន្ត' }} <span>→</span></button>
					<p class="privacy-note">{{ apiConfigured ? (locale === 'km' ? 'ពាក្យសម្ងាត់ត្រូវបានផ្ទៀងផ្ទាត់ដោយសេវាកម្មគណនី។' : 'Your password is verified by the account service.') : (locale === 'km' ? 'សម្រាប់ការសាកល្បងក្នុងឧបករណ៍នេះ ប្រព័ន្ធរក្សាទុកតែសោផ្ទៀងផ្ទាត់ដែលបានអ៊ិនគ្រីប មិនរក្សាទុកពាក្យសម្ងាត់ដើមទេ។' : 'For this device-only demo, only a derived password verifier is stored, never your original password.') }}</p>
					<p class="auth-switch">{{ locale === 'km' ? 'មានគណនីរួចហើយ?' : 'Already have an account?' }} <button type="button" @click="switchAuthMode(true)">{{ locale === 'km' ? 'ចូលគណនី' : 'Sign in' }}</button></p>
				</form>
			</div>
		</main>
	</div>
	<div v-else v-translate="locale" class="app-frame" :class="{ 'dark-theme': darkTheme }" :lang="locale">
		<aside class="sidebar" :class="{ 'sidebar-open': menuOpen }">
			<a class="brand" href="#catalog" @click.prevent="navigate('catalog')">
				<span class="brand-copy"><strong>បណ្ណាល័យអនឡាញ</strong></span>
			</a>

			<div class="campus-label">អានសៀវភៅតាមអនឡាញ</div>
			<nav class="main-nav" aria-label="ម៉ឺនុយមេ">
				<button v-for="item in navigationItems" :key="item.id" class="nav-item" :class="{ active: currentPage === item.id }" @click="navigate(item.id)">
					<span class="nav-icon" aria-hidden="true"><component :is="item.icon" :size="17" :stroke-width="2.2" /></span>
					<span>{{ item.label }}</span>
				</button>
			</nav>

			<div class="sidebar-spacer"></div>
			<div class="online-promo">
				<span aria-hidden="true">📖</span>
				<strong>ពិភពសៀវភៅនៅចុងដៃអ្នក</strong>
				<p>ស្វែងរក ចាប់ផ្ដើមអាន ហើយរក្សាទុកសៀវភៅដែលអ្នកចូលចិត្ត។</p>
			</div>
				<div class="profile-area">
					<div class="profile-button">
						<button class="avatar-upload" type="button" :aria-label="locale === 'km' ? 'កែ Profile' : 'Edit profile'" @click="openProfileEditor">
							<img v-if="student.avatar" class="avatar avatar-photo" :src="student.avatar" alt="">
							<span v-else class="avatar">{{ initials }}</span>
							<span class="avatar-edit-icon" aria-hidden="true">✎</span>
						</button>
						<span class="profile-copy"><strong data-no-translate>{{ student.fullName }}</strong></span>
					</div>
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
					  <span class="open-status"><i></i> បណ្ណាល័យអនឡាញ</span>
					<img v-if="student.avatar" class="top-avatar" :src="student.avatar" alt="" aria-hidden="true">
					<span v-else class="top-avatar" aria-hidden="true">{{ initials }}</span>
				</div>
			</header>

			<section class="page-content">
				<component :is="activeComponent" @navigate="navigate" @edit-profile="openProfileEditor" />
			</section>
			<footer class="page-footer"><span>សេវាកម្មបណ្ណាល័យ</span><span>រៀនដោយរីករាយ រីកចម្រើនជាមួយគ្នា</span></footer>
		</main>
			<button v-if="menuOpen" class="mobile-scrim" aria-label="បិទម៉ឺនុយ" @click="menuOpen = false"></button>
		<div v-if="profileEditorOpen" class="profile-editor-backdrop" @click.self="profileEditorOpen = false">
			<form class="profile-editor-modal" @submit.prevent="saveProfile">
				<button class="profile-editor-close" type="button" :aria-label="locale === 'km' ? 'បិទ' : 'Close'" @click="profileEditorOpen = false">×</button>
				<p class="form-eyebrow">{{ locale === 'km' ? 'ព័ត៌មានគណនី' : 'ACCOUNT DETAILS' }}</p>
				<h2>{{ locale === 'km' ? 'កែ Profile របស់អ្នក' : 'Edit your profile' }}</h2>
				<p class="profile-editor-description">{{ locale === 'km' ? 'កែប្រែព័ត៌មានដែលអ្នកបានបញ្ចូលពេលបង្កើតគណនី។' : 'Update the information you entered when creating your account.' }}</p>
				<div class="profile-editor-avatar">
					<img v-if="profileDraft.avatar" :src="profileDraft.avatar" alt="">
					<span v-else>{{ profileDraft.fullName.trim().slice(0, 1) || 'ន' }}</span>
					<label class="profile-avatar-change">{{ locale === 'km' ? 'ប្តូររូប' : 'Change photo' }}<input type="file" accept="image/png,image/jpeg,image/webp" @change="changeDraftAvatar"></label>
				</div>
				<div class="profile-editor-grid">
					<label class="field full-field">{{ locale === 'km' ? 'ឈ្មោះពេញ' : 'Full name' }}<input v-model.trim="profileDraft.fullName" type="text" autocomplete="name" required minlength="2"></label>
					<label class="field">{{ locale === 'km' ? 'លេខសម្គាល់និស្សិត' : 'Student ID' }}<input v-model.trim="profileDraft.studentId" type="text" required></label>
					<label class="field">{{ locale === 'km' ? 'អ៊ីមែលសាកលវិទ្យាល័យ' : 'University email' }}<input v-model.trim="profileDraft.email" type="email" autocomplete="email" required></label>
					<label class="field">{{ locale === 'km' ? 'មហាវិទ្យាល័យ' : 'Faculty' }}<select v-model="profileDraft.faculty" required><option disabled value="">{{ locale === 'km' ? 'ជ្រើសរើសមហាវិទ្យាល័យ' : 'Select a faculty' }}</option><option v-for="faculty in faculties" :key="faculty.value" :value="faculty.value">{{ faculty.label }}</option></select></label>
					<label class="field">{{ locale === 'km' ? 'ឆ្នាំសិក្សា' : 'Study year' }}<select v-model="profileDraft.year" required><option disabled value="">{{ locale === 'km' ? 'ជ្រើសរើសឆ្នាំសិក្សា' : 'Select a study year' }}</option><option v-for="year in studyYears" :key="year.value" :value="year.value">{{ year.label }}</option></select></label>
					<label class="field full-field">{{ locale === 'km' ? 'លេខទូរស័ព្ទ (មិនបាច់ក៏បាន)' : 'Phone (optional)' }}<input v-model.trim="profileDraft.phone" type="tel" autocomplete="tel"></label>
				</div>
				<p v-if="profileError" class="profile-editor-error" role="alert">{{ profileError }}</p>
				<div class="profile-editor-actions">
					<button type="button" class="profile-editor-cancel" @click="profileEditorOpen = false">{{ locale === 'km' ? 'បោះបង់' : 'Cancel' }}</button>
					<button type="submit" class="register-button" :disabled="profileSaving">{{ profileSaving ? (locale === 'km' ? 'កំពុងរក្សាទុក…' : 'Saving…') : (locale === 'km' ? 'រក្សាទុកព័ត៌មាន' : 'Save changes') }}</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import { computed, provide, ref } from 'vue';
import CatalogView from '@/views/CatalogView.vue';
import ReadingListView from '@/views/ReadingListView.vue';
import api, { apiConfigured } from '@/services/api';
import { BookOpen, BookmarkCheck } from '@lucide/vue';

const navigation = [
	{ id: 'catalog', label: 'ស្វែងរកសៀវភៅ', icon: BookOpen },
	{ id: 'reading', label: 'សៀវភៅដែលបានអាន', icon: BookmarkCheck },
];

const pages = {
	catalog: CatalogView,
	reading: ReadingListView,
};
const currentPage = ref('catalog');
const menuOpen = ref(false);
const darkTheme = ref(localStorage.getItem('leafline_theme') !== 'light');
const locale = ref(localStorage.getItem('leafline_locale') === 'en' ? 'en' : 'km');
const student = ref(null);
const registering = ref(false);
const registrationError = ref('');
const isLogin = ref(false);
const profileEditorOpen = ref(false);
const profileSaving = ref(false);
const profileError = ref('');
const profileDraft = ref({ fullName: '', studentId: '', email: '', faculty: '', year: '', phone: '', avatar: '' });
const showLoginPassword = ref(false);
const showRegistrationPassword = ref(false);
const showConfirmPassword = ref(false);
const loginForm = ref({ email: '', password: '' });
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
		catalog: 'Find books',
		reading: 'Books I have read',
	}[item.id] ?? item.label) : item.label,
})));
const activeTitle = computed(() => navigationItems.value.find((item) => item.id === currentPage.value)?.label ?? 'ស្វែងរកសៀវភៅ');
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

async function registerStudent() {
	registrationError.value = '';
	if (registration.value.password !== registration.value.confirmPassword) {
		registrationError.value = 'ពាក្យសម្ងាត់ទាំងពីរមិនត្រូវគ្នាទេ។';
		return;
	}
	registering.value = true;
	try {
		const profile = {
			fullName: registration.value.fullName,
			studentId: registration.value.studentId,
			email: registration.value.email.trim().toLowerCase(),
			faculty: registration.value.faculty,
			year: registration.value.year,
			phone: registration.value.phone,
		};
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
		} else {
			const accounts = readLocalAccounts();
			if (accounts.some((account) => account.email === profile.email)) {
				registrationError.value = locale.value === 'km'
					? 'អ៊ីមែលនេះមានគណនីរួចហើយ។ សូមចូលគណនី។'
					: 'An account already exists for this email. Please sign in.';
				isLogin.value = true;
				loginForm.value.email = profile.email;
				return;
			}
			const salt = crypto.getRandomValues(new Uint8Array(16));
			const passwordHash = await derivePasswordHash(registration.value.password, salt);
			accounts.push({
				email: profile.email,
				salt: bytesToBase64(salt),
				passwordHash: bytesToBase64(passwordHash),
				profile,
			});
			localStorage.setItem('leafline_accounts', JSON.stringify(accounts));
		}
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

async function loginStudent() {
	registrationError.value = '';
	registering.value = true;
	try {
		const email = loginForm.value.email.trim().toLowerCase();
		let profile;
		if (apiConfigured) {
			const { data } = await api.post('/auth/login', {
				email,
				password: loginForm.value.password,
			});
			if (data?.token) localStorage.setItem('token', data.token);
			const user = data?.user ?? data?.student;
			if (!user || typeof user !== 'object') {
				throw new Error('The login response did not include a user profile.');
			}
			profile = {
				fullName: user.fullName ?? user.full_name ?? '',
				studentId: user.studentId ?? user.student_id ?? '',
				email: user.email ?? email,
				faculty: user.faculty ?? '',
				year: String(user.year ?? user.study_year ?? ''),
				phone: user.phone ?? '',
				avatar: user.avatar ?? user.avatar_url ?? '',
			};
			if (!profile.fullName) {
				throw new Error('The login response did not include the user name.');
			}
		} else {
			const account = readLocalAccounts().find((savedAccount) => savedAccount.email === email);
			if (!account) throw new Error('No local account was found for this email.');
			const enteredHash = await derivePasswordHash(
				loginForm.value.password,
				base64ToBytes(account.salt),
			);
			if (!bytesMatch(enteredHash, base64ToBytes(account.passwordHash))) {
				throw new Error('The password did not match.');
			}
			profile = account.profile;
		}
		localStorage.setItem('leafline_student', JSON.stringify(profile));
		student.value = profile;
		loginForm.value.password = '';
	} catch (error) {
		console.error('Unable to sign in:', error);
		registrationError.value = apiConfigured
			? (error.response?.data?.message ?? (locale.value === 'km' ? 'អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ។ សូមព្យាយាមម្ដងទៀត។' : 'Email or password is incorrect. Please try again.'))
			: (locale.value === 'km' ? 'រកមិនឃើញគណនី ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ។' : 'Account not found or password is incorrect.');
	} finally {
		registering.value = false;
	}
}

function switchAuthMode(loginMode) {
	isLogin.value = loginMode;
	registrationError.value = '';
	loginForm.value.password = '';
}

function readLocalAccounts() {
	try {
		const saved = JSON.parse(localStorage.getItem('leafline_accounts') || '[]');
		if (!Array.isArray(saved)) throw new Error('Saved local accounts are not a list.');
		return saved;
	} catch (error) {
		console.error('Unable to read saved local accounts:', error);
		throw error;
	}
}

async function derivePasswordHash(password, salt) {
	const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
	const bits = await crypto.subtle.deriveBits(
		{ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 120000 },
		key,
		256,
	);
	return new Uint8Array(bits);
}

function bytesToBase64(bytes) {
	return btoa(String.fromCharCode(...bytes));
}

function base64ToBytes(value) {
	return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

function bytesMatch(first, second) {
	if (first.length !== second.length) return false;
	let mismatch = 0;
	for (let index = 0; index < first.length; index += 1) mismatch |= first[index] ^ second[index];
	return mismatch === 0;
}

function openProfileEditor() {
	profileDraft.value = {
		fullName: student.value.fullName ?? '',
		studentId: student.value.studentId ?? '',
		email: student.value.email ?? '',
		faculty: student.value.faculty ?? '',
		year: String(student.value.year ?? ''),
		phone: student.value.phone ?? '',
		avatar: student.value.avatar ?? '',
	};
	profileError.value = '';
	profileEditorOpen.value = true;
}

function changeDraftAvatar(event) {
	const input = event.target;
	const file = input.files?.[0];
	if (!file) return;
	if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
		profileError.value = locale.value === 'km' ? 'សូមជ្រើសរើសរូបភាព PNG, JPG ឬ WEBP។' : 'Choose a PNG, JPG, or WEBP image.';
		input.value = '';
		return;
	}
	if (file.size > 2 * 1024 * 1024) {
		profileError.value = locale.value === 'km' ? 'រូបភាពត្រូវមានទំហំតិចជាង ២ MB។' : 'The image must be smaller than 2 MB.';
		input.value = '';
		return;
	}
	const reader = new FileReader();
	reader.onload = () => {
		if (typeof reader.result === 'string') {
			profileDraft.value.avatar = reader.result;
			profileError.value = '';
		}
		input.value = '';
	};
	reader.onerror = () => {
		profileError.value = locale.value === 'km' ? 'មិនអាចបើករូបភាពនេះបានទេ។' : 'Could not read this image.';
		input.value = '';
	};
	reader.readAsDataURL(file);
}

function saveProfile() {
	if (profileSaving.value) return;
	profileError.value = '';
	if (apiConfigured) {
		profileError.value = locale.value === 'km'
			? 'សេវាកម្មគណនីអនឡាញមិនទាន់មាន API សម្រាប់កែ Profile ទេ។ សូមទាក់ទងអ្នកគ្រប់គ្រងប្រព័ន្ធ។'
			: 'The account service does not provide a profile update API yet. Please contact the system administrator.';
		return;
	}

	profileSaving.value = true;
	try {
		const currentEmail = String(student.value.email ?? '').trim().toLowerCase();
		const email = profileDraft.value.email.trim().toLowerCase();
		const accounts = readLocalAccounts();
		const account = accounts.find((savedAccount) =>
			String(savedAccount.email ?? savedAccount.profile?.email ?? '').trim().toLowerCase() === currentEmail,
		);
		if (!account) throw new Error('The local account for this profile could not be found.');
		if (accounts.some((savedAccount) =>
			savedAccount !== account && String(savedAccount.email ?? savedAccount.profile?.email ?? '').trim().toLowerCase() === email,
		)) {
			profileError.value = locale.value === 'km'
				? 'អ៊ីមែលនេះមានគណនីរួចហើយ។ សូមប្រើអ៊ីមែលផ្សេង។'
				: 'An account already exists for this email. Please use another email.';
			return;
		}

		const updatedProfile = {
			...student.value,
			...profileDraft.value,
			fullName: profileDraft.value.fullName.trim(),
			studentId: profileDraft.value.studentId.trim(),
			email,
			phone: profileDraft.value.phone.trim(),
		};
		account.email = email;
		account.profile = updatedProfile;
		localStorage.setItem('leafline_accounts', JSON.stringify(accounts));
		localStorage.setItem('leafline_student', JSON.stringify(updatedProfile));
		student.value = updatedProfile;
		profileEditorOpen.value = false;
	} catch (error) {
		console.error('Unable to update the student profile:', error);
		profileError.value = locale.value === 'km'
			? 'មិនអាចរក្សាទុកព័ត៌មាន Profile បានទេ។ សូមព្យាយាមម្ដងទៀត។'
			: 'Could not save profile details. Please try again.';
	} finally {
		profileSaving.value = false;
	}
}

function signOut() {
	const lastEmail = student.value?.email ?? '';
	localStorage.removeItem('leafline_student');
	localStorage.removeItem('token');
	student.value = null;
	profileEditorOpen.value = false;
	registrationError.value = '';
	registration.value = { fullName: '', studentId: '', email: '', faculty: '', year: '', phone: '', password: '', confirmPassword: '', accepted: false };
	isLogin.value = true;
	loginForm.value = { email: lastEmail, password: '' };
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
  color: #d4e9d1;
  line-height: 1;
  transition: transform var(--transition), background var(--transition), color var(--transition), box-shadow var(--transition);
}

.nav-item:hover .nav-icon {
  transform: translateY(-1px) rotate(-4deg);
  background: rgb(255 255 255 / 13%);
  color: #f0f7d8;
  box-shadow: 0 3px 10px rgb(8 30 16 / 12%);
}

.nav-item.active .nav-icon {
  border-color: #dcebdd;
  background: #dceedd;
  color: #34734a;
  box-shadow: 0 3px 9px rgb(34 87 49 / 12%);
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

.avatar-upload {
  position: relative;
  display: block;
  width: 39px;
  height: 39px;
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
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

.avatar-photo {
  object-fit: cover;
}

.avatar-edit-icon {
  position: absolute;
  right: -4px;
  bottom: -4px;
  z-index: 1;
  display: grid;
  width: 18px;
  height: 18px;
  place-items: center;
  border: 2px solid #214b37;
  border-radius: 50%;
  background: #d7edb8;
  color: #24543b;
  font-size: 11px;
  line-height: 1;
  pointer-events: none;
}

.avatar-upload:focus-visible {
  outline: 3px solid #a6d6b4;
  outline-offset: 4px;
  border-radius: 14px;
}

.profile-editor-backdrop {
  position: fixed;
  z-index: 2000;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 20px;
  overflow-y: auto;
  background: rgb(18 35 24 / 65%);
  backdrop-filter: blur(5px);
}

.profile-editor-modal {
  position: relative;
  width: min(100%, 620px);
  max-height: min(90vh, 820px);
  overflow-y: auto;
  padding: 28px;
  border: 1px solid #e0e9df;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 24px 70px rgb(0 0 0 / 24%);
}

.profile-editor-modal h2 {
  margin: 0;
  color: #2c4934;
  font-size: 22px;
}

.profile-editor-description {
  margin: 7px 35px 0 0;
  color: #849087;
  font-size: 11px;
  line-height: 1.8;
}

.profile-editor-close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 35px;
  height: 35px;
  border: 0;
  border-radius: 11px;
  background: #f0f6f0;
  color: #5d7562;
  font-size: 24px;
  cursor: pointer;
}

.profile-editor-avatar {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 20px 0;
}

.profile-editor-avatar > img,
.profile-editor-avatar > span {
  display: grid;
  width: 62px;
  height: 62px;
  flex: 0 0 auto;
  place-items: center;
  overflow: hidden;
  border: 2px solid #d8e8d8;
  border-radius: 50%;
  background: #e9f3e8;
  color: #367549;
  font-size: 23px;
  font-weight: 800;
  object-fit: cover;
}

.profile-avatar-change {
  display: inline-flex;
  padding: 9px 12px;
  border: 1px solid #d7e8d9;
  border-radius: 10px;
  background: #f8fbf8;
  color: #3d794b;
  font-size: 10px;
  font-weight: 750;
  cursor: pointer;
}

.profile-avatar-change input {
  display: none;
}

.profile-editor-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.profile-editor-error {
  margin: 14px 0 0;
  color: #b5473e;
  font-size: 11px;
  line-height: 1.8;
}

.profile-editor-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
}

.profile-editor-actions .register-button {
  width: auto;
  min-width: 180px;
}

.profile-editor-cancel {
  min-width: 100px;
  padding: 10px 14px;
  border: 1px solid #dfe8dd;
  border-radius: 12px;
  background: #fff;
  color: #526654;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
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

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
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

.password-input-wrap {
  position: relative;
}

.field .password-input-wrap input {
  padding-right: 44px;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 9px;
  display: grid;
  width: 30px;
  height: 30px;
  padding: 5px;
  transform: translateY(-50%);
  place-items: center;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: #718174;
  cursor: pointer;
}

.password-toggle:hover {
  background: #edf3ec;
  color: #315f3e;
}

.password-toggle:focus-visible {
  outline: 2px solid #43865e;
  outline-offset: 1px;
}

.password-toggle svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
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

.auth-switch {
  margin: 0;
  color: #7d8b80;
  font-size: 11px;
  text-align: center;
}

.auth-switch button {
  padding: 0;
  border: 0;
  background: transparent;
  color: #397957;
  font-size: inherit;
  font-weight: 800;
}

.auth-switch button:hover {
  color: #24543b;
  text-decoration: underline;
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

@media (max-width: 560px) {
  .profile-editor-modal {
    padding: 23px 18px;
  }

  .profile-editor-grid {
    grid-template-columns: 1fr;
    gap: 13px;
  }

  .profile-editor-grid .full-field {
    grid-column: auto;
  }

  .profile-editor-actions .register-button {
    min-width: 0;
  }
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

.dark-theme .profile-editor-modal {
  border-color: #39483d;
  background: #202a24;
}

.dark-theme .profile-editor-modal h2 {
  color: #e1eee2;
}

.dark-theme .profile-editor-description {
  color: #a0ada1;
}

.dark-theme .profile-editor-close,
.dark-theme .profile-editor-cancel {
  border-color: #39483d;
  background: #253128;
  color: #d4e4d6;
}

.dark-theme .profile-avatar-change {
  border-color: #39483d;
  background: #19231c;
  color: #b5dfbd;
}

.dark-theme .profile-editor-avatar > img,
.dark-theme .profile-editor-avatar > span {
  border-color: #39483d;
  background: #29372c;
  color: #b5dfbd;
}

.dark-theme .form-heading h2 {
  color: #e1eee2;
}

.dark-theme .form-heading > p:last-child,
.dark-theme .privacy-note,
.dark-theme .auth-switch {
  color: #a0ada1;
}

.dark-theme .auth-switch button {
  color: #a7d6b0;
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

.dark-theme .password-toggle {
  color: #a0b1a2;
}

.dark-theme .password-toggle:hover {
  background: #2d4031;
  color: #d4e7d4;
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


/* =====================================================
   LEAFLINE — EXTRA POLISH LAYER
   Friendly icons, softer cards, clearer spacing and focus
===================================================== */
.brand-mark {
  border-radius: 15px 15px 15px 6px;
  background: linear-gradient(145deg, #c9e8b9, #f3e7c7);
  box-shadow: 0 8px 18px rgb(7 25 15 / 16%);
}

.sidebar {
  box-shadow: 8px 0 30px rgb(27 59 38 / 5%);
}

.nav-item {
  min-height: 49px;
  border-radius: 14px;
  letter-spacing: .05px;
}

.nav-icon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  font-size: 17px;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 5%);
}

.nav-item.active {
  box-shadow: 0 7px 18px rgb(8 30 16 / 12%);
}

.topbar {
  min-height: 78px;
  border-bottom-color: #e5ece2;
  box-shadow: 0 5px 20px rgb(40 75 45 / 3%);
}

.breadcrumbs strong {
  color: var(--green-dark);
  font-weight: 800;
}

.page-content {
  padding-top: 32px;
}

.page-footer {
  padding: 16px 32px 22px;
  border-top: 1px solid var(--line);
  color: #8b978c;
  font-size: 11px;
}

.page-footer span:first-child {
  color: var(--green);
  font-weight: 800;
}

.points-card {
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 5%);
}

.profile-button {
  border-radius: 13px;
  transition: background .2s ease;
}

.profile-button:hover {
  background: rgb(255 255 255 / 5%);
}

.avatar-upload {
  border-radius: 15px;
}

.avatar,
.top-avatar {
  box-shadow: 0 3px 10px rgb(0 0 0 / 10%);
}

.avatar-photo,
.top-avatar[src] {
  object-fit: cover;
  overflow: hidden;
}

.theme-toggle,
.language-toggle,
.icon-button,
.menu-toggle {
  border-radius: 12px;
}

.theme-toggle:hover,
.language-toggle:hover,
.icon-button:hover {
  transform: translateY(-1px);
}

.open-status {
  border-radius: 999px;
  background: #eff8ef;
  padding: 7px 11px;
}

.open-status i {
  box-shadow: 0 0 0 4px rgb(70 158 94 / 12%);
}

.registration-main {
  background:
    radial-gradient(circle at 100% 0%, rgb(225 239 216 / 55%), transparent 33%),
    #fffdf8;
}

.registration-form-wrap {
  border-radius: 24px;
}

.form-heading h2 {
  letter-spacing: -.6px;
}

.field input,
.field select {
  min-height: 46px;
  border-radius: 12px;
  background: #fffefa;
  transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
}

.field input:focus,
.field select:focus {
  border-color: #83b895;
  background: #fff;
  box-shadow: 0 0 0 4px rgb(91 158 110 / 12%);
  outline: none;
}

.register-button {
  min-height: 48px;
  border-radius: 13px;
  box-shadow: 0 8px 18px rgb(41 103 64 / 17%);
}

.register-button:hover:not(:disabled) {
  box-shadow: 0 11px 24px rgb(41 103 64 / 22%);
  transform: translateY(-1px);
}

/* Gentle dark theme tuning */
.dark-theme .topbar {
  border-bottom-color: #2b4033;
  box-shadow: 0 5px 20px rgb(0 0 0 / 10%);
}

.dark-theme .breadcrumbs strong {
  color: #c4e4c6;
}

.dark-theme .page-footer {
  border-top-color: #2b4033;
  color: #9aafa0;
}

.dark-theme .open-status {
  background: #263f2f;
  color: #d5ead5;
}

/* Mobile spacing: keep controls comfortable and prevent horizontal overflow */
@media (max-width: 900px) {
  .page-content {
    padding: 22px 18px 30px;
  }

  .topbar {
    gap: 10px;
    padding: 12px 17px;
  }

  .page-footer {
    gap: 8px;
    padding: 14px 18px 20px;
    flex-wrap: wrap;
  }
}

@media (max-width: 520px) {
  .page-content {
    padding: 17px 12px 24px;
  }

  .topbar {
    min-height: 64px;
    padding: 10px 12px;
  }

  .breadcrumbs {
    min-width: 0;
    font-size: 11px;
  }

  .topbar-actions {
    gap: 7px;
  }

  .top-avatar {
    width: 34px;
    height: 34px;
  }
}


/* =========================================================
   LEAFLINE — PREMIUM POLISH PACK
   Additive styling: preserves the existing Vue functionality
========================================================= */

:root {
  --leafline-accent: #3b8059;
  --leafline-accent-deep: #23583b;
  --leafline-mint: #eaf6ec;
  --leafline-border: #e3ebe2;
  --leafline-card-shadow: 0 12px 34px rgba(31, 73, 45, .065);
}

body {
  background:
    radial-gradient(ellipse at 85% 0%, rgba(220, 239, 218, .34), transparent 32%),
    var(--page-bg);
}

button, a, input, select, textarea {
  -webkit-tap-highlight-color: transparent;
}

button:focus-visible, a:focus-visible, input:focus-visible,
select:focus-visible, textarea:focus-visible {
  outline: 3px solid rgba(104, 173, 119, .55);
  outline-offset: 3px;
}

/* Sidebar details */
.sidebar {
  box-shadow: 8px 0 32px rgba(21, 53, 32, .055);
}

.brand {
  min-height: 46px;
}

.brand-mark {
  box-shadow: 0 7px 18px rgba(5, 20, 10, .17);
}

.online-promo {
  margin: 0 18px 18px;
  padding: 16px;
  border: 1px solid rgba(203, 229, 202, .18);
  border-radius: 16px;
  background: rgba(255, 255, 255, .07);
  color: #e8f3e7;
}

.online-promo > span {
  display: block;
  margin-bottom: 9px;
  font-size: 23px;
}

.online-promo strong {
  display: block;
  font-size: 12px;
  line-height: 1.7;
}

.online-promo p {
  margin: 6px 0 0;
  color: #b9d1bd;
  font-size: 10px;
  line-height: 1.8;
}

.nav-item {
  min-height: 49px;
  border-radius: 14px;
  letter-spacing: .05px;
}

.nav-item.active {
  box-shadow: 0 8px 18px rgba(9, 30, 15, .10);
}

.nav-item.active::before {
  left: 0;
  width: 4px;
  border-radius: 0 5px 5px 0;
}

.points-card {
  box-shadow: inset 0 1px 0 rgba(255,255,255,.04);
}

/* Top navigation */
.topbar {
  box-shadow: 0 5px 22px rgba(34, 62, 39, .025);
}

.theme-toggle, .language-toggle, .icon-button {
  border-radius: 12px;
}

.theme-toggle:hover, .language-toggle:hover, .icon-button:hover {
  transform: translateY(-1px);
}

/* Page transitions and common content cards */
.page-content {
  animation: leafline-premium-enter .32s cubic-bezier(.2,.7,.25,1) both;
}

@keyframes leafline-premium-enter {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

#app .page-content .stat-card,
#app .page-content .panel,
#app .page-content .book-card,
#app .page-content .loan-card,
#app .page-content .hold-card,
#app .page-content .cart-item,
#app .page-content .cart-summary,
#app .page-content .cart-empty,
#app .page-content .loan-stats article {
  border-color: var(--leafline-border);
  border-radius: 18px;
  box-shadow: var(--leafline-card-shadow);
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
}

#app .page-content .stat-card:hover,
#app .page-content .book-card:hover,
#app .page-content .loan-card:hover,
#app .page-content .hold-card:hover {
  transform: translateY(-3px);
  border-color: #cfe2d0;
  box-shadow: 0 16px 35px rgba(31, 73, 45, .10);
}

#app .page-content h1,
#app .page-content h2,
#app .page-content h3 {
  letter-spacing: -.25px;
}

#app .page-content input:not([type="checkbox"]):not([type="radio"]),
#app .page-content select,
#app .page-content textarea {
  border-radius: 12px;
  transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
}

#app .page-content input:focus,
#app .page-content select:focus,
#app .page-content textarea:focus {
  border-color: #79ad83;
  box-shadow: 0 0 0 4px rgba(93, 155, 103, .12);
}

/* Registration / sign-in screen */
.registration-page {
  background:
    radial-gradient(circle at 12% 8%, rgba(226, 242, 218, .8), transparent 28%),
    #f8faf6;
}

.registration-story {
  position: relative;
  isolation: isolate;
  background:
    radial-gradient(circle at 15% 15%, rgba(188, 222, 167, .16), transparent 30%),
    radial-gradient(circle at 90% 82%, rgba(242, 205, 159, .12), transparent 25%),
    linear-gradient(155deg, #173c2c 0%, #24543b 55%, #2d6545 100%);
}

.registration-story::after {
  position: absolute;
  z-index: -1;
  right: -95px;
  bottom: 8%;
  width: 270px;
  height: 270px;
  border: 1px solid rgba(238, 249, 229, .12);
  border-radius: 50%;
  box-shadow: 0 0 0 28px rgba(238,249,229,.035), 0 0 0 58px rgba(238,249,229,.025);
  content: "";
  pointer-events: none;
}

.story-eyebrow,
.form-eyebrow {
  letter-spacing: .65px;
}

.registration-form-wrap {
  border: 1px solid rgba(226, 235, 224, .88);
  border-radius: 24px;
  background: rgba(255,255,255,.94);
  box-shadow: 0 24px 70px rgba(38, 74, 48, .085);
  backdrop-filter: blur(12px);
}

.form-heading h2 {
  letter-spacing: -.5px;
}

.field input,
.field select {
  min-height: 46px;
  border-radius: 12px;
  background-color: #fcfdfb;
}

.field input:hover,
.field select:hover {
  border-color: #c8dac9;
}

.password-toggle {
  border-radius: 9px;
}

.register-button {
  min-height: 48px;
  border-radius: 13px;
  background: linear-gradient(135deg, #397b53, #286441);
  box-shadow: 0 8px 18px rgba(47, 111, 68, .17);
  font-weight: 800;
}

.register-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(47, 111, 68, .23);
}

.terms-check {
  border-radius: 12px;
}

/* Profile editor */
.profile-editor-backdrop {
  background: rgba(15, 35, 23, .62);
  backdrop-filter: blur(8px);
}

.profile-editor-modal {
  border-radius: 24px;
  box-shadow: 0 28px 90px rgba(0,0,0,.28);
}

.profile-editor-avatar > img,
.profile-editor-avatar > span {
  box-shadow: 0 5px 16px rgba(39, 91, 52, .10);
}

.profile-avatar-change:hover,
.profile-editor-close:hover,
.profile-editor-cancel:hover {
  transform: translateY(-1px);
}

/* Footer */
.page-footer {
  color: #839087;
}

/* Dark mode — soften contrast and keep cards legible */
.dark-theme.app-frame {
  background: #101a14;
}

.dark-theme .sidebar {
  background:
    radial-gradient(circle at 0% 0%, rgba(107,161,110,.11), transparent 34%),
    linear-gradient(180deg, #142d20 0%, #193927 100%);
}

.dark-theme .topbar {
  border-bottom-color: #29392d;
  background: rgba(22, 34, 26, .94);
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
  border-color: #2b4030;
  box-shadow: 0 12px 30px rgba(0,0,0,.12);
}

.dark-theme #app .page-content .stat-card:hover,
.dark-theme #app .page-content .book-card:hover,
.dark-theme #app .page-content .loan-card:hover,
.dark-theme #app .page-content .hold-card:hover {
  border-color: #456b4c;
  box-shadow: 0 16px 35px rgba(0,0,0,.2);
}

.dark-theme #app .page-content input:focus,
.dark-theme #app .page-content select:focus,
.dark-theme #app .page-content textarea:focus {
  border-color: #75a87b;
  box-shadow: 0 0 0 4px rgba(93, 155, 103, .16);
}

.dark-theme .registration-form-wrap {
  border-color: #2d4433;
  background: rgba(25, 39, 29, .96);
  box-shadow: 0 24px 70px rgba(0,0,0,.22);
}

.dark-theme .field input,
.dark-theme .field select {
  background: #17251b;
}

.dark-theme .register-button {
  background: linear-gradient(135deg, #4b9563, #34764b);
}

/* Mobile and tablet refinements */
@media (max-width: 900px) {
  .page-content {
    padding: 24px 22px 32px;
  }

  .topbar {
    padding-right: 22px;
    padding-left: 22px;
  }

  .registration-form-wrap {
    border-radius: 20px;
  }
}

@media (max-width: 600px) {
  .page-content {
    padding: 18px 13px 26px;
  }

  .topbar {
    min-height: 62px;
    padding: 10px 13px;
  }

  .topbar-actions {
    gap: 6px;
  }

  .open-status {
    display: none;
  }

  .registration-form-wrap {
    padding: 22px 17px;
    border-radius: 18px;
  }

  .profile-editor-modal {
    padding: 22px 17px;
    border-radius: 18px;
  }

  .profile-editor-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .profile-editor-actions {
    flex-direction: column-reverse;
  }

  .profile-editor-actions .register-button,
  .profile-editor-cancel {
    width: 100%;
  }

  .register-button {
    min-height: 46px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}

.registration-page {
  grid-template-columns: minmax(360px, .88fr) minmax(0, 1.12fr);
  background:
    radial-gradient(ellipse at 82% 12%, rgba(223, 240, 215, .72), transparent 31%),
    radial-gradient(ellipse at 96% 88%, rgba(242, 227, 194, .42), transparent 28%),
    #f7f8f2;
}

.registration-story {
  min-height: 100vh;
  padding: 38px clamp(30px, 5.3vw, 78px);
  background:
    radial-gradient(ellipse at 76% 88%, rgba(131, 180, 113, .28), transparent 34%),
    radial-gradient(circle at 12% 75%, rgba(68, 129, 84, .42), transparent 36%),
    linear-gradient(150deg, #173b2c 0%, #1c4a35 52%, #285c40 100%);
}

.registration-brand {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  text-decoration: none;
}

.registration-brand::before {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 1px solid rgba(236, 247, 231, .22);
  border-radius: 12px;
  background: rgba(255, 255, 255, .1);
  content: "📚";
  font-size: 18px;
}

.registration-brand strong {
  color: #fff;
  font-size: 19px;
}

.story-copy {
  max-width: 440px;
  padding: 42px 0;
}

.story-copy h1 {
  font-size: clamp(30px, 3.15vw, 44px);
  line-height: 1.55;
}

.story-copy > p:not(.story-eyebrow) {
  margin: 14px 0 23px;
}

.story-list {
  gap: 11px;
}

.registration-book-art {
  position: absolute;
  right: 5%;
  bottom: 11%;
  width: 210px;
  height: 185px;
  opacity: .78;
  pointer-events: none;
}

.book-art-glow {
  position: absolute;
  inset: 15px 0 0 18px;
  border-radius: 50%;
  background: rgba(185, 222, 161, .15);
  filter: blur(3px);
}

.book-art-card {
  position: absolute;
  right: 13px;
  bottom: 10px;
  display: flex;
  width: 130px;
  height: 146px;
  flex-direction: column;
  justify-content: space-between;
  padding: 17px;
  border: 1px solid rgba(255, 255, 255, .42);
  border-radius: 8px 18px 18px 8px;
  background: linear-gradient(145deg, #f6ecd1, #d6e0bc);
  box-shadow: 0 18px 32px rgba(5, 25, 13, .24), inset 7px 0 rgba(111, 138, 97, .12);
  color: #31513a;
  transform: rotate(7deg);
}

.book-art-card span {
  font-size: 7px;
  font-weight: 800;
  letter-spacing: 1.1px;
}

.book-art-card strong {
  font-family: Georgia, serif;
  font-size: 19px;
  line-height: 1.1;
}

.book-art-card i {
  align-self: flex-end;
  color: #b17b3e;
  font-size: 19px;
  font-style: normal;
}

.book-art-book {
  position: absolute;
  display: grid;
  width: 48px;
  height: 55px;
  place-items: center;
  border: 4px solid rgba(255, 255, 255, .9);
  border-radius: 7px 12px 12px 7px;
  background: #fff;
  box-shadow: 0 9px 18px rgba(5, 25, 13, .2);
  font-size: 26px;
}

.book-art-book-one {
  top: 13px;
  left: 15px;
  transform: rotate(-16deg);
}

.book-art-book-two {
  top: 2px;
  right: 24px;
  transform: rotate(12deg);
}

.book-art-book-three {
  bottom: 11px;
  left: 2px;
  transform: rotate(-7deg);
}

.registration-main {
  min-height: 100vh;
  padding: 76px clamp(24px, 4.3vw, 66px) 28px;
}

.registration-form-wrap {
  max-width: 680px;
  padding: 27px clamp(25px, 3.2vw, 40px);
  border: 1px solid rgba(222, 232, 217, .9);
  border-radius: 25px;
  box-shadow: 0 22px 70px rgba(37, 65, 42, .09), 0 3px 10px rgba(37, 65, 42, .035);
}

.form-heading {
  margin-bottom: 19px;
}

.form-eyebrow {
  margin-bottom: 7px;
}

.form-heading h2 {
  font-size: clamp(22px, 2.1vw, 28px);
  line-height: 1.45;
}

.form-heading > p:last-child {
  margin-top: 5px;
}

.form-grid {
  gap: 13px 15px;
}

.field {
  gap: 5px;
}

.field input,
.field select {
  min-height: 43px;
  padding: 0 13px;
  border-radius: 11px;
  font-size: 11px;
}

.password-input-wrap input {
  padding-right: 43px;
}

.terms-check {
  margin-top: 14px;
}

.register-button {
  min-height: 45px;
  margin-top: 13px;
}

.privacy-note {
  margin-top: 10px;
  font-size: 9px;
  line-height: 1.7;
}

.auth-switch {
  margin-top: 11px;
  font-size: 10px;
}

.registration-theme-toggle,
.registration-language-toggle {
  top: 18px;
}

.registration-theme-toggle {
  right: 22px;
}

.registration-language-toggle {
  right: 139px;
}

.dark-theme.registration-page {
  background:
    radial-gradient(ellipse at 82% 12%, rgba(73, 111, 70, .24), transparent 31%),
    #111b14;
}

.dark-theme .registration-form-wrap {
  border-color: #304637;
  background: #18251c;
}

@media (max-width: 900px) {
  .registration-page {
    grid-template-columns: minmax(290px, .78fr) minmax(0, 1.22fr);
  }

  .registration-story {
    padding-right: 30px;
    padding-left: 30px;
  }

  .registration-book-art {
    right: -12px;
    bottom: 9%;
    transform: scale(.82);
    transform-origin: bottom right;
  }

  .registration-main {
    padding-right: 22px;
    padding-left: 22px;
  }
}

@media (max-width: 700px) {
  .registration-page {
    display: block;
    min-height: 100vh;
    padding: 0 15px 28px;
  }

  .registration-story {
    display: block;
    min-height: 0;
    margin: 0 -15px;
    padding: 22px 23px 24px;
    border-radius: 0 0 26px 26px;
  }

  .registration-brand::before {
    width: 34px;
    height: 34px;
  }

  .registration-brand strong {
    font-size: 17px;
  }

  .story-copy {
    margin: 26px 0 0;
    padding: 0;
  }

  .story-copy h1 {
    max-width: 390px;
    font-size: clamp(25px, 6vw, 34px);
  }

  .story-copy > p:not(.story-eyebrow) {
    max-width: 390px;
    margin: 9px 0 14px;
    font-size: 11px;
  }

  .story-list {
    display: none;
  }

  .story-footer,
  .registration-book-art {
    display: none;
  }

  .registration-main {
    min-height: 0;
    padding: 20px 0 0;
  }

  .registration-mobile-brand {
    display: none;
  }

  .registration-form-wrap {
    max-width: none;
    padding: 22px 19px;
    border-radius: 20px;
  }

  .registration-theme-toggle,
  .registration-language-toggle {
    top: 16px;
  }

  .registration-theme-toggle {
    right: 14px;
  }

  .registration-language-toggle {
    right: 129px;
  }
}

@media (max-width: 480px) {
  .registration-page {
    padding-right: 11px;
    padding-left: 11px;
  }

  .registration-story {
    margin-right: -11px;
    margin-left: -11px;
    padding-right: 17px;
    padding-left: 17px;
  }

  .registration-form-wrap {
    padding: 20px 15px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .form-heading {
    margin-bottom: 16px;
  }

  .form-heading h2 {
    font-size: 22px;
  }

  .registration-theme-toggle {
    right: 11px;
  }

  .registration-language-toggle {
    right: 123px;
  }
}

</style>