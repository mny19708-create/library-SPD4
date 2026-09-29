<template>
	<div class="loans-page">
		<div class="loans-heading"><div><p class="eyebrow">គ្រប់គ្រងការខ្ចីសៀវភៅ</p><h1>សៀវភៅដែលខ្ញុំខ្ចី</h1><p class="subheading">មើលថ្ងៃកំណត់សង និងសៀវភៅដែលបានកក់របស់អ្នក។</p></div><button class="reminder-toggle" role="switch" :aria-checked="remindersEnabled" @click="toggleReminders"><span class="toggle-track" :class="{ on: remindersEnabled }"><i></i></span><span>រំលឹកថ្ងៃសង <small>{{ remindersEnabled ? 'បើក' : 'បិទ' }}</small></span></button></div>

		<div v-if="notice" class="notice"><span>✓</span>{{ notice }}<button aria-label="Dismiss message" @click="notice = ''">×</button></div>

		<section class="loan-stats"><article><span class="loan-stat-icon green">↗</span><div><strong>{{ khmerNumber(activeLoans.length) }}</strong><small>កំពុងខ្ចី</small></div></article><article><span class="loan-stat-icon orange">◷</span><div><strong>{{ khmerNumber(dueSoonCount) }}</strong><small>ត្រូវសងក្នុងសប្ដាហ៍នេះ</small></div></article><article><span class="loan-stat-icon gold">⌑</span><div><strong>{{ khmerNumber(activeHolds.length) }}</strong><small>កំពុងរង់ចាំទទួល</small></div></article></section>

		<section class="section-block"><div class="section-heading"><div><h2>សៀវភៅកំពុងខ្ចី</h2><p>កំពុងខ្ចីសរុប {{ khmerNumber(activeLoans.length) }} ក្បាល</p></div><span class="renew-note">អាចបន្តការខ្ចីបានម្ដង</span></div>
			<div v-if="activeLoans.length" class="loan-list">
				<article v-for="loan in activeLoans" :key="loan.id" class="loan-card">
					<div class="mini-cover" :class="loan.cover"><span>{{ loan.shortTitle }}</span></div>
					<div class="loan-info"><span class="loan-category">{{ categoryLabel(loan.category) }}</span><h3>{{ loan.title }}</h3><p>{{ loan.author }}</p><div class="due-progress"><div class="progress-track"><i :class="dueStatus(loan).className" :style="{ width: `${progress(loan)}%` }"></i></div><span :class="dueStatus(loan).className">{{ dueStatus(loan).label }}</span></div></div>
					<div class="loan-actions"><span class="due-date">{{ formatDate(loan.dueDate) }}</span><button v-if="dueStatus(loan).kind === 'overdue'" class="fee-link" @click="notice = `ថ្លៃយឺតសងប៉ាន់ស្មានសម្រាប់ ${loan.title}៖ ៛ ${formatFee(loan)} (៛ ៨០០ ក្នុងមួយថ្ងៃ)`">ថ្លៃយឺតសង ៛ {{ formatFee(loan) }}</button><span v-else class="due-caption">ថ្ងៃត្រូវសង</span><div class="action-buttons"><button class="renew-button" :disabled="loan.renewed || dueStatus(loan).kind === 'overdue' || loan.returnRequested" @click="renewLoan(loan)">{{ loan.renewed ? 'បានបន្ត' : 'បន្តការខ្ចី' }}</button><button class="return-button" :disabled="loan.returnRequested" @click="requestReturn(loan)">{{ loan.returnRequested ? 'បានស្នើសង' : 'ស្នើសងសៀវភៅ' }}</button></div></div>
				</article>
			</div>
			<div v-else class="empty-state"><span>▤</span><strong>មិនមានសៀវភៅកំពុងខ្ចីទេ</strong><p>សៀវភៅដែលអ្នកខ្ចី នឹងបង្ហាញនៅទីនេះ។</p></div>
		</section>

		<section class="section-block holds-block"><div class="section-heading"><div><h2>សៀវភៅបានកក់</h2><p>រក្សាទុកសៀវភៅរយៈពេល ២៤ ម៉ោង</p></div><button class="catalog-link" @click="$emit('navigate', 'catalog')">រកសៀវភៅ <span>→</span></button></div>
			<div v-if="activeHolds.length" class="hold-list"><article v-for="hold in activeHolds" :key="hold.bookId" class="hold-card"><span class="hold-symbol">▤</span><div class="hold-info"><strong>{{ hold.title }}</strong><small>{{ hold.author }}</small></div><div class="hold-expiry"><span>ថ្ងៃផុតកំណត់</span><strong>{{ formatExpiry(hold.expiresAt) }}</strong></div><button class="cancel-hold" :aria-label="`បោះបង់ការកក់ ${hold.title}`" @click="cancelHold(hold)">×</button></article></div>
			<div v-else class="empty-state hold-empty"><span>⌑</span><strong>មិនទាន់មានសៀវភៅកក់ទេ</strong><p>កក់សៀវភៅពីបញ្ជី ហើយមកទទួលនៅតុបណ្ណារក្ស។</p><button @click="$emit('navigate', 'catalog')">មើលបញ្ជីសៀវភៅ</button></div>
		</section>

		<aside class="policy-banner"><span class="policy-icon">ⓘ</span><p><strong>លក្ខខណ្ឌខ្ចីសៀវភៅ</strong><br>ខ្ចីបាន ២១ ថ្ងៃ និងអាចបន្តបានម្ដង មុនថ្ងៃកំណត់សង។ ថ្លៃយឺតសងប៉ាន់ស្មាន៖ ៨០០ រៀលក្នុងមួយថ្ងៃ ចាប់ពីថ្ងៃបន្ទាប់ពីថ្ងៃកំណត់សង។</p><span class="policy-hours">បើមានសំណួរ សូមសួរ<br>បណ្ណារក្សនៅតុសេវា។</span></aside>
	</div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import api, { apiConfigured } from '@/services/api';

defineEmits(['navigate']);
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
	if (days < 0) return { kind: 'overdue', label: `យឺត ${khmerNumber(Math.abs(days))} ថ្ងៃ`, className: 'status-late' };
	if (days === 0) return { kind: 'today', label: 'ត្រូវសងថ្ងៃនេះ', className: 'status-soon' };
	if (days <= 7) return { kind: 'soon', label: `ត្រូវសងក្នុង ${khmerNumber(days)} ថ្ងៃ`, className: 'status-soon' };
	return { kind: 'later', label: `ត្រូវសងក្នុង ${khmerNumber(days)} ថ្ងៃ`, className: 'status-ok' };
}
function progress(loan) { return Math.max(8, Math.min(100, ((21 - daysFromToday(loan.dueDate)) / 21) * 100)); }
function formatDate(dateString) {
	const dueDate = new Date(`${dateString}T12:00:00`);
	return `ថ្ងៃទី ${khmerNumber(dueDate.getDate())} ខែ${khmerMonths[dueDate.getMonth()]}`;
}
function formatExpiry(expiry) {
	const holdExpiry = new Date(expiry);
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
		try { await api.post('/loans/renew', { loan_id: loan.id }); } catch { /* Keep the tracker usable in demo mode. */ }
	}
	loan.dueDate = newDueDate.toISOString().slice(0, 10);
	loan.renewed = true;
	notice.value = `បានបន្តការខ្ចី “${loan.title}”។ ថ្ងៃត្រូវសងថ្មីគឺ ${formatDate(loan.dueDate)}។`;
}
async function requestReturn(loan) {
	if (apiConfigured) {
		try { await api.post('/loans/return', { loan_id: loan.id }); } catch { /* Record the request locally in demo mode. */ }
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
.loans-page { color: #26372d; }
.loans-heading { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 20px; }
.eyebrow { margin: 0 0 6px; color: #548468; font-size: 9px; font-weight: 700; letter-spacing: 1.1px; }
h1 { margin: 0; color: #223a2e; font-size: 26px; font-weight: 600; letter-spacing: 0; }
.subheading { margin: 5px 0 0; color: #89928c; font-size: 11px; }
.reminder-toggle { display: flex; align-items: center; gap: 8px; padding: 7px 10px; border: 1px solid #e5eae4; border-radius: 5px; background: white; color: #55665b; cursor: pointer; text-align: left; font-size: 9px; }
.reminder-toggle > span:last-child { display: grid; gap: 2px; }
.reminder-toggle small { color: #639071; font-size: 8px; }
.toggle-track { display: flex; width: 27px; height: 16px; align-items: center; padding: 2px; border-radius: 9px; background: #d8ded9; transition: background .15s; }
.toggle-track.on { justify-content: flex-end; background: #4f9768; }
.toggle-track i { width: 12px; height: 12px; border-radius: 50%; background: white; box-shadow: 0 1px 2px #0002; }
.notice { display: flex; align-items: center; gap: 8px; margin: -7px 0 13px; padding: 9px 11px; border: 1px solid #d8e9dc; border-radius: 4px; background: #f0f7f0; color: #4a7956; font-size: 9px; }
.notice button { margin-left: auto; border: 0; background: transparent; color: inherit; cursor: pointer; }
.loan-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 23px; }
.loan-stats article { display: flex; align-items: center; gap: 10px; padding: 12px; border: 1px solid #e6eae5; border-radius: 5px; background: white; }
.loan-stat-icon { display: grid; width: 30px; height: 30px; flex: 0 0 auto; place-items: center; border-radius: 50%; font-size: 16px; }
.loan-stat-icon.green { background: #e7f2e9; color: #3d8158; }
.loan-stat-icon.orange { background: #f9ede5; color: #c57a58; }
.loan-stat-icon.gold { background: #f7f1df; color: #ae884a; }
.loan-stats article div { display: grid; gap: 3px; }
.loan-stats strong { color: #35483a; font-size: 17px; }
.loan-stats small { color: #929a94; font-size: 8px; }
.section-block { margin-top: 20px; }
.section-heading { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
.section-heading h2 { margin: 0; color: #35453a; font-size: 13px; font-weight: 700; }
.section-heading p { margin: 4px 0 0; color: #929a94; font-size: 8px; }
.renew-note { color: #999f99; font-size: 8px; }
.loan-list, .hold-list { display: grid; gap: 8px; }
.loan-card { display: grid; grid-template-columns: 58px minmax(0,1fr) minmax(135px,.55fr); align-items: center; gap: 13px; padding: 12px; border: 1px solid #e5eae4; border-radius: 5px; background: white; }
.mini-cover { position: relative; display: grid; width: 54px; height: 69px; place-items: center; padding: 6px; border-radius: 2px 4px 4px 2px; color: #f9f2e6; box-shadow: inset 4px 0 #0002; text-align: center; white-space: pre-line; }
.mini-cover span { font-family: Georgia, serif; font-size: 10px; line-height: 1.1; }
.cover-rust { background: linear-gradient(145deg, #ba7d5e, #76474c); }
.cover-olive { background: linear-gradient(145deg, #86906d, #455947); }
.loan-info { min-width: 0; }
.loan-category { color: #548468; font-size: 7px; font-weight: 700; letter-spacing: .6px; text-transform: uppercase; }
.loan-info h3 { overflow: hidden; margin: 4px 0 3px; color: #3d4a40; font-size: 10px; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
.loan-info > p { margin: 0; color: #929a94; font-size: 8px; }
.due-progress { display: flex; align-items: center; gap: 7px; margin-top: 11px; }
.progress-track { width: min(130px, 60%); height: 4px; overflow: hidden; border-radius: 4px; background: #edf0ec; }
.progress-track i { display: block; height: 100%; border-radius: inherit; background: #64a175; }
.progress-track i.status-late { background: #cf795f; }
.due-progress > span { font-size: 8px; white-space: nowrap; }
.status-ok { color: #548663; }
.status-soon { color: #b37b43; }
.status-late { color: #bb6653; }
.status-return { color: #728179; }
.loan-actions { display: grid; justify-items: end; gap: 4px; }
.due-date { color: #46584a; font-size: 12px; font-weight: 700; }
.due-caption { color: #9ba29c; font-size: 7px; letter-spacing: .5px; }
.fee-link { padding: 0; border: 0; background: transparent; color: #bd6b51; cursor: pointer; font-size: 8px; }
.action-buttons { display: flex; gap: 5px; margin-top: 5px; }
.action-buttons button { min-height: 26px; padding: 0 8px; border-radius: 3px; cursor: pointer; font-size: 8px; }
.renew-button { border: 1px solid #dce8dd; background: #f1f7f1; color: #477c54; }
.return-button { border: 1px solid #e6e9e5; background: white; color: #7a867d; }
.action-buttons button:disabled { color: #a7ada7; cursor: default; }
.empty-state { display: grid; min-height: 130px; align-content: center; justify-items: center; border: 1px dashed #dde5dd; border-radius: 5px; background: #fbfcfa; text-align: center; }
.empty-state > span { color: #89a48d; font-size: 23px; }
.empty-state strong { margin-top: 5px; color: #4d5d51; font-size: 10px; }
.empty-state p { margin: 4px 0 0; color: #929b94; font-size: 8px; }
.hold-card { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border: 1px solid #e8e9e2; border-radius: 5px; background: #fffefa; }
.hold-symbol { display: grid; width: 30px; height: 30px; flex: 0 0 auto; place-items: center; border-radius: 4px; background: #f5eedb; color: #a88a50; }
.hold-info { display: grid; min-width: 0; gap: 3px; }
.hold-info strong { overflow: hidden; color: #4d574a; font-size: 9px; text-overflow: ellipsis; white-space: nowrap; }
.hold-info small { color: #989b8f; font-size: 8px; }
.hold-expiry { display: grid; gap: 3px; margin-left: auto; text-align: right; }
.hold-expiry span { color: #a39b86; font-size: 7px; font-weight: 700; letter-spacing: .4px; }
.hold-expiry strong { color: #826e45; font-size: 9px; }
.cancel-hold { width: 25px; height: 25px; margin-left: 4px; border: 0; background: transparent; color: #9b9d94; cursor: pointer; font-size: 16px; }
.hold-empty { min-height: 120px; }
.hold-empty button { margin-top: 9px; padding: 6px 10px; border: 0; border-radius: 3px; background: #e8f2e9; color: #3f7955; cursor: pointer; font-size: 8px; }
.catalog-link { border: 0; background: transparent; color: #44805a; cursor: pointer; font-size: 9px; font-weight: 600; }
.policy-banner { display: flex; align-items: center; gap: 10px; margin-top: 20px; padding: 12px 14px; border: 1px solid #e9e5d9; border-radius: 5px; background: #faf8f1; }
.policy-icon { color: #a18a58; font-size: 15px; }
.policy-banner p { flex: 1; margin: 0; color: #908a78; font-size: 8px; line-height: 1.6; }
.policy-banner p strong { color: #6d634b; font-size: 9px; }
.policy-hours { padding-left: 12px; border-left: 1px solid #e8e2d2; color: #958d79; font-size: 8px; line-height: 1.5; }
@media (max-width: 700px) { .loan-card { grid-template-columns: 46px minmax(0,1fr); gap: 10px; } .mini-cover { width: 45px; height: 61px; } .loan-actions { grid-column: 2; display: flex; align-items: center; justify-items: initial; flex-wrap: wrap; gap: 8px; } .loan-actions .due-date { margin-right: auto; } .action-buttons { margin-top: 0; } .progress-track { width: min(110px, 50%); } }
@media (max-width: 460px) { .loans-heading { align-items: flex-start; flex-direction: column; } .reminder-toggle { align-self: flex-end; margin-top: -9px; } .loan-stats { gap: 6px; } .loan-stats article { flex-direction: column; align-items: flex-start; gap: 6px; padding: 9px; } .loan-stats strong { font-size: 15px; } .loan-stats small { font-size: 7px; } .renew-note { max-width: 100px; text-align: right; } .policy-hours { display: none; } .hold-expiry span { display: none; } }
</style>
