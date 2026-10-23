<template>
  <main class="home-page" v-translate="locale" :data-locale="locale">
    <!-- Hero: user-facing only -->
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow"><span class="eyebrow-dot"></span> DIGITAL LIBRARY</span>
        <h1>សួស្ដី{{ userName ? ` ${userName}` : '' }}! <span class="wave">👋</span></h1>
        <p class="hero-subtitle">រីករាយដែលបានជួបអ្នកម្ដងទៀត។ ថ្ងៃនេះតោះមកស្វែងរកសៀវភៅល្អៗ និងបង្កើនចំណេះដឹងជាមួយគ្នា។</p>
        <div class="hero-actions">
          <button class="btn btn-primary" @click="navigateTo('catalog')">
            <BookOpen :size="18" /> ស្វែងរកសៀវភៅ <ArrowRight :size="17" />
          </button>
          <button class="btn btn-soft" @click="navigateTo('loans')">
            <BookmarkCheck :size="18" /> សៀវភៅរបស់ខ្ញុំ
          </button>
        </div>
        <div class="hero-note"><Sparkles :size="16" /> អានតិចៗរាល់ថ្ងៃ ចំណេះដឹងកើនឡើងរាល់ថ្ងៃ!</div>
      </div>

      <div class="hero-art" aria-label="រូប Bot មិត្តជួយណែនាំការអាន">
        <div class="art-orbit orbit-one"></div>
        <div class="art-orbit orbit-two"></div>
        <span class="art-star star-a">✦</span>
        <span class="art-star star-b">✧</span>
        <span class="art-heart">♡</span>
        <div class="bot">
          <div class="bot-antenna"><i></i></div>
          <div class="bot-head">
            <div class="bot-ear ear-left"></div><div class="bot-ear ear-right"></div>
            <div class="bot-face">
              <span class="bot-eye"></span><span class="bot-eye"></span>
              <span class="bot-smile"></span>
            </div>
            <span class="bot-blush blush-left"></span><span class="bot-blush blush-right"></span>
          </div>
          <div class="bot-neck"></div>
          <div class="bot-body">
            <div class="bot-badge"><BookOpen :size="22" /></div>
            <span class="bot-button"></span>
          </div>
          <div class="bot-arm arm-left"></div><div class="bot-arm arm-right"></div>
          <div class="bot-foot foot-left"></div><div class="bot-foot foot-right"></div>
        </div>
        <div class="bot-bubble"><span>🤖</span><div><strong>សួស្ដីមិត្តអ្នកអាន!</strong><p>{{ botMessage }}</p></div></div>
      </div>
    </section>

    <!-- Personal overview, not admin analytics -->
    <section class="quick-stats">
      <article class="quick-stat">
        <span class="stat-icon mint"><BookOpen :size="21" /></span>
        <div><span class="stat-label">សៀវភៅដែលខ្ញុំខ្ចី</span><strong>{{ myLoans.length }}</strong><small>សំណើ/កំណត់ត្រារបស់អ្នក</small></div>
      </article>
      <article class="quick-stat">
        <span class="stat-icon peach"><Flame :size="21" /></span>
        <div><span class="stat-label">ថ្ងៃអានជាប់គ្នា</span><strong>{{ rewards.streak }} <small>ថ្ងៃ</small></strong><small>គោលដៅ ២ ថ្ងៃ</small></div>
      </article>
      <article class="quick-stat">
        <span class="stat-icon lilac"><Star :size="21" /></span>
        <div><span class="stat-label">ពិន្ទុរបស់ខ្ញុំ</span><strong>{{ rewards.points.toLocaleString() }}</strong><small>ពិន្ទុអានសៀវភៅ</small></div>
      </article>
    </section>

    <!-- Reading streak -->
    <section class="reading-card">
      <div class="reading-main">
        <div class="reading-heading">
          <div class="reading-icon"><CalendarCheck :size="22" /></div>
          <div><span class="section-kicker">YOUR DAILY READING</span><h2>បង្កើតទម្លាប់អានរាល់ថ្ងៃ 🌱</h2></div>
        </div>
        <p class="reading-description">ចុចបញ្ជាក់នៅពេលអ្នកបានអានសៀវភៅថ្ងៃនេះ។ អ្នកទទួលបាន <strong>១០ ពិន្ទុ</strong> ក្នុងមួយថ្ងៃ ហើយអាចតាមដានគោលដៅអានជាប់គ្នា ២ ថ្ងៃ។</p>
        <div class="progress-label"><span>ដំណើរទៅកាន់ ២ ថ្ងៃ</span><strong>{{ Math.min(rewards.streak, 2) }} / 2 ថ្ងៃ</strong></div>
        <div class="progress-track"><span :style="{ width: `${Math.min(rewards.streak, 2) / 2 * 100}%` }"></span></div>
        <div class="progress-foot"><span>🌼 រាល់ថ្ងៃគឺជាជំហានតូចមួយ</span><span>{{ Math.min(100, rewards.streak / 2 * 100) }}%</span></div>
      </div>
      <div class="checkin-box">
        <div class="checkin-emoji">{{ checkedInToday ? '🌟' : '📖' }}</div>
        <strong>{{ checkedInToday ? 'ថ្ងៃនេះអ្នកបានអានហើយ!' : 'បានអានថ្ងៃនេះហើយឬនៅ?' }}</strong>
        <p>{{ checkedInToday ? 'ល្អណាស់! ត្រឡប់មកអានម្ដងទៀតថ្ងៃស្អែក។' : 'ចំណាយពេលតែបន្តិច ដើម្បីទទួលបានពិន្ទុ។' }}</p>
        <button class="btn checkin-btn" :class="{ 'is-done': checkedInToday }" :disabled="checkedInToday" @click="checkIn">
          <CheckCircle2 v-if="checkedInToday" :size="18" />
          <Flame v-else :size="18" />
          {{ checkedInToday ? 'បានកត់ត្រាហើយ' : 'ខ្ញុំបានអានថ្ងៃនេះ +១០ ពិន្ទុ' }}
        </button>
        <small v-if="checkinMessage" class="checkin-message">{{ checkinMessage }}</small>
      </div>
    </section>

    <!-- Rewards -->
    <section class="section-block">
      <div class="section-heading">
        <div><span class="section-kicker">LITTLE REWARDS, BIG PROGRESS</span><h2>រង្វាន់សម្រាប់មិត្តអ្នកអាន 🎁</h2><p>ខិតខំអាន ហើយប្រមូលពិន្ទុដើម្បីទទួលរង្វាន់។</p></div>
        <span class="points-pill"><Star :size="15" /> {{ rewards.points }} ពិន្ទុ</span>
      </div>
      <div class="rewards-grid">
        <article class="reward-card book-reward">
          <div class="reward-visual"><span class="reward-sparkle">✦</span><span class="reward-emoji">📚</span><span class="reward-ribbon">BOOK</span></div>
          <div class="reward-content"><span class="reward-type">រង្វាន់សៀវភៅ</span><h3>សៀវភៅមួយក្បាល</h3><p>ប្រើពិន្ទុដើម្បីស្នើសុំរង្វាន់សៀវភៅពីបណ្ណាល័យ។</p><div class="reward-bottom"><span><Star :size="15" /> ៥០០ ពិន្ទុ</span><button class="reward-btn" :disabled="rewards.points < 500" @click="redeemReward('book')">ប្ដូររង្វាន់ <ArrowRight :size="15" /></button></div></div>
        </article>
        <article class="reward-card certificate-reward">
          <div class="reward-visual"><span class="certificate-sun">✦</span><span class="reward-emoji">🏅</span><span class="certificate-paper">CERTIFICATE</span></div>
          <div class="reward-content"><span class="reward-type">រង្វាន់ពិសេស</span><h3>ប័ណ្ណសរសើរអ្នកអាន</h3><p>អានជាប់គ្នា ២ ថ្ងៃ ដើម្បីដោះសោរប័ណ្ណសរសើរ។</p><div class="reward-bottom"><span><Trophy :size="15" /> {{ rewards.streak >= 2 ? 'បានដោះសោហើយ' : `${Math.min(rewards.streak, 2)} / 2 ថ្ងៃ` }}</span><button class="reward-btn" :disabled="rewards.streak < 2 || rewards.certificateRedeemed" @click="redeemReward('certificate')">{{ rewards.certificateRedeemed ? 'បានស្នើសុំហើយ' : rewards.streak >= 2 ? 'ទទួលប័ណ្ណ' : 'បន្តអាន' }}</button></div></div>
        </article>
      </div>
      <p class="reward-note"><Info :size="15" /> រង្វាន់នៅទីនេះជាការស្នើសុំក្នុងគំរូ Front-end។ បណ្ណាល័យត្រូវបញ្ជាក់មុនពេលផ្ដល់រង្វាន់ពិតប្រាកដ។</p>
    </section>

    <!-- Recommended books -->
    <section class="section-block">
      <div class="section-heading">
        <div><span class="section-kicker">PICKED FOR YOU</span><h2>សៀវភៅណែនាំសម្រាប់អ្នក 💚</h2><p>ស្វែងរកសៀវភៅថ្មីដែលអាចជួយបើកទ្វារចំណេះដឹង។</p></div>
        <button class="link-button" @click="navigateTo('catalog')">មើលទាំងអស់ <ArrowRight :size="16" /></button>
      </div>
      <div class="books-grid">
        <article v-for="book in recommendedBooks" :key="book.id" class="book-card">
          <div class="book-cover" :class="book.color">
            <span class="cover-deco">{{ book.emoji }}</span><span class="cover-label">{{ book.category }}</span>
            <strong>{{ book.title }}</strong><span class="cover-subtitle">{{ book.subtitle }}</span>
          </div>
          <div class="book-info"><h3>{{ book.title }}</h3><p>{{ book.author }}</p><div class="book-card-bottom"><span class="availability"><i></i> សៀវភៅណែនាំ</span><button class="mini-action" @click="navigateTo('catalog')">មើលសៀវភៅ <ArrowRight :size="14" /></button></div></div>
        </article>
      </div>
    </section>

    <!-- Personal shortcuts only -->
    <section class="section-block shortcuts-section">
      <div class="section-heading"><div><span class="section-kicker">YOUR LIBRARY SPACE</span><h2>ផ្លូវកាត់របស់អ្នក ✨</h2><p>ចូលទៅកាន់សេវាកម្មដែលអ្នកប្រើញឹកញាប់។</p></div></div>
      <div class="shortcut-grid">
        <button class="shortcut-card" @click="navigateTo('catalog')"><span class="shortcut-icon mint"><BookOpen :size="22" /></span><span><strong>ស្វែងរកសៀវភៅ</strong><small>ស្វែងរកតាមចំណងជើង និងប្រភេទ</small></span><ChevronRight :size="19" /></button>
        <button class="shortcut-card" @click="navigateTo('loans')"><span class="shortcut-icon peach"><BookmarkCheck :size="22" /></span><span><strong>សៀវភៅដែលខ្ញុំខ្ចី</strong><small>ពិនិត្យសំណើ និងស្ថានភាពខ្ចី</small></span><ChevronRight :size="19" /></button>
        <button class="shortcut-card" @click="navigateTo('rooms')"><span class="shortcut-icon blue"><Armchair :size="22" /></span><span><strong>កក់បន្ទប់សិក្សា</strong><small>ស្វែងរកកន្លែងសិក្សារបស់អ្នក</small></span><ChevronRight :size="19" /></button>
        <button class="shortcut-card" @click="$emit('edit-profile')"><span class="shortcut-icon lilac"><UserRound :size="22" /></span><span><strong>Profile របស់ខ្ញុំ</strong><small>កែព័ត៌មាន និងរូបភាពផ្ទាល់ខ្លួន</small></span><ChevronRight :size="19" /></button>
      </div>
    </section>

    <!-- Reward request confirmation -->
    <div v-if="rewardDialog" class="modal-backdrop" @click.self="rewardDialog = ''">
      <section class="reward-modal" role="dialog" aria-modal="true">
        <button class="modal-close" @click="rewardDialog = ''" aria-label="បិទ"><X :size="20" /></button>
        <div class="reward-modal-emoji">{{ rewardDialog === 'book' ? '📚' : '🏅' }}</div>
        <h2>{{ rewardDialog === 'book' ? 'ស្នើសុំរង្វាន់សៀវភៅ' : 'ស្នើសុំប័ណ្ណសរសើរ' }}</h2>
        <p>{{ rewardDialog === 'book' ? 'ពិន្ទុ ៥០០ នឹងត្រូវប្រើសម្រាប់សំណើនេះ។' : 'អ្នកបានបំពេញគោលដៅអានជាប់គ្នា ២ ថ្ងៃហើយ!' }}</p>
        <div class="modal-actions"><button class="btn btn-soft" @click="rewardDialog = ''">បោះបង់</button><button class="btn btn-primary" @click="confirmRedeem">បញ្ជាក់សំណើ <Check :size="17" /></button></div>
      </section>
    </div>

    <div v-if="toastMessage" class="toast" role="status"><CheckCircle2 :size="21" /><span>{{ toastMessage }}</span><button @click="toastMessage = ''" aria-label="បិទ"><X :size="17" /></button></div>
  </main>
</template>

<script setup>
import { computed, inject, onMounted, reactive, ref, watch } from 'vue';
import {
  Armchair, ArrowRight, BookmarkCheck, BookOpen, CalendarCheck,
  Check, CheckCircle2, ChevronRight, Flame, Info, Sparkles, Star, Trophy,
  UserRound, X
} from '@lucide/vue';

const emit = defineEmits(['navigate', 'edit-profile']);
const locale = inject('locale', ref('km'));
const studentProfile = inject('studentProfile', null);

const PROFILE_KEY = 'leafline_student';
const REWARDS_KEY = 'leafline_reading_rewards';
const LOANS_KEY = 'leafline_book_holds';

const defaultProfile = { fullName: '', studentId: '', email: '', phone: '', faculty: '', year: '', avatar: '' };
const profile = reactive({ ...defaultProfile });
const toastMessage = ref('');
const checkinMessage = ref('');
const rewardDialog = ref('');
const pendingReward = ref('');

const rewards = reactive({
  points: 0,
  streak: 0,
  totalDays: 0,
  lastReadDate: '',
  certificateRedeemed: false,
  history: []
});

const recommendedBooks = [
  { id: 1, title: 'ទម្លាប់ល្អ', subtitle: 'BUILD GOOD HABITS', author: 'សៀវភៅអភិវឌ្ឍខ្លួន', category: 'SELF GROWTH', emoji: '🌱', color: 'cover-green' },
  { id: 2, title: 'សិល្បៈនៃការគិត', subtitle: 'THINK BETTER', author: 'សៀវភៅចំណេះដឹង', category: 'KNOWLEDGE', emoji: '💡', color: 'cover-yellow' },
  { id: 3, title: 'ពិភពវិទ្យាសាស្ត្រ', subtitle: 'EXPLORE SCIENCE', author: 'សៀវភៅវិទ្យាសាស្ត្រ', category: 'SCIENCE', emoji: '🔭', color: 'cover-blue' },
  { id: 4, title: 'រឿងនិទាន', subtitle: 'STORIES & DREAMS', author: 'សៀវភៅអានកម្សាន្ត', category: 'STORIES', emoji: '🦋', color: 'cover-pink' }
];

function readLocal(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    toastMessage.value = 'មិនអាចរក្សាទុកបានទេ។ សូមសាកល្បងរូបភាពតូចជាងនេះ។';
    return false;
  }
}

function dateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function shiftDate(dateString, amount) {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return dateKey(date);
}

const todayKey = ref(dateKey());
const checkedInToday = computed(() => rewards.lastReadDate === todayKey.value);
const userName = computed(() => {
  const name = profile.fullName?.trim();
  if (!name) return 'មិត្តអ្នកអាន';
  return name.split(/\s+/)[0];
});
const botMessage = computed(() => {
  if (checkedInToday.value) return 'អ្នកបានបំពេញការអានថ្ងៃនេះហើយ។ អស្ចារ្យណាស់!';
  if (rewards.streak >= 7) return `អ្នកអានជាប់គ្នា ${rewards.streak} ថ្ងៃហើយ! បន្តទៀតណា។`;
  return 'តោះអានសៀវភៅថ្ងៃនេះ ដើម្បីទទួលបាន ១០ ពិន្ទុ!';
});
const myLoans = computed(() => {
  const raw = readLocal(LOANS_KEY, []);
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.items)) return raw.items;
  if (raw && Array.isArray(raw.holds)) return raw.holds;
  return [];
});

function navigateTo(page) {
  emit('navigate', page);
}

function syncProfile(source) {
  if (!source || typeof source !== 'object') return;
  Object.assign(profile, { ...defaultProfile, ...source });
}

function initials(name = '') {
  const clean = name.trim();
  return clean ? clean.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase() : 'U';
}

function saveRewards() {
  saveLocal(REWARDS_KEY, { ...rewards, history: [...rewards.history] });
}

function checkIn() {
  todayKey.value = dateKey();
  if (checkedInToday.value) {
    checkinMessage.value = 'អ្នកបានកត់ត្រាការអានថ្ងៃនេះរួចហើយ។';
    return;
  }
  const yesterday = shiftDate(todayKey.value, -1);
  rewards.streak = rewards.lastReadDate === yesterday ? rewards.streak + 1 : 1;
  rewards.points += 10;
  rewards.totalDays += 1;
  rewards.lastReadDate = todayKey.value;
  rewards.history.unshift({ date: todayKey.value, type: 'daily_reading', points: 10 });
  rewards.history = rewards.history.slice(0, 100);
  saveRewards();
  checkinMessage.value = 'អស្ចារ្យ! អ្នកទទួលបាន ១០ ពិន្ទុហើយ 🎉';
  toastMessage.value = 'បានកត់ត្រាការអានថ្ងៃនេះ +១០ ពិន្ទុ!';
}

function redeemReward(type) {
  if (type === 'book' && rewards.points < 500) {
    toastMessage.value = 'អ្នកត្រូវការយ៉ាងតិច ៥០០ ពិន្ទុដើម្បីស្នើសុំសៀវភៅ។';
    return;
  }
  if (type === 'certificate' && rewards.streak < 2) {
    toastMessage.value = 'សូមអានជាប់គ្នា ២ ថ្ងៃសិនណា។';
    return;
  }
  if (type === 'certificate' && rewards.certificateRedeemed) {
    toastMessage.value = 'អ្នកបានស្នើសុំប័ណ្ណសរសើររួចហើយ។';
    return;
  }
  pendingReward.value = type;
  rewardDialog.value = type;
}

function confirmRedeem() {
  const type = pendingReward.value;
  if (type === 'book') {
    if (rewards.points < 500) {
      rewardDialog.value = '';
      toastMessage.value = 'ពិន្ទុរបស់អ្នកមិនគ្រប់គ្រាន់ទេ។';
      return;
    }
    rewards.points -= 500;
    rewards.history.unshift({ date: dateKey(), type: 'book_reward_request', points: -500, status: 'pending' });
    toastMessage.value = 'បានបង្កើតសំណើរង្វាន់សៀវភៅ។ សូមរង់ចាំបណ្ណាល័យបញ្ជាក់។';
  } else if (type === 'certificate') {
    rewards.certificateRedeemed = true;
    rewards.history.unshift({ date: dateKey(), type: 'certificate_request', points: 0, status: 'pending' });
    toastMessage.value = 'បានបង្កើតសំណើប័ណ្ណសរសើរ។ សូមរង់ចាំបណ្ណាល័យបញ្ជាក់។';
  }
  rewards.history = rewards.history.slice(0, 100);
  saveRewards();
  rewardDialog.value = '';
  pendingReward.value = '';
}

onMounted(() => {
  todayKey.value = dateKey();
  const storedProfile = readLocal(PROFILE_KEY, null);
  if (storedProfile) syncProfile(storedProfile);
  if (studentProfile?.value) syncProfile(studentProfile.value);
  const storedRewards = readLocal(REWARDS_KEY, null);
  if (storedRewards && typeof storedRewards === 'object') {
    Object.assign(rewards, {
      points: Number(storedRewards.points) || 0,
      streak: Number(storedRewards.streak) || 0,
      totalDays: Number(storedRewards.totalDays) || 0,
      lastReadDate: storedRewards.lastReadDate || '',
      certificateRedeemed: Boolean(storedRewards.certificateRedeemed),
      history: Array.isArray(storedRewards.history) ? storedRewards.history : []
    });
  }
  if (studentProfile?.value) persistProfile();
});

watch(
  () => studentProfile?.value,
  (value) => {
    if (value && typeof value === 'object') {
      syncProfile(value);
      saveLocal(PROFILE_KEY, { ...profile });
    }
  },
  { deep: true }
);
</script>

<style scoped>
.home-page {
  --green: #2f7549;
  --green-dark: #205a36;
  --ink: #263d30;
  --muted: #829087;
  --line: #e7eee7;
  display: grid;
  gap: 25px;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 10px;
  color: var(--ink);
  font-family: inherit;
}
.home-page *, .home-page *::before, .home-page *::after { box-sizing: border-box; }
button, input { font: inherit; }
button { -webkit-tap-highlight-color: transparent; }
.hero {
  position: relative; display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(260px, .75fr);
  align-items: center; min-height: 300px; overflow: hidden; padding: 35px 42px;
  border: 1px solid #dcecdf; border-radius: 28px;
  background: radial-gradient(circle at 83% 18%, #fff 0, #fff0 28%), linear-gradient(115deg, #eff9f0 0%, #f7fbf4 48%, #fff6eb 100%);
}
.hero::before { content: ""; position: absolute; width: 260px; height: 260px; right: 12%; top: -160px; border-radius: 50%; background: #d6ebd8aa; }
.hero-copy { position: relative; z-index: 2; max-width: 690px; }
.eyebrow, .section-kicker { display: inline-flex; align-items: center; gap: 8px; color: #56815f; font-size: 10px; font-weight: 800; letter-spacing: 1.4px; }
.eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: #72ad7b; box-shadow: 0 0 0 4px #dcefe0; }
.hero h1 { margin: 18px 0 9px; color: #234a30; font-size: clamp(27px, 3.4vw, 39px); font-weight: 850; line-height: 1.35; overflow-wrap: anywhere; }
.wave { display: inline-block; transform-origin: 70% 70%; animation: wave 2.8s ease-in-out infinite; }
.hero-subtitle { max-width: 580px; margin: 0; color: #728176; font-size: 13px; line-height: 2; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 11px; margin-top: 24px; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 9px; min-height: 45px; padding: 12px 17px; border: 1px solid transparent; border-radius: 13px; font-size: 12px; font-weight: 750; cursor: pointer; transition: transform .2s, background .2s, box-shadow .2s; }
.btn:hover:not(:disabled) { transform: translateY(-2px); }
.btn-primary { background: var(--green); color: white; box-shadow: 0 7px 17px #2f754923; }
.btn-primary:hover:not(:disabled) { background: var(--green-dark); box-shadow: 0 10px 22px #2f754936; }
.btn-soft { border-color: #dbe8dc; background: #ffffffc9; color: #356746; }
.btn-soft:hover:not(:disabled) { background: white; }
.hero-note { display: flex; align-items: center; gap: 7px; margin-top: 20px; color: #7d9a80; font-size: 11px; }
.hero-note svg { color: #d4a94c; }
.hero-art { position: relative; display: grid; min-height: 230px; place-items: center; }
.art-orbit { position: absolute; width: 215px; height: 215px; border: 1px dashed #b9d9bd; border-radius: 50%; }
.orbit-two { width: 170px; height: 170px; border-style: solid; border-color: #d9e9d8; }
.art-star, .art-heart { position: absolute; z-index: 2; color: #d6aa4f; font-size: 27px; animation: float 3.4s ease-in-out infinite; }
.star-a { top: 13px; left: 19%; }.star-b { top: 37px; right: 13%; color: #7eaf86; animation-delay: .6s; }.art-heart { right: 17%; bottom: 30px; color: #e89a9b; font-size: 30px; }
.bot { position: relative; z-index: 1; width: 145px; height: 175px; margin-top: 12px; }
.bot-antenna { position: absolute; top: 0; left: 68px; width: 9px; height: 22px; border-radius: 7px; background: #75ad81; }
.bot-antenna i { position: absolute; top: -8px; left: -4px; width: 17px; height: 17px; border: 3px solid #fff; border-radius: 50%; background: #e9bd5f; }
.bot-head { position: absolute; top: 19px; left: 16px; width: 113px; height: 82px; border: 5px solid #fff; border-radius: 31px; background: linear-gradient(145deg, #b8dfbd, #78b789); box-shadow: 0 10px 0 #3b83544a, 0 15px 25px #316d4020; }
.bot-ear { position: absolute; top: 24px; width: 13px; height: 30px; border: 3px solid #fff; border-radius: 8px; background: #f4d98f; }
.ear-left { left: -14px; }.ear-right { right: -14px; }
.bot-face { position: absolute; inset: 13px 12px 12px; display: flex; align-items: center; justify-content: center; gap: 24px; border-radius: 18px; background: #f8fff7; }
.bot-eye { width: 8px; height: 11px; border-radius: 50%; background: #315e42; }
.bot-smile { position: absolute; bottom: 12px; left: 40px; width: 17px; height: 8px; border-bottom: 3px solid #315e42; border-radius: 0 0 15px 15px; }
.bot-blush { position: absolute; top: 46px; width: 13px; height: 7px; border-radius: 50%; background: #f3a4a0; opacity: .85; }.blush-left { left: 11px; }.blush-right { right: 11px; }
.bot-neck { position: absolute; top: 99px; left: 63px; width: 20px; height: 11px; background: #6ca779; }
.bot-body { position: absolute; top: 105px; left: 31px; display: grid; width: 83px; height: 57px; place-items: center; border: 4px solid white; border-radius: 23px 23px 17px 17px; background: linear-gradient(145deg, #a5d6ae, #69a979); box-shadow: 0 8px 0 #3b835433; }
.bot-badge { display: grid; width: 37px; height: 32px; place-items: center; border-radius: 11px; background: #f7fff4; color: #438052; }
.bot-button { position: absolute; right: 8px; bottom: 8px; width: 6px; height: 6px; border-radius: 50%; background: #f2cf7a; }
.bot-arm { position: absolute; top: 115px; width: 19px; height: 37px; border: 4px solid #fff; border-radius: 12px; background: #8ac497; }.arm-left { left: 12px; transform: rotate(18deg); }.arm-right { right: 11px; transform: rotate(-25deg); }
.bot-foot { position: absolute; top: 158px; width: 27px; height: 13px; border-radius: 8px 8px 11px 11px; background: #528e61; }.foot-left { left: 42px; }.foot-right { right: 42px; }
.bot-bubble { position: absolute; right: -4px; bottom: -2px; display: flex; align-items: flex-start; gap: 9px; width: 220px; padding: 12px 14px; border: 1px solid #e3eddf; border-radius: 15px 15px 5px 15px; background: #ffffffed; box-shadow: 0 8px 25px #294b3010; }
.bot-bubble > span { font-size: 21px; }.bot-bubble strong { display: block; color: #356947; font-size: 10px; }.bot-bubble p { margin: 4px 0 0; color: #849087; font-size: 9px; line-height: 1.7; }
.quick-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.quick-stat { display: flex; align-items: center; gap: 14px; min-width: 0; padding: 19px; border: 1px solid var(--line); border-radius: 19px; background: #fff; box-shadow: 0 5px 20px #263d3007; }
.stat-icon, .shortcut-icon { display: grid; flex: 0 0 auto; width: 47px; height: 47px; place-items: center; border-radius: 15px; }
.mint { background: #e6f5e8; color: #438154; }.peach { background: #fff0e7; color: #ca805d; }.lilac { background: #f0ebff; color: #8b76c4; }.blue { background: #e8f3ff; color: #5e8ab8; }
.quick-stat > div { display: grid; min-width: 0; gap: 4px; }.stat-label { color: #829087; font-size: 11px; }.quick-stat strong { color: #2c4934; font-size: 25px; line-height: 1.2; }.quick-stat strong small { font-size: 11px; font-weight: 600; }.quick-stat small { color: #9aa49b; font-size: 9px; }
.reading-card { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(270px, .75fr); gap: 25px; padding: 27px; border: 1px solid #dcebdd; border-radius: 22px; background: linear-gradient(120deg, #f6fbf5, #fffdf7); }
.reading-heading { display: flex; align-items: center; gap: 13px; }.reading-icon { display: grid; width: 46px; height: 46px; flex: 0 0 auto; place-items: center; border-radius: 15px; background: #e1f1e3; color: #39774b; }.reading-heading h2 { margin: 5px 0 0; color: #2d4d35; font-size: 17px; line-height: 1.6; }.reading-description { max-width: 640px; margin: 18px 0 22px; color: #7b897e; font-size: 11px; line-height: 2; }.reading-description strong { color: #3e7c4e; }
.progress-label, .progress-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; color: #6f8172; font-size: 10px; }.progress-label strong { color: #36764a; }.progress-track { height: 10px; margin-top: 10px; overflow: hidden; border-radius: 20px; background: #e5eee4; }.progress-track span { display: block; height: 100%; min-width: 0; border-radius: inherit; background: linear-gradient(90deg, #74b680, #367b4b); transition: width .4s; }.progress-foot { margin-top: 9px; color: #9aa59b; font-size: 9px; }
.checkin-box { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 22px; border: 1px solid #f0e5ca; border-radius: 18px; background: #fffaf0; text-align: center; }.checkin-emoji { display: grid; width: 49px; height: 49px; place-items: center; border-radius: 16px; background: #ffefc9; font-size: 25px; }.checkin-box > strong { margin-top: 12px; color: #70592d; font-size: 12px; }.checkin-box > p { margin: 7px 0 14px; color: #998666; font-size: 10px; line-height: 1.8; }.checkin-btn { width: 100%; background: #c38f35; color: white; box-shadow: 0 6px 15px #c38f3520; }.checkin-btn:hover:not(:disabled) { background: #a97827; }.checkin-btn.is-done { border-color: #d7e9d7; background: #e5f4e6; color: #3d794b; box-shadow: none; cursor: default; }.checkin-btn:disabled { cursor: default; }.checkin-message { margin-top: 10px; color: #64836a; font-size: 10px; line-height: 1.6; }
.section-block { display: grid; gap: 19px; }.section-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }.section-heading h2 { margin: 6px 0 4px; color: #294431; font-size: 19px; line-height: 1.55; }.section-heading p { margin: 0; color: #879289; font-size: 11px; line-height: 1.8; }.points-pill { display: inline-flex; align-items: center; gap: 6px; flex: 0 0 auto; padding: 9px 12px; border: 1px solid #f0e3c4; border-radius: 20px; background: #fff9e9; color: #9d782c; font-size: 10px; font-weight: 800; }
.rewards-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 17px; }.reward-card { display: grid; grid-template-columns: 135px minmax(0, 1fr); min-width: 0; overflow: hidden; border: 1px solid var(--line); border-radius: 19px; background: #fff; transition: transform .2s, box-shadow .2s; }.reward-card:hover { transform: translateY(-3px); box-shadow: 0 10px 24px #263d300d; }.reward-visual { position: relative; display: grid; min-height: 190px; place-items: center; overflow: hidden; background: linear-gradient(145deg, #e7f5e8, #cfe8d0); }.certificate-reward .reward-visual { background: linear-gradient(145deg, #fff1cf, #f5dfab); }.reward-visual::before { content: ""; position: absolute; width: 115px; height: 115px; border: 1px solid #ffffff90; border-radius: 50%; }.reward-emoji { position: relative; z-index: 1; font-size: 53px; filter: drop-shadow(0 7px 6px #375b331c); }.reward-sparkle, .certificate-sun { position: absolute; top: 20px; right: 20px; color: #7eae80; font-size: 25px; }.certificate-sun { color: #c49b43; }.reward-ribbon, .certificate-paper { position: absolute; bottom: 20px; padding: 6px 9px; border: 1px solid #ffffffa8; border-radius: 7px; background: #ffffff8a; color: #4b8055; font-size: 8px; font-weight: 850; letter-spacing: 1px; }.certificate-paper { color: #9b772d; }
.reward-content { display: flex; min-width: 0; flex-direction: column; justify-content: center; padding: 20px; }.reward-type { color: #80a084; font-size: 9px; font-weight: 800; letter-spacing: .7px; }.reward-content h3 { margin: 7px 0; color: #2e4935; font-size: 15px; }.reward-content p { margin: 0; color: #859087; font-size: 10px; line-height: 1.9; }.reward-bottom { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-top: 17px; padding-top: 13px; border-top: 1px solid #edf1ed; }.reward-bottom > span { display: inline-flex; align-items: center; gap: 5px; color: #a17c32; font-size: 10px; font-weight: 750; }.reward-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 11px; border: 1px solid #dceadd; border-radius: 10px; background: #eff8ef; color: #3d794b; font-size: 10px; font-weight: 750; cursor: pointer; }.reward-btn:hover:not(:disabled) { background: #dcefe0; }.reward-btn:disabled { cursor: not-allowed; opacity: .5; }.reward-note { display: flex; align-items: flex-start; gap: 7px; margin: -3px 0 0; color: #9a9f98; font-size: 10px; line-height: 1.8; }.reward-note svg { flex: 0 0 auto; margin-top: 2px; }
.link-button { display: inline-flex; align-items: center; gap: 7px; flex: 0 0 auto; padding: 10px 12px; border: 1px solid #dcebdd; border-radius: 11px; background: #f0f8f0; color: #3d794b; font-size: 10px; font-weight: 750; cursor: pointer; }.link-button:hover { background: #e2f1e3; }
.books-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }.book-card { min-width: 0; overflow: hidden; border: 1px solid #e8eee8; border-radius: 17px; background: white; transition: transform .2s, box-shadow .2s; }.book-card:hover { transform: translateY(-4px); box-shadow: 0 10px 24px #263d3010; }.book-cover { position: relative; display: flex; min-height: 158px; flex-direction: column; align-items: flex-start; justify-content: center; gap: 8px; padding: 18px; overflow: hidden; }.cover-green { background: linear-gradient(145deg, #e3f3e4, #c8e4cc); color: #2c6439; }.cover-yellow { background: linear-gradient(145deg, #fff3d6, #f2e0ac); color: #886a27; }.cover-blue { background: linear-gradient(145deg, #e5f1ff, #cbdff6); color: #3b638b; }.cover-pink { background: linear-gradient(145deg, #ffedf2, #f5d6e2); color: #a25072; }.cover-deco { position: absolute; top: 13px; right: 13px; font-size: 33px; opacity: .9; }.cover-label { font-size: 8px; font-weight: 850; letter-spacing: .8px; }.book-cover strong { max-width: 100%; font-size: 15px; line-height: 1.7; overflow-wrap: anywhere; }.cover-subtitle { font-size: 8px; font-weight: 750; letter-spacing: .4px; }.book-info { padding: 14px; }.book-info h3 { margin: 0; color: #2f4936; font-size: 12px; line-height: 1.8; }.book-info > p { margin: 4px 0 14px; color: #929b93; font-size: 10px; }.book-card-bottom { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }.availability { display: inline-flex; align-items: center; gap: 5px; color: #7e8c80; font-size: 9px; }.availability i { width: 6px; height: 6px; border-radius: 50%; background: #76b680; }.mini-action { display: inline-flex; align-items: center; gap: 5px; padding: 7px 8px; border: 0; border-radius: 8px; background: #eff8ef; color: #39754a; font-size: 9px; font-weight: 750; cursor: pointer; }
.shortcut-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }.shortcut-card { display: flex; align-items: center; gap: 13px; min-width: 0; padding: 16px; border: 1px solid var(--line); border-radius: 16px; background: white; text-align: left; cursor: pointer; transition: border .2s, transform .2s, box-shadow .2s; }.shortcut-card:hover { transform: translateY(-2px); border-color: #cfe3d1; box-shadow: 0 7px 18px #263d3009; }.shortcut-icon { width: 44px; height: 44px; border-radius: 13px; }.shortcut-card > span:nth-child(2) { display: grid; min-width: 0; gap: 5px; flex: 1; }.shortcut-card strong { color: #36513c; font-size: 12px; }.shortcut-card small { color: #909b91; font-size: 10px; line-height: 1.6; }.shortcut-card > svg { flex: 0 0 auto; color: #9bab9d; }
.modal-backdrop { position: fixed; z-index: 1000; inset: 0; display: grid; place-items: center; padding: 18px; overflow-y: auto; background: #172a1fc4; backdrop-filter: blur(6px); }.profile-modal, .reward-modal { position: relative; width: 100%; max-width: 470px; margin: auto; padding: 28px; border: 1px solid #e0ebe0; border-radius: 24px; background: #fff; box-shadow: 0 25px 80px #0d1f1333; animation: modal-in .2s ease-out; }.modal-close { position: absolute; top: 15px; right: 15px; display: grid; width: 35px; height: 35px; place-items: center; border: 0; border-radius: 11px; background: #f0f6f0; color: #5d7562; cursor: pointer; }.profile-modal-heading h2, .reward-modal h2 { margin: 7px 0; color: #2c4934; font-size: 21px; }.profile-modal-heading p, .reward-modal p { margin: 0; color: #849087; font-size: 11px; line-height: 1.8; }.avatar-editor { display: flex; align-items: center; gap: 15px; margin: 22px 0; padding: 15px; border: 1px solid #e7eee7; border-radius: 15px; background: #f8fbf8; }.avatar-preview { display: grid; width: 70px; height: 70px; flex: 0 0 auto; place-items: center; overflow: hidden; border: 3px solid white; border-radius: 50%; background: #dff0e1; color: #367549; box-shadow: 0 0 0 1px #cfe4d1; font-size: 22px; font-weight: 800; }.avatar-preview img { width: 100%; height: 100%; object-fit: cover; }.upload-btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 11px; border: 1px solid #d7e8d9; border-radius: 10px; background: white; color: #3d794b; font-size: 10px; font-weight: 750; cursor: pointer; }.avatar-editor p { margin: 7px 0 0; color: #9aa39b; font-size: 9px; }.field-label { display: block; margin: 14px 0 7px; color: #506654; font-size: 11px; font-weight: 750; }.field-input { width: 100%; min-height: 43px; padding: 11px 12px; border: 1px solid #dfe9df; border-radius: 11px; outline: none; background: white; color: #304636; font-size: 12px; }.field-input:focus { border-color: #75ad80; box-shadow: 0 0 0 3px #e6f4e8; }.profile-error { color: #c24e4e; font-size: 10px; line-height: 1.7; }.save-profile { width: 100%; margin-top: 21px; }.reward-modal { max-width: 390px; text-align: center; }.reward-modal-emoji { display: grid; width: 66px; height: 66px; place-items: center; margin: 4px auto 16px; border-radius: 20px; background: #f0f8ed; font-size: 34px; }.modal-actions { display: flex; justify-content: center; gap: 10px; margin-top: 23px; }.toast { position: fixed; z-index: 1200; right: 22px; bottom: 22px; display: flex; align-items: center; gap: 11px; width: min(410px, calc(100vw - 32px)); padding: 15px; border: 1px solid #d6e9d7; border-radius: 15px; background: white; color: #3c794b; box-shadow: 0 12px 35px #1b35231c; animation: modal-in .2s ease-out; }.toast > span { flex: 1; color: #55725a; font-size: 11px; line-height: 1.7; }.toast button { display: grid; place-items: center; border: 0; background: transparent; color: #819084; cursor: pointer; }
@keyframes wave { 0%, 100% { transform: rotate(0); } 15%, 30% { transform: rotate(13deg); } 45% { transform: rotate(-5deg); } 60% { transform: rotate(9deg); } }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
@keyframes modal-in { from { opacity: 0; transform: translateY(9px) scale(.985); } to { opacity: 1; transform: translateY(0) scale(1); } }
@media (max-width: 1050px) { .hero { padding: 28px; grid-template-columns: minmax(0, 1fr) 270px; }.hero-art { transform: scale(.92); }.reading-card { grid-template-columns: 1fr; }.checkin-box { display: grid; grid-template-columns: auto 1fr; justify-items: start; column-gap: 13px; text-align: left; }.checkin-emoji { grid-row: span 2; }.checkin-box > strong { align-self: end; margin-top: 0; }.checkin-box > p { margin: 4px 0 0; }.checkin-btn { grid-column: 1 / -1; margin-top: 15px; }.checkin-message { grid-column: 1 / -1; } }
@media (max-width: 760px) { .home-page { gap: 18px; padding: 3px; }.hero { grid-template-columns: minmax(0, 1fr); padding: 25px 22px 20px; border-radius: 21px; }.hero h1 { font-size: 27px; }.hero-art { min-height: 205px; margin-top: 8px; transform: scale(.9); }.bot-bubble { right: 0; bottom: 0; }.quick-stats { grid-template-columns: 1fr; gap: 10px; }.quick-stat { padding: 14px; }.quick-stat strong { font-size: 22px; }.reading-card { padding: 19px; gap: 18px; }.section-heading { align-items: flex-start; }.section-heading h2 { font-size: 16px; }.rewards-grid { grid-template-columns: 1fr; }.reward-card { grid-template-columns: 115px minmax(0, 1fr); }.reward-visual { min-height: 180px; }.reward-content { padding: 15px; }.books-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 11px; }.book-cover { min-height: 145px; padding: 13px; }.book-cover strong { font-size: 13px; }.book-info { padding: 11px; }.book-card-bottom { align-items: flex-start; flex-direction: column; }.shortcut-grid { grid-template-columns: 1fr; }.section-heading .link-button { max-width: 115px; } }
@media (max-width: 420px) { .hero { padding: 22px 17px; }.hero h1 { font-size: 23px; }.hero-subtitle { font-size: 12px; }.hero-actions { flex-direction: column; align-items: stretch; }.hero-actions .btn { width: 100%; }.hero-art { transform: scale(.82); margin: -4px -10px -9px; }.bot-bubble { width: 205px; }.section-heading { flex-direction: column; align-items: flex-start; }.points-pill { align-self: flex-start; }.reward-card { grid-template-columns: 95px minmax(0, 1fr); }.reward-visual { min-height: 205px; }.reward-emoji { font-size: 40px; }.reward-content h3 { font-size: 13px; }.reward-bottom { align-items: flex-start; flex-direction: column; }.books-grid { gap: 9px; }.book-cover { min-height: 130px; }.cover-deco { font-size: 27px; }.book-cover strong { font-size: 12px; }.mini-action { font-size: 8px; }.profile-modal, .reward-modal { padding: 23px 19px; }.toast { right: 16px; bottom: 16px; } }
@media (prefers-reduced-motion: reduce) { .home-page *, .home-page *::before, .home-page *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; } }
</style>
