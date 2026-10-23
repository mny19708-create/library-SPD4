<template>
  <main class="rooms-page" v-translate="locale" :data-locale="locale">
    <header class="view-heading">
      <div>
        <p class="eyebrow"><House :size="21" /> ប្រព័ន្ធកក់បន្ទប់សិក្សា</p>
        <h1>ជ្រើសរើសបន្ទប់សិក្សា</h1>
        <p class="subheading">ស្វែងរក និងកក់បន្ទប់ដែលសាកសមនឹងតម្រូវការរបស់អ្នកយ៉ាងងាយស្រួល។</p>
      </div>
      <div class="live-indicator">
        <span class="live-dot"></span>
        <span>{{ demoMode ? 'បង្ហាញបន្ទប់គំរូ' : 'ស្ថានភាពបច្ចុប្បន្ន' }}</span>
        <small>{{ demoMode ? 'សាកល្បង' : 'អនឡាញ' }}</small>
      </div>
    </header>

    <Transition name="welcome-pop">
      <section v-if="welcomeVisible" class="welcome-bot-card" aria-label="សារស្វាគមន៍ពី Bot">
        <div class="welcome-bot-character" aria-hidden="true">
          <span class="welcome-bot-spark spark-one">✦</span>
          <span class="welcome-bot-face">🤖</span>
          <span class="welcome-bot-spark spark-two">✧</span>
        </div>
        <div class="welcome-bot-copy">
          <span class="welcome-bot-kicker"><span class="welcome-online-dot"></span> LIBRARY ASSISTANT</span>
          <h2>សួស្តី! សូមស្វាគមន៍មកកាន់បណ្ណាល័យ 💚</h2>
          <p>ខ្ញុំជា Bot ជំនួយការ។ ខ្ញុំនឹងចង្អុលបង្ហាញអ្នកមួយជំហានម្ដងៗ ដើម្បីជ្រើសរើសបន្ទប់ និងកក់ម៉ោងដែលអ្នកត្រូវការ។</p>
          <div class="welcome-bot-actions">
            <button class="welcome-start-button" @click="startBotGuide"><ArrowDown :size="18" /> ចាប់ផ្ដើមណែនាំខ្ញុំ</button>
            <button class="welcome-dismiss-button" @click="welcomeVisible = false">មើលបន្ទប់សិន</button>
          </div>
        </div>
        <button class="welcome-close" aria-label="បិទសារស្វាគមន៍" @click="welcomeVisible = false"><X :size="18" /></button>
        <div class="welcome-arrow" aria-hidden="true"><span>↓</span><small>ចាប់ផ្ដើមនៅទីនេះ</small></div>
      </section>
    </Transition>

    <section class="room-summary">
      <div class="summary-info">
        <span class="summary-mark"><DoorOpen :size="28" /></span>
        <div>
          <strong>មានបន្ទប់ទំនេរ {{ khmerNumber(availableCount) }}</strong>
          <small>អគារខាងកើត · ៣ ជាន់</small>
        </div>
      </div>
      <label class="search-box">
        <Search :size="21" class="search-icon" />
        <input v-model="searchQuery" type="search" placeholder="ស្វែងរកលេខបន្ទប់..." autocomplete="off" />
        <button v-if="searchQuery" class="clear-search" aria-label="លុបពាក្យស្វែងរក" @click="searchQuery = ''"><X :size="17" /></button>
      </label>
      <div class="summary-side">
        <span>រយៈពេលកក់</span>
        <strong><Clock3 :size="17" /> កំណត់ម៉ោងដោយខ្លួនឯង</strong>
      </div>
    </section>

    <div v-if="notice" class="notice" :class="{ 'notice-error': notice.kind === 'error' }" role="status" aria-live="polite">
      <component :is="notice.kind === 'error' ? CircleAlert : CheckCircle2" :size="22" />
      <p>{{ notice.text }}</p>
      <button aria-label="បិទសារជូនដំណឹង" @click="notice = null"><X :size="20" /></button>
    </div>

    <section v-if="booking" class="booking-banner">
      <span class="booking-symbol"><CalendarCheck :size="26" /></span>
      <div class="booking-message">
        <strong>{{ booking.checkedIn ? 'បានចូលប្រើបន្ទប់ហើយ' : `អ្នកបានកក់បន្ទប់ ${roomName(booking.roomId)}` }}</strong>
        <span>{{ booking.checkedIn ? 'សូមសិក្សាឲ្យបានល្អ។' : 'សូមបញ្ជាក់វត្តមានដោយ QR ក្នុងរយៈពេល ១៥ នាទី។' }}</span>
      </div>
      <div v-if="!booking.checkedIn" class="checkin-timer">
        <small>ពេលវេលាបញ្ជាក់វត្តមាន</small>
        <strong>{{ remainingLabel }}</strong>
      </div>
      <button v-if="!booking.checkedIn" class="checkin-button" @click="openCheckinModal">
        <QrCode :size="19" /> បញ្ជាក់វត្តមាន <ArrowRight :size="18" />
      </button>
      <button v-else class="leave-room-button" :disabled="leavingRoom" @click="leaveRoom">
        <LogOut :size="18" /> {{ leavingRoom ? 'កំពុងចេញ...' : 'ចេញពីបន្ទប់' }}
      </button>
      <button v-if="!booking.checkedIn" class="dismiss-booking" aria-label="បោះបង់ការកក់" title="បោះបង់ការកក់" @click="releaseBooking('អ្នកបានបោះបង់ការកក់បន្ទប់។')"><X :size="21" /></button>
    </section>

    <div class="map-toolbar">
      <div class="floor-tabs" aria-label="ជ្រើសរើសជាន់">
        <button v-for="floor in floors" :key="floor.id" :class="{ selected: currentFloor === floor.id }" @click="currentFloor = floor.id">
          <Building2 :size="18" /> {{ floor.label }}
        </button>
      </div>
      <div class="type-filters" aria-label="តម្រងប្រភេទបន្ទប់">
        <button v-for="type in roomTypes" :key="type.value" :class="{ selected: selectedType === type.value }" @click="selectedType = type.value">
          {{ type.label }}
        </button>
      </div>
    </div>

    <section class="floor-layout" aria-label="ប្លង់បន្ទប់សិក្សា">
      <div class="layout-label">
        <strong><MapPin :size="18" /> {{ floorLabel(currentFloor) }} · អគារខាងកើត</strong>
        <span>ចុចលើកាតបន្ទប់ដើម្បីមើលព័ត៌មានលម្អិត</span>
      </div>

      <div v-if="filteredVisibleRooms.length" class="room-grid">
        <article
          v-for="room in filteredVisibleRooms"
          :key="room.id"
          class="room-card-item"
          :class="{ occupied: !isAvailable(room), chosen: selectedRoom?.id === room.id, 'my-booking': booking?.roomId === room.id }"
          @click="handleRoomClick(room)"
        >
          <div class="room-card-header">
            <div class="room-title-group">
              <span class="room-avatar"><House :size="25" /></span>
              <span class="room-number">បន្ទប់ <span data-no-translate>{{ room.name }}</span></span>
            </div>
            <span class="room-state-badge" :class="isAvailable(room) ? 'badge-available' : 'badge-occupied'">
              <span class="status-dot"></span>{{ roomStatusText(room) }}
            </span>
          </div>

          <div class="room-card-body">
            <p class="room-type-text">
              <component :is="roomIconComponent(room.type)" :size="19" />
              {{ roomTypeLabel(room.type) }}
            </p>
            <p class="room-capacity-text"><Armchair :size="18" /> ចំនួនកៅអី៖ <strong>{{ khmerNumber(room.capacity) }} កៅអី</strong></p>
          </div>

          <div class="room-card-footer">
            <button class="room-action-btn" :disabled="!isAvailable(room) || !!booking" @click.stop="handleRoomClick(room)">
              <span>{{ !isAvailable(room) ? 'កំពុងប្រើប្រាស់' : booking ? 'សូមបញ្ចប់ការកក់បច្ចុប្បន្ន' : 'មើល និងជ្រើសរើសបន្ទប់' }}</span>
              <ArrowRight :size="18" />
            </button>
          </div>
        </article>
      </div>
      <div v-else class="empty-state">
        <Search :size="38" />
        <strong>រកមិនឃើញបន្ទប់ទេ</strong>
        <span>សូមប្ដូរពាក្យស្វែងរក ឬជ្រើសរើសតម្រងផ្សេង។</span>
        <button @click="searchQuery = ''; selectedType = 'all'">បង្ហាញបន្ទប់ទាំងអស់</button>
      </div>
    </section>

    <section v-if="selectedRoom" class="selection-row">
      <div class="selection-info">
        <span class="selection-icon"><CheckCircle2 :size="27" /></span>
        <div>
          <strong>បានជ្រើសរើស៖ បន្ទប់ {{ selectedRoom.name }} ({{ roomTypeLabel(selectedRoom.type) }})</strong>
          <small>{{ khmerNumber(selectedRoom.capacity) }} កៅអី · {{ floorLabel(selectedRoom.floor) }} · ឥតគិតថ្លៃ</small>
        </div>
      </div>
      <button class="reserve-button" :disabled="!!booking || !isAvailable(selectedRoom) || bookingInProgress" @click="bookRoom">
        <CalendarCheck :size="19" /> {{ bookingInProgress ? 'កំពុងកក់...' : 'បញ្ជាក់ការកក់បន្ទប់នេះ' }} <ArrowRight :size="18" />
      </button>
    </section>

    <p class="policy-note"><CircleAlert :size="17" /> បើមិនបញ្ជាក់វត្តមានក្នុងរយៈពេល ១៥ នាទី ការកក់នឹងត្រូវបានលុបចោលស្វ័យប្រវត្តិ។</p>

    <!-- Room details modal -->
    <div v-if="roomActionModalOpen" class="modal-backdrop" @click.self="roomActionModalOpen = false">
      <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="room-modal-title">
        <button class="modal-close" aria-label="បិទ" @click="roomActionModalOpen = false"><X :size="23" /></button>
        <div class="modal-header-icon"><House :size="30" /></div>
        <p class="eyebrow">{{ floorLabel(activePromptRoom?.floor) }}</p>
        <h2 id="room-modal-title">បន្ទប់សិក្សា {{ activePromptRoom?.name }}</h2>
        <div class="room-detail-info">
          <p><strong>ប្រភេទបន្ទប់៖</strong> {{ roomTypeLabel(activePromptRoom?.type) }}</p>
          <p><strong>ចំនួនកៅអី៖</strong> {{ khmerNumber(activePromptRoom?.capacity) }} កៅអី</p>
          <p><strong>ស្ថានភាព៖</strong> <span :class="isAvailable(activePromptRoom) ? 'text-green' : 'text-red'">{{ roomStatusText(activePromptRoom) }}</span></p>
        </div>
        <div v-if="booking && String(booking.roomId) === String(activePromptRoom?.id) && booking.checkedIn" class="leave-room-card">
          <strong>អ្នកកំពុងប្រើបន្ទប់នេះ</strong>
          <span>បើអ្នកសិក្សាចប់ សូមចុចប៊ូតុងខាងក្រោមដើម្បីចេញ និងឲ្យអ្នកដទៃអាចកក់បាន។</span>
          <button class="leave-room-button" :disabled="leavingRoom" @click="leaveRoom"><LogOut :size="18" /> {{ leavingRoom ? 'កំពុងចេញ...' : 'ចេញពីបន្ទប់នេះ' }}</button>
        </div>
        <p class="modal-copy" v-if="isAvailable(activePromptRoom) && !booking">បន្ទប់នេះទំនេរ។ ចុចប៊ូតុងខាងក្រោមដើម្បីជ្រើសរើស ហើយបញ្ជាក់ការកក់នៅជំហានបន្ទាប់។</p>
        <p class="modal-copy" v-else-if="booking">អ្នកមានការកក់មួយកំពុងដំណើរការ។ សូមបញ្ជាក់វត្តមាន ឬបោះបង់ការកក់ចាស់សិន។</p>
        <p class="modal-copy" v-else>បន្ទប់នេះកំពុងប្រើប្រាស់ ដូច្នេះមិនអាចកក់បាននៅពេលនេះទេ។</p>
        <div class="modal-actions-group">
          <button class="verify-button primary-btn" :disabled="!isAvailable(activePromptRoom) || !!booking" @click="confirmSelectRoom">
            <CheckCircle2 :size="19" /> ជ្រើសរើសបន្ទប់នេះ
          </button>
          <button class="verify-button secondary-btn" @click="roomActionModalOpen = false"><X :size="19" /> បិទ</button>
        </div>
      </section>
    </div>

    <!-- Check-in QR modal -->
    <div v-if="checkinOpen" class="modal-backdrop" @click.self="closeCheckinModal">
      <section class="modal-card checkin-modal" role="dialog" aria-modal="true" aria-labelledby="checkin-title">
        <button class="modal-close" aria-label="បិទ" @click="closeCheckinModal"><X :size="23" /></button>
        <div class="modal-header-icon"><QrCode :size="30" /></div>
        <p class="eyebrow">បន្ទប់ {{ roomName(booking?.roomId) }}</p>
        <h2 id="checkin-title">បញ្ជាក់វត្តមាន</h2>
        <p class="modal-copy">បង្ហាញ QR Code នេះ ឬស្កេន QR Code របស់បន្ទប់ដើម្បីបញ្ជាក់វត្តមាន។</p>
        <div class="booking-qr">
          <img v-if="qrImage" :src="qrImage" alt="QR កូដសម្រាប់បញ្ជាក់វត្តមាន" />
          <p v-else-if="qrGenerating">កំពុងបង្កើត QR កូដ...</p>
          <p v-else class="qr-error">មិនអាចបង្កើត QR កូដបានទេ។ សូមប្រើលេខកូដខាងក្រោម។</p>
        </div>
        <p class="qr-caption">លេខកូដកក់៖ <strong>{{ booking?.code }}</strong></p>
        <div class="scanner-container">
          <div id="qr-reader" v-show="isScanning"></div>
          <button v-if="!isScanning" class="toggle-scanner-btn" @click="startScanner">
            <Camera :size="20" /> បើកកាមេរ៉ាស្កេន QR
          </button>
          <button v-else class="toggle-scanner-btn stop" @click="stopScanner">
            <X :size="20" /> បិទកាមេរ៉ា
          </button>
        </div>
        <label for="room-code">លេខកូដបញ្ជាក់វត្តមាន</label>
        <input id="room-code" v-model="verificationCode" type="text" placeholder="បញ្ចូលលេខកូដ ឬស្កេន QR" autocomplete="off" @keyup.enter="verifyCheckin" />
        <p v-if="codeError" class="code-error">{{ codeError }}</p>
        <button class="verify-button primary-btn verify-submit" @click="verifyCheckin">
          <CheckCircle2 :size="19" /> បញ្ជាក់វត្តមាន <ArrowRight :size="18" />
        </button>
      </section>
    </div>

    <!-- Floating booking helper BOT -->
    <div class="booking-help-bot">
      <Transition name="bot-pop">
        <section v-if="helpOpen" class="bot-help-panel">
          <header class="bot-help-header">
            <span class="bot-avatar">🤖</span>
            <div>
              <strong>ជំនួយការកក់បន្ទប់</strong>
              <small>ជំនួយណែនាំអ្នក</small>
            </div>
            <button class="bot-close" aria-label="បិទជំនួយ" @click="helpOpen = false"><X :size="17" /></button>
          </header>
          <div class="bot-help-body">
            <p class="bot-greeting">សួស្តី! 💚 ខ្ញុំនឹងជួយអ្នកកក់បន្ទប់សិក្សា។</p>
            <div class="bot-step" :class="{ 'bot-step-active': guideStep === 1 }"><span>១</span><p>ចុចជាន់ដែលអ្នកចង់បាន រួចរកបន្ទប់ស្លាក <strong>ទំនេរ</strong>។</p></div>
            <div class="bot-step" :class="{ 'bot-step-active': guideStep === 2 }"><span>២</span><p>ចុចកាតបន្ទប់ រួចចុច <strong>ជ្រើសរើសបន្ទប់នេះ</strong>។</p></div>
            <div class="bot-step" :class="{ 'bot-step-active': guideStep === 3 }"><span>៣</span><p>កំណត់ថ្ងៃ និងម៉ោងចាប់ផ្ដើម/បញ្ចប់ រួចចុច <strong>បញ្ជាក់ការកក់</strong>។</p></div>
            <div class="bot-step" :class="{ 'bot-step-active': guideStep === 4 }"><span>៤</span><p>បញ្ជាក់វត្តមានដោយ QR។ ពេលប្រើចប់ ចុច <strong>ចេញពីបន្ទប់</strong>។</p></div>
            <p v-if="booking" class="bot-current-status">
              ✅ អ្នកកំពុងមានការកក់បន្ទប់ {{ roomName(booking.roomId) }}។
              <span v-if="!booking.checkedIn">សូមបញ្ជាក់វត្តមានមុនពេលកំណត់។</span>
              <span v-else>អ្នកបានបញ្ជាក់វត្តមានរួចហើយ។</span>
            </p>
            <p v-else-if="selectedRoom" class="bot-current-status">
              💚 អ្នកបានជ្រើសរើសបន្ទប់ {{ selectedRoom.name }}។ សូមចុច «បញ្ជាក់ការកក់បន្ទប់នេះ» ដើម្បីបន្ត។
            </p>
            <p v-else class="bot-current-status">💡 ចាប់ផ្ដើមដោយចុចលើបន្ទប់ដែលមានស្ថានភាព «ទំនេរ»។</p>
          </div>
          <button class="bot-action-button" @click="advanceGuide">
            <ArrowDown :size="18" /> {{ guideStep >= 4 ? 'ចាប់ផ្ដើមណែនាំម្ដងទៀត' : 'បង្ហាញចំណុចបន្ទាប់' }} <ArrowRight :size="18" />
          </button>
        </section>
      </Transition>
      <button class="booking-bot-button" :class="{ 'bot-active': helpOpen }" :aria-expanded="helpOpen" aria-label="បើកជំនួយការកក់បន្ទប់" @click="helpOpen = !helpOpen">
        <span class="bot-button-icon">{{ helpOpen ? '✕' : '🤖' }}</span>
        <span v-if="!helpOpen" class="bot-button-label">ជំនួយកក់បន្ទប់</span>
        <span v-if="!helpOpen" class="bot-notification-dot"></span>
      </button>
    </div>
  </main>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, onMounted, nextTick, ref } from 'vue';
import {
  House, Search, Users, Monitor, Headphones, Armchair, CheckCircle2,
  Clock3, CalendarCheck, QrCode, Camera, X, ArrowRight, Building2,
  CircleAlert, DoorOpen, MapPin, LogOut, ArrowDown
} from '@lucide/vue';
import api, { apiConfigured } from '@/services/api';
import { Html5Qrcode } from 'html5-qrcode';
import QRCode from 'qrcode';

const locale = inject('locale');

const floors = [
  { id: 'Level 1', label: 'ជាន់ទី ១' },
  { id: 'Level 2', label: 'ជាន់ទី ២' },
  { id: 'Level 3', label: 'ជាន់ទី ៣' },
];
const roomTypes = [
  { value: 'all', label: 'ទាំងអស់' },
  { value: 'Quiet study', label: 'ស្ងប់ស្ងាត់' },
  { value: 'Group room', label: 'បន្ទប់ក្រុម' },
  { value: 'Project room', label: 'គម្រោង' },
];

const currentFloor = ref('Level 2');
const selectedType = ref('all');
const searchQuery = ref('');
const demoMode = ref(true);
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
const qrImage = ref('');
const qrGenerating = ref(false);
const roomActionModalOpen = ref(false);
const activePromptRoom = ref(null);
const isScanning = ref(false);
const helpOpen = ref(false);
const welcomeVisible = ref(true);
const bookingInProgress = ref(false);
const leavingRoom = ref(false);
const guideStep = ref(1);
const bookingStart = ref(toLocalDateTime(new Date()));
const bookingEnd = ref(toLocalDateTime(new Date(Date.now() + 60 * 60 * 1000)));
const minBookingDateTime = computed(() => toLocalDateTime(new Date()));
const validBookingTime = computed(() => {
  const start = new Date(bookingStart.value).getTime();
  const end = new Date(bookingEnd.value).getTime();
  return Number.isFinite(start) && Number.isFinite(end) && start >= Date.now() - 60000 && end > start;
});
let html5QrCode = null;
let ticker;
let refreshTicker;

const availableCount = computed(() =>
  rooms.value.filter(room => isAvailable(room) && String(room.id) !== String(booking.value?.roomId)).length
);
const filteredVisibleRooms = computed(() => rooms.value.filter(room => {
  const matchFloor = room.floor === currentFloor.value;
  const matchType = selectedType.value === 'all' || room.type === selectedType.value;
  const query = searchQuery.value.trim().toLowerCase();
  const matchSearch = !query || String(room.name).toLowerCase().includes(query) ||
    roomTypeLabel(room.type).toLowerCase().includes(query);
  return matchFloor && matchType && matchSearch;
}));
const remainingMs = computed(() => booking.value
  ? Math.max(0, 15 * 60 * 1000 - (now.value - booking.value.bookedAt))
  : 0);
const remainingLabel = computed(() =>
  `${String(Math.floor(remainingMs.value / 60000)).padStart(2, '0')}:${String(Math.floor((remainingMs.value % 60000) / 1000)).padStart(2, '0')}`
);

function toLocalDateTime(date) {
  const pad = value => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function isAvailable(room) {
  if (!room) return false;
  const status = String(room.status ?? '').trim().toLowerCase();
  return ['available', 'free', 'vacant'].includes(status);
}
function floorLabel(floor) {
  const level = String(floor ?? 'Level 2').match(/\d+/)?.[0] ?? '2';
  return `ជាន់ទី ${khmerNumber(level)}`;
}
function khmerNumber(value) {
  return String(value ?? '').replace(/\d/g, digit => '០១២៣៤៥៦៧៨៩'[Number(digit)]);
}
function roomTypeLabel(type) {
  const labels = {
    'Quiet study': 'បន្ទប់ស្ងប់ស្ងាត់',
    'Group room': 'បន្ទប់ក្រុម',
    'Project room': 'បន្ទប់គម្រោង',
  };
  return labels[type] ?? type ?? 'បន្ទប់សិក្សា';
}
function roomIconComponent(type) {
  if (type === 'Quiet study') return Headphones;
  if (type === 'Group room') return Users;
  if (type === 'Project room') return Monitor;
  return House;
}
function roomStatusText(room) {
  if (!room) return 'មិនស្គាល់';
  if (String(booking.value?.roomId) === String(room.id)) {
    return booking.value.checkedIn ? 'បានចូលប្រើ' : 'បានកក់';
  }
  return isAvailable(room) ? 'ទំនេរ' : 'កំពុងប្រើ';
}
function roomName(id) {
  return rooms.value.find(room => String(room.id) === String(id))?.name ?? id ?? '';
}
function handleRoomClick(room) {
  activePromptRoom.value = room;
  roomActionModalOpen.value = true;
}
function cancelSelection() {
  selectedRoom.value = null;
  notice.value = { kind: 'success', text: 'បានបោះបង់ការជ្រើសរើស។ អ្នកអាចជ្រើសរើសបន្ទប់ផ្សេងបាន។' };
}
function changeRoom() {
  selectedRoom.value = null;
  notice.value = { kind: 'success', text: 'សូមចុចបន្ទប់ថ្មីដែលមានស្ថានភាព «ទំនេរ»។' };
  nextTick(() => document.querySelector('.floor-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
}
function startBotGuide() {
  welcomeVisible.value = false;
  helpOpen.value = true;
  guideStep.value = 1;
  nextTick(() => document.querySelector('.map-toolbar')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
}
function advanceGuide() {
  if (guideStep.value >= 4) guideStep.value = 1;
  else guideStep.value += 1;
  helpOpen.value = true;
  const targets = { 1: '.map-toolbar', 2: '.floor-layout', 3: '.selection-row', 4: '.booking-banner' };
  nextTick(() => document.querySelector(targets[guideStep.value])?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
}
function confirmSelectRoom() {
  const room = activePromptRoom.value;
  if (!room || !isAvailable(room) || booking.value) return;
  selectedRoom.value = room;
  currentFloor.value = room.floor;
  roomActionModalOpen.value = false;
  notice.value = {
    kind: 'success',
    text: `បានជ្រើសរើសបន្ទប់ ${room.name}។ សូមចុច «បញ្ជាក់ការកក់បន្ទប់នេះ» ខាងក្រោមបញ្ជីបន្ទប់។`,
  };
  nextTick(() => document.querySelector('.selection-row')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
}
function saveBooking() {
  localStorage.setItem('leafline_room_booking', JSON.stringify(booking.value));
}
function releaseBooking(message = 'បានលុបការកក់ ព្រោះមិនបានបញ្ជាក់វត្តមានក្នុងរយៈពេល ១៥ នាទី។') {
  if (booking.value && !booking.value.checkedIn) {
    rooms.value = rooms.value.map(room =>
      String(room.id) === String(booking.value.roomId) ? { ...room, status: 'available' } : room
    );
  }
  booking.value = null;
  selectedRoom.value = null;
  localStorage.removeItem('leafline_room_booking');
  notice.value = { kind: 'error', text: message };
}
async function loadRooms() {
  if (!apiConfigured) return;
  try {
    const { data } = await api.get('/rooms');
    if (Array.isArray(data) && data.length) {
      demoMode.value = false;
      rooms.value = data.map((room, index) => {
        const rawStatus = String(room.status ?? 'available').trim().toLowerCase();
        const normalizedStatus = ['available', 'free', 'vacant'].includes(rawStatus) ? 'available' : rawStatus;
        return {
          ...room,
          id: String(room.id ?? room.name ?? index),
          name: room.name ?? `បន្ទប់ ${room.id ?? index + 1}`,
          floor: room.floor ?? 'Level 2',
          type: room.type ?? 'Quiet study',
          capacity: room.capacity ?? 2,
          status: normalizedStatus,
        };
      });
    }
  } catch (error) {
    console.warn('Unable to load rooms; using demo data.', error);
    notice.value = { kind: 'error', text: 'មិនអាចទាញយកបន្ទប់ពី Server បានទេ។ កំពុងបង្ហាញទិន្នន័យគំរូ។' };
  }
}
async function bookRoom() {
  if (bookingInProgress.value || !selectedRoom.value || booking.value || !isAvailable(selectedRoom.value)) return;
  if (!validBookingTime.value) {
    notice.value = { kind: 'error', text: 'សូមជ្រើសរើសម៉ោងចាប់ផ្ដើម និងម៉ោងបញ្ចប់ឲ្យត្រឹមត្រូវ។ ម៉ោងបញ្ចប់ត្រូវនៅក្រោយម៉ោងចាប់ផ្ដើម។' };
    return;
  }
  bookingInProgress.value = true;
  const room = selectedRoom.value;
  try {
    let serverBooking = {};
    if (apiConfigured) {
      const response = await api.post('/rooms/book', {
        room_id: room.id,
        start_time: new Date(bookingStart.value).toISOString(),
        end_time: new Date(bookingEnd.value).toISOString(),
      });
      serverBooking = response.data ?? {};
    }
    booking.value = {
      roomId: room.id,
      bookedAt: Date.now(),
      code: serverBooking.qr_code ?? `ROOM-${room.id}`,
      startTime: bookingStart.value,
      endTime: bookingEnd.value,
      checkedIn: false,
    };
    rooms.value = rooms.value.map(item =>
      String(item.id) === String(room.id) ? { ...item, status: 'reserved' } : item
    );
    saveBooking();
    selectedRoom.value = null;
    notice.value = {
      kind: 'success',
      text: `🎉 កក់បន្ទប់ ${room.name} បានជោគជ័យ! សូមចុច «បញ្ជាក់វត្តមាន» និងបញ្ចូលលេខកូដ ឬស្កេន QR ក្នុងរយៈពេល ១៥ នាទី។`,
    };
    nextTick(() => document.querySelector('.booking-banner')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  } catch (error) {
    notice.value = {
      kind: 'error',
      text: error?.response?.data?.message || 'មិនអាចកក់បន្ទប់តាម Server បានទេ។ សូមពិនិត្យការតភ្ជាប់ ឬស្ថានភាពបន្ទប់ រួចសាកម្ដងទៀត។',
    };
    console.error('Room booking failed:', error);
    await loadRooms();
  } finally {
    bookingInProgress.value = false;
  }
}
async function leaveRoom() {
  if (!booking.value?.checkedIn || leavingRoom.value) return;
  const roomId = booking.value.roomId;
  leavingRoom.value = true;
  try {
    if (apiConfigured) {
      await api.post('/rooms/check-out', { room_id: roomId });
    }
    rooms.value = rooms.value.map(room => String(room.id) === String(roomId) ? { ...room, status: 'available' } : room);
    booking.value = null;
    selectedRoom.value = null;
    localStorage.removeItem('leafline_room_booking');
    roomActionModalOpen.value = false;
    notice.value = { kind: 'success', text: `បានចេញពីបន្ទប់ ${roomName(roomId)} ហើយ។ បន្ទប់នេះអាចត្រូវបានកក់ម្ដងទៀត។` };
    await loadRooms();
  } catch (error) {
    notice.value = { kind: 'error', text: error?.response?.data?.message || 'មិនអាចចេញពីបន្ទប់តាម Server បានទេ។ សូមសាកម្ដងទៀត។' };
  } finally {
    leavingRoom.value = false;
  }
}
async function openCheckinModal() {
  checkinOpen.value = true;
  qrImage.value = '';
  codeError.value = '';
  if (!booking.value?.code) return;
  qrGenerating.value = true;
  try {
    qrImage.value = await QRCode.toDataURL(String(booking.value.code), {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 240,
    });
  } catch (error) {
    console.error('Failed to generate booking QR code:', error);
    codeError.value = 'មិនអាចបង្កើត QR កូដបានទេ។ សូមប្រើលេខកូដដោយដៃ។';
  } finally {
    qrGenerating.value = false;
  }
}
function closeCheckinModal() {
  stopScanner();
  checkinOpen.value = false;
}
async function startScanner() {
  isScanning.value = true;
  await nextTick();
  try {
    if (!html5QrCode) html5QrCode = new Html5Qrcode('qr-reader');
    await html5QrCode.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 220, height: 220 } },
      decodedText => {
        verificationCode.value = decodedText.trim();
        stopScanner();
        verifyCheckin();
      },
      () => {}
    );
  } catch (error) {
    console.error('Failed to start QR scanner:', error);
    isScanning.value = false;
    codeError.value = 'មិនអាចបើកកាមេរ៉ាបានទេ។ សូមអនុញ្ញាត Camera Permission និងប្រើ HTTPS ឬ localhost។';
  }
}
async function stopScanner() {
  if (!html5QrCode || !isScanning.value) return;
  try {
    await html5QrCode.stop();
    await html5QrCode.clear();
  } catch (error) {
    console.warn('Unable to stop QR scanner cleanly:', error);
  } finally {
    isScanning.value = false;
  }
}
async function verifyCheckin() {
  codeError.value = '';
  const enteredCode = verificationCode.value.trim().toUpperCase();
  if (!booking.value || enteredCode !== String(booking.value.code).toUpperCase()) {
    codeError.value = 'លេខកូដមិនត្រឹមត្រូវទេ។ សូមពិនិត្យ QR Code ហើយព្យាយាមម្ដងទៀត។';
    return;
  }
  try {
    if (apiConfigured) {
      await api.post('/rooms/check-in', {
        room_id: booking.value.roomId,
        verification_code: verificationCode.value.trim(),
      });
    }
    booking.value.checkedIn = true;
    saveBooking();
    await stopScanner();
    checkinOpen.value = false;
    verificationCode.value = '';
    notice.value = {
      kind: 'success',
      text: `បានបញ្ជាក់វត្តមានសម្រាប់បន្ទប់ ${roomName(booking.value.roomId)}។ សូមសិក្សាឲ្យបានល្អ!`,
    };
  } catch (error) {
    codeError.value = error?.response?.data?.message || 'Server មិនអាចបញ្ជាក់វត្តមានបានទេ។ សូមព្យាយាមម្ដងទៀត។';
    console.error('Check-in failed:', error);
  }
}

onMounted(async () => {
  await loadRooms();
  try {
    const saved = JSON.parse(localStorage.getItem('leafline_room_booking') || 'null');
    if (saved?.checkedIn || (saved?.bookedAt && Date.now() - saved.bookedAt < 15 * 60 * 1000)) {
      booking.value = saved;
      rooms.value = rooms.value.map(room =>
        String(room.id) === String(saved.roomId) ? { ...room, status: 'reserved' } : room
      );
    } else if (saved) {
      localStorage.removeItem('leafline_room_booking');
    }
  } catch {
    localStorage.removeItem('leafline_room_booking');
  }

  ticker = window.setInterval(() => {
    now.value = Date.now();
    if (booking.value && !booking.value.checkedIn && remainingMs.value <= 0) releaseBooking();
  }, 1000);

  refreshTicker = window.setInterval(() => {
    if (!demoMode.value) loadRooms();
  }, 30000);
});
onBeforeUnmount(() => {
  stopScanner();
  window.clearInterval(ticker);
  window.clearInterval(refreshTicker);
});
</script>

<style>
.rooms-page {
  --primary: #16845b;
  --primary-dark: #116747;
  --primary-light: #e8f7ef;
  --text-main: #172b22;
  --text-muted: #65776c;
  --border-color: #e1ebe4;
  width: 100%;
  color: var(--text-main);
  font: inherit;
  line-height: inherit;
}
.rooms-page * { box-sizing: border-box; }

/* Animated welcome assistant */
.welcome-bot-card { position:relative; display:flex; align-items:center; gap:22px; overflow:hidden; padding:24px 28px; margin:0 0 24px; border:1px solid #ccebd7; border-radius:24px; background:radial-gradient(circle at 5% 10%,#dff8e9 0,transparent 34%),linear-gradient(120deg,#f2fcf5 0%,#fff 56%,#effaf3 100%); box-shadow:0 14px 34px rgb(24 112 69 / 9%); }
.welcome-bot-card::after { position:absolute; right:-28px; bottom:-70px; width:190px; height:190px; border:1px solid rgb(38 160 99 / 12%); border-radius:50%; content:""; box-shadow:0 0 0 22px rgb(38 160 99 / 4%),0 0 0 44px rgb(38 160 99 / 3%); pointer-events:none; }
.welcome-bot-character { position:relative; display:grid; width:100px; height:100px; flex:0 0 100px; place-items:center; border:1px solid #d0f0da; border-radius:28px; background:linear-gradient(145deg,#fff,#e5f8eb); box-shadow:0 9px 22px rgb(22 132 91 / 12%); animation:welcome-float 3s ease-in-out infinite; }
.welcome-bot-face { display:block; font-size:53px; filter:drop-shadow(0 4px 3px rgb(28 83 51 / 12%)); animation:welcome-wave 2.8s ease-in-out infinite; transform-origin:bottom center; }
.welcome-bot-spark { position:absolute; color:#e4a82d; font-size:22px; animation:sparkle-twinkle 1.8s ease-in-out infinite; }
.spark-one { top:8px; left:9px; }.spark-two { right:7px; bottom:10px; animation-delay:.8s; }
.welcome-bot-copy { position:relative; z-index:1; min-width:0; flex:1; }
.welcome-bot-kicker { display:inline-flex; align-items:center; gap:7px; margin-bottom:6px; color:#16845b; font-size:10px; font-weight:900; letter-spacing:1.3px; }
.welcome-online-dot { width:8px; height:8px; border-radius:50%; background:#25ad69; box-shadow:0 0 0 4px #d8f4e2; animation:online-pulse 1.7s ease-out infinite; }
.welcome-bot-copy h2 { margin:0 0 5px; color:#173d2a; font-size:clamp(19px,2vw,25px); font-weight:900; line-height:1.6; }
.welcome-bot-copy p { max-width:720px; margin:0; color:#5d7465; font-size:14px; line-height:1.9; }
.welcome-bot-actions { display:flex; align-items:center; flex-wrap:wrap; gap:10px; margin-top:15px; }
.welcome-start-button,.welcome-dismiss-button { display:inline-flex; align-items:center; justify-content:center; gap:8px; min-height:43px; padding:10px 15px; border-radius:12px; font:inherit; font-size:13px; font-weight:850; cursor:pointer; transition:transform .2s,box-shadow .2s,background .2s; }
.welcome-start-button { border:0; color:#fff; background:linear-gradient(135deg,#16845b,#2ca971); box-shadow:0 6px 16px rgb(22 132 91 / 22%); }
.welcome-start-button:hover { transform:translateY(-2px); box-shadow:0 9px 20px rgb(22 132 91 / 28%); }
.welcome-dismiss-button { border:1px solid #d8e9dd; color:#41634e; background:#fff; }
.welcome-dismiss-button:hover { background:#f0faf3; }
.welcome-close { position:absolute; z-index:2; top:12px; right:12px; display:grid; width:31px; height:31px; place-items:center; border:1px solid #e0eee4; border-radius:10px; color:#65816e; background:rgb(255 255 255 / 85%); cursor:pointer; }
.welcome-arrow { position:absolute; right:26px; bottom:17px; display:flex; align-items:center; gap:5px; color:#16845b; animation:arrow-nudge 1.3s ease-in-out infinite; }
.welcome-arrow span { font-size:25px; font-weight:900; }.welcome-arrow small { font-size:10px; font-weight:800; }
.welcome-pop-enter-active,.welcome-pop-leave-active { transition:opacity .35s ease,transform .35s ease; }
.welcome-pop-enter-from,.welcome-pop-leave-to { opacity:0; transform:translateY(-12px) scale(.98); }
@keyframes welcome-float { 0%,100% { transform:translateY(0) rotate(-2deg); } 50% { transform:translateY(-7px) rotate(2deg); } }
@keyframes welcome-wave { 0%,100% { transform:rotate(0); } 8%,24% { transform:rotate(-9deg); } 16%,32% { transform:rotate(9deg); } 40% { transform:rotate(0); } }
@keyframes sparkle-twinkle { 0%,100% { opacity:.45; transform:scale(.8) rotate(0); } 50% { opacity:1; transform:scale(1.2) rotate(18deg); } }
@keyframes online-pulse { 0% { box-shadow:0 0 0 0 rgb(37 173 105 / 35%); } 100% { box-shadow:0 0 0 7px rgb(37 173 105 / 0%); } }
@keyframes arrow-nudge { 0%,100% { transform:translateY(0); } 50% { transform:translateY(5px); } }
.view-heading { display:flex; justify-content:space-between; align-items:center; gap:20px; margin-bottom:30px; }
.view-heading h1 { margin:0; color:#153c2a; font-size:clamp(28px,3vw,38px); line-height:1.5; font-weight:800; }
.eyebrow { display:flex; align-items:center; gap:10px; margin:0 0 8px; color:var(--primary); font-size:16px; font-weight:800; }
.subheading { margin:7px 0 0; color:var(--text-muted); font-size:16px; line-height:1.9; }
.live-indicator { display:flex; align-items:center; gap:10px; padding:11px 16px; border:1px solid #cce8d6; border-radius:14px; color:#176b47; background:#eef8f1; font-size:14px; font-weight:750; white-space:nowrap; }
.live-indicator small { padding:3px 8px; border-radius:7px; background:#d8f3e2; font-size:12px; }
.live-dot,.status-dot { width:8px; height:8px; flex-shrink:0; border-radius:50%; background:#24a568; }
.live-dot { box-shadow:0 0 0 4px #c9efd7; }
.room-summary { display:flex; align-items:center; justify-content:space-between; gap:24px; padding:24px; margin-bottom:24px; border:1px solid var(--border-color); border-radius:20px; background:#fff; box-shadow:0 6px 24px rgb(26 71 45 / 5%); }
.summary-info { display:flex; align-items:center; gap:15px; }
.summary-mark { display:grid; width:58px; height:58px; flex-shrink:0; place-items:center; border-radius:16px; color:var(--primary); background:var(--primary-light); }
.summary-info strong { display:block; font-size:19px; font-weight:800; line-height:1.7; }
.summary-info small,.summary-side span { color:var(--text-muted); font-size:14px; line-height:1.8; }
.search-box { display:flex; align-items:center; gap:9px; min-height:54px; padding:0 14px; border:1px solid #d9e7dd; border-radius:13px; background:#f8fbf9; transition:.2s; }
.search-box:focus-within { border-color:var(--primary); box-shadow:0 0 0 4px rgb(22 132 91 / 10%); }
.search-icon { flex-shrink:0; color:#708579; }
.search-box input { width:240px; min-width:0; padding:12px 2px; border:0; outline:0; background:transparent; color:var(--text-main); font:inherit; font-size:15px; }
.search-box input::placeholder { color:#87958c; }
.clear-search { display:grid; place-items:center; border:0; border-radius:7px; padding:4px; color:#65776c; background:transparent; cursor:pointer; }
.summary-side { text-align:right; }
.summary-side span { display:block; }
.summary-side strong { display:flex; align-items:center; justify-content:flex-end; gap:7px; color:var(--primary); font-size:16px; white-space:nowrap; }
.notice { display:flex; align-items:center; gap:12px; padding:16px 19px; margin:16px 0; border:1px solid #bfe8cd; border-radius:14px; color:#17633f; background:#effbf3; font-size:15px; font-weight:650; }
.notice p { flex:1; margin:0; line-height:1.8; }
.notice button,.dismiss-booking,.modal-close { display:grid; place-items:center; border:0; background:transparent; cursor:pointer; }
.notice-error { border-color:#f3cccc; color:#a12e36; background:#fff4f4; }
.booking-banner { position:relative; display:flex; align-items:center; gap:17px; padding:22px 24px; margin:18px 0; border:1px solid #b2e5ce; border-radius:18px; background:#edfaf3; }
.booking-symbol { display:grid; width:50px; height:50px; flex-shrink:0; place-items:center; border-radius:15px; color:#fff; background:var(--primary); }
.booking-message { min-width:0; }
.booking-message strong,.booking-message span { display:block; }
.booking-message strong { color:#194c34; font-size:17px; font-weight:800; }
.booking-message span { color:#4b7660; font-size:14px; line-height:1.8; }
.checkin-timer { margin-left:auto; text-align:right; }
.checkin-timer small { display:block; color:var(--text-muted); font-size:12px; }
.checkin-timer strong { color:#d83d47; font-size:23px; font-variant-numeric:tabular-nums; }
.checkin-button,.reserve-button,.verify-button { display:inline-flex; align-items:center; justify-content:center; gap:9px; min-height:49px; padding:12px 19px; border:0; border-radius:12px; color:#fff; background:var(--primary); font:inherit; font-size:15px; font-weight:800; cursor:pointer; transition:background .2s,transform .2s; }
.checkin-button:hover,.reserve-button:hover:not(:disabled),.verify-button:hover:not(:disabled) { background:var(--primary-dark); transform:translateY(-1px); }
.dismiss-booking { width:34px; height:34px; flex-shrink:0; border-radius:9px; color:#6d8375; }
.dismiss-booking:hover,.modal-close:hover { color:#c53030; background:#fff0f0; }
.map-toolbar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px; margin:30px 0 22px; }
.floor-tabs,.type-filters { display:flex; gap:7px; padding:6px; border:1px solid var(--border-color); border-radius:14px; background:#edf3ef; }
.floor-tabs button,.type-filters button { display:inline-flex; align-items:center; justify-content:center; gap:8px; flex-shrink:0; padding:11px 16px; border:0; border-radius:10px; color:#53675a; background:transparent; font:inherit; font-size:14px; font-weight:750; cursor:pointer; transition:.2s; }
.floor-tabs button:hover,.type-filters button:hover { color:var(--primary); background:#fff; }
.floor-tabs button.selected,.type-filters button.selected { color:#fff; background:var(--primary); box-shadow:0 4px 12px rgb(22 132 91 / 18%); }
.floor-layout { padding:28px; border:1px solid var(--border-color); border-radius:22px; background:#fff; box-shadow:0 8px 30px rgb(26 71 45 / 4%); }
.layout-label { display:flex; align-items:center; justify-content:space-between; gap:16px; color:var(--text-muted); font-size:14px; }
.layout-label strong { display:flex; align-items:center; gap:8px; color:#2b4937; font-size:16px; }
.room-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(min(100%,290px),1fr)); gap:20px; margin-top:24px; }
.room-card-item { display:flex; flex-direction:column; justify-content:space-between; min-width:0; min-height:238px; padding:22px; border:1.5px solid #dcebe1; border-radius:19px; background:#fff; cursor:pointer; box-shadow:0 5px 18px rgb(26 71 45 / 4%); transition:transform .22s,box-shadow .22s,border-color .22s; }
.room-card-item:hover { transform:translateY(-4px); border-color:#65b88c; box-shadow:0 14px 30px rgb(26 71 45 / 10%); }
.room-card-item.occupied { border-color:#f0dada; background:#fffafa; }
.room-card-item.chosen,.room-card-item.my-booking { border:2px solid var(--primary); background:#effaf3; box-shadow:0 8px 25px rgb(22 132 91 / 12%); }
.room-card-header { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:19px; }
.room-title-group { display:flex; align-items:center; gap:11px; min-width:0; }
.room-avatar { display:grid; width:46px; height:46px; flex-shrink:0; place-items:center; border-radius:14px; color:var(--primary); background:var(--primary-light); }
.room-number { color:#193d2b; font-size:22px; font-weight:800; white-space:nowrap; }
.room-state-badge { display:inline-flex; align-items:center; gap:7px; padding:6px 10px; border-radius:9px; font-size:12px; font-weight:800; white-space:nowrap; }
.badge-available { color:#12683f; background:#d9f8e5; }
.badge-available .status-dot { width:7px; height:7px; background:#1e9c5d; }
.badge-occupied { color:#a52d36; background:#ffe5e6; }
.badge-occupied .status-dot { width:7px; height:7px; background:#df4d55; }
.room-card-body { display:grid; gap:11px; margin-bottom:20px; }
.room-type-text,.room-capacity-text { display:flex; align-items:center; gap:9px; margin:0; }
.room-type-text { color:var(--primary); font-size:16px; font-weight:800; }
.room-capacity-text { color:#5a6d60; font-size:14px; }
.room-capacity-text strong { color:#2a4534; }
.room-card-footer { padding-top:15px; border-top:1px solid #e6eee8; }
.room-action-btn { display:flex; align-items:center; justify-content:center; gap:8px; width:100%; min-height:47px; padding:11px 12px; border:0; border-radius:11px; color:#fff; background:var(--primary); font:inherit; font-size:13px; font-weight:800; cursor:pointer; transition:background .2s; }
.room-action-btn:hover:not(:disabled) { background:var(--primary-dark); }
.room-action-btn:disabled { color:#78857d; background:#e9edef; cursor:not-allowed; }
.empty-state { display:flex; flex-direction:column; align-items:center; gap:12px; padding:55px 20px; color:#7b8c80; text-align:center; }
.empty-state strong { color:#294936; font-size:20px; }
.empty-state span { font-size:14px; }
.empty-state button { padding:10px 16px; border:0; border-radius:10px; color:#fff; background:var(--primary); font:inherit; font-weight:700; cursor:pointer; }
.selection-row { display:flex; align-items:center; justify-content:space-between; gap:20px; margin-top:26px; padding:23px; border:1.5px solid #a6dfbd; border-radius:19px; background:#f0faf3; scroll-margin-top:24px; }
.selection-info { display:flex; align-items:center; gap:14px; min-width:0; }
.selection-icon { display:grid; width:54px; height:54px; flex-shrink:0; place-items:center; border-radius:15px; color:#fff; background:var(--primary); }
.selection-info strong,.selection-info small { display:block; line-height:1.8; }
.selection-info strong { color:#1b3b28; font-size:15px; font-weight:800; }
.selection-info small { color:#5b7463; font-size:13px; }
.reserve-button:disabled,.verify-button:disabled { background:#bdc9c1; cursor:not-allowed; transform:none; }
.booking-time-fields { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; min-width:min(100%,420px); }
.booking-time-fields label { display:grid; gap:6px; color:#31543e; font-size:12px; font-weight:800; }
.booking-time-fields input { width:100%; min-width:0; min-height:43px; padding:9px; border:1px solid #cfe3d5; border-radius:10px; color:#244431; background:#fff; font:inherit; font-size:12px; }
.booking-time-fields small { grid-column:1/-1; color:#668070; font-size:12px; }
.selection-actions { display:flex; flex-wrap:wrap; align-items:center; justify-content:flex-end; gap:9px; }
.cancel-selection-button,.change-room-button,.leave-room-button { display:inline-flex; align-items:center; justify-content:center; gap:8px; min-height:47px; padding:11px 15px; border:1px solid #dce7df; border-radius:12px; font:inherit; font-size:13px; font-weight:800; cursor:pointer; }
.cancel-selection-button { color:#b42332; background:#fff4f4; border-color:#f2d0d0; }
.change-room-button { color:#16734d; background:#eaf8ef; border-color:#c8e9d3; }
.leave-room-button { color:#fff; background:#d94a52; border-color:#d94a52; white-space:nowrap; }
.leave-room-button:hover:not(:disabled) { background:#b92e39; }
.leave-room-button:disabled { opacity:.65; cursor:wait; }
.leave-room-card { display:grid; gap:9px; padding:15px; border:1px solid #bde5ca; border-radius:14px; background:#effaf3; }
.leave-room-card strong { color:#175c3c; }
.leave-room-card span { color:#5b7463; font-size:13px; line-height:1.8; }
.bot-step-active { padding:10px; margin-left:-10px; margin-right:-10px; border:1px solid #b6e4c6; border-radius:12px; background:#effaf3; box-shadow:0 0 0 3px rgb(22 132 91 / 7%); }
.policy-note { display:flex; align-items:flex-start; gap:9px; margin:22px 0 0; color:#708176; font-size:13px; line-height:1.9; }
.policy-note svg { flex-shrink:0; margin-top:4px; }
.modal-backdrop { position:fixed; z-index:1000; inset:0; display:grid; place-items:center; padding:18px; overflow-y:auto; background:rgb(12 30 20 / 62%); backdrop-filter:blur(7px); }
.modal-card { position:relative; width:min(500px,100%); max-height:calc(100vh - 36px); overflow-y:auto; padding:34px; border:1px solid #e5eee8; border-radius:24px; background:#fff; box-shadow:0 30px 70px rgb(0 0 0 / 22%); }
.modal-close { position:absolute; top:16px; right:16px; width:38px; height:38px; border-radius:10px; color:#718176; }
.modal-header-icon { display:grid; width:58px; height:58px; place-items:center; margin-bottom:17px; border-radius:17px; color:var(--primary); background:var(--primary-light); }
.modal-card h2 { margin:0 0 12px; color:#193d2b; font-size:27px; font-weight:800; line-height:1.6; }
.room-detail-info { display:grid; gap:10px; padding:18px; margin:18px 0; border:1px solid var(--border-color); border-radius:14px; background:#f7faf8; }
.room-detail-info p { margin:0; color:#42584a; font-size:14px; line-height:1.9; }
.text-green { color:#16845b; font-weight:800; }
.text-red { color:#d13e49; font-weight:800; }
.modal-copy { color:#64776a; font-size:14px; line-height:2; }
.modal-actions-group { display:grid; gap:11px; margin-top:22px; }
.primary-btn { width:100%; }
.secondary-btn { width:100%; border:1px solid #dbe5de; color:#596c60; background:#f2f6f3; }
.booking-qr { display:grid; place-items:center; min-height:190px; }
.booking-qr img { display:block; width:200px; height:200px; padding:10px; margin:12px auto; border:1px solid #e1e9e3; border-radius:15px; background:#fff; }
.qr-caption { margin:8px 0 18px; color:#687b6d; text-align:center; font-size:14px; }
.qr-caption strong { color:#1d6845; overflow-wrap:anywhere; }
.qr-error,.code-error { color:#c53030; font-size:13px; font-weight:700; }
.scanner-container { margin-bottom:18px; }
#qr-reader { width:100%; overflow:hidden; border-radius:13px; }
.toggle-scanner-btn { display:flex; align-items:center; justify-content:center; gap:9px; width:100%; min-height:48px; padding:12px; border:1.5px dashed #83cba0; border-radius:12px; color:var(--primary); background:#f0faf3; font:inherit; font-size:14px; font-weight:800; cursor:pointer; }
.toggle-scanner-btn.stop { border-color:#f2b6b6; color:#c53030; background:#fff5f5; }
.checkin-modal label { display:block; margin:12px 0 6px; color:#2b4635; font-size:14px; font-weight:800; }
.checkin-modal input { width:100%; min-height:51px; padding:12px 14px; border:1.5px solid #d3e0d7; border-radius:11px; outline-color:var(--primary); color:#1a3022; background:#fff; font:inherit; font-size:15px; }
.code-error { margin:8px 0; }
.verify-submit { margin-top:16px; }
.rooms-page button:focus-visible,.rooms-page input:focus-visible { outline:3px solid rgb(22 132 91 / 35%); outline-offset:3px; }

/* Floating help bot: fixed to the viewport, not the scrolling room list */
.booking-help-bot { position:fixed; right:22px; bottom:24px; z-index:2000; font-family:inherit; }
.booking-bot-button { position:relative; display:flex; align-items:center; gap:10px; min-height:58px; padding:9px 18px 9px 11px; border:2px solid #fff; border-radius:999px; color:#fff; background:linear-gradient(135deg,#16845b,#32a876); box-shadow:0 9px 28px rgb(22 132 91 / 30%); cursor:pointer; transition:transform .2s,box-shadow .2s; animation:bot-idle-bob 3s ease-in-out infinite; }
.booking-bot-button:hover { transform:translateY(-3px); box-shadow:0 13px 32px rgb(22 132 91 / 38%); }
.bot-button-icon { display:grid; width:38px; height:38px; flex-shrink:0; place-items:center; border-radius:50%; color:#16845b; background:#fff; font-size:23px; animation:bot-icon-wiggle 3.5s ease-in-out infinite; }
.bot-button-label { font-size:14px; font-weight:800; }
.bot-notification-dot { position:absolute; top:2px; right:5px; width:11px; height:11px; border:2px solid #fff; border-radius:50%; background:#ffcf57; animation:online-pulse 1.8s ease-out infinite; }
@keyframes bot-idle-bob { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-4px); } }
@keyframes bot-icon-wiggle { 0%,88%,100% { transform:rotate(0); } 91% { transform:rotate(-10deg); } 94% { transform:rotate(10deg); } 97% { transform:rotate(-5deg); } }
.bot-help-panel { position:absolute; right:0; bottom:72px; display:flex; flex-direction:column; width:min(365px,calc(100vw - 28px)); max-height:min(580px,calc(100dvh - 120px)); overflow:hidden; border:1px solid #dcebe1; border-radius:22px; background:#fff; box-shadow:0 18px 60px rgb(19 61 38 / 20%); }
.bot-help-header { display:flex; align-items:center; gap:11px; padding:17px; border-bottom:1px solid #e2eee6; background:linear-gradient(135deg,#e9f9ef,#f7fcf8); }
.bot-avatar { display:grid; width:44px; height:44px; flex-shrink:0; place-items:center; border-radius:15px; background:#fff; font-size:25px; }
.bot-help-header strong,.bot-help-header small { display:block; }
.bot-help-header strong { color:#194b33; font-size:14px; }
.bot-help-header small { margin-top:4px; color:#6b8374; font-size:11px; }
.bot-close { display:grid; width:32px; height:32px; flex-shrink:0; place-items:center; margin-left:auto; border:0; border-radius:10px; color:#54715f; background:#fff; cursor:pointer; }
.bot-help-body { overflow-y:auto; padding:15px; }
.bot-greeting { margin:0 0 15px; padding:12px; border-radius:13px 13px 13px 4px; color:#315a40; background:#f0f8f2; font-size:13px; line-height:1.9; }
.bot-step { display:flex; align-items:flex-start; gap:10px; margin:13px 0; }
.bot-step>span { display:grid; width:27px; height:27px; flex-shrink:0; place-items:center; border-radius:9px; color:#16845b; background:#e4f6e9; font-size:12px; font-weight:900; }
.bot-step p { margin:1px 0 0; color:#596e60; font-size:12px; line-height:1.9; }
.bot-step strong { color:#176d48; }
.bot-current-status { margin:16px 0 0; padding:12px; border:1px solid #ccebd5; border-radius:12px; color:#256744; background:#f1faf4; font-size:12px; line-height:1.9; }
.bot-action-button { display:flex; align-items:center; justify-content:center; gap:9px; min-height:48px; margin:0 15px 15px; border:0; border-radius:12px; color:#fff; background:#16845b; font:inherit; font-size:13px; font-weight:800; cursor:pointer; }
.bot-action-button:hover { background:#116747; }
.bot-pop-enter-active,.bot-pop-leave-active { transition:opacity .2s ease,transform .2s ease; }
.bot-pop-enter-from,.bot-pop-leave-to { opacity:0; transform:translateY(12px) scale(.97); }
@media (prefers-reduced-motion:reduce) { .welcome-bot-character,.welcome-bot-face,.welcome-bot-spark,.welcome-online-dot,.welcome-arrow,.booking-bot-button,.bot-button-icon,.bot-notification-dot { animation:none !important; } }
@media (max-width:1000px) {
  .rooms-page { padding:22px; }
  .room-summary { flex-wrap:wrap; }
  .search-box { flex:1 1 260px; }
  .search-box input { width:100%; }
  .selection-row { align-items:flex-start; flex-direction:column; }
  .selection-actions { width:100%; }
  .selection-actions > button { flex:1 1 150px; }
  .booking-time-fields { width:100%; }
  .reserve-button { width:100%; }
}
@media (max-width:650px) {
  .rooms-page { padding:14px; }
  .welcome-bot-card { align-items:flex-start; gap:13px; padding:18px 16px; border-radius:19px; }
  .welcome-bot-character { width:66px; height:66px; flex-basis:66px; border-radius:20px; }
  .welcome-bot-face { font-size:37px; }
  .welcome-arrow { display:none; }
  .welcome-bot-copy h2 { font-size:18px; padding-right:14px; }
  .welcome-bot-copy p { font-size:13px; }
  .welcome-bot-actions { align-items:stretch; flex-direction:column; }
  .welcome-bot-actions button { width:100%; }
  .view-heading { align-items:flex-start; flex-direction:column; gap:14px; }
  .view-heading h1 { font-size:27px; }
  .subheading { font-size:14px; }
  .live-indicator { flex-wrap:wrap; }
  .room-summary { align-items:stretch; flex-direction:column; gap:17px; padding:17px; }
  .summary-side { text-align:left; }
  .summary-side strong { justify-content:flex-start; }
  .map-toolbar { align-items:stretch; flex-direction:column; }
  .floor-tabs,.type-filters { max-width:100%; overflow-x:auto; }
  .floor-tabs button,.type-filters button { padding:10px 13px; font-size:13px; }
  .floor-layout { padding:16px; border-radius:17px; }
  .layout-label { align-items:flex-start; flex-direction:column; gap:5px; }
  .room-grid { grid-template-columns:1fr; gap:14px; }
  .room-card-item { min-height:auto; padding:18px; }
  .room-number { font-size:20px; }
  .room-state-badge { padding:5px 8px; font-size:11px; }
  .booking-banner { align-items:flex-start; flex-wrap:wrap; padding:17px; }
  .booking-message { flex:1; padding-right:20px; }
  .checkin-timer { margin-left:0; text-align:left; }
  .checkin-button,.leave-room-button { width:100%; }
  .dismiss-booking { position:absolute; top:12px; right:12px; }
  .selection-row { padding:17px; }
  .selection-actions { width:100%; flex-direction:column; }
  .selection-actions > button { width:100%; }
  .booking-time-fields { grid-template-columns:1fr; }
  .selection-info { align-items:flex-start; }
  .selection-info strong { font-size:14px; }
  .selection-info small { font-size:12px; }
  .modal-card { padding:27px 19px; border-radius:20px; }
  .modal-card h2 { font-size:24px; }
  .booking-help-bot { right:12px; bottom:14px; }
  .booking-bot-button { min-height:52px; padding-right:14px; }
  .bot-help-panel { bottom:64px; max-height:calc(100dvh - 100px); }
}
</style>
