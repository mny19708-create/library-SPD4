```vue
<template>
  <section class="user-home" v-translate="locale">
    <!-- Welcome header -->
    <header class="welcome-header">
      <div>
        <span class="eyebrow">🌿 LEAFLINE LIBRARY</span>
        <h1>សួស្តី, <em>{{ profile.fullName || 'និស្សិត' }}</em> 👋</h1>
        <p>ត្រៀមខ្លួនសម្រាប់ថ្ងៃសិក្សាដ៏ល្អមួយហើយឬនៅ?</p>
      </div>

      <button class="profile-button" @click="openProfile">
        <img v-if="profile.avatar" :src="profile.avatar" alt="រូប Profile" />
        <span v-else class="avatar-placeholder">
          {{ initials }}
        </span>
        <span class="profile-button-text">
          <strong>គណនីរបស់ខ្ញុំ</strong>
          <small>កែប្រែ Profile</small>
        </span>
        <UserRound :size="18" />
      </button>
    </header>

    <!-- Main actions -->
    <div class="hero-card">
      <div class="hero-copy">
        <span class="hero-label">
          <Sparkles :size="16" /> YOUR STUDY SPACE
        </span>
        <h2>រៀនដោយរីករាយ<br />រីកចម្រើនរាល់ថ្ងៃ។</h2>
        <p>
          ស្វែងរកសៀវភៅដែលអ្នកចូលចិត្ត
          ឬកក់បន្ទប់ស្ងប់ស្ងាត់សម្រាប់ការសិក្សា។
        </p>

        <div class="hero-actions">
          <button class="btn-primary" @click="$emit('navigate', 'catalog')">
            <BookOpen :size="20" />
            រកសៀវភៅ
            <ArrowRight :size="18" />
          </button>

          <button class="btn-secondary" @click="$emit('navigate', 'rooms')">
            <CalendarDays :size="20" />
            កក់បន្ទប់
          </button>
        </div>
      </div>

      <div class="hero-decoration" aria-hidden="true">
        <div class="decoration-circle">
          <BookOpen :size="92" stroke-width="1.3" />
        </div>
        <span class="deco-star star-one">✦</span>
        <span class="deco-star star-two">✿</span>
        <span class="deco-leaf">🌱</span>
      </div>
    </div>

    <!-- Only essential services -->
    <div class="section-heading">
      <div>
        <h2>សេវាកម្មរបស់អ្នក</h2>
        <p>ជ្រើសរើសអ្វីដែលអ្នកចង់ធ្វើថ្ងៃនេះ</p>
      </div>
    </div>

    <div class="service-grid">
      <button class="service-card" @click="$emit('navigate', 'catalog')">
        <span class="service-icon mint">
          <BookOpen :size="27" />
        </span>
        <span class="service-text">
          <strong>ស្វែងរកសៀវភៅ</strong>
          <small>ស្វែងរកសៀវភៅដែលអ្នកចូលចិត្ត</small>
        </span>
        <ArrowRight class="service-arrow" :size="19" />
      </button>

      <button class="service-card" @click="$emit('navigate', 'rooms')">
        <span class="service-icon lavender">
          <CalendarDays :size="27" />
        </span>
        <span class="service-text">
          <strong>កក់បន្ទប់សិក្សា</strong>
          <small>ជ្រើសរើសកន្លែងសិក្សារបស់អ្នក</small>
        </span>
        <ArrowRight class="service-arrow" :size="19" />
      </button>

      <button class="service-card" @click="$emit('navigate', 'loans')">
        <span class="service-icon peach">
          <LibraryBig :size="27" />
        </span>
        <span class="service-text">
          <strong>សៀវភៅរបស់ខ្ញុំ</strong>
          <small>ពិនិត្យសៀវភៅដែលកំពុងខ្ចី</small>
        </span>
        <ArrowRight class="service-arrow" :size="19" />
      </button>

      <button class="service-card" @click="$emit('navigate', 'cart')">
        <span class="service-icon sky">
          <ShoppingCart :size="27" />
        </span>
        <span class="service-text">
          <strong>កន្ត្រកសៀវភៅ</strong>
          <small>មើលសៀវភៅដែលអ្នកបានជ្រើស</small>
        </span>
        <ArrowRight class="service-arrow" :size="19" />
      </button>
    </div>

    <!-- Profile editor -->
    <div v-if="profileOpen" class="modal-backdrop" @click.self="closeProfile">
      <section
        class="profile-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
      >
        <header class="modal-header">
          <div>
            <span class="eyebrow">✨ MY ACCOUNT</span>
            <h2 id="profile-title">កែប្រែ Profile</h2>
            <p>កែប្រែព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នក</p>
          </div>
          <button
            class="close-button"
            type="button"
            aria-label="បិទ"
            @click="closeProfile"
          >×</button>
        </header>

        <form class="profile-form" @submit.prevent="saveProfile">
          <div class="avatar-editor">
            <div class="large-avatar">
              <img v-if="draft.avatar" :src="draft.avatar" alt="រូប Profile" />
              <span v-else>{{ draftInitials }}</span>
            </div>
            <div class="avatar-actions">
              <label class="upload-button">
                <Camera :size="17" />
                ប្តូររូបភាព
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  @change="changeAvatar"
                />
              </label>
              <button
                v-if="draft.avatar"
                class="remove-avatar"
                type="button"
                @click="draft.avatar = ''"
              >
                លុបរូបភាព
              </button>
              <small>PNG, JPG ឬ WEBP</small>
            </div>
          </div>

          <label class="form-field">
            ឈ្មោះពេញ
            <input v-model.trim="draft.fullName" required minlength="2" />
          </label>

          <label class="form-field">
            អ៊ីមែល
            <input v-model.trim="draft.email" type="email" required />
          </label>

          <label class="form-field">
            លេខទូរស័ព្ទ
            <input v-model.trim="draft.phone" type="tel" placeholder="0xx xxx xxx" />
          </label>

          <label class="form-field">
            លេខសម្គាល់និស្សិត
            <input :value="draft.studentId" disabled />
            <small>លេខសម្គាល់នេះមិនអាចកែពីទីនេះបានទេ។</small>
          </label>

          <p v-if="profileError" class="profile-error" role="alert">
            {{ profileError }}
          </p>

          <div class="modal-actions">
            <button type="button" class="cancel-button" @click="closeProfile">
              បោះបង់
            </button>
            <button type="submit" class="save-button">
              <Check :size="18" />
              រក្សាទុក
            </button>
          </div>
        </form>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, inject, reactive, ref, watch } from 'vue';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Camera,
  Check,
  LibraryBig,
  ShoppingCart,
  Sparkles,
  UserRound,
} from '@lucide/vue';

defineEmits(['navigate']);

const studentProfile = inject('studentProfile', null);
const locale = inject('locale', ref('km'));

const profileOpen = ref(false);
const profileError = ref('');

const profile = reactive({
  fullName: '',
  email: '',
  phone: '',
  studentId: '',
  avatar: '',
});

const draft = reactive({
  fullName: '',
  email: '',
  phone: '',
  studentId: '',
  avatar: '',
});

function syncProfile() {
  const saved = studentProfile?.value || {};

  Object.assign(profile, {
    fullName: saved.fullName || '',
    email: saved.email || '',
    phone: saved.phone || '',
    studentId: saved.studentId || '',
    avatar: saved.avatar || '',
  });
}

watch(
  () => studentProfile?.value,
  syncProfile,
  { immediate: true, deep: true },
);

const initials = computed(() => getInitials(profile.fullName));
const draftInitials = computed(() => getInitials(draft.fullName));

function getInitials(name) {
  return String(name || 'និស្សិត')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => [...part][0])
    .join('');
}

function openProfile() {
  Object.assign(draft, profile);
  profileError.value = '';
  profileOpen.value = true;
}

function closeProfile() {
  profileOpen.value = false;
  profileError.value = '';
}

function changeAvatar(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    profileError.value = 'សូមជ្រើសរើសរូបភាពទំហំមិនលើស 2MB។';
    event.target.value = '';
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    if (typeof reader.result === 'string') {
      draft.avatar = reader.result;
      profileError.value = '';
    }
  };

  reader.onerror = () => {
    profileError.value = 'មិនអាចបើករូបភាពនេះបានទេ។';
  };

  reader.readAsDataURL(file);
  event.target.value = '';
}

function saveProfile() {
  profileError.value = '';

  const updated = {
    ...profile,
    fullName: draft.fullName.trim(),
    email: draft.email.trim(),
    phone: draft.phone.trim(),
    avatar: draft.avatar,
  };

  try {
    const previous = JSON.parse(
      localStorage.getItem('leafline_student') || '{}',
    );

    const next = { ...previous, ...updated };

    // Ensure the profile is saved before updating the UI.
    localStorage.setItem('leafline_student', JSON.stringify(next));

    if (studentProfile?.value) {
      Object.assign(studentProfile.value, next);
    }

    Object.assign(profile, updated);
    closeProfile();
  } catch (error) {
    console.error('Unable to save profile:', error);
    profileError.value =
      'មិនអាចរក្សាទុកព័ត៌មានបានទេ។ សូមសាកល្បងរូបភាពតូចជាងនេះ។';
  }
}
</script>

<style scoped>
.user-home {
  --green: #27845b;
  --green-dark: #176444;
  --ink: #263b30;
  --muted: #7a897f;
  --line: #e6eee7;
  width: 100%;
  padding: 8px 0 28px;
  color: var(--ink);
  font-family: "Noto Sans Khmer", "Khmer OS Battambang", system-ui, sans-serif;
}

.user-home *,
.user-home *::before,
.user-home *::after {
  box-sizing: border-box;
}

.welcome-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 26px;
}

.eyebrow {
  display: inline-block;
  margin-bottom: 9px;
  color: var(--green);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 1.1px;
}

.welcome-header h1 {
  margin: 0;
  color: #213a2b;
  font-size: clamp(24px, 3vw, 35px);
  font-weight: 900;
  line-height: 1.6;
}

.welcome-header h1 em {
  color: var(--green);
  font-style: normal;
}

.welcome-header p,
.section-heading p,
.modal-header p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.9;
}

.profile-button {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 9px 13px 9px 9px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: #fff;
  color: var(--green-dark);
  cursor: pointer;
  transition: .2s ease;
}

.profile-button:hover {
  border-color: #b9ddc6;
  box-shadow: 0 8px 20px #245f4012;
  transform: translateY(-2px);
}

.profile-button img,
.avatar-placeholder {
  width: 43px;
  height: 43px;
  border-radius: 14px;
  object-fit: cover;
}

.avatar-placeholder {
  display: grid;
  place-items: center;
  background: #dcf5e5;
  color: #20784f;
  font-size: 17px;
  font-weight: 900;
}

.profile-button-text {
  display: grid;
  gap: 3px;
  text-align: left;
}

.profile-button-text strong {
  font-size: 12px;
}

.profile-button-text small {
  color: var(--muted);
  font-size: 11px;
}

.hero-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  min-height: 300px;
  padding: clamp(25px, 4vw, 44px);
  overflow: hidden;
  border: 1px solid #dcefe2;
  border-radius: 28px;
  background:
    radial-gradient(circle at 87% 20%, #d6f4d6 0, transparent 26%),
    linear-gradient(120deg, #f0fbf2, #f9fcf6 65%, #eaf8ed);
  box-shadow: 0 14px 36px #295c3e0b;
}

.hero-copy {
  position: relative;
  z-index: 2;
  max-width: 640px;
}

.hero-label {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  border: 1px solid #d7ecdc;
  border-radius: 999px;
  background: #fff;
  color: var(--green);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .6px;
}

.hero-copy h2 {
  margin: 18px 0 12px;
  color: #244a34;
  font-size: clamp(26px, 3vw, 39px);
  font-weight: 900;
  line-height: 1.65;
}

.hero-copy p {
  max-width: 470px;
  margin: 0;
  color: #66776b;
  font-size: 14px;
  line-height: 2;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 11px;
  margin-top: 24px;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 47px;
  padding: 0 18px;
  border-radius: 13px;
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: .2s ease;
}

.btn-primary {
  border: 1px solid var(--green);
  background: linear-gradient(135deg, #329b68, #19774e);
  color: #fff;
  box-shadow: 0 7px 16px #27845b28;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px #27845b35;
}

.btn-secondary {
  border: 1px solid #cfe5d4;
  background: #fff;
  color: var(--green-dark);
}

.btn-secondary:hover {
  border-color: #86bd98;
  background: #f5fcf6;
  transform: translateY(-2px);
}

.hero-decoration {
  position: relative;
  display: grid;
  flex: 0 0 230px;
  place-items: center;
  min-height: 220px;
}

.decoration-circle {
  display: grid;
  place-items: center;
  width: 190px;
  height: 190px;
  border: 1px solid #cde8d0;
  border-radius: 45% 55% 53% 47%;
  background: linear-gradient(145deg, #d7f3d2, #b8e6c0);
  color: #27845b;
  transform: rotate(-7deg);
}

.deco-star,
.deco-leaf {
  position: absolute;
}

.star-one {
  top: 15px;
  right: 25px;
  color: #e7b54c;
  font-size: 35px;
}

.star-two {
  bottom: 26px;
  left: 5px;
  color: #5da875;
  font-size: 30px;
}

.deco-leaf {
  right: 5px;
  bottom: 7px;
  font-size: 34px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 30px 0 16px;
}

.section-heading h2 {
  margin: 0;
  color: #2c4434;
  font-size: 19px;
  font-weight: 900;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px;
}

.service-card {
  display: flex;
  align-items: center;
  gap: 15px;
  min-width: 0;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 19px;
  background: #fff;
  text-align: left;
  cursor: pointer;
  transition: .2s ease;
}

.service-card:hover {
  border-color: #b8dcc3;
  box-shadow: 0 10px 25px #245f4010;
  transform: translateY(-3px);
}

.service-icon {
  display: grid;
  flex: 0 0 52px;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 16px;
}

.mint { background: #e0f7e8; color: #27845b; }
.lavender { background: #f0e8ff; color: #8960ce; }
.peach { background: #fff0e5; color: #d7824c; }
.sky { background: #e4f2ff; color: #4287c9; }

.service-text {
  display: grid;
  flex: 1;
  min-width: 0;
  gap: 6px;
}

.service-text strong {
  color: #304537;
  font-size: 14px;
  font-weight: 900;
  line-height: 1.7;
}

.service-text small {
  color: var(--muted);
  font-size: 11px;
  line-height: 1.8;
}

.service-arrow {
  flex: 0 0 auto;
  color: #81a88d;
  transition: transform .2s;
}

.service-card:hover .service-arrow {
  transform: translateX(4px);
}

/* Profile editor */
.modal-backdrop {
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: grid;
  place-items: center;
  overflow-y: auto;
  padding: 20px;
  background: #17291f88;
  backdrop-filter: blur(5px);
}

.profile-modal {
  width: min(100%, 510px);
  max-height: calc(100dvh - 40px);
  overflow-y: auto;
  padding: 26px;
  border: 1px solid #e5eee6;
  border-radius: 25px;
  background: #fff;
  box-shadow: 0 24px 80px #12271c35;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 22px;
}

.modal-header h2 {
  margin: 0;
  color: #263e2e;
  font-size: 23px;
  font-weight: 900;
}

.close-button {
  flex: 0 0 37px;
  width: 37px;
  height: 37px;
  border: 1px solid #e8eee8;
  border-radius: 12px;
  background: #f6faf6;
  color: #627268;
  font-size: 25px;
  cursor: pointer;
}

.avatar-editor {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 22px;
  padding: 16px;
  border: 1px solid #e6f0e7;
  border-radius: 18px;
  background: #f8fcf8;
}

.large-avatar {
  display: grid;
  flex: 0 0 76px;
  place-items: center;
  width: 76px;
  height: 76px;
  overflow: hidden;
  border: 3px solid #fff;
  border-radius: 23px;
  background: #ddf4e3;
  color: var(--green);
  font-size: 25px;
  font-weight: 900;
  box-shadow: 0 3px 12px #245f4015;
}

.large-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 9px;
}

.upload-button,
.remove-avatar {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 12px;
  border: 1px solid #d8e9dc;
  border-radius: 10px;
  background: #fff;
  color: var(--green-dark);
  font: inherit;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.upload-button input {
  display: none;
}

.remove-avatar {
  border-color: #f0dada;
  color: #b54d4d;
}

.avatar-actions small {
  width: 100%;
  color: var(--muted);
  font-size: 10px;
}

.profile-form {
  display: grid;
  gap: 15px;
}

.form-field {
  display: grid;
  gap: 7px;
  color: #3c5143;
  font-size: 12px;
  font-weight: 800;
}

.form-field input {
  width: 100%;
  min-height: 45px;
  padding: 10px 12px;
  border: 1px solid #dfe9e0;
  border-radius: 11px;
  background: #fbfdfb;
  color: #2b4032;
  font: inherit;
  font-size: 13px;
  outline: none;
}

.form-field input:focus {
  border-color: #68ad80;
  box-shadow: 0 0 0 3px #27845b17;
}

.form-field input:disabled {
  background: #f0f3f0;
  color: #89948c;
  cursor: not-allowed;
}

.form-field small {
  color: #89948c;
  font-size: 10px;
  font-weight: 500;
}

.profile-error {
  margin: 0;
  padding: 11px;
  border-radius: 10px;
  background: #fff0f0;
  color: #b33d3d;
  font-size: 12px;
  line-height: 1.7;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 5px;
}

.cancel-button,
.save-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 43px;
  padding: 0 17px;
  border-radius: 11px;
  font: inherit;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.cancel-button {
  border: 1px solid #e2e9e3;
  background: #fff;
  color: #68776d;
}

.save-button {
  border: 1px solid var(--green);
  background: var(--green);
  color: #fff;
}

.user-home button:focus-visible,
.user-home input:focus-visible {
  outline: 3px solid #9bd6ae;
  outline-offset: 3px;
}

@media (max-width: 760px) {
  .welcome-header {
    align-items: flex-start;
  }

  .profile-button {
    gap: 7px;
    padding: 7px;
  }

  .profile-button-text {
    display: none;
  }

  .hero-card {
    min-height: auto;
    padding: 27px 22px;
    border-radius: 23px;
  }

  .hero-decoration {
    flex-basis: 130px;
    min-height: 150px;
  }

  .decoration-circle {
    width: 125px;
    height: 125px;
  }

  .decoration-circle svg {
    width: 62px;
  }

  .hero-copy h2 {
    font-size: 25px;
  }

  .service-card {
    padding: 15px;
  }
}

@media (max-width: 520px) {
  .user-home {
    padding-top: 0;
  }

  .welcome-header {
    gap: 10px;
  }

  .welcome-header h1 {
    font-size: 23px;
  }

  .welcome-header p {
    max-width: 260px;
    font-size: 11px;
  }

  .hero-decoration {
    display: none;
  }

  .hero-copy h2 {
    font-size: 26px;
  }

  .hero-copy p {
    font-size: 12px;
  }

  .hero-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    min-height: 46px;
  }

  .service-grid {
    grid-template-columns: 1fr;
    gap: 11px;
  }

  .service-card {
    padding: 15px;
  }

  .profile-modal {
    padding: 20px;
    border-radius: 20px;
  }

  .avatar-editor {
    padding: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .user-home *,
  .user-home *::before,
  .user-home *::after {
    animation: none !important;
    transition: none !important;
  }
}
</style>
```