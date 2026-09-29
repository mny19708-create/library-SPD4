<template>
  <div class="rooms-page">
    <div class="view-heading">
      <div><p class="eyebrow">ជ្រើសរើសកន្លែងសិក្សា</p><h1>បន្ទប់សិក្សា</h1><p class="subheading">ជ្រើសរើសបន្ទប់ដែលសមនឹងការសិក្សារបស់អ្នក។</p></div>
      <div class="live-indicator"><i></i> {{ demoMode ? 'បង្ហាញបន្ទប់គំរូ' : 'ស្ថានភាពបន្ទប់បច្ចុប្បន្ន' }} <span>{{ demoMode ? 'សាកល្បង' : 'ធ្វើបច្ចុប្បន្នភាពថ្មីៗ' }}</span></div>
    </div>

    <section class="room-summary">
      <div><span class="summary-mark">▦</span><span><strong>មានបន្ទប់ទំនេរ {{ khmerNumber(availableCount) }}</strong><small>អគារខាងកើត · ៣ ជាន់</small></span></div>
      <div class="summary-side"><span>រយៈពេលកក់</span><strong>មិនលើស ២ ម៉ោង</strong></div>
    </section>

    <div v-if="notice" class="notice" :class="{ 'notice-error': notice.kind === 'error' }"><span>{{ notice.kind === 'error' ? '!' : '✓' }}</span>{{ notice.text }}<button aria-label="Dismiss message" @click="notice = null">×</button></div>

    <section v-if="booking" class="booking-banner">
      <div class="booking-symbol">⌁</div>
      <div class="booking-message"><strong>{{ booking.checkedIn ? 'បានចូលប្រើបន្ទប់ហើយ' : `អ្នកបានកក់បន្ទប់ ${roomName(booking.roomId)}` }}</strong><span>{{ booking.checkedIn ? 'សូមសិក្សាឲ្យបានល្អ។' : 'សូមបញ្ជាក់វត្តមានដោយ QR ក្នុងរយៈពេល ១៥ នាទី។' }}</span></div>
      <div v-if="!booking.checkedIn" class="checkin-timer"><small>ពេលវេលាបញ្ជាក់វត្តមាន</small><strong>{{ remainingLabel }}</strong></div>
      <button v-if="!booking.checkedIn" class="checkin-button" @click="checkinOpen = true">បញ្ជាក់វត្តមាន <span>→</span></button>
      <button class="dismiss-booking" aria-label="បោះបង់ការកក់" title="បោះបង់ការកក់" @click="releaseBooking()">×</button>
    </section>

    <div class="map-toolbar"><div class="floor-tabs"><button v-for="floor in floors" :key="floor.id" :class="{ selected: currentFloor === floor.id }" @click="currentFloor = floor.id">{{ floor.label }}</button></div><div class="map-legend"><span><i class="available-key"></i>ទំនេរ</span><span><i class="occupied-key"></i>កំពុងប្រើ</span><span><i class="selected-key"></i>បានជ្រើស</span></div></div>

    <section class="floor-layout" aria-label="Interactive study room floor plan">
      <div class="layout-label"><span>{{ floorLabel(currentFloor) }} · អគារខាងកើត</span><span>ចុចលើបន្ទប់ទំនេរ ដើម្បីជ្រើសរើស</span></div>
      <div class="room-grid">
        <button v-for="room in visibleRooms" :key="room.id" class="room-tile" :class="{ occupied: !isAvailable(room), chosen: selectedRoom?.id === room.id, 'my-booking': booking?.roomId === room.id }" :disabled="!isAvailable(room) || !!booking" @click="selectedRoom = room">
          <span class="room-number">{{ room.name }}</span><span class="room-type">{{ roomTypeLabel(room.type) }}</span><span class="room-capacity">♙ {{ khmerNumber(room.capacity) }} កៅអី</span><span class="room-state">{{ roomStatusText(room) }}</span>
        </button>
        <div class="map-corridor"><span>ផ្លូវដើរកណ្ដាល</span></div>
        <button v-for="room in visibleRoomsSecondary" :key="room.id" class="room-tile secondary-room" :class="{ occupied: !isAvailable(room), chosen: selectedRoom?.id === room.id, 'my-booking': booking?.roomId === room.id }" :disabled="!isAvailable(room) || !!booking" @click="selectedRoom = room">
          <span class="room-number">{{ room.name }}</span><span class="room-type">{{ roomTypeLabel(room.type) }}</span><span class="room-capacity">♙ {{ khmerNumber(room.capacity) }} កៅអី</span><span class="room-state">{{ roomStatusText(room) }}</span>
        </button>
      </div>
      <div class="floor-footer"><span>↖ ជណ្ដើរ</span><span>ជណ្ដើរយន្ត ↗</span><span>កន្លែងអង្គុយរួម · ២៤ កៅអី</span></div>
    </section>

    <section class="selection-row">
      <div><span class="selection-icon">⌂</span><span><strong>{{ selectedRoom ? `${selectedRoom.name} · ${roomTypeLabel(selectedRoom.type)}` : 'សូមជ្រើសរើសបន្ទប់' }}</strong><small>{{ selectedRoom ? `${khmerNumber(selectedRoom.capacity)} កៅអី · ${floorLabel(selectedRoom.floor)} · ឥតគិតថ្លៃ` : 'ព័ត៌មានបន្ទប់នឹងបង្ហាញនៅទីនេះ។' }}</small></span></div>
      <button class="reserve-button" :disabled="!selectedRoom || !!booking" @click="bookRoom">កក់បន្ទប់នេះ <span>→</span></button>
    </section>
    <p class="policy-note"><span>ⓘ</span> បើមិនបញ្ជាក់វត្តមានក្នុងរយៈពេល ១៥ នាទី ការកក់នឹងត្រូវបានលុបចោល។</p>

    <div v-if="checkinOpen" class="modal-backdrop" @click.self="checkinOpen = false"><section class="checkin-modal" role="dialog" aria-modal="true" aria-labelledby="checkin-title"><button class="modal-close" aria-label="បិទ" @click="checkinOpen = false">×</button><span class="modal-qr">▦</span><p class="eyebrow">បន្ទប់ {{ roomName(booking?.roomId) }}</p><h2 id="checkin-title">បញ្ជាក់វត្តមាន</h2><p class="modal-copy">ស្កេន QR នៅមុខបន្ទប់ ឬបញ្ចូលលេខកូដ ដើម្បីបញ្ជាក់ថាអ្នកបានមកដល់។</p><p v-if="booking?.code?.startsWith('ROOM-')" class="demo-code">លេខកូដសាកល្បង៖ <strong>{{ booking.code }}</strong></p><label for="room-code">លេខកូដបន្ទប់</label><input id="room-code" v-model="verificationCode" type="text" placeholder="បញ្ចូលលេខកូដ QR" autocomplete="off" @keyup.enter="verifyCheckin"><p v-if="codeError" class="code-error">{{ codeError }}</p><button class="verify-button" @click="verifyCheckin">បញ្ជាក់វត្តមាន <span>→</span></button></section></div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import api, { apiConfigured } from '@/services/api';

const floors = [
  { id: 'Level 1', label: 'ជាន់ទី ១' },
  { id: 'Level 2', label: 'ជាន់ទី ២' },
  { id: 'Level 3', label: 'ជាន់ទី ៣' },
];
const currentFloor = ref('Level 2');
const rooms = ref([
  { id: '1A', name: '1A', floor: 'Level 1', type: 'Quiet study', capacity: 2, status: 'available' },
  { id: '1B', name: '1B', floor: 'Level 1', type: 'Group room', capacity: 4, status: 'occupied' },
  { id: '1C', name: '1C', floor: 'Level 1', type: 'Quiet study', capacity: 2, status: 'available' },
  { id: '1D', name: '1D', floor: 'Level 1', type: 'Project room', capacity: 6, status: 'available' },
  { id: '2A', name: '2A', floor: 'Level 2', type: 'Quiet study', capacity: 2, status: 'available' },
  { id: '2B', name: '2B', floor: 'Level 2', type: 'Quiet study', capacity: 2, status: 'occupied' },
  { id: '2C', name: '2C', floor: 'Level 2', type: 'Group room', capacity: 4, status: 'available' },
  { id: '2D', name: '2D', floor: 'Level 2', type: 'Project room', capacity: 6, status: 'available' },
  { id: '3A', name: '3A', floor: 'Level 3', type: 'Quiet study', capacity: 2, status: 'available' },
  { id: '3B', name: '3B', floor: 'Level 3', type: 'Group room', capacity: 4, status: 'available' },
  { id: '3C', name: '3C', floor: 'Level 3', type: 'Quiet study', capacity: 2, status: 'occupied' },
  { id: '3D', name: '3D', floor: 'Level 3', type: 'Project room', capacity: 6, status: 'available' },
]);
const selectedRoom = ref(null);
const booking = ref(null);
const now = ref(Date.now());
const notice = ref(null);
const checkinOpen = ref(false);
const verificationCode = ref('');
const codeError = ref('');
const availableCount = computed(() => rooms.value.filter((room) => isAvailable(room) && room.id !== booking.value?.roomId).length);
const visibleRooms = computed(() => rooms.value.filter((room) => room.floor === currentFloor.value).slice(0, 2));
const visibleRoomsSecondary = computed(() => rooms.value.filter((room) => room.floor === currentFloor.value).slice(2));
const remainingMs = computed(() => booking.value ? Math.max(0, 15 * 60 * 1000 - (now.value - booking.value.bookedAt)) : 0);
const remainingLabel = computed(() => `${String(Math.floor(remainingMs.value / 60000)).padStart(2, '0')}:${String(Math.floor((remainingMs.value % 60000) / 1000)).padStart(2, '0')}`);
let ticker;
let refreshTicker;

function isAvailable(room) { return String(room.status).toLowerCase() === 'available'; }
const demoMode = ref(true);
function floorLabel(floor) {
  const level = String(floor ?? '').match(/\d+/)?.[0] ?? '២';
  return `ជាន់ទី ${khmerNumber(level)}`;
}
function khmerNumber(value) { return String(value).replace(/\d/g, (digit) => '០១២៣៤៥៦៧៨៩'[Number(digit)]); }
function roomTypeLabel(type) {
  const labels = { 'Quiet study': 'បន្ទប់ស្ងប់ស្ងាត់', 'Group room': 'បន្ទប់ក្រុម', 'Project room': 'បន្ទប់គម្រោង' };
  return labels[type] ?? type ?? 'បន្ទប់សិក្សា';
}
function roomStatusText(room) {
  if (booking.value?.roomId === room.id) return booking.value.checkedIn ? 'បានចូលប្រើ' : 'បានកក់';
  return isAvailable(room) ? 'ទំនេរ' : 'កំពុងប្រើ';
}
function roomName(id) { return rooms.value.find((room) => room.id === id)?.name ?? id; }
function saveBooking() { localStorage.setItem('leafline_room_booking', JSON.stringify(booking.value)); }
function releaseBooking(message = 'Your unconfirmed booking was released after 15 minutes.') {
  if (booking.value) rooms.value = rooms.value.map((room) => room.id === booking.value.roomId ? { ...room, status: 'available' } : room);
  booking.value = null;
  selectedRoom.value = null;
  localStorage.removeItem('leafline_room_booking');
  notice.value = { kind: 'error', text: message === 'Your unconfirmed booking was released after 15 minutes.' ? 'បានលុបការកក់ ព្រោះមិនបានបញ្ជាក់វត្តមានក្នុងរយៈពេល ១៥ នាទី។' : message };
}

async function loadRooms() {
  if (!apiConfigured) return;
  try {
    const { data } = await api.get('/rooms');
    if (Array.isArray(data) && data.length) {
      demoMode.value = false;
      rooms.value = data.map((room, index) => ({ ...room, id: String(room.id ?? room.name ?? index), name: room.name ?? `បន្ទប់ ${room.id}`, floor: room.floor ?? 'Level 2', type: room.type ?? 'បន្ទប់សិក្សា', capacity: room.capacity ?? 2, status: room.status ?? 'available' }));
    }
  } catch { /* The local floor plan remains available while the API is offline. */ }
}

async function bookRoom() {
  if (!selectedRoom.value || booking.value) return;
  const room = selectedRoom.value;
  let serverBooking = {};
  if (apiConfigured) {
    try {
      const response = await api.post('/rooms/book', { room_id: room.id });
      serverBooking = response.data ?? {};
    } catch { /* Keep the booking flow usable in demo mode. */ }
  }
  booking.value = { roomId: room.id, bookedAt: Date.now(), code: serverBooking.qr_code ?? `ROOM-${room.id}`, checkedIn: false };
  rooms.value = rooms.value.map((item) => item.id === room.id ? { ...item, status: 'reserved', statusText: 'Reserved for you' } : item);
  saveBooking();
  selectedRoom.value = null;
  notice.value = { kind: 'success', text: 'បានកក់បន្ទប់ហើយ។ សូមបញ្ជាក់វត្តមានដោយ QR ក្នុងរយៈពេល ១៥ នាទី។' };
}

async function verifyCheckin() {
  codeError.value = '';
  if (!booking.value || verificationCode.value.trim().toUpperCase() !== booking.value.code.toUpperCase()) {
    codeError.value = 'លេខកូដមិនត្រឹមត្រូវទេ។ សូមពិនិត្យ QR នៅមុខបន្ទប់ ហើយព្យាយាមម្ដងទៀត។';
    return;
  }
  if (apiConfigured) {
    try { await api.post('/rooms/check-in', { room_id: booking.value.roomId, verification_code: verificationCode.value.trim() }); } catch { /* Verification is stored locally in demo mode. */ }
  }
  booking.value.checkedIn = true;
  saveBooking();
  checkinOpen.value = false;
  verificationCode.value = '';
  notice.value = { kind: 'success', text: `បានបញ្ជាក់វត្តមានសម្រាប់បន្ទប់ ${roomName(booking.value.roomId)}។ សូមសិក្សាឲ្យបានល្អ!` };
}

onMounted(() => {
  loadRooms();
  try {
    const saved = JSON.parse(localStorage.getItem('leafline_room_booking') || 'null');
    if (saved?.checkedIn || saved?.bookedAt && Date.now() - saved.bookedAt < 15 * 60 * 1000) booking.value = saved;
    else if (saved) localStorage.removeItem('leafline_room_booking');
  } catch { localStorage.removeItem('leafline_room_booking'); }
  ticker = window.setInterval(() => {
    now.value = Date.now();
    if (booking.value && !booking.value.checkedIn && remainingMs.value <= 0) releaseBooking();
  }, 1000);
  refreshTicker = window.setInterval(() => { if (!demoMode.value) loadRooms(); }, 30000);
});
onBeforeUnmount(() => { window.clearInterval(ticker); window.clearInterval(refreshTicker); });
</script>

<style scoped>
.rooms-page { color: #26362c; }
.view-heading { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 22px; }
.eyebrow { margin: 0 0 6px; color: #528469; font-size: 9px; font-weight: 700; letter-spacing: 1.1px; }
h1 { margin: 0; color: #21392d; font-size: 26px; font-weight: 600; letter-spacing: 0; }
.subheading { margin: 5px 0 0; color: #87918a; font-size: 11px; }
.live-indicator { display: flex; align-items: center; gap: 7px; color: #4b8262; font-size: 10px; white-space: nowrap; }
.live-indicator i { width: 7px; height: 7px; border-radius: 50%; background: #50a571; box-shadow: 0 0 0 3px #e4f2e8; }
.live-indicator span { margin-left: 4px; color: #98a199; font-size: 9px; }
.room-summary { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border: 1px solid #e5ece5; border-radius: 6px; background: #fff; }
.room-summary > div:first-child { display: flex; align-items: center; gap: 11px; }
.summary-mark { display: grid; width: 34px; height: 34px; place-items: center; border-radius: 5px; background: #e8f3e9; color: #36805b; font-size: 19px; }
.room-summary strong, .room-summary small { display: block; }
.room-summary strong { color: #35463a; font-size: 11px; }
.room-summary small { margin-top: 3px; color: #939b94; font-size: 9px; }
.summary-side { display: grid; gap: 4px; text-align: right; }
.summary-side span { color: #9aa29c; font-size: 8px; font-weight: 700; letter-spacing: .7px; }
.summary-side strong { color: #526357; font-size: 10px; }
.notice { display: flex; align-items: center; gap: 8px; margin-top: 12px; padding: 9px 11px; border: 1px solid #d8eadc; border-radius: 5px; background: #eff7ef; color: #417553; font-size: 10px; }
.notice > span { font-weight: 700; }
.notice button { margin-left: auto; border: 0; background: transparent; color: inherit; cursor: pointer; font-size: 16px; }
.notice-error { border-color: #f0dcd2; background: #fff4ee; color: #a66448; }
.booking-banner { position: relative; display: flex; align-items: center; gap: 11px; margin-top: 12px; padding: 12px 42px 12px 13px; border: 1px solid #cfe4d3; border-radius: 6px; background: #eef7ef; }
.booking-symbol { display: grid; width: 31px; height: 31px; flex: 0 0 auto; place-items: center; border-radius: 50%; background: #dceede; color: #3b8258; font-size: 18px; }
.booking-message { display: grid; gap: 3px; }
.booking-message strong { color: #3a6647; font-size: 10px; }
.booking-message span { color: #7d9380; font-size: 9px; }
.checkin-timer { display: grid; gap: 2px; margin-left: auto; text-align: right; }
.checkin-timer small { color: #89978b; font-size: 7px; font-weight: 700; letter-spacing: .5px; }
.checkin-timer strong { color: #3c6f4d; font-size: 14px; font-variant-numeric: tabular-nums; }
.checkin-button, .reserve-button, .verify-button { display: inline-flex; align-items: center; gap: 8px; border: 0; border-radius: 4px; background: #287755; color: white; cursor: pointer; font-size: 9px; font-weight: 600; }
.checkin-button { min-height: 31px; margin-left: 13px; padding: 0 10px; }
.checkin-button:hover, .reserve-button:hover, .verify-button:hover { background: #1c6244; }
.dismiss-booking { position: absolute; top: 7px; right: 9px; border: 0; background: transparent; color: #79927e; cursor: pointer; font-size: 18px; }
.map-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 20px 0 11px; }
.floor-tabs { display: flex; gap: 4px; padding: 3px; border-radius: 5px; background: #edf0ec; }
.floor-tabs button { padding: 7px 11px; border: 0; border-radius: 4px; background: transparent; color: #778279; cursor: pointer; font-size: 9px; }
.floor-tabs button.selected { background: white; color: #3c7251; box-shadow: 0 1px 3px #24362912; font-weight: 700; }
.map-legend { display: flex; align-items: center; gap: 12px; color: #858f87; font-size: 8px; }
.map-legend span { display: inline-flex; align-items: center; gap: 5px; }
.map-legend i { width: 8px; height: 8px; border: 1px solid #d8e7da; border-radius: 2px; background: #e9f4e9; }
.map-legend .occupied-key { border-color: #e8e9e6; background: #eff0ed; }
.map-legend .selected-key { border-color: #33805a; background: #33805a; }
.floor-layout { padding: 15px; border: 1px solid #e4e9e3; border-radius: 6px; background: #fff; }
.layout-label { display: flex; justify-content: space-between; color: #8b958d; font-size: 8px; }
.layout-label span:first-child { color: #67776c; font-weight: 700; letter-spacing: .6px; }
.room-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-template-rows: 118px 30px 118px; gap: 9px; margin-top: 12px; }
.room-tile { position: relative; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; padding: 11px; border: 1px solid #d9e8dc; border-radius: 5px; background: #edf6ee; color: #345b40; cursor: pointer; text-align: left; transition: background .15s, border .15s, transform .15s; }
.room-tile:not(:disabled):hover { transform: translateY(-2px); border-color: #65a57b; background: #e5f2e7; }
.room-tile.occupied { border-color: #e8eae6; background: #f1f2ef; color: #818982; cursor: not-allowed; }
.room-tile.chosen, .room-tile.my-booking { border: 2px solid #37845b; background: #e5f2e7; }
.room-number { font-size: 14px; font-weight: 700; }
.room-type { margin-top: 3px; font-size: 8px; }
.room-capacity { margin-top: 9px; color: #86958a; font-size: 8px; }
.room-state { position: absolute; top: 8px; right: 8px; color: #5d966c; font-size: 7px; }
.occupied .room-state { color: #9b8075; }
.map-corridor { grid-column: 1 / -1; display: grid; place-items: center; border-block: 1px dashed #dfe4de; color: #a3aaa4; font-size: 7px; font-weight: 700; letter-spacing: 1px; }
.secondary-room { grid-row: 3; }
.floor-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 11px; color: #929b94; font-size: 8px; }
.floor-footer span:last-child { color: #748078; }
.selection-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 12px; padding: 12px 14px; border: 1px solid #e6eae5; border-radius: 5px; background: #fff; }
.selection-row > div { display: flex; align-items: center; gap: 10px; min-width: 0; }
.selection-icon { display: grid; width: 30px; height: 30px; flex: 0 0 auto; place-items: center; border-radius: 50%; background: #f7f0e6; color: #ae8254; }
.selection-row strong, .selection-row small { display: block; }
.selection-row strong { color: #48564b; font-size: 10px; }
.selection-row small { margin-top: 3px; color: #929b94; font-size: 8px; }
.reserve-button { min-height: 34px; flex: 0 0 auto; padding: 0 12px; }
.reserve-button:disabled { background: #c7d5ca; cursor: not-allowed; }
.policy-note { display: flex; align-items: center; gap: 6px; margin: 11px 0 0; color: #929b94; font-size: 8px; }
.policy-note span { color: #74967b; font-size: 12px; }
.modal-backdrop { position: fixed; z-index: 10; inset: 0; display: grid; place-items: center; padding: 18px; background: #17291f80; }
.checkin-modal { position: relative; width: min(370px, 100%); padding: 25px; border-radius: 8px; background: white; box-shadow: 0 18px 70px #14271e40; }
.modal-close { position: absolute; top: 11px; right: 13px; border: 0; background: transparent; color: #859088; cursor: pointer; font-size: 20px; }
.modal-qr { display: grid; width: 40px; height: 40px; margin-bottom: 15px; place-items: center; border-radius: 6px; background: #e8f2e9; color: #3e815a; font-size: 23px; }
.checkin-modal h2 { margin: 0; color: #253b2d; font-size: 20px; }
.modal-copy { margin: 7px 0 17px; color: #859087; font-size: 10px; line-height: 1.6; }
.demo-code { margin: -8px 0 13px; padding: 8px; border-radius: 4px; background: #f4f7f1; color: #687864; font-size: 9px; }
.demo-code strong { color: #39754f; font-variant-numeric: tabular-nums; }
.checkin-modal label { display: block; margin-bottom: 6px; color: #5f6e63; font-size: 9px; font-weight: 700; }
.checkin-modal input { width: 100%; height: 38px; padding: 0 10px; border: 1px solid #dde5dd; border-radius: 4px; outline-color: #53936b; font-size: 11px; }
.code-error { margin: 7px 0 0; color: #b25b45; font-size: 9px; }
.verify-button { width: 100%; height: 38px; justify-content: center; margin-top: 13px; }
@media (max-width: 650px) { .view-heading { align-items: flex-start; } .live-indicator { flex-direction: column; align-items: flex-end; gap: 4px; font-size: 8px; }.live-indicator span { margin: 0; } .room-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(2, 105px) 25px repeat(2, 105px); } .map-corridor { grid-row: 3; } .secondary-room { grid-row: auto; } .map-corridor { grid-column: 1 / -1; } .booking-banner { flex-wrap: wrap; } .checkin-button { margin-left: auto; } }
@media (max-width: 430px) { .room-summary { padding: 11px; } .summary-side { display: none; } .map-toolbar { align-items: flex-start; flex-direction: column; } .map-legend { gap: 10px; } .floor-tabs { width: 100%; justify-content: space-between; } .floor-tabs button { flex: 1; padding-inline: 3px; } .floor-layout { padding: 10px; } .room-grid { gap: 6px; } .selection-row { align-items: flex-start; flex-direction: column; } .reserve-button { width: 100%; justify-content: center; } .layout-label span:last-child { max-width: 130px; text-align: right; } }
</style>
