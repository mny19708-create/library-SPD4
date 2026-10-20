<template>
	<div class="loans-page" v-translate="locale" :data-locale="locale">
		<!-- Header Section -->
		<div class="loans-heading">
			<div>
				<p class="eyebrow">គ្រប់គ្រងការខ្ចីសៀវភៅ</p>
				<h1>សៀវភៅដែលខ្ញុំខ្ចី</h1>
				<p class="subheading">មើលថ្ងៃកំណត់សង និងសៀវភៅដែលបានកក់របស់អ្នក។</p>
			</div>
			<button class="reminder-toggle" role="switch" :aria-checked="remindersEnabled" @click="toggleReminders">
				<span class="toggle-track" :class="{ on: remindersEnabled }"><i></i></span>
				<span>រំលឹកថ្ងៃសង <small data-no-translate>{{ locale === 'en' ? (remindersEnabled ? 'On' : 'Off') : (remindersEnabled ? 'បើក' : 'បិទ') }}</small></span>
			</button>
		</div>

		<!-- Notice Alert -->
		<div v-if="notice" class="notice">
			<span>✓</span>
			<p>{{ notice }}</p>
			<button aria-label="Dismiss message" @click="notice = ''">×</button>
		</div>

		<!-- Statistics Section -->
		<section class="loan-stats">
			<article>
				<span class="loan-stat-icon green">↗</span>
				<div>
					<strong>{{ khmerNumber(activeLoans.length) }}</strong>
					<small>កំពុងខ្ចី</small>
				</div>
			</article>
			<article>
				<span class="loan-stat-icon orange">◷</span>
				<div>
					<strong>{{ khmerNumber(dueSoonCount) }}</strong>
					<small>ត្រូវសងក្នុងសប្ដាហ៍នេះ</small>
				</div>
			</article>
			<article>
				<span class="loan-stat-icon gold">⌑</span>
				<div>
					<strong>{{ khmerNumber(activeHolds.length) }}</strong>
					<small>កំពុងរង់ចាំទទួល</small>
				</div>
			</article>
		</section>

		<!-- Active Loans Section -->
		<section class="section-block">
			<div class="section-heading">
				<div>
					<h2>សៀវភៅកំពុងខ្ចី</h2>
					<p>{{ locale === 'en' ? `Total ${activeLoans.length} books on loan` : `កំពុងខ្ចីសរុប ${khmerNumber(activeLoans.length)} ក្បាល` }}</p>
				</div>
				<span class="renew-note">អាចបន្តការខ្ចីបានម្ដង</span>
			</div>

			<div v-if="activeLoans.length" class="loan-list">
				<article v-for="loan in activeLoans" :key="loan.id" class="loan-card">
					<div class="mini-cover" :class="loan.cover">
						<span>{{ loan.shortTitle }}</span>
					</div>
					<div class="loan-info">
						<span class="loan-category">{{ categoryLabel(loan.category) }}</span>
						<h3 data-no-translate>{{ loan.title }}</h3>
						<p>{{ loan.author }}</p>
						<div class="due-progress">
							<div class="progress-track">
								<i :class="dueStatus(loan).className" :style="{ width: `${progress(loan)}%` }"></i>
							</div>
							<span :class="dueStatus(loan).className">{{ dueStatus(loan).label }}</span>
						</div>
					</div>
					<div class="loan-actions">
						<span class="due-date">{{ formatDate(loan.dueDate) }}</span>
						<button v-if="dueStatus(loan).kind === 'overdue'" class="fee-link" @click="notice = `ថ្លៃយឺតសងប៉ាន់ស្មានសម្រាប់ ${loan.title}៖ ៛ ${formatFee(loan)} (៛ ៨០០ ក្នុងមួយថ្ងៃ)`">
							ថ្លៃយឺតសង ៛ {{ formatFee(loan) }}
						</button>
						<span v-else class="due-caption">ថ្ងៃត្រូវសង</span>
						<div class="action-buttons">
							<button class="renew-button" :disabled="loan.renewed || dueStatus(loan).kind === 'overdue' || loan.returnRequested" @click="renewLoan(loan)">
								{{ loan.renewed ? 'បានបន្ត' : 'បន្តការខ្ចី' }}
							</button>
							<button class="return-button" :disabled="loan.returnRequested" @click="requestReturn(loan)">
								{{ loan.returnRequested ? 'បានស្នើសង' : 'ស្នើសងសៀវភៅ' }}
							</button>
						</div>
					</div>
				</article>
			</div>
			<div v-else class="empty-state">
				<span>▤</span>
				<strong>មិនមានសៀវភៅកំពុងខ្ចីទេ</strong>
				<p>សៀវភៅដែលអ្នកខ្ចី នឹងបង្ហាញនៅទីនេះ។</p>
			</div>
		</section>

		<!-- Holds Section -->
		<section class="section-block holds-block">
			<div class="section-heading">
				<div>
					<h2>សៀវភៅបានកក់</h2>
					<p>រក្សាទុកសៀវភៅរយៈពេល ២៤ ម៉ោង</p>
				</div>
				<button class="catalog-link" @click="$emit('navigate', 'catalog')">រកសៀវភៅ <span>→</span></button>
			</div>

			<div v-if="activeHolds.length" class="hold-list">
				<article v-for="hold in activeHolds" :key="hold.bookId" class="hold-card">
					<span class="hold-symbol">▤</span>
					<div class="hold-info">
						<strong data-no-translate>{{ hold.title }}</strong>
						<small>{{ hold.author }}</small>
					</div>
					<div class="hold-expiry">
						<span>ថ្ងៃផុតកំណត់</span>
						<strong>{{ formatExpiry(hold.expiresAt) }}</strong>
					</div>
					<button class="cancel-hold" :aria-label="`បោះបង់ការកក់ ${hold.title}`" @click="cancelHold(hold)">×</button>
				</article>
			</div>
			<div v-else class="empty-state hold-empty">
				<span>⌑</span>
				<strong>មិនទាន់មានសៀវភៅកក់ទេ</strong>
				<p>កក់សៀវភៅពីបញ្ជី ហើយមកទទួលនៅតុបណ្ណារក្ស។</p>
				<button @click="$emit('navigate', 'catalog')">មើលបញ្ជីសៀវភៅ</button>
			</div>
		</section>

		<!-- Policy Banner -->
		<aside class="policy-banner">
			<span class="policy-icon">ⓘ</span>
			<p>
				<strong>លក្ខខណ្ឌខ្ចីសៀវភៅ</strong><br>
				ខ្ចីបាន ២១ ថ្ងៃ និងអាចបន្តបានម្ដង មុនថ្ងៃកំណត់សង។ ថ្លៃយឺតសងប៉ាន់ស្មាន៖ ៨០០ រៀលក្នុងមួយថ្ងៃ ចាប់ពីថ្ងៃបន្ទាប់ពីថ្ងៃកំណត់សង។
			</p>
			<span class="policy-hours">បើមានសំណួរ សូមសួរ<br>បណ្ណារក្សនៅតុសេវា។</span>
		</aside>
	</div>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue';
import api, { apiConfigured } from '@/services/api';

defineEmits(['navigate']);
const locale = inject('locale');
const loans = ref([
	{ id: 'loan-1', title: 'The Creative Act', shortTitle: 'The\nCreative\nAct', author: 'Rick Rubin', category: 'សិល្បៈ និងវប្បធម៌', cover: 'cover-rust', dueDate: '2026-10-02', renewed: false, returnRequested: false },
	{ id: 'loan-2', title: 'The Design of Everyday Things', shortTitle: 'Everyday\nThings', author: 'Don Norman', category: 'ការរចនា', cover: 'cover-olive', dueDate: '2026-09-25', renewed: false, returnRequested: false },
]);
const holds = ref([]);
const now = ref(Date.now());
const remindersEnabled = ref(true);
const notice = ref('');
const activeLoans = computed(() => loans.value.filter((loan) => !loan.returned));
const activeHolds = computed(() => holds.value.filter((hold) => new Date(hold.expiresAt).getTime() > now.value));
const dueSoonCount = computed(() => activeLoans.value.filter((loan) => dueStatus(loan).kind === 'soon').length);
const khmerMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
let ticker;

function khmerNumber(value) { return String(value).replace(/\d/g, (digit) => '០១២៣៤៥៦៧៨៩'[Number(digit)]); }
function categoryLabel(category) {
	const labels = { Design: 'ការរចនា', 'Arts & culture': 'សិល្បៈ និងវប្បធម៌' };
	return labels[category] ?? category;
}
function daysFromToday(dateString) {
	const due = new Date(`${dateString}T12:00:00`);
	const today = new Date(now.value);
	today.setHours(12, 0, 0, 0);
	return Math.round((due - today) / 86400000);
}
function dueStatus(loan) {
	if (loan.returnRequested) return { kind: 'return', label: 'បានស្នើសងសៀវភៅ', className: 'status-return' };
	const days = daysFromToday(loan.dueDate);
	if (days < 0) return { kind: 'overdue', label: locale.value === 'en' ? `Overdue ${Math.abs(days)} days` : `យឺត ${khmerNumber(Math.abs(days))} ថ្ងៃ`, className: 'status-late' };
	if (days === 0) return { kind: 'today', label: locale.value === 'en' ? 'Due today' : 'ត្រូវសងថ្ងៃនេះ', className: 'status-soon' };
	if (days <= 7) return { kind: 'soon', label: locale.value === 'en' ? `Due in ${days} days` : `ត្រូវសងក្នុង ${khmerNumber(days)} ថ្ងៃ`, className: 'status-soon' };
	return { kind: 'later', label: locale.value === 'en' ? `Due in ${days} days` : `ត្រូវសងក្នុង ${khmerNumber(days)} ថ្ងៃ`, className: 'status-ok' };
}
function progress(loan) { return Math.max(8, Math.min(100, ((21 - daysFromToday(loan.dueDate)) / 21) * 100)); }
function formatDate(dateString) {
	const dueDate = new Date(`${dateString}T12:00:00`);
	if (locale.value === 'en') return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(dueDate);
	return `ថ្ងៃទី ${khmerNumber(dueDate.getDate())} ខែ${khmerMonths[dueDate.getMonth()]}`;
}
function formatExpiry(expiry) {
	const holdExpiry = new Date(expiry);
	if (locale.value === 'en') {
		return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(holdExpiry);
	}
	const hour = holdExpiry.getHours();
	const period = hour >= 12 ? 'ល្ងាច' : 'ព្រឹក';
	return `ថ្ងៃទី ${khmerNumber(holdExpiry.getDate())} ខែ${khmerMonths[holdExpiry.getMonth()]} · ម៉ោង ${khmerNumber(hour % 12 || 12)}:${khmerNumber(String(holdExpiry.getMinutes()).padStart(2, '0'))} ${period}`;
}
function formatFee(loan) { return khmerNumber((Math.abs(daysFromToday(loan.dueDate)) * 800).toLocaleString('en-US')); }
function saveHolds() { localStorage.setItem('leafline_book_holds', JSON.stringify(holds.value)); }
function toggleReminders() {
	remindersEnabled.value = !remindersEnabled.value;
	localStorage.setItem('leafline_due_reminders', String(remindersEnabled.value));
	notice.value = remindersEnabled.value ? 'បានបើកការរំលឹកថ្ងៃសងនៅលើឧបករណ៍នេះ។' : 'បានបិទការរំលឹកថ្ងៃសង។';
}
async function renewLoan(loan) {
	if (loan.renewed || dueStatus(loan).kind === 'overdue') return;
	const newDueDate = new Date(`${loan.dueDate}T12:00:00`);
	newDueDate.setDate(newDueDate.getDate() + 14);
	if (apiConfigured) {
		try { await api.post('/loans/renew', { loan_id: loan.id }); } catch { /* Demo mode */ }
	}
	loan.dueDate = newDueDate.toISOString().slice(0, 10);
	loan.renewed = true;
	notice.value = `បានបន្តការខ្ចី “${loan.title}”។ ថ្ងៃត្រូវសងថ្មីគឺ ${formatDate(loan.dueDate)}។`;
}
async function requestReturn(loan) {
	if (apiConfigured) {
		try { await api.post('/loans/return', { loan_id: loan.id }); } catch { /* Demo mode */ }
	}
	loan.returnRequested = true;
	notice.value = `បានកត់ត្រាសំណើសង “${loan.title}”។ សូមយកសៀវភៅទៅប្រគល់នៅតុបណ្ណារក្ស។`;
}
function cancelHold(hold) {
	holds.value = holds.value.filter((item) => String(item.bookId) !== String(hold.bookId));
	saveHolds();
	notice.value = `បានបោះបង់ការកក់ “${hold.title}”។`;
}

onMounted(() => {
	remindersEnabled.value = localStorage.getItem('leafline_due_reminders') !== 'false';
	try {
		const saved = JSON.parse(localStorage.getItem('leafline_book_holds') || '[]');
		holds.value = Array.isArray(saved) ? saved.filter((hold) => new Date(hold.expiresAt).getTime() > Date.now()) : [];
		saveHolds();
	} catch { holds.value = []; }
	ticker = window.setInterval(() => { now.value = Date.now(); holds.value = holds.value.filter((hold) => new Date(hold.expiresAt).getTime() > now.value); saveHolds(); }, 60000);
});
onBeforeUnmount(() => window.clearInterval(ticker));
</script>

<style scoped>
.loans-page { color: #26372d; max-width: 1200px; margin: 0 auto; padding: 20px; }
.loans-heading { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 24px; }
.eyebrow { margin: 0 0 6px; color: #3b7550; font-size: 10px; font-weight: 700; letter-spacing: 1.1px; }
h1 { margin: 0; color: #1b3024; font-size: 28px; font-weight: 700; }
.subheading { margin: 6px 0 0; color: #68756d; font-size: 13px; }

.reminder-toggle { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border: 1px solid #dce4de; border-radius: 8px; background: white; color: #435449; cursor: pointer; font-size: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.02); transition: all 0.2s; }
.reminder-toggle:hover { border-color: #3b7550; }
.reminder-toggle small { color: #3b7550; font-size: 9px; font-weight: 600; }
.toggle-track { display: flex; width: 30px; height: 18px; align-items: center; padding: 2px; border-radius: 10px; background: #cbd4ce; transition: background .2s; }
.toggle-track.on { justify-content: flex-end; background: #3b7550; }
.toggle-track i { width: 14px; height: 14px; border-radius: 50%; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.15); }

.notice { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; padding: 12px 16px; border: 1px solid #c7e2cb; border-radius: 8px; background: #edf7ef; color: #2d663d; font-size: 12px; box-shadow: 0 2px 8px rgba(45, 102, 61, 0.05); }
.notice p { margin: 0; flex: 1; }
.notice button { margin-left: auto; border: 0; background: transparent; color: inherit; cursor: pointer; font-size: 18px; }

.loan-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 28px; }
.loan-stats article { display: flex; align-items: center; gap: 14px; padding: 16px; border: 1px solid #e1e8e2; border-radius: 10px; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
.loan-stat-icon { display: grid; width: 38px; height: 38px; flex: 0 0 auto; place-items: center; border-radius: 50%; font-size: 18px; }
.loan-stat-icon.green { background: #e7f2e9; color: #2d663d; }
.loan-stat-icon.orange { background: #fdf0ec; color: #c4683f; }
.loan-stat-icon.gold { background: #fdf8eb; color: #a67c37; }
.loan-stats article div { display: grid; gap: 2px; }
.loan-stats strong { color: #223528; font-size: 20px; font-weight: 700; }
.loan-stats small { color: #78857c; font-size: 10px; }

.section-block { margin-top: 24px; }
.section-heading { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.section-heading h2 { margin: 0; color: #23382b; font-size: 16px; font-weight: 700; }
.section-heading p { margin: 4px 0 0; color: #78857c; font-size: 10px; }
.renew-note { color: #78857c; font-size: 10px; background: #f0f4f1; padding: 4px 8px; border-radius: 4px; }

.loan-list, .hold-list { display: grid; gap: 12px; }
.loan-card { display: grid; grid-template-columns: 64px minmax(0,1fr) minmax(160px,.45fr); align-items: center; gap: 16px; padding: 16px; border: 1px solid #e1e8e2; border-radius: 10px; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.02); transition: transform 0.2s, box-shadow 0.2s; }
.loan-card:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.04); }

.mini-cover { position: relative; display: grid; width: 60px; height: 76px; place-items: center; padding: 6px; border-radius: 4px 6px 6px 4px; color: #f9f2e6; box-shadow: inset 4px 0 rgba(0,0,0,0.15); text-align: center; white-space: pre-line; }
.mini-cover span { font-family: Georgia, serif; font-size: 10px; line-height: 1.2; font-weight: 600; }
.cover-rust { background: linear-gradient(145deg, #ba7d5e, #76474c); }
.cover-olive { background: linear-gradient(145deg, #86906d, #455947); }

.loan-info { min-width: 0; }
.loan-category { color: #3b7550; font-size: 9px; font-weight: 700; letter-spacing: .6px; text-transform: uppercase; }
.loan-info h3 { overflow: hidden; margin: 4px 0 4px; color: #22382b; font-size: 13px; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
.loan-info > p { margin: 0; color: #78857c; font-size: 11px; }

.due-progress { display: flex; align-items: center; gap: 10px; margin-top: 12px; }
.progress-track { width: min(150px, 60%); height: 6px; overflow: hidden; border-radius: 6px; background: #edf2ee; }
.progress-track i { display: block; height: 100%; border-radius: inherit; background: #3b7550; }
.progress-track i.status-late { background: #c4683f; }
.due-progress > span { font-size: 10px; font-weight: 600; white-space: nowrap; }

.status-ok { color: #3b7550; }
.status-soon { color: #c4683f; }
.status-late { color: #b54734; }
.status-return { color: #68786e; }

.loan-actions { display: grid; justify-items: end; gap: 4px; }
.due-date { color: #23382b; font-size: 14px; font-weight: 700; }
.due-caption { color: #78857c; font-size: 9px; letter-spacing: .5px; }
.fee-link { padding: 0; border: 0; background: transparent; color: #b54734; cursor: pointer; font-size: 10px; font-weight: 600; }

.action-buttons { display: flex; gap: 8px; margin-top: 8px; }
.action-buttons button { min-height: 30px; padding: 0 12px; border-radius: 6px; cursor: pointer; font-size: 10px; font-weight: 600; transition: background 0.2s; }
.renew-button { border: 1px solid #c7e2cb; background: #edf7ef; color: #2d663d; }
.renew-button:hover:not(:disabled) { background: #d9ebdc; }
.return-button { border: 1px solid #dce4de; background: white; color: #55665b; }
.return-button:hover:not(:disabled) { background: #f4f7f5; }
.action-buttons button:disabled { color: #a1ada5; background: #f0f4f1; border-color: #e4eae6; cursor: default; }

.empty-state { display: grid; min-height: 160px; align-content: center; justify-items: center; border: 1px dashed #d6dfd8; border-radius: 10px; background: #fafcfb; text-align: center; padding: 20px; }
.empty-state > span { color: #82a38a; font-size: 28px; margin-bottom: 6px; }
.empty-state strong { color: #324639; font-size: 13px; font-weight: 700; }
.empty-state p { margin: 6px 0 0; color: #78857c; font-size: 11px; }

.hold-card { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border: 1px solid #e1e8e2; border-radius: 10px; background: #fffefb; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
.hold-symbol { display: grid; width: 36px; height: 36px; flex: 0 0 auto; place-items: center; border-radius: 8px; background: #fcf6e6; color: #a67c37; font-size: 16px; }
.hold-info { display: grid; min-width: 0; gap: 3px; }
.hold-info strong { overflow: hidden; color: #23382b; font-size: 12px; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
.hold-info small { color: #78857c; font-size: 10px; }

.hold-expiry { display: grid; gap: 2px; margin-left: auto; text-align: right; }
.hold-expiry span { color: #9c8a68; font-size: 8px; font-weight: 700; letter-spacing: .4px; }
.hold-expiry strong { color: #735b2e; font-size: 11px; font-weight: 700; }

.cancel-hold { width: 30px; height: 30px; margin-left: 8px; border: 0; background: transparent; color: #8a968e; cursor: pointer; font-size: 18px; border-radius: 50%; transition: background 0.2s; }
.cancel-hold:hover { background: #f0f4f1; color: #b54734; }

.hold-empty { min-height: 140px; }
.hold-empty button { margin-top: 12px; padding: 8px 14px; border: 0; border-radius: 6px; background: #edf7ef; color: #2d663d; cursor: pointer; font-size: 10px; font-weight: 600; transition: background 0.2s; }
.hold-empty button:hover { background: #d9ebdc; }

.catalog-link { border: 0; background: transparent; color: #3b7550; cursor: pointer; font-size: 11px; font-weight: 600; }
.catalog-link:hover { text-decoration: underline; }

.policy-banner { display: flex; align-items: center; gap: 14px; margin-top: 28px; padding: 16px 18px; border: 1px solid #e9e3d0; border-radius: 10px; background: #faf7ee; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
.policy-icon { color: #a67c37; font-size: 20px; }
.policy-banner p { flex: 1; margin: 0; color: #736b56; font-size: 10px; line-height: 1.6; }
.policy-banner p strong { color: #4d4632; font-size: 11px; font-weight: 700; }
.policy-hours { padding-left: 14px; border-left: 1px solid #e3dcce; color: #736b56; font-size: 10px; line-height: 1.5; }

@media (max-width: 700px) { 
	.loan-card { grid-template-columns: 52px minmax(0,1fr); gap: 12px; } 
	.mini-cover { width: 50px; height: 66px; } 
	.loan-actions { grid-column: 2; display: flex; align-items: center; justify-items: initial; flex-wrap: wrap; gap: 10px; } 
	.loan-actions .due-date { margin-right: auto; } 
	.action-buttons { margin-top: 0; } 
	.progress-track { width: min(130px, 50%); } 
}

@media (max-width: 460px) { 
	.loans-heading { align-items: flex-start; flex-direction: column; gap: 10px; } 
	.reminder-toggle { align-self: stretch; justify-content: space-between; } 
	.loan-stats { grid-template-columns: 1fr; gap: 8px; } 
	.loan-stats article { flex-direction: row; align-items: center; padding: 12px; } 
	.renew-note { max-width: 100px; text-align: right; } 
	.policy-hours { display: none; } 
	.hold-expiry span { display: none; } 
}
</style>