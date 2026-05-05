// ============================================================
// CONFIGURATION
// ============================================================

const QUIZ_CONFIG = {
  mode:      'immediate', // 'immediate' | 'end-review' (future)
  filter:    'all',       // 'all' | 'grass' | 'forb' | 'legume' | 'woody'
  count:     null,        // null = all in filtered set; number = random subset
  randomize: true         // true = shuffle; false = in-order by ID
};

// ============================================================
// PLANT DATA
// Columns: type, stature (grasses only), lifecycle, season,
//          origin, invasive, desirable
// ST: S=Short M=Mid T=Tall
// LH: A=Annual P=Perennial
// SG: W=Warm C=Cool
// OR: N=Native In=Introduced
// IN: true=Invasive false=Non-Invasive
// Food: true=Desirable false=Undesirable
// Note: Blackeyed Susan (#49) OR listed as "M" in source PDF —
//       treated as Native (likely typo in answer key).
// ============================================================

const PLANTS = [
  // ── Grasses ─────────────────────────────────────────────
  { id:1,  name:'Annual Threeawn',          scientific:'Aristida sp.',                type:'grass',  stature:'S', lifecycle:'A', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:2,  name:'Annual Brome',             scientific:'Bromus sp.',                  type:'grass',  stature:'S', lifecycle:'A', season:'C', origin:'In', invasive:true,  desirable:false },
  { id:3,  name:'Bermudagrass',             scientific:'Cynodon dactylon',            type:'grass',  stature:'S', lifecycle:'P', season:'W', origin:'In', invasive:true,  desirable:true  },
  { id:4,  name:'Big Bluestem',             scientific:'Andropogon gerardii',         type:'grass',  stature:'T', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:5,  name:'Blue Grama',               scientific:'Bouteloua gracilis',          type:'grass',  stature:'S', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:6,  name:'Broomsedge Bluestem',      scientific:'Andropogon virginicus',       type:'grass',  stature:'T', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:7,  name:'Buffalograss',             scientific:'Buchloe dactyloides',         type:'grass',  stature:'S', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:8,  name:'Curly Mesquite',           scientific:'Hiliaria berlangeri',         type:'grass',  stature:'S', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:9,  name:'Eastern Gamagrass',        scientific:'Tripsacum dactyloides',       type:'grass',  stature:'T', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:10, name:'Fall Witchgrass',          scientific:'Leptoloma cognatum',          type:'grass',  stature:'S', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:11, name:'Hairy Grama',              scientific:'Bouteloua hirsuta',           type:'grass',  stature:'S', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:12, name:'Hairy Tridens',            scientific:'Erioneuron pilosum',          type:'grass',  stature:'S', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:13, name:'Indiangrass',              scientific:'Sorghastrum nutans',          type:'grass',  stature:'T', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:14, name:'Johnsongrass',             scientific:'Sorghum halapense',           type:'grass',  stature:'T', lifecycle:'P', season:'W', origin:'In', invasive:true,  desirable:true  },
  { id:15, name:'Little Barley',            scientific:'Hordeum pusillum',            type:'grass',  stature:'S', lifecycle:'A', season:'C', origin:'In', invasive:true,  desirable:false },
  { id:16, name:'Little Bluestem',          scientific:'Schizachyrium scorparium',    type:'grass',  stature:'T', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:17, name:'Old World Bluestem',       scientific:'Bothriochloa ischaemum',      type:'grass',  stature:'M', lifecycle:'P', season:'W', origin:'In', invasive:true,  desirable:true  },
  { id:18, name:'Perennial Dropseed',       scientific:'Sporobolus sp.',              type:'grass',  stature:'T', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:19, name:'Perennial Threeawn',       scientific:'Aristida sp.',                type:'grass',  stature:'M', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:20, name:'Purpletop',                scientific:'Tridens flavus',              type:'grass',  stature:'T', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:21, name:'Red Grama',                scientific:'Bouteloua trifida',           type:'grass',  stature:'S', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:22, name:'Sand Dropseed',            scientific:'Sporobolus cryptandrus',      type:'grass',  stature:'M', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:23, name:'Sand Lovegrass',           scientific:'Eragrostis trichodes',        type:'grass',  stature:'M', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:24, name:'Scribner Panicum',         scientific:'Panicum oligosanthes',        type:'grass',  stature:'S', lifecycle:'P', season:'C', origin:'N',  invasive:false, desirable:true  },
  { id:25, name:'Sedge',                    scientific:'Carex sp.',                   type:'grass',  stature:'S', lifecycle:'P', season:'C', origin:'N',  invasive:false, desirable:true  },
  { id:26, name:'Sideoats Grama',           scientific:'Bouteloua curtipendula',      type:'grass',  stature:'M', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:27, name:'Silver Bluestem',          scientific:'Bothriochloa saccharoides',   type:'grass',  stature:'M', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:28, name:'Splitbeard Bluestem',      scientific:'Andropogon ternarius',        type:'grass',  stature:'M', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:29, name:'Switchgrass',              scientific:'Panicum virgatum',            type:'grass',  stature:'T', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:30, name:'Texas Bluegrass',          scientific:'Poa arachnifera',             type:'grass',  stature:'M', lifecycle:'P', season:'C', origin:'N',  invasive:false, desirable:true  },
  { id:31, name:'Texas Grama',              scientific:'Bouteloua rigidiseta',        type:'grass',  stature:'S', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:32, name:'Texas Wintergrass',        scientific:'Nasella leucotricha',         type:'grass',  stature:'S', lifecycle:'P', season:'C', origin:'N',  invasive:false, desirable:true  },
  { id:33, name:'Tumblegrass',              scientific:'Schedonnardus paniculatus',   type:'grass',  stature:'S', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:34, name:'Vine Mesquite',            scientific:'Panicum obtusum',             type:'grass',  stature:'M', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:35, name:'Weeping Lovegrass',        scientific:'Eragrostis curvula',          type:'grass',  stature:'M', lifecycle:'P', season:'W', origin:'In', invasive:false, desirable:true  },
  { id:36, name:'Western Wheatgrass',       scientific:'Pascopyrum smithii',          type:'grass',  stature:'M', lifecycle:'P', season:'C', origin:'N',  invasive:false, desirable:true  },
  { id:37, name:'Wildrye',                  scientific:'Elymus sp.',                  type:'grass',  stature:'M', lifecycle:'P', season:'C', origin:'N',  invasive:false, desirable:true  },
  { id:38, name:'Windmillgrass',            scientific:'Chloris sp.',                 type:'grass',  stature:'S', lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },

  // ── Legumes ─────────────────────────────────────────────
  { id:39, name:'Catclaw Sensitivebriar',   scientific:'Mimosa quadrivalis',          type:'legume', stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:40, name:'Bundleflower',             scientific:'Desmanthus sp.',              type:'legume', stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:41, name:'Prairie Clover',           scientific:'Dalea sp.',                   type:'legume', stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:42, name:'Scurfpea',                 scientific:'Psoralidium sp.',             type:'legume', stature:null, lifecycle:'P', season:'C', origin:'N',  invasive:false, desirable:false },
  { id:43, name:'Slender Dalea',            scientific:'Dalea enneandra',             type:'legume', stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:44, name:'Vetch',                    scientific:'Vicia sp.',                   type:'legume', stature:null, lifecycle:'A', season:'C', origin:'In', invasive:false, desirable:true  },
  { id:45, name:'Yellow Neptune',           scientific:'Neptunia lutea',              type:'legume', stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },

  // ── Forbs ────────────────────────────────────────────────
  { id:46, name:'Annual Sunflower',         scientific:'Helianthus annuus',           type:'forb',   stature:null, lifecycle:'A', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:47, name:'Antelopehorn Milkweed',    scientific:'Asclepias viridis',           type:'forb',   stature:null, lifecycle:'P', season:'C', origin:'N',  invasive:false, desirable:false },
  { id:48, name:'Beebalm',                  scientific:'Monarda citriodora',          type:'forb',   stature:null, lifecycle:'A', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:49, name:'Blackeyed Susan',          scientific:'Rudbeckia hirta',             type:'forb',   stature:null, lifecycle:'A', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:50, name:'Common Broomweed',         scientific:'Gutierrezia dracunculoides',  type:'forb',   stature:null, lifecycle:'A', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:51, name:'Compass Plant',            scientific:'Silphium laciniatum',         type:'forb',   stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:52, name:'Croton',                   scientific:'Croton sp.',                  type:'forb',   stature:null, lifecycle:'A', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:53, name:'Curlycup Gumweed',         scientific:'Grindelia squarrosa',         type:'forb',   stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:54, name:'Daisy Fleabane',           scientific:'Erigeron strigosus',          type:'forb',   stature:null, lifecycle:'A', season:'C', origin:'N',  invasive:false, desirable:false },
  { id:55, name:'Dotted Gayfeather',        scientific:'Liatris punctata',            type:'forb',   stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:56, name:'Engelmann Daisy',          scientific:'Engelmannia peristenia',      type:'forb',   stature:null, lifecycle:'P', season:'C', origin:'N',  invasive:false, desirable:true  },
  { id:57, name:'Giant Ragweed',            scientific:'Ambrosia trifida',            type:'forb',   stature:null, lifecycle:'A', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:58, name:'Halfshrub Sundrop',        scientific:'Calylophus serrulatus',       type:'forb',   stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:59, name:'Heath Aster',              scientific:'Aster ericoides',             type:'forb',   stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:60, name:'Horseweed',                scientific:'Conyza canadensis',           type:'forb',   stature:null, lifecycle:'A', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:61, name:'Maximilian Sunflower',     scientific:'Helianthus maximiliani',      type:'forb',   stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:62, name:'Pepperweed',               scientific:'Lepidium virginicum',         type:'forb',   stature:null, lifecycle:'A', season:'C', origin:'N',  invasive:false, desirable:true  },
  { id:63, name:'Prairie Coneflower',       scientific:'Ratibida columnifera',        type:'forb',   stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:64, name:'Plains Yucca',             scientific:'Yucca glauca',                type:'forb',   stature:null, lifecycle:'P', season:'C', origin:'N',  invasive:false, desirable:false },
  { id:65, name:'Prickly Pear Cactus',      scientific:'Opuntia macrorhiza',          type:'forb',   stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:true,  desirable:false },
  { id:66, name:'Sagewort',                 scientific:'Artemisia ludoviciana',       type:'forb',   stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:67, name:'Silverleaf Nightshade',    scientific:'Solanum elaeagnifolium',      type:'forb',   stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:68, name:'Snow-on-the-Mountain',     scientific:'Euphorbia marginata',         type:'forb',   stature:null, lifecycle:'A', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:69, name:'Wax Goldenweed',           scientific:'Haplopappus ciliatus',        type:'forb',   stature:null, lifecycle:'A', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:70, name:'Western Ironweed',         scientific:'Vernonia baldwinii',          type:'forb',   stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:71, name:'Western Ragweed',          scientific:'Ambrosia psilostachya',       type:'forb',   stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:72, name:'Wood Sorrel',              scientific:'Oxalis sp.',                  type:'forb',   stature:null, lifecycle:'A', season:'C', origin:'N',  invasive:false, desirable:false },
  { id:73, name:'Yarrow',                   scientific:'Achillea millefolium',        type:'forb',   stature:null, lifecycle:'P', season:'C', origin:'N',  invasive:false, desirable:false },

  // ── Woodies ──────────────────────────────────────────────
  { id:74, name:'Blackberry / Dewberry',    scientific:'Rubus sp.',                   type:'woody',  stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:true,  desirable:false },
  { id:75, name:'Blackjack Oak',            scientific:'Quercus marilandica',         type:'woody',  stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:76, name:'Cedar',                    scientific:'Juniperus sp.',               type:'woody',  stature:null, lifecycle:'P', season:'C', origin:'N',  invasive:true,  desirable:false },
  { id:77, name:'Buttonbush',               scientific:'Symphoricarpus orbiculatus',  type:'woody',  stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:78, name:'Chittamwood',              scientific:'Bumelia lanuginosa',          type:'woody',  stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:79, name:'Eastern Cottonwood',       scientific:'Populus deltoides',           type:'woody',  stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:80, name:'Elm',                      scientific:'Ulmus sp.',                   type:'woody',  stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:81, name:'Fragrant Sumac',           scientific:'Rhus aromatica',              type:'woody',  stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:82, name:'Greenbriar',               scientific:'Smilax bona-nox',             type:'woody',  stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:83, name:'Hackberry',                scientific:'Celtis sp.',                  type:'woody',  stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:84, name:'Sumac',                    scientific:'Rhus sp.',                    type:'woody',  stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:85, name:'Live Oak',                 scientific:'Quercus virginiana',          type:'woody',  stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:86, name:'Mesquite',                 scientific:'Prosopis glandulosa',         type:'woody',  stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:true,  desirable:false },
  { id:87, name:'Post Oak',                 scientific:'Quercus stellata',            type:'woody',  stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:88, name:'Plum',                     scientific:'Prunus sp.',                  type:'woody',  stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
  { id:89, name:'Redbud',                   scientific:'Cercis canadensis',           type:'woody',  stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:true  },
  { id:90, name:'Soapberry',                scientific:'Sapindus drummondii',         type:'woody',  stature:null, lifecycle:'P', season:'W', origin:'N',  invasive:false, desirable:false },
];

// ============================================================
// STATE
// ============================================================

let state = {
  queue: [],
  index: 0,
  submitted: false,
  answers: {},
  score: { plants: 0, chars: 0, charsTotal: 0 }
};

// ============================================================
// UTILITIES
// ============================================================

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getCategories(plant) {
  const cats = [
    {
      key: 'lifecycle',
      label: 'Lifecycle',
      options: [{ v: 'A', l: 'Annual' }, { v: 'P', l: 'Perennial' }]
    },
    {
      key: 'season',
      label: 'Season',
      options: [{ v: 'W', l: 'Warm' }, { v: 'C', l: 'Cool' }]
    },
    {
      key: 'origin',
      label: 'Origin',
      options: [{ v: 'N', l: 'Native' }, { v: 'In', l: 'Introduced' }]
    },
    {
      key: 'invasive',
      label: 'Invasive',
      options: [{ v: 'true', l: 'Invasive' }, { v: 'false', l: 'Non-Invasive' }]
    },
    {
      key: 'desirable',
      label: 'Desirability',
      options: [{ v: 'true', l: 'Desirable' }, { v: 'false', l: 'Undesirable' }]
    },
  ];
  if (plant.type === 'grass') {
    cats.push({
      key: 'stature',
      label: 'Stature',
      options: [{ v: 'S', l: 'Short' }, { v: 'M', l: 'Mid' }, { v: 'T', l: 'Tall' }]
    });
  }
  return cats;
}

// Returns the plant's correct answer as a string (to match dataset values stored as strings)
function getCorrectValue(plant, key) {
  if (key === 'invasive' || key === 'desirable') return String(plant[key]);
  return plant[key];
}

// ============================================================
// RENDER
// ============================================================

function selIf(configKey, btnValue) {
  const configVal = QUIZ_CONFIG[configKey];
  const configStr = configVal === null ? 'null' : String(configVal);
  return configStr === btnValue ? ' selected' : '';
}

function parseSettingValue(setting, raw) {
  if (setting === 'randomize') return raw === 'true';
  if (setting === 'count') return raw === 'null' ? null : parseInt(raw, 10);
  return raw;
}

function renderStart() {
  const available = QUIZ_CONFIG.filter === 'all'
    ? PLANTS.length
    : PLANTS.filter(p => p.type === QUIZ_CONFIG.filter).length;

  return `
    <div class="start-screen">
      <header class="start-header">
        <div class="start-title">FFA Plant Quiz</div>
        <div class="start-subtitle">Range Plant Contest Prep</div>
      </header>

      <div class="settings-card">
        <div class="settings-section">
          <div class="settings-label">Order</div>
          <div class="settings-group">
            <button class="setting-btn${selIf('randomize', 'true')}"  data-setting="randomize" data-value="true">Shuffled</button>
            <button class="setting-btn${selIf('randomize', 'false')}" data-setting="randomize" data-value="false">In Order</button>
          </div>
        </div>

        <div class="settings-section">
          <div class="settings-label">Plant Type</div>
          <div class="settings-group">
            <button class="setting-btn${selIf('filter', 'all')}"    data-setting="filter" data-value="all">All</button>
            <button class="setting-btn${selIf('filter', 'grass')}"  data-setting="filter" data-value="grass">Grass</button>
            <button class="setting-btn${selIf('filter', 'forb')}"   data-setting="filter" data-value="forb">Forb</button>
            <button class="setting-btn${selIf('filter', 'legume')}" data-setting="filter" data-value="legume">Legume</button>
            <button class="setting-btn${selIf('filter', 'woody')}"  data-setting="filter" data-value="woody">Woody</button>
          </div>
        </div>

        <div class="settings-section">
          <div class="settings-label">Quiz Length</div>
          <div class="settings-group">
            <button class="setting-btn${selIf('count', 'null')}" data-setting="count" data-value="null">All</button>
            <button class="setting-btn${selIf('count', '10')}"   data-setting="count" data-value="10">10</button>
            <button class="setting-btn${selIf('count', '20')}"   data-setting="count" data-value="20">20</button>
            <button class="setting-btn${selIf('count', '30')}"   data-setting="count" data-value="30">30</button>
            <button class="setting-btn${selIf('count', '50')}"   data-setting="count" data-value="50">50</button>
          </div>
          <div class="available-count">${available} plant${available !== 1 ? 's' : ''} available</div>
        </div>

        <div class="action-area">
          <button id="start-btn" class="action-btn">Start Quiz</button>
        </div>
      </div>
    </div>
  `;
}

function startScreen() {
  document.getElementById('start-btn').addEventListener('click', initQuiz);

  document.querySelectorAll('.settings-group').forEach(group => {
    group.addEventListener('click', e => {
      const btn = e.target.closest('.setting-btn');
      if (!btn) return;
      const setting = btn.dataset.setting;
      QUIZ_CONFIG[setting] = parseSettingValue(setting, btn.dataset.value);
      group.querySelectorAll('.setting-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (setting === 'filter') {
        const available = QUIZ_CONFIG.filter === 'all'
          ? PLANTS.length
          : PLANTS.filter(p => p.type === QUIZ_CONFIG.filter).length;
        document.querySelector('.available-count').textContent =
          `${available} plant${available !== 1 ? 's' : ''} available`;
      }
    });
  });
}

function render() {
  const app = document.getElementById('app');
  if (state.index >= state.queue.length) {
    app.innerHTML = renderResults();
    document.getElementById('change-settings-btn').addEventListener('click', () => {
      app.innerHTML = renderStart();
      startScreen();
    });
    document.getElementById('play-again-btn').addEventListener('click', initQuiz);
    return;
  }
  app.innerHTML = renderQuiz();
  document.getElementById('characteristics').addEventListener('click', handleChoiceClick);
  document.getElementById('action-btn').addEventListener('click', handleActionClick);
}

function renderQuiz() {
  const plant = state.queue[state.index];
  const total = state.queue.length;
  const pct = (state.index / total) * 100;
  const cats = getCategories(plant);
  const typeLabel = plant.type.charAt(0).toUpperCase() + plant.type.slice(1);

  return `
    <div class="quiz-screen">
      <header class="quiz-header">
        <div class="header-top">
          <span class="quiz-title">FFA Plant Quiz</span>
          <span class="progress-count">${state.index + 1}&thinsp;/&thinsp;${total}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="score-line">
          ${state.score.plants} plant${state.score.plants !== 1 ? 's' : ''} fully correct
        </div>
      </header>

      <div class="card">
        <div class="type-badge ${plant.type}">${typeLabel}</div>
        <h2 class="plant-name">${plant.name}</h2>
        <div class="plant-scientific">${plant.scientific}</div>

        <div class="characteristics" id="characteristics">
          ${cats.map(cat => `
            <div class="char-row">
              <span class="char-label">${cat.label}</span>
              <div class="btn-group">
                ${cat.options.map(opt => `
                  <button class="choice-btn" data-category="${cat.key}" data-value="${opt.v}">${opt.l}</button>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="action-area">
          <button id="action-btn" class="action-btn" disabled>Submit</button>
        </div>
      </div>
    </div>
  `;
}

function renderResults() {
  const total = state.queue.length;
  const plantPct = total > 0 ? Math.round((state.score.plants / total) * 100) : 0;
  const charPct  = state.score.charsTotal > 0
    ? Math.round((state.score.chars / state.score.charsTotal) * 100)
    : 0;

  let grade, gradeClass;
  if (charPct >= 90)      { grade = 'Excellent';    gradeClass = 'grade-a'; }
  else if (charPct >= 75) { grade = 'Good';         gradeClass = 'grade-b'; }
  else if (charPct >= 60) { grade = 'Keep Studying'; gradeClass = 'grade-c'; }
  else                    { grade = 'Needs Work';   gradeClass = 'grade-d'; }

  return `
    <div class="results-screen">
      <div class="results-card">
        <div class="results-grade ${gradeClass}">${grade}</div>
        <h2 class="results-title">Quiz Complete</h2>

        <div class="score-grid">
          <div class="score-item">
            <div class="score-value">${state.score.plants}&thinsp;/&thinsp;${total}</div>
            <div class="score-label">Plants 100% correct</div>
          </div>
          <div class="score-item">
            <div class="score-value">${state.score.chars}&thinsp;/&thinsp;${state.score.charsTotal}</div>
            <div class="score-label">Characteristics correct</div>
          </div>
        </div>

        <div class="score-pct ${gradeClass}">${charPct}%</div>
        <div class="score-pct-label">characteristic accuracy</div>

        <div class="results-buttons">
          <button id="change-settings-btn" class="action-btn secondary-btn">Change Settings</button>
          <button id="play-again-btn" class="action-btn">Play Again</button>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// EVENT HANDLERS
// ============================================================

function handleChoiceClick(e) {
  const btn = e.target.closest('.choice-btn');
  if (!btn || state.submitted) return;

  const category = btn.dataset.category;

  // Deselect sibling buttons in the same category
  document.querySelectorAll(`.choice-btn[data-category="${category}"]`)
    .forEach(b => b.classList.remove('selected'));

  btn.classList.add('selected');
  state.answers[category] = btn.dataset.value;

  checkSubmitEnabled();
}

function checkSubmitEnabled() {
  const plant = state.queue[state.index];
  const cats = getCategories(plant);
  const allAnswered = cats.every(cat => state.answers[cat.key] !== undefined);
  document.getElementById('action-btn').disabled = !allAnswered;
}

function handleActionClick() {
  if (!state.submitted) {
    submitAnswers();
  } else {
    nextPlant();
  }
}

function submitAnswers() {
  const plant = state.queue[state.index];
  const cats  = getCategories(plant);
  state.submitted = true;

  let plantCorrect = true;
  let charRight = 0;

  cats.forEach(cat => {
    const correctVal = getCorrectValue(plant, cat.key);
    const userVal    = state.answers[cat.key];
    const isCorrect  = userVal === correctVal;

    if (!isCorrect) plantCorrect = false;
    else charRight++;

    document.querySelectorAll(`.choice-btn[data-category="${cat.key}"]`).forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.value === correctVal) {
        btn.classList.add('correct');
        btn.classList.remove('selected');
      } else if (btn.dataset.value === userVal && !isCorrect) {
        btn.classList.add('incorrect');
        btn.classList.remove('selected');
      }
    });
  });

  state.score.chars      += charRight;
  state.score.charsTotal += cats.length;
  if (plantCorrect) state.score.plants++;

  const actionBtn = document.getElementById('action-btn');
  const isLast    = state.index >= state.queue.length - 1;
  actionBtn.textContent = isLast ? 'See Results' : 'Next Plant →';
  actionBtn.disabled    = false;
  if (plantCorrect) actionBtn.classList.add('correct-btn');
}

function nextPlant() {
  state.index++;
  state.submitted = false;
  state.answers   = {};
  render();
}

// ============================================================
// INIT
// ============================================================

function initQuiz() {
  let pool = [...PLANTS];
  if (QUIZ_CONFIG.filter !== 'all') pool = pool.filter(p => p.type === QUIZ_CONFIG.filter);
  if (QUIZ_CONFIG.randomize) shuffle(pool);
  if (QUIZ_CONFIG.count !== null) pool = pool.slice(0, QUIZ_CONFIG.count);
  state = {
    queue:     pool,
    index:     0,
    submitted: false,
    answers:   {},
    score:     { plants: 0, chars: 0, charsTotal: 0 }
  };
  render();
}

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  app.innerHTML = renderStart();
  startScreen();
});
