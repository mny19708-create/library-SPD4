<template>
	<div class="dashboard">
		<HomeView @navigate="$emit('navigate', $event)" />

		<section class="stats-grid" aria-label="ស្ថិតិការប្រើប្រាស់បណ្ណាល័យ">
			<article class="stat-card"><div class="stat-heading"><span>ម៉ោងសិក្សាក្នុងបន្ទប់</span><span class="stat-icon green">⌁</span></div><strong>12.5 <small>ម៉ោង</small></strong><p><b>កើន 2.5 ម៉ោង</b> សប្ដាហ៍នេះ</p><div class="mini-bars"><i v-for="(bar, index) in [36, 51, 42, 73, 57, 84, 63]" :key="index" :style="{ height: `${bar}%` }"></i></div></article>
			<article class="stat-card"><div class="stat-heading"><span>សៀវភៅដែលបានអាន</span><span class="stat-icon coral">▤</span></div><strong>8 <small>ក្បាល</small></strong><p><b>កំពុងខ្ចី 2 ក្បាល</b></p><div class="stat-bottom"><span class="stat-dot"></span> ស្ថិតក្នុងចំណោមអ្នកអានកំពូល 18%</div></article>
			<article class="stat-card reward-stat"><div class="stat-heading"><span>ពិន្ទុសិក្សា</span><span class="stat-icon gold">✳</span></div><strong>1,240 <small>ពិន្ទុ</small></strong><p><b>ខ្វះ 260 ពិន្ទុ</b> ដល់រង្វាន់បន្ទាប់</p><div class="reward-meter"><span></span></div><div class="reward-caption"><span>រង្វាន់៖ ប័ណ្ណទិញសៀវភៅ</span><span>82%</span></div></article>
		</section>

		<section class="dashboard-grid">
			<article class="panel analytics-panel">
				<div class="panel-heading"><div><h2>ស្ថិតិការប្រើប្រាស់បន្ទប់</h2><p>ការប្រើប្រាស់កន្លែងសិក្សាប្រចាំសប្ដាហ៍</p></div><span class="period-select">ទិន្នន័យគំរូ</span></div>
				<div class="chart-legend"><span><i class="legend-study"></i>ម៉ោងបានកក់</span><span><i class="legend-capacity"></i>កន្លែងនៅសល់</span><b>ម៉ោងកំពូល · ២–៤ រសៀល</b></div>
				<div class="chart">
					<div class="chart-y"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div>
					<div class="chart-plot"><div class="chart-grid"><i></i><i></i><i></i><i></i><i></i></div><div class="chart-columns"><div v-for="(day, index) in chartDays" :key="day" class="chart-day"><div class="column-pair"><i class="capacity-bar" :style="{ height: `${[62, 78, 56, 91, 73, 49, 38][index]}%` }"></i><i class="booked-bar" :style="{ height: `${[38, 52, 34, 71, 57, 40, 26][index]}%` }"></i></div><span>{{ day }}</span></div></div></div>
				</div>
				<div class="analytics-foot"><span><strong>68%</strong> ប្រើប្រាស់ជាមធ្យម</span><span class="foot-good">↑ 8% ធៀបនឹងសប្ដាហ៍មុន</span></div>
			</article>

			<article class="panel hours-panel">
				<div class="panel-heading"><div><h2>ម៉ោងដែលមានអ្នកសិក្សាច្រើន</h2><p>ពេលវេលាដែលនិស្សិតមកសិក្សា</p></div><span class="peak-label">ម៉ោងកំពូល</span></div>
				<div class="hour-row" v-for="hour in popularHours" :key="hour.label"><span>{{ hour.label }}</span><div class="hour-track"><i :style="{ width: `${hour.value}%` }"></i></div><b>{{ hour.value }}%</b></div>
				<div class="quiet-note"><span>✳</span><p><strong>ពេលនេះមិនសូវមានមនុស្ស</strong><br>មានកន្លែងទំនេរច្រើននៅជាន់ទី ២។</p></div>
			</article>
		</section>

		<section class="lower-grid">
			<article class="panel next-panel"><div class="panel-heading"><div><h2>កាលវិភាគបន្ទាប់</h2><p>គម្រោងបណ្ណាល័យរបស់អ្នក</p></div><button class="link-button" @click="$emit('navigate', 'rooms')">មើលការកក់ទាំងអស់ →</button></div><div class="booking-row"><div class="date-tile"><b>14</b><span>តុលា</span></div><div class="booking-info"><strong>បន្ទប់ស្ងប់ស្ងាត់ · 2B</strong><span>ម៉ោង ២–៤ រសៀល <i>·</i> អគារខាងកើត ជាន់ទី ២</span></div><span class="confirmed-tag">បានបញ្ជាក់</span></div></article>
			<article class="panel streak-panel"><div class="streak-mark">✳</div><div><h2>អ្នកកំពុងខិតខំបានល្អ</h2><p>អ្នកបានមកសិក្សា 4 ថ្ងៃក្នុងសប្ដាហ៍នេះ។ បន្តទៀត!</p></div><strong>4 <small>ថ្ងៃ</small></strong></article>
		</section>
	</div>
</template>

<script setup>
import HomeView from '@/views/HomeView.vue';

defineEmits(['navigate']);
const chartDays = ['ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍', 'អាទិត្យ'];
const popularHours = [
	{ label: '១០ ព្រឹក', value: 42 },
	{ label: '១២ ថ្ងៃ', value: 64 },
	{ label: '២ រសៀល', value: 92 },
	{ label: '៤ រសៀល', value: 78 },
	{ label: '៦ ល្ងាច', value: 53 },
];
</script>

<style scoped>
.dashboard { display: grid; gap: 17px; }
.stats-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 13px; }
.stat-card, .panel { min-width: 0; border: 1px solid #e7ebe6; border-radius: 7px; background: #fff; }
.stat-card { position: relative; min-height: 142px; padding: 15px 16px; overflow: hidden; }
.stat-heading { display: flex; align-items: center; justify-content: space-between; color: #879189; font-size: 9px; font-weight: 700; letter-spacing: .8px; }
.stat-icon { display: grid; width: 25px; height: 25px; place-items: center; border-radius: 50%; font-size: 15px; }
.stat-icon.green { background: #e7f3eb; color: #388361; }
.stat-icon.coral { background: #f9ece6; color: #d2795b; }
.stat-icon.gold { background: #f8f0df; color: #bd8a43; }
.stat-card > strong { display: block; margin-top: 9px; color: #273b30; font-size: 25px; font-weight: 600; }
.stat-card > strong small { color: #727f76; font-size: 11px; font-weight: 500; }
.stat-card p { margin: 3px 0 0; color: #939b95; font-size: 10px; }
.stat-card p b { color: #448365; font-weight: 600; }
.mini-bars { position: absolute; right: 17px; bottom: 17px; display: flex; height: 32px; align-items: end; gap: 4px; }
.mini-bars i { width: 6px; border-radius: 3px 3px 1px 1px; background: #b9d9c4; }
.stat-bottom { display: flex; align-items: center; gap: 6px; margin-top: 10px; color: #78857b; font-size: 9px; }
.stat-dot { width: 6px; height: 6px; border-radius: 50%; background: #e29470; }
.reward-meter { height: 4px; margin-top: 11px; border-radius: 4px; background: #edf0e9; }
.reward-meter span { display: block; width: 82%; height: 100%; border-radius: 4px; background: #d9a568; }
.reward-caption { display: flex; justify-content: space-between; margin-top: 6px; color: #909890; font-size: 8px; }
.dashboard-grid { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(240px, .85fr); gap: 13px; }
.panel { padding: 16px 17px; }
.panel-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
.panel-heading h2, .streak-panel h2 { margin: 0; color: #2b3c31; font-size: 13px; font-weight: 700; }
.panel-heading p, .streak-panel p { margin: 4px 0 0; color: #939b95; font-size: 9px; }
.period-select { padding: 6px 8px; border: 1px solid #e9ede8; border-radius: 4px; background: white; color: #637168; font-size: 9px; }
.chart-legend { display: flex; align-items: center; gap: 14px; margin-top: 17px; color: #8c968f; font-size: 8px; }
.chart-legend span { display: inline-flex; align-items: center; gap: 5px; }
.chart-legend i { width: 7px; height: 7px; border-radius: 2px; }
.legend-study { background: #34825e; }
.legend-capacity { background: #dbe9df; }
.chart-legend b { margin-left: auto; color: #558469; font-size: 8px; font-weight: 600; }
.chart { display: flex; height: 122px; gap: 9px; margin-top: 9px; }
.chart-y { display: flex; flex-direction: column; justify-content: space-between; padding: 1px 0 19px; color: #a0a8a2; font-size: 8px; }
.chart-plot { position: relative; flex: 1; min-width: 0; }
.chart-grid { position: absolute; inset: 3px 0 20px; display: flex; flex-direction: column; justify-content: space-between; }
.chart-grid i { width: 100%; border-top: 1px dashed #edf0ec; }
.chart-columns { position: absolute; inset: 3px 0 0; display: flex; justify-content: space-around; }
.chart-day { z-index: 1; display: flex; width: 10%; flex-direction: column; align-items: center; justify-content: end; gap: 5px; color: #929b94; font-size: 8px; }
.column-pair { display: flex; width: 100%; height: 91px; align-items: end; justify-content: center; gap: 3px; }
.column-pair i { width: 8px; max-height: 100%; border-radius: 3px 3px 0 0; }
.capacity-bar { background: #dfebe2; }
.booked-bar { background: #388361; }
.analytics-foot { display: flex; justify-content: space-between; margin-top: 9px; padding-top: 10px; border-top: 1px solid #f0f2ef; color: #818c83; font-size: 9px; }
.analytics-foot strong { color: #2b6648; font-size: 12px; }
.foot-good { color: #488566; }
.peak-label { padding: 5px 7px; border-radius: 3px; background: #f8eee4; color: #ad7652; font-size: 8px; font-weight: 700; letter-spacing: .4px; }
.hour-row { display: grid; grid-template-columns: 70px minmax(0,1fr) 32px; align-items: center; gap: 8px; margin-top: 14px; color: #65736a; font-size: 13px; }
.hour-row b { color: #68766c; font-size: 9px; font-weight: 600; text-align: right; }
.hour-track { height: 6px; overflow: hidden; border-radius: 4px; background: #f0f2ef; }
.hour-track i { display: block; height: 100%; border-radius: 4px; background: #7fb58f; }
.hour-row:nth-of-type(4) .hour-track i { background: #34815d; }
.quiet-note { display: flex; align-items: center; gap: 9px; margin-top: 17px; padding: 9px; border-radius: 5px; background: #f1f6f0; }
.quiet-note > span { color: #639575; font-size: 17px; }
.quiet-note p { margin: 0; color: #7d8a7f; font-size: 8px; line-height: 1.5; }
.quiet-note strong { color: #41694e; font-size: 9px; }
.lower-grid { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(220px, .8fr); gap: 13px; }
.link-button { padding: 4px 0; border: 0; background: transparent; color: #39815e; cursor: pointer; font-size: 9px; font-weight: 600; }
.booking-row { display: flex; align-items: center; gap: 11px; margin-top: 13px; padding-top: 12px; border-top: 1px solid #eff1ee; }
.date-tile { display: grid; width: 38px; height: 42px; flex: 0 0 auto; align-content: center; justify-items: center; border-radius: 4px; background: #f8eee5; color: #b47c54; }
.date-tile b { font-size: 15px; line-height: 1; }
.date-tile span { margin-top: 3px; font-size: 7px; font-weight: 700; }
.booking-info { display: grid; min-width: 0; gap: 4px; }
.booking-info strong { overflow: hidden; color: #4d5b51; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.booking-info span { color: #929a94; font-size: 8px; }
.booking-info i { padding: 0 3px; color: #d38a67; font-style: normal; }
.confirmed-tag { margin-left: auto; padding: 5px 7px; border-radius: 10px; background: #eaf4ed; color: #43815e; font-size: 8px; white-space: nowrap; }
.streak-panel { display: flex; align-items: center; gap: 10px; background: #fcf7ee; }
.streak-mark { display: grid; width: 34px; height: 34px; flex: 0 0 auto; place-items: center; border-radius: 50%; background: #f4e6cc; color: #c48d4d; font-size: 20px; }
.streak-panel > div:nth-child(2) { min-width: 0; }
.streak-panel p { line-height: 1.5; }
.streak-panel > strong { margin-left: auto; color: #98703c; font-size: 21px; }
.streak-panel > strong small { display: block; color: #9e8b6e; font-size: 8px; font-weight: 500; text-align: center; }
@media (max-width: 900px) { .dashboard-grid, .lower-grid { grid-template-columns: 1fr; } }
@media (max-width: 620px) { .stats-grid { grid-template-columns: 1fr 1fr; } .stat-card:last-child { grid-column: 1 / -1; } .streak-panel { min-height: 80px; } }
@media (max-width: 430px) { .stats-grid { grid-template-columns: 1fr; } .stat-card:last-child { grid-column: auto; } .stat-card { min-height: 128px; } .chart-legend { gap: 8px; } .chart-legend b { display: none; } .confirmed-tag { display: none; } }
</style>
