<template>
  <section class="welcome-row">
    <div class="welcome-copy">
      <p class="eyebrow">{{ today }} <span>·</span> សួស្តី {{ greetingName }}</p>
      <h1>រកកន្លែងស្ងប់ស្ងាត់ <em>បង្កើតគំនិតថ្មី។</em></h1>
      <p class="welcome-subtitle">រៀបចំថ្ងៃសិក្សារបស់អ្នក ឲ្យកាន់តែងាយស្រួល។</p>
      <div class="welcome-actions">
        <button class="primary-action" @click="$emit('navigate', 'rooms')"><span>▦</span> កក់បន្ទប់សិក្សា</button>
        <button class="text-action" @click="$emit('navigate', 'catalog')">រកមើលសៀវភៅ <span>→</span></button>
      </div>
    </div>
    <div class="reading-note" aria-label="ពាក្យលើកទឹកចិត្តសម្រាប់ការសិក្សា">
      <span class="note-mark">“</span>
      <p>កន្លែងស្ងប់ស្ងាត់ អាចធ្វើឲ្យការសិក្សាពេញមួយថ្ងៃកាន់តែមានន័យ។</p>
      <span class="note-caption">ថ្ងៃដ៏ល្អសម្រាប់ការរៀន</span>
      <span class="note-leaf">✳</span>
    </div>
  </section>
</template>

<script setup>
import { computed, inject } from 'vue';

defineEmits(['navigate']);
const studentProfile = inject('studentProfile', null);
const weekdayNames = ['ថ្ងៃអាទិត្យ', 'ថ្ងៃចន្ទ', 'ថ្ងៃអង្គារ', 'ថ្ងៃពុធ', 'ថ្ងៃព្រហស្បតិ៍', 'ថ្ងៃសុក្រ', 'ថ្ងៃសៅរ៍'];
const monthNames = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
const greetingName = computed(() => studentProfile?.value?.fullName ?? 'និស្សិត');
const today = computed(() => {
  const currentDate = new Date();
  const khmerNumber = (value) => String(value).replace(/\d/g, (digit) => '០១២៣៤៥៦៧៨៩'[Number(digit)]);
  return `${weekdayNames[currentDate.getDay()]} ទី${khmerNumber(currentDate.getDate())} ខែ${monthNames[currentDate.getMonth()]} ឆ្នាំ${khmerNumber(currentDate.getFullYear())}`;
});
</script>

<style scoped>
.welcome-row { display: grid; grid-template-columns: minmax(0, 1fr) 270px; align-items: center; gap: 28px; margin-bottom: 28px; }
.eyebrow { margin: 0 0 12px; color: #66746b; font-size: 13px; font-weight: 600; }
.eyebrow span { padding: 0 4px; color: #dc8a68; }
h1 { margin: 0; color: #233b2f; font-size: 32px; font-weight: 600; line-height: 1.5; letter-spacing: 0; }
h1 em { color: #36835e; font-style: normal; font-weight: 600; }
.welcome-subtitle { margin: 9px 0 18px; color: #65736a; font-size: 15px; }
.welcome-actions { display: flex; align-items: center; gap: 18px; }
.primary-action { display: inline-flex; min-height: 44px; align-items: center; gap: 8px; padding: 0 14px; border: 0; border-radius: 5px; background: #267754; color: white; cursor: pointer; font-size: 14px; font-weight: 600; }
.primary-action:hover { background: #1c6244; }
.primary-action span { font-size: 15px; }
.text-action { padding: 8px 0; border: 0; background: transparent; color: #356c4e; cursor: pointer; font-size: 14px; font-weight: 600; }
.text-action span { padding-left: 4px; }
.reading-note { position: relative; min-height: 150px; overflow: hidden; padding: 17px 18px; border-radius: 7px; background: #f2e6d5; color: #675849; }
.note-mark { display: block; height: 25px; color: #d47e5c; font-family: Georgia, serif; font-size: 44px; line-height: 1; }
.reading-note p { max-width: 230px; margin: 7px 0 12px; font-size: 14px; line-height: 1.7; }
.note-caption { color: #755e4b; font-size: 11px; font-weight: 700; }
.note-leaf { position: absolute; right: 15px; bottom: 5px; color: #c8a17e; font-size: 45px; opacity: .55; transform: rotate(22deg); }
@media (max-width: 740px) { .welcome-row { grid-template-columns: 1fr; gap: 17px; } .reading-note { min-height: 124px; } h1 { font-size: 25px; } }
</style>
