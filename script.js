// ============================================================
// MUSIC THEORY ENGINE
// ============================================================
const NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const MODE_INTERVALS = {
  major:[0,2,4,5,7,9,11], minor:[0,2,3,5,7,8,10],
  dorian:[0,2,3,5,7,9,10], mixolydian:[0,2,4,5,7,9,10],
  lydian:[0,2,4,6,7,9,11], phrygian:[0,1,3,5,7,8,10],
};
const MODE_CHORD_QUALITIES = {
  major:['maj7','m7','m7','maj7','7','m7','m7b5'],
  minor:['m7','m7b5','maj7','m7','m7','maj7','7'],
  dorian:['m7','m7','maj7','7','m7','m7b5','maj7'],
  mixolydian:['7','m7','m7b5','maj7','m7','m7','maj7'],
  lydian:['maj7','7','m7','m7b5','maj7','m7','m7'],
  phrygian:['m7','maj7','7','m7','m7b5','maj7','m7'],
};
const ROMAN_NUMERALS = {
  major:['I','ii','iii','IV','V','vi','vii°'],
  minor:['i','ii°','III','iv','v','VI','VII'],
  dorian:['i','ii','III','IV','v','vi°','VII'],
  mixolydian:['I','ii','iii°','IV','v','vi','VII'],
  lydian:['I','II','iii','iv°','V','vi','vii'],
  phrygian:['i','II','III','iv','v°','VI','vii'],
};
const CHORD_FUNCTIONS = {
  major:['tonic','subdominant','tonic','subdominant','dominant','tonic','dominant'],
  minor:['tonic','dominant','tonic','subdominant','dominant','subdominant','dominant'],
  dorian:['tonic','subdominant','tonic','subdominant','dominant','dominant','subdominant'],
  mixolydian:['tonic','subdominant','dominant','subdominant','dominant','tonic','subdominant'],
  lydian:['tonic','dominant','tonic','subdominant','dominant','tonic','dominant'],
  phrygian:['tonic','subdominant','dominant','subdominant','dominant','subdominant','tonic'],
};
const FUNCTION_LABELS = {tonic:'Tonic',subdominant:'Subdominant',dominant:'Dominant',modal:'Modal',secondary:'Sec.Dom'};
const QUALITY_DISPLAY = {
  'maj7':'Maj 7th','m7':'Min 7th','7':'Dom 7th','m7b5':'Half-dim','dim7':'Dim 7th',
  'maj':'Major','m':'Minor','dim':'Dim','aug':'Aug','sus2':'Sus2','sus4':'Sus4',
  'add9':'Add9','9':'Dom 9th','m9':'Min 9th','maj9':'Maj 9th','13':'Dom 13th',
  '7#11':'Lyd Dom','7b9':'Dom 7b9','alt':'Altered','mMaj7':'mMaj7',
};
const MODAL_INTERCHANGE = {
  major:[
    {numeral:'bVII',quality:'7',function:'modal',source:'Mixolydian',interval:10},
    {numeral:'bIII',quality:'maj7',function:'modal',source:'Minor',interval:3},
    {numeral:'bVI',quality:'maj7',function:'modal',source:'Minor',interval:8},
    {numeral:'iv',quality:'m7',function:'modal',source:'Minor',interval:5},
    {numeral:'ii°',quality:'m7b5',function:'modal',source:'Minor',interval:2},
    {numeral:'bII',quality:'maj7',function:'modal',source:'Phrygian',interval:1},
  ],
  minor:[
    {numeral:'IV',quality:'maj7',function:'modal',source:'Dorian',interval:5},
    {numeral:'bII',quality:'7',function:'modal',source:'Phrygian',interval:1},
    {numeral:'V',quality:'7',function:'modal',source:'Harm.Minor',interval:7},
    {numeral:'i',quality:'mMaj7',function:'modal',source:'Harm.Minor',interval:0},
  ],
  dorian:[
    {numeral:'I',quality:'maj7',function:'modal',source:'Major',interval:0},
    {numeral:'bVII',quality:'7',function:'modal',source:'Mixolydian',interval:10},
    {numeral:'V',quality:'7',function:'modal',source:'Harm.Minor',interval:7},
  ],
  mixolydian:[
    {numeral:'I',quality:'maj7',function:'modal',source:'Major',interval:0},
    {numeral:'iv',quality:'m7',function:'modal',source:'Minor',interval:5},
    {numeral:'bVI',quality:'maj7',function:'modal',source:'Minor',interval:8},
  ],
  lydian:[
    {numeral:'IV',quality:'maj7',function:'modal',source:'Major',interval:5},
    {numeral:'bVII',quality:'7',function:'modal',source:'Mixolydian',interval:10},
  ],
  phrygian:[
    {numeral:'bII',quality:'maj7',function:'modal',source:'Phrygian',interval:1},
    {numeral:'IV',quality:'m7',function:'modal',source:'Minor',interval:5},
  ],
};

function getNoteIndex(note) {
  const map = {'Db':'C#','Eb':'D#','Gb':'F#','Ab':'G#','Bb':'A#'};
  return NOTES.indexOf(map[note] || note);
}
function getChordName(root, quality) {
  const qMap = {'maj7':'maj7','m7':'m7','7':'7','m7b5':'m7b5','dim7':'dim7','maj':'','m':'m','dim':'dim','aug':'aug','sus2':'sus2','sus4':'sus4','add9':'add9','9':'9','m9':'m9','maj9':'maj9','13':'13','7#11':'7#11','7b9':'7b9','alt':'alt','mMaj7':'mMaj7'};
  return root + (qMap[quality] !== undefined ? qMap[quality] : quality);
}
function getDiatonicChords(key, mode) {
  const rootIdx = getNoteIndex(key);
  const intervals = MODE_INTERVALS[mode] || MODE_INTERVALS.major;
  const qualities = MODE_CHORD_QUALITIES[mode] || MODE_CHORD_QUALITIES.major;
  const numerals = ROMAN_NUMERALS[mode] || ROMAN_NUMERALS.major;
  const functions = CHORD_FUNCTIONS[mode] || CHORD_FUNCTIONS.major;
  return intervals.map((interval, i) => {
    const noteIdx = (rootIdx + interval) % 12;
    const note = NOTES[noteIdx];
    return {note, quality:qualities[i], numeral:numerals[i], function:functions[i], name:getChordName(note, qualities[i])};
  });
}
function getModalInterchangeChords(key, mode) {
  const rootIdx = getNoteIndex(key);
  const miChords = MODAL_INTERCHANGE[mode] || MODAL_INTERCHANGE.major;
  return miChords.map(chord => {
    const noteIdx = (rootIdx + chord.interval) % 12;
    const note = NOTES[noteIdx];
    return {...chord, note, name: getChordName(note, chord.quality)};
  });
}
function getSecondaryDominants(key, mode) {
  const rootIdx = getNoteIndex(key);
  const intervals = MODE_INTERVALS[mode] || MODE_INTERVALS.major;
  const numerals = ROMAN_NUMERALS[mode] || ROMAN_NUMERALS.major;
  return [1,2,3,4,5,6].map(i => {
    const v7Interval = (intervals[i] + 7) % 12;
    const noteIdx = (rootIdx + v7Interval) % 12;
    const note = NOTES[noteIdx];
    return {note, quality:'7', numeral:`V7/${numerals[i]}`, function:'secondary', name:getChordName(note,'7')};
  });
}

// ============================================================
// AUDIO ENGINE
// ============================================================
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
const NOTE_FREQS = {'C':261.63,'C#':277.18,'D':293.66,'D#':311.13,'E':329.63,'F':349.23,'F#':369.99,'G':392.00,'G#':415.30,'A':440.00,'A#':466.16,'B':493.88};
const CHORD_INTERVALS_AUDIO = {
  'maj7':[0,4,7,11],'m7':[0,3,7,10],'7':[0,4,7,10],'m7b5':[0,3,6,10],
  'dim7':[0,3,6,9],'maj':[0,4,7],'m':[0,3,7],'dim':[0,3,6],'aug':[0,4,8],
  'sus2':[0,2,7],'sus4':[0,5,7],'add9':[0,4,7,14],'9':[0,4,7,10,14],
  'm9':[0,3,7,10,14],'maj9':[0,4,7,11,14],'13':[0,4,7,10,14,21],
  '7#11':[0,4,7,10,18],'7b9':[0,4,7,10,13],'alt':[0,4,6,10,13],'mMaj7':[0,3,7,11],
};
function playChord(rootNote, quality, e) {
  if (e) { e.stopPropagation(); e.preventDefault(); }
  try {
    const ctx = getAudioCtx();
    if (ctx.state === 'suspended') ctx.resume();
    const baseFreq = NOTE_FREQS[rootNote] || 261.63;
    const intervals = CHORD_INTERVALS_AUDIO[quality] || [0,4,7];
    const now = ctx.currentTime;
    const duration = 1.8;
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.setValueAtTime(0.35, now);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    intervals.forEach((semitones, i) => {
      const freq = baseFreq * Math.pow(2, semitones / 12);
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(masterGain);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3 / intervals.length, now + 0.02 + i * 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.start(now + i * 0.04);
      osc.stop(now + duration + 0.1);
    });
  } catch(err) { console.warn('Audio error:', err); }
}

// ============================================================
// APP STATE
// ============================================================
let sections = [];
let activeSectionId = null;
let currentPaletteTab = 'diatonic';
let dragState = {type:null, data:null, sourceIndex:null};
let sectionIdCounter = 0;
let chordIdCounter = 0;
let currentProjectId = null; // tracks which saved project is loaded
let isDirty = false; // tracks unsaved changes

// ============================================================
// DIRTY STATE
// ============================================================
function markDirty() {
  isDirty = true;
  const dot = document.getElementById('saveDot');
  const status = document.getElementById('saveStatus');
  if (dot) dot.classList.add('unsaved');
  if (status) status.textContent = 'Unsaved';
  scheduleAutosave();
}
function markClean() {
  isDirty = false;
  const dot = document.getElementById('saveDot');
  const status = document.getElementById('saveStatus');
  if (dot) dot.classList.remove('unsaved');
  if (status) status.textContent = 'Saved';
}

let autosaveTimer = null;
function scheduleAutosave() {
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => autosave(), 2000);
}
async function autosave() {
  try {
    const data = buildProjectData();
    await window.db.set('autosave_session', data);
  } catch(e) {}
}

function buildProjectData() {
  return {
    title: document.getElementById('songTitle').value || 'Untitled',
    bpm: document.getElementById('bpmInput').value,
    time: document.getElementById('timeSignature').value,
    style: document.getElementById('styleSelect').value,
    sections, sectionIdCounter, chordIdCounter,
    savedAt: new Date().toISOString(),
  };
}

// ============================================================
// SECTION MANAGEMENT
// ============================================================
function addSection(name=null, key='C', mode='major', bars=8) {
  const id = ++sectionIdCounter;
  sections.push({id, name: name || `Section ${id}`, key, mode, bars, chords:[]});
  renderSectionsList();
  selectSection(id);
  renderOverview();
  markDirty();
}
function removeCurrentSection() {
  if (!activeSectionId) return;
  sections = sections.filter(s => s.id !== activeSectionId);
  activeSectionId = sections.length > 0 ? sections[sections.length-1].id : null;
  renderSectionsList(); renderEditor(); renderOverview();
  markDirty();
}
function selectSection(id) {
  activeSectionId = id;
  renderSectionsList();
  renderEditor();
}
function getActiveSection() { return sections.find(s => s.id === activeSectionId); }

// ============================================================
// RENDER SECTIONS LIST
// ============================================================
function renderSectionsList() {
  const list = document.getElementById('sectionsList');
  list.innerHTML = '';
  sections.forEach((section, idx) => {
    const div = document.createElement('div');
    div.className = `section-item ${section.id === activeSectionId ? 'active' : ''}`;
    div.draggable = true;
    const prevSection = idx > 0 ? sections[idx-1] : null;
    const keyChanged = prevSection && (prevSection.key !== section.key || prevSection.mode !== section.mode);
    div.innerHTML = `
      <div class="section-name">${section.name}${keyChanged ? ' <span class="key-change-badge">🔑 Key Change</span>' : ''}</div>
      <div class="section-meta">
        <span class="section-key-badge">${section.key} ${section.mode}</span>
        <span style="color:var(--text3);font-size:0.65rem;">${section.chords.length} chords · ${section.bars}b</span>
      </div>
      <span class="section-drag-handle">⠿</span>
    `;
    div.addEventListener('click', () => selectSection(section.id));
    div.addEventListener('dragstart', (e) => { dragState = {type:'section-item', data:section.id, sourceIndex:idx}; div.classList.add('dragging'); e.dataTransfer.effectAllowed='move'; });
    div.addEventListener('dragend', () => div.classList.remove('dragging'));
    div.addEventListener('dragover', (e) => { e.preventDefault(); if(dragState.type==='section-item') div.classList.add('drag-over'); });
    div.addEventListener('dragleave', () => div.classList.remove('drag-over'));
    div.addEventListener('drop', (e) => {
      e.preventDefault(); div.classList.remove('drag-over');
      if (dragState.type==='section-item' && dragState.data !== section.id) {
        const fromIdx = sections.findIndex(s => s.id === dragState.data);
        const [moved] = sections.splice(fromIdx, 1);
        sections.splice(idx, 0, moved);
        renderSectionsList(); renderOverview(); markDirty();
      }
    });
    list.appendChild(div);
  });
}

// ============================================================
// RENDER EDITOR
// ============================================================
function renderEditor() {
  const header = document.getElementById('editorHeader');
  const body = document.getElementById('editorBody');
  const section = getActiveSection();
  if (!section) {
    header.style.display = 'none';
    body.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🎼</div><h3>No section selected</h3><p>Open <strong>Projects</strong> to load a template or saved song, or add a new section!</p><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;justify-content:center;"><button class="btn btn-primary" onclick="openProjectsModal()">🗂️ Open Projects</button><button class="btn btn-ghost" onclick="addSection()">+ Add Section</button></div></div>`;
    return;
  }
  header.style.display = 'flex';
  document.getElementById('sectionNameInput').value = section.name;
  document.getElementById('keySelect').value = section.key;
  document.getElementById('modeSelect').value = section.mode;
  document.getElementById('barsInput').value = section.bars;
  const nameInput = document.getElementById('sectionNameInput');
  nameInput.oninput = () => { section.name = nameInput.value; renderSectionsList(); renderOverview(); markDirty(); };
  const isEmpty = section.chords.length === 0;
  body.innerHTML = `
    <div class="progression-label">Chord Progression</div>
    <div class="chord-slots ${isEmpty?'empty-hint':''}" id="chordSlots" data-section="${section.id}"></div>
    <div style="display:flex;gap:7px;margin-top:8px;flex-wrap:wrap;">
      <button class="btn btn-ghost btn-sm" onclick="clearChords()">🗑️ Clear</button>
      <button class="btn btn-ghost btn-sm" onclick="duplicateProgression()">📋 Duplicate</button>
    </div>
    <div class="presets-section">
      <div class="progression-label" style="margin-top:14px;">Quick Progressions</div>
      <div class="presets-grid" id="presetsGrid"></div>
    </div>
  `;
  renderChordSlots();
  renderPresets();
  setupChordSlotDrop();
}

function renderChordSlots() {
  const section = getActiveSection();
  if (!section) return;
  const slots = document.getElementById('chordSlots');
  if (!slots) return;
  slots.innerHTML = '';
  slots.classList.toggle('empty-hint', section.chords.length === 0);
  section.chords.forEach((chord, idx) => slots.appendChild(createChordCard(chord, idx, true)));
}

function createChordCard(chord, idx, inSection=false) {
  const div = document.createElement('div');
  div.className = `chord-card ${chord.function}`;
  div.draggable = true;
  div.innerHTML = `
    <div class="chord-numeral">${chord.numeral}</div>
    <div class="chord-name">${chord.name}</div>
    <div class="chord-quality">${QUALITY_DISPLAY[chord.quality]||chord.quality}</div>
    <div class="chord-function">${FUNCTION_LABELS[chord.function]||chord.function}</div>
    ${inSection ? `
      <div><select class="chord-bars-select" onchange="updateChordBars(${idx},this.value)" onclick="event.stopPropagation()">
        <option value="1" ${chord.bars===1?'selected':''}>1 bar</option>
        <option value="2" ${chord.bars===2?'selected':''}>2 bars</option>
        <option value="4" ${(chord.bars===4||!chord.bars)?'selected':''}>4 bars</option>
        <option value="8" ${chord.bars===8?'selected':''}>8 bars</option>
      </select></div>
      <div class="chord-remove" onclick="removeChord(${idx})">✕</div>
    ` : ''}
    <button class="chord-play-btn" onclick="playChord('${chord.note}','${chord.quality}',event)" title="Play chord">▶</button>
  `;
  div.addEventListener('click', (e) => {
    if (!e.target.closest('.chord-remove') && !e.target.closest('.chord-bars-select') && !e.target.closest('.chord-play-btn')) {
      playChord(chord.note, chord.quality);
      div.classList.add('playing');
      setTimeout(() => div.classList.remove('playing'), 600);
    }
  });
  if (inSection) {
    div.addEventListener('dragstart', (e) => { dragState = {type:'section-chord', data:chord, sourceIndex:idx}; div.classList.add('dragging'); e.dataTransfer.effectAllowed='move'; });
    div.addEventListener('dragend', () => div.classList.remove('dragging'));
    div.addEventListener('dragover', (e) => { e.preventDefault(); });
    div.addEventListener('drop', (e) => {
      e.preventDefault(); e.stopPropagation();
      const section = getActiveSection();
      if (!section || dragState.type !== 'section-chord') return;
      const fromIdx = dragState.sourceIndex;
      const toIdx = idx;
      if (fromIdx !== toIdx) {
        const [moved] = section.chords.splice(fromIdx, 1);
        section.chords.splice(toIdx, 0, moved);
        renderChordSlots(); renderOverview(); markDirty();
      }
    });
  }
  return div;
}

function setupChordSlotDrop() {
  const slots = document.getElementById('chordSlots');
  if (!slots) return;
  slots.addEventListener('dragover', (e) => { e.preventDefault(); slots.classList.add('drag-target'); });
  slots.addEventListener('dragleave', (e) => { if (!slots.contains(e.relatedTarget)) slots.classList.remove('drag-target'); });
  slots.addEventListener('drop', (e) => {
    e.preventDefault(); slots.classList.remove('drag-target');
    const section = getActiveSection();
    if (!section) return;
    if (dragState.type === 'palette') {
      section.chords.push({...dragState.data, bars:4, id:++chordIdCounter});
      renderChordSlots(); renderOverview(); renderSectionsList(); markDirty();
    }
  });
}

function removeChord(idx) {
  const section = getActiveSection();
  if (!section) return;
  section.chords.splice(idx, 1);
  renderChordSlots(); renderOverview(); renderSectionsList(); markDirty();
}
function updateChordBars(idx, bars) {
  const section = getActiveSection();
  if (!section) return;
  section.chords[idx].bars = parseInt(bars);
  renderOverview(); markDirty();
}
function clearChords() {
  const section = getActiveSection();
  if (!section) return;
  section.chords = [];
  renderChordSlots(); renderOverview(); renderSectionsList(); markDirty();
}
function duplicateProgression() {
  const section = getActiveSection();
  if (!section || section.chords.length === 0) { showToast('No chords to duplicate!'); return; }
  section.chords = [...section.chords, ...section.chords.map(c => ({...c, id:++chordIdCounter}))];
  renderChordSlots(); renderOverview(); renderSectionsList(); markDirty();
  showToast('Progression duplicated!');
}
function onKeyChange() {
  const section = getActiveSection();
  if (!section) return;
  section.key = document.getElementById('keySelect').value;
  section.mode = document.getElementById('modeSelect').value;
  renderPalette();
  renderSectionsList();
  renderOverview();
  renderPresets(); // KEY FIX: update quick progressions on key change
  markDirty();
}
function onBarsChange() {
  const section = getActiveSection();
  if (!section) return;
  section.bars = parseInt(document.getElementById('barsInput').value) || 8;
  renderSectionsList(); markDirty();
}

// ============================================================
// PRESETS
// ============================================================
const STYLE_PRESETS = {
  jazz:[
    {name:'ii-V-I',desc:'Jazz standard',degrees:[1,4,0]},
    {name:'I-VI-ii-V',desc:'Rhythm changes A',degrees:[0,5,1,4]},
    {name:'iii-VI-ii-V',desc:'Turnaround',degrees:[2,5,1,4]},
    {name:'I-IV-iii-VI',desc:'Ascending',degrees:[0,3,2,5]},
    {name:'ii-V-I-IV',desc:'Extended ii-V-I',degrees:[1,4,0,3]},
  ],
  pop:[
    {name:'I-V-vi-IV',desc:'Pop classic',degrees:[0,4,5,3]},
    {name:'I-IV-V-I',desc:'Simple major',degrees:[0,3,4,0]},
    {name:'vi-IV-I-V',desc:'Minor feel',degrees:[5,3,0,4]},
    {name:'I-vi-IV-V',desc:'50s progression',degrees:[0,5,3,4]},
  ],
  rock:[
    {name:'I-bVII-IV',desc:'Rock anthem',degrees:[0,3,0]},
    {name:'I-IV-I-V',desc:'Classic rock',degrees:[0,3,0,4]},
    {name:'i-bVII-bVI-V',desc:'Minor rock',degrees:[0,3,2,4]},
    {name:'I-V-IV-I',desc:'Power chord',degrees:[0,4,3,0]},
  ],
  blues:[
    {name:'I7-IV7-V7',desc:'12-bar blues',degrees:[0,3,4]},
    {name:'I7-I7-IV7-IV7',desc:'Blues A section',degrees:[0,0,3,3]},
    {name:'I-IV-I-V7',desc:'Blues turnaround',degrees:[0,3,0,4]},
  ],
  bossa:[
    {name:'Imaj7-IV7',desc:'Bossa basic',degrees:[0,3]},
    {name:'ii-V-I-VI',desc:'Bossa turnaround',degrees:[1,4,0,5]},
    {name:'I-iii-IV-V',desc:'Bossa ascending',degrees:[0,2,3,4]},
  ],
  classical:[
    {name:'I-IV-V-I',desc:'Authentic cadence',degrees:[0,3,4,0]},
    {name:'I-V-vi-iii-IV',desc:'Pachelbel-like',degrees:[0,4,5,2,3]},
    {name:'i-iv-V-i',desc:'Minor cadence',degrees:[0,3,4,0]},
  ],
  metal:[
    {name:'i-bVII-bVI-V',desc:'Metal classic',degrees:[0,3,2,4]},
    {name:'i-bVI-bIII-bVII',desc:'Power metal',degrees:[0,2,1,3]},
    {name:'i-iv-bVI-V',desc:'Dark metal',degrees:[0,3,2,4]},
  ],
};

function renderPresets() {
  const grid = document.getElementById('presetsGrid');
  if (!grid) return;
  const style = document.getElementById('styleSelect').value;
  const section = getActiveSection();
  if (!section) return;
  const diatonic = getDiatonicChords(section.key, section.mode);
  const presets = STYLE_PRESETS[style] || STYLE_PRESETS.jazz;
  grid.innerHTML = '';
  presets.forEach(preset => {
    const btn = document.createElement('button');
    btn.className = 'preset-btn';
    const chordNames = preset.degrees.map(d => diatonic[d] ? diatonic[d].name : '?').join(' → ');
    btn.innerHTML = `<span class="preset-name">${preset.name}</span><span class="preset-chords">${chordNames}</span><span style="font-size:0.6rem;color:var(--text3)">${preset.desc}</span>`;
    btn.addEventListener('click', () => {
      preset.degrees.forEach(d => { if (diatonic[d]) section.chords.push({...diatonic[d], bars:4, id:++chordIdCounter}); });
      renderChordSlots(); renderOverview(); renderSectionsList(); markDirty();
      showToast(`Added ${preset.name}!`);
    });
    grid.appendChild(btn);
  });
}

// ============================================================
// PALETTE
// ============================================================
function switchPaletteTab(tab, el) {
  currentPaletteTab = tab;
  document.querySelectorAll('.palette-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderPalette();
}
function renderPalette() {
  const body = document.getElementById('paletteBody');
  body.innerHTML = '';
  const section = getActiveSection();
  const key = section ? section.key : 'C';
  const mode = section ? section.mode : 'major';
  if (currentPaletteTab === 'diatonic') renderDiatonicPalette(body, key, mode);
  else if (currentPaletteTab === 'modal') renderModalPalette(body, key, mode);
  else renderCustomPalette(body, key, mode);
}
function addPaletteTitle(body, text) {
  const t = document.createElement('div'); t.className = 'palette-section-title'; t.textContent = text; body.appendChild(t);
}
function renderDiatonicPalette(body, key, mode) {
  const diatonic = getDiatonicChords(key, mode);
  const secondary = getSecondaryDominants(key, mode);
  addPaletteTitle(body, `Diatonic — ${key} ${mode}`);
  const g1 = document.createElement('div'); g1.className = 'palette-chords';
  diatonic.forEach(chord => g1.appendChild(createPaletteChord(chord)));
  body.appendChild(g1);
  addPaletteTitle(body, 'Jazz Extensions');
  const extGrid = document.createElement('div'); extGrid.className = 'palette-chords';
  ['9','maj9','m9','13','7#11','7b9','alt'].forEach(q => {
    const root = diatonic[0];
    extGrid.appendChild(createPaletteChord({note:root.note, quality:q, numeral:'I', function:'tonic', name:getChordName(root.note,q)}));
  });
  body.appendChild(extGrid);
  addPaletteTitle(body, 'Secondary Dominants');
  const g3 = document.createElement('div'); g3.className = 'palette-chords';
  secondary.forEach(chord => g3.appendChild(createPaletteChord(chord)));
  body.appendChild(g3);
  const tip = document.createElement('div'); tip.className = 'theory-tip';
  tip.innerHTML = `💡 In <strong>${key} ${mode}</strong>, <strong>${diatonic[4]?.name}</strong> creates tension that resolves to <strong>${diatonic[0]?.name}</strong>. The most powerful movement in music!`;
  body.appendChild(tip);
}
function renderModalPalette(body, key, mode) {
  const miChords = getModalInterchangeChords(key, mode);
  addPaletteTitle(body, 'Modal Interchange');
  const grid = document.createElement('div'); grid.className = 'palette-chords';
  miChords.forEach(chord => {
    const el = createPaletteChord(chord);
    const src = document.createElement('div');
    src.style.cssText = 'font-size:0.54rem;color:var(--text3);margin-top:1px;';
    src.textContent = `from ${chord.source}`;
    el.appendChild(src);
    grid.appendChild(el);
  });
  body.appendChild(grid);
  const rootIdx = getNoteIndex(key);
  addPaletteTitle(body, 'Chromatic / Special');
  const specials = [
    {note:NOTES[(rootIdx+1)%12],quality:'7',numeral:'bII7',function:'modal',name:getChordName(NOTES[(rootIdx+1)%12],'7')},
    {note:NOTES[(rootIdx+6)%12],quality:'7',numeral:'TritSub',function:'modal',name:getChordName(NOTES[(rootIdx+6)%12],'7')},
    {note:NOTES[(rootIdx+3)%12],quality:'dim7',numeral:'dim7',function:'modal',name:getChordName(NOTES[(rootIdx+3)%12],'dim7')},
    {note:NOTES[(rootIdx+8)%12],quality:'aug',numeral:'aug',function:'modal',name:getChordName(NOTES[(rootIdx+8)%12],'aug')},
  ];
  const g2 = document.createElement('div'); g2.className = 'palette-chords';
  specials.forEach(c => g2.appendChild(createPaletteChord(c)));
  body.appendChild(g2);
  const tip = document.createElement('div'); tip.className = 'theory-tip';
  tip.innerHTML = `💡 <strong>Modal Interchange</strong>: borrow chords from parallel modes. In C major, <strong>Fm7</strong> (from C minor) adds a darker, richer color!`;
  body.appendChild(tip);
}
function renderCustomPalette(body, key, mode) {
  addPaletteTitle(body, 'Build Custom Chord');
  const rootIdx = getNoteIndex(key);
  const builder = document.createElement('div');
  builder.className = 'custom-chord-builder';
  builder.innerHTML = `
    <div class="custom-chord-row"><label>Root</label>
      <select class="custom-select" id="customRoot">${NOTES.map((n,i)=>`<option value="${n}" ${i===rootIdx?'selected':''}>${n}</option>`).join('')}</select>
    </div>
    <div class="custom-chord-row"><label>Quality</label>
      <select class="custom-select" id="customQuality">
        <option value="maj7">Major 7th (maj7)</option><option value="m7">Minor 7th (m7)</option>
        <option value="7">Dominant 7th (7)</option><option value="m7b5">Half-dim (m7b5)</option>
        <option value="dim7">Diminished 7th</option><option value="maj">Major</option>
        <option value="m">Minor</option><option value="sus2">Suspended 2nd</option>
        <option value="sus4">Suspended 4th</option><option value="add9">Add 9th</option>
        <option value="9">Dominant 9th</option><option value="m9">Minor 9th</option>
        <option value="maj9">Major 9th</option><option value="13">Dominant 13th</option>
        <option value="7#11">Lydian Dom (7#11)</option><option value="7b9">Dom 7b9</option>
        <option value="alt">Altered</option><option value="aug">Augmented</option>
      </select>
    </div>
    <div class="custom-chord-row"><label>Function</label>
      <select class="custom-select" id="customFunction">
        <option value="tonic">Tonic</option><option value="subdominant">Subdominant</option>
        <option value="dominant">Dominant</option><option value="modal">Modal/Borrowed</option>
        <option value="secondary">Secondary</option>
      </select>
    </div>
    <div class="custom-chord-row"><label>Numeral</label>
      <input type="text" class="custom-select" id="customNumeral" placeholder="e.g. bVII" value="I">
    </div>
    <div id="customPreview" style="text-align:center;padding:8px;margin:8px 0;background:var(--bg4);border-radius:8px;font-weight:700;font-size:1rem;cursor:pointer;" title="Click to hear"></div>
    <button class="btn btn-primary" style="width:100%;margin-top:4px;" onclick="addCustomChord()">+ Add to Section</button>
  `;
  body.appendChild(builder);
  function updatePreview() {
    const root = document.getElementById('customRoot')?.value || key;
    const quality = document.getElementById('customQuality')?.value || 'maj7';
    const preview = document.getElementById('customPreview');
    if (preview) { preview.textContent = getChordName(root, quality); preview.onclick = () => playChord(root, quality); }
  }
  setTimeout(() => {
    document.getElementById('customRoot')?.addEventListener('change', updatePreview);
    document.getElementById('customQuality')?.addEventListener('change', updatePreview);
    updatePreview();
  }, 50);
  const tip = document.createElement('div'); tip.className = 'theory-tip';
  tip.innerHTML = `💡 <strong>Custom chords</strong> let you add any chord — even outside the key. Great for chromatic movements and jazz substitutions!`;
  body.appendChild(tip);
}
function addCustomChord() {
  const section = getActiveSection();
  if (!section) { showToast('Select a section first!'); return; }
  const root = document.getElementById('customRoot').value;
  const quality = document.getElementById('customQuality').value;
  const func = document.getElementById('customFunction').value;
  const numeral = document.getElementById('customNumeral').value || '?';
  const chord = {note:root, quality, numeral, function:func, name:getChordName(root,quality), bars:4, id:++chordIdCounter};
  section.chords.push(chord);
  renderChordSlots(); renderOverview(); renderSectionsList(); markDirty();
  showToast(`Added ${chord.name}!`);
}
function createPaletteChord(chord) {
  const div = document.createElement('div');
  div.className = `palette-chord ${chord.function}`;
  div.innerHTML = `
    <div class="chord-numeral">${chord.numeral}</div>
    <div class="chord-name">${chord.name}</div>
    <div class="chord-quality">${QUALITY_DISPLAY[chord.quality]||chord.quality}</div>
    <button class="palette-play-btn" title="Play">▶</button>
  `;
  div.querySelector('.palette-play-btn').addEventListener('click', (e) => { e.stopPropagation(); playChord(chord.note, chord.quality); });
  div.addEventListener('dragstart', (e) => { dragState = {type:'palette', data:{...chord}}; e.dataTransfer.effectAllowed='copy'; });
  div.draggable = true;
  div.addEventListener('click', (e) => {
    if (e.target.closest('.palette-play-btn')) return;
    const section = getActiveSection();
    if (!section) { showToast('Select a section first!'); return; }
    section.chords.push({...chord, bars:4, id:++chordIdCounter});
    renderChordSlots(); renderOverview(); renderSectionsList(); markDirty();
    playChord(chord.note, chord.quality);
    div.classList.add('playing'); setTimeout(() => div.classList.remove('playing'), 600);
  });
  return div;
}

// ============================================================
// OVERVIEW
// ============================================================
function renderOverview() {
  const body = document.getElementById('overviewBody');
  body.innerHTML = '';
  if (sections.length === 0) { body.innerHTML = '<span style="color:var(--text3);font-size:0.73rem;">Add sections to see your song structure here...</span>'; return; }
  sections.forEach((section, idx) => {
    if (idx > 0) { const a = document.createElement('div'); a.className='overview-arrow'; a.textContent='→'; body.appendChild(a); }
    const div = document.createElement('div');
    div.className = `overview-section ${section.id===activeSectionId?'active':''}`;
    div.addEventListener('click', () => selectSection(section.id));
    const label = document.createElement('div'); label.className='overview-section-label'; label.textContent=section.name;
    const keyEl = document.createElement('div'); keyEl.className='overview-section-key'; keyEl.textContent=`${section.key} ${section.mode}`;
    const chordsEl = document.createElement('div'); chordsEl.className='overview-chords';
    section.chords.slice(0,8).forEach(chord => {
      const c = document.createElement('div');
      c.className=`overview-chord ${chord.function}`;
      c.textContent=chord.name.length>4?chord.name.substring(0,4):chord.name;
      c.title=chord.name;
      chordsEl.appendChild(c);
    });
    if (section.chords.length>8) { const m=document.createElement('div'); m.className='overview-chord'; m.style.background='var(--bg4)'; m.style.color='var(--text2)'; m.textContent=`+${section.chords.length-8}`; chordsEl.appendChild(m); }
    if (section.chords.length===0) { const e=document.createElement('div'); e.style.cssText='font-size:0.6rem;color:var(--text3);padding:4px;'; e.textContent='empty'; chordsEl.appendChild(e); }
    div.appendChild(label); div.appendChild(keyEl); div.appendChild(chordsEl);
    body.appendChild(div);
  });
}

// ============================================================
// PROJECTS MODAL
// ============================================================
async function openProjectsModal() {
  document.getElementById('projectsModal').classList.add('show');
  await renderProjectsModal();
}
function closeProjectsModal() { document.getElementById('projectsModal').classList.remove('show'); }

async function renderProjectsModal() {
  const body = document.getElementById('projectsModalBody');
  body.innerHTML = '';

  // New Project
  const newBtn = document.createElement('button');
  newBtn.className = 'new-project-btn';
  newBtn.innerHTML = '✨ Start New Project';
  newBtn.addEventListener('click', () => { newProject(); closeProjectsModal(); });
  body.appendChild(newBtn);

  // Saved Projects
  const savedTitle = document.createElement('div'); savedTitle.className = 'modal-section-title'; savedTitle.textContent = '💾 Saved Projects'; body.appendChild(savedTitle);
  let projectsList = [];
  try { const data = await window.db.get('projects_index'); if (data && data.list) projectsList = data.list; } catch(e) {}

  if (projectsList.length === 0) {
    const noSaves = document.createElement('div'); noSaves.className = 'no-saves';
    noSaves.innerHTML = 'No saved projects yet.<br>Use the <strong>💾 Save</strong> button to save your current work!';
    body.appendChild(noSaves);
  } else {
    projectsList.slice().reverse().forEach(proj => {
      const item = document.createElement('div'); item.className = 'saved-project-item';
      const date = new Date(proj.savedAt);
      const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
      const isCurrent = proj.id === currentProjectId;
      item.innerHTML = `
        <div class="saved-project-info">
          <div class="saved-project-name">${proj.title || 'Untitled'}${isCurrent ? '<span class="current-project-badge">● Current</span>' : ''}</div>
          <div class="saved-project-meta">${proj.sectionCount} sections · ${proj.style} · ${dateStr}</div>
        </div>
        <div class="saved-project-actions">
          <button class="btn btn-primary btn-sm" data-load="${proj.id}">📂 Load</button>
          <button class="btn btn-danger btn-sm" data-delete="${proj.id}">🗑️</button>
        </div>
      `;
      item.querySelector('[data-load]').addEventListener('click', async (e) => { e.stopPropagation(); await loadProject(proj.id); closeProjectsModal(); });
      item.querySelector('[data-delete]').addEventListener('click', async (e) => { e.stopPropagation(); await deleteProject(proj.id); await renderProjectsModal(); });
      body.appendChild(item);
    });
  }

  // Templates
  const templTitle = document.createElement('div'); templTitle.className = 'modal-section-title'; templTitle.style.marginTop='16px'; templTitle.textContent = '🎼 Song Templates'; body.appendChild(templTitle);
  const templGrid = document.createElement('div'); templGrid.className = 'templates-grid';
  const templates = [
    {id:'jazz-standard', icon:'🎷', name:'Jazz Standard (AABA)', desc:'Classic jazz form with head, bridge, and outro. Perfect for standards.', sections:'Head A · Head A · Bridge B · Head A · Outro'},
    {id:'verse-chorus', icon:'🎤', name:'Verse-Chorus-Bridge', desc:'The most common pop/rock structure. Intro to outro.', sections:'Intro · Verse · Pre-Chorus · Chorus · Bridge · Outro'},
    {id:'blues', icon:'🎸', name:'12-Bar Blues', desc:'The foundation of blues, rock, and jazz. Repeating 12-bar form.', sections:'Blues A · Blues B · Solo · Blues C'},
    {id:'satriani', icon:'⚡', name:'Satriani Style', desc:'Rock/instrumental with key changes and a dramatic solo section.', sections:'Intro · Verse · Chorus · Solo (Key Change) · Bridge · Outro'},
  ];
  templates.forEach(t => {
    const card = document.createElement('div'); card.className = 'template-card';
    card.innerHTML = `<div class="template-card-icon">${t.icon}</div><div class="template-card-name">${t.name}</div><div class="template-card-desc">${t.desc}</div><div class="template-card-sections">${t.sections}</div>`;
    card.addEventListener('click', () => { loadTemplate(t.id); closeProjectsModal(); });
    templGrid.appendChild(card);
  });
  body.appendChild(templGrid);
}

function newProject() {
  sections = []; activeSectionId = null; sectionIdCounter = 0; chordIdCounter = 0;
  currentProjectId = null; // clear current project — next save will create a new one
  document.getElementById('songTitle').value = 'My Song';
  document.getElementById('bpmInput').value = '120';
  document.getElementById('timeSignature').value = '4/4';
  document.getElementById('styleSelect').value = 'jazz';
  renderSectionsList(); renderEditor(); renderPalette(); renderOverview();
  markClean();
  showToast('New project started! ✨');
}

async function saveCurrentProject() {
  const title = document.getElementById('songTitle').value || 'Untitled';

  // If we have a currentProjectId, OVERWRITE it. Otherwise create new.
  const id = currentProjectId || ('proj_' + Date.now());
  currentProjectId = id; // remember for future saves

  const data = {
    id, title,
    bpm: document.getElementById('bpmInput').value,
    time: document.getElementById('timeSignature').value,
    style: document.getElementById('styleSelect').value,
    sections, sectionIdCounter, chordIdCounter,
    savedAt: new Date().toISOString(),
  };

  try {
    await window.db.set(id, data);

    // Update index: if project already exists, update it; otherwise add it
    let projectsList = [];
    try { const idx = await window.db.get('projects_index'); if (idx && idx.list) projectsList = idx.list; } catch(e) {}

    const existingIdx = projectsList.findIndex(p => p.id === id);
    const projectMeta = {id, title, savedAt: data.savedAt, sectionCount: sections.length, style: data.style};

    if (existingIdx >= 0) {
      projectsList[existingIdx] = projectMeta; // overwrite existing entry
    } else {
      projectsList.push(projectMeta); // add new entry
    }

    if (projectsList.length > 20) projectsList = projectsList.slice(-20);
    await window.db.set('projects_index', {list: projectsList});

    // Also save as autosave
    await window.db.set('autosave_session', {...data, currentProjectId: id});

    markClean();
    showToast(`"${title}" saved! ✅`);
  } catch(e) { showToast('Save failed'); }
}

async function loadProject(id) {
  try {
    const data = await window.db.get(id);
    if (!data) { showToast('Project not found'); return; }
    applyProjectData(data);
    currentProjectId = id; // track which project is loaded
    markClean();
    showToast(`"${data.title}" loaded!`);
  } catch(e) { showToast('Load failed'); }
}

function applyProjectData(data) {
  document.getElementById('songTitle').value = data.title || '';
  document.getElementById('bpmInput').value = data.bpm || 120;
  document.getElementById('timeSignature').value = data.time || '4/4';
  document.getElementById('styleSelect').value = data.style || 'jazz';
  sections = data.sections || [];
  sectionIdCounter = data.sectionIdCounter || sections.length;
  chordIdCounter = data.chordIdCounter || 0;
  activeSectionId = sections.length > 0 ? sections[0].id : null;
  renderSectionsList(); renderEditor(); renderPalette(); renderOverview();
}

async function deleteProject(id) {
  try {
    let projectsList = [];
    const idx = await window.db.get('projects_index');
    if (idx && idx.list) projectsList = idx.list;
    projectsList = projectsList.filter(p => p.id !== id);
    await window.db.set('projects_index', {list: projectsList});
    if (currentProjectId === id) currentProjectId = null;
    showToast('Project deleted');
  } catch(e) { showToast('Delete failed'); }
}

// ============================================================
// TEMPLATES
// ============================================================
function loadTemplate(template) {
  sections = []; sectionIdCounter = 0; chordIdCounter = 0;
  currentProjectId = null; // templates start as new unsaved projects
  function addSec(name, key, mode, degrees, bars=8) {
    const id = ++sectionIdCounter;
    const diatonic = getDiatonicChords(key, mode);
    const chords = degrees.map(d => ({...diatonic[d], bars:4, id:++chordIdCounter}));
    sections.push({id, name, key, mode, bars, chords});
  }
  if (template === 'jazz-standard') {
    document.getElementById('songTitle').value = 'Jazz Standard';
    document.getElementById('styleSelect').value = 'jazz';
    addSec('Head (A)', 'F', 'major', [0,1,4,0]);
    addSec('Head (A2)', 'F', 'major', [0,1,4,0]);
    addSec('Bridge (B)', 'D', 'minor', [0,4,0,4]);
    addSec('Head (A3)', 'F', 'major', [0,1,4,0]);
    addSec('Outro', 'F', 'major', [0,5,1,4]);
    showToast('Jazz Standard (AABA) loaded!');
  } else if (template === 'verse-chorus') {
    document.getElementById('songTitle').value = 'My Song';
    addSec('Intro', 'G', 'major', [0,4,5,3]);
    addSec('Verse', 'G', 'major', [0,4,5,3]);
    addSec('Pre-Chorus', 'G', 'major', [5,3,0,4]);
    addSec('Chorus', 'G', 'major', [0,5,3,4]);
    addSec('Verse 2', 'G', 'major', [0,4,5,3]);
    addSec('Pre-Chorus 2', 'G', 'major', [5,3,0,4]);
    addSec('Chorus 2', 'G', 'major', [0,5,3,4]);
    addSec('Bridge', 'E', 'minor', [0,3,2,4]);
    addSec('Final Chorus', 'G', 'major', [0,5,3,4]);
    addSec('Outro', 'G', 'major', [0,4,0]);
    showToast('Verse-Chorus-Bridge loaded!');
  } else if (template === 'blues') {
    document.getElementById('songTitle').value = '12-Bar Blues';
    document.getElementById('styleSelect').value = 'blues';
    addSec('12-Bar Blues (A)', 'A', 'mixolydian', [0,0,3,3,0,0,4,3,0,4,0,4], 12);
    addSec('12-Bar Blues (B)', 'A', 'mixolydian', [0,0,3,3,0,0,4,3,0,4,0,4], 12);
    addSec('Solo', 'A', 'mixolydian', [0,3,4,0]);
    addSec('12-Bar Blues (C)', 'A', 'mixolydian', [0,0,3,3,0,0,4,3,0,4,0,4], 12);
    showToast('12-Bar Blues loaded!');
  } else if (template === 'satriani') {
    document.getElementById('songTitle').value = 'Satriani Style';
    document.getElementById('styleSelect').value = 'rock';
    addSec('Intro', 'E', 'major', [0,3,4,3]);
    addSec('Verse', 'E', 'major', [0,5,3,4]);
    addSec('Chorus', 'E', 'major', [0,3,5,4]);
    addSec('Solo (Key Change)', 'C', 'major', [0,3,4,5]);
    addSec('Bridge', 'A', 'minor', [0,3,2,4]);
    addSec('Chorus 2', 'E', 'major', [0,3,5,4]);
    addSec('Outro', 'E', 'major', [0,4,0]);
    showToast('Satriani Style loaded!');
  }
  activeSectionId = sections.length > 0 ? sections[0].id : null;
  renderSectionsList(); renderEditor(); renderPalette(); renderOverview();
  markDirty();
}

// ============================================================
// EXPORT
// ============================================================
function openExportModal() {
  const title = document.getElementById('songTitle').value || 'Untitled';
  const bpm = document.getElementById('bpmInput').value;
  const time = document.getElementById('timeSignature').value;
  const style = document.getElementById('styleSelect').value;
  let text = `🎵 ${title}\nBPM: ${bpm} | Time: ${time} | Style: ${style}\n${'═'.repeat(50)}\n\n`;
  sections.forEach(section => {
    text += `[${section.name}] — ${section.key} ${section.mode} | ${section.bars} bars\n`;
    text += section.chords.length > 0 ? `  ${section.chords.map(c=>`${c.name}(${c.numeral})`).join(' | ')}\n\n` : `  (no chords)\n\n`;
  });
  document.getElementById('exportContent').textContent = text;
  document.getElementById('exportModal').classList.add('show');
}
function closeExportModal() { document.getElementById('exportModal').classList.remove('show'); }
function copyExport() {
  const content = document.getElementById('exportContent').textContent;
  navigator.clipboard.writeText(content).then(() => showToast('Copied!')).catch(() => showToast('Copy failed'));
}

// ============================================================
// UTILS
// ============================================================
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// Close modals on overlay click
document.getElementById('projectsModal').addEventListener('click', (e) => { if (e.target === document.getElementById('projectsModal')) closeProjectsModal(); });
document.getElementById('exportModal').addEventListener('click', (e) => { if (e.target === document.getElementById('exportModal')) closeExportModal(); });

// Style change updates presets
document.getElementById('styleSelect').addEventListener('change', () => { if (activeSectionId) renderPresets(); markDirty(); });
document.getElementById('songTitle').addEventListener('input', markDirty);
document.getElementById('bpmInput').addEventListener('input', markDirty);
document.getElementById('timeSignature').addEventListener('change', markDirty);

// ============================================================
// INIT — restore last session
// ============================================================
async function init() {
  renderPalette();
  renderOverview();
  // Try to restore last autosaved session
  try {
    const data = await window.db.get('autosave_session');
    if (data && data.sections && data.sections.length > 0) {
      applyProjectData(data);
      currentProjectId = data.currentProjectId || null;
      markClean();
      showToast('Session restored ✅');
    }
  } catch(e) {}
}
init();