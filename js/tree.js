import { syncToSupabase } from './supabase.js';

const NUTRIENTS = {
  'hs-detective': { name: '비료', color: '#8b5e3c' },
  'hs-council':   { name: '비료', color: '#8b5e3c' },
  'hs-botanical': { name: '비료', color: '#8b5e3c' },
  'hs-haunted':   { name: '물',   color: '#3a7abf' },
  'hs-guest':     { name: '물',   color: '#3a7abf' },
  'hs-airport':   { name: '물',   color: '#3a7abf' },
  'hs-cinema':    { name: '양분', color: '#5a8a3a' },
  'hs-lp':        { name: '양분', color: '#5a8a3a' },
  'hs-culture':   { name: '양분', color: '#5a8a3a' },
};
const NUTRIENT_TYPES = { '비료': '#8b5e3c', '물': '#3a7abf', '양분': '#5a8a3a' };
const NUTRIENT_ICONS = { '비료': '🌱', '물': '💧', '양분': '🍃' };

const treeImages = ['', 'tree 1.png', 'tree 2.png', 'tree 3.png'];
const treeSizes  = [0, 200, 320, 420];
const treeLevels = ['묘목', '작은 나무', '중간 나무', '가장 큰 나무'];

function getUser() { return window.appState?.currentUser; }

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function todayNutrientVisitedKey() {
  return `nv_visited_${getUser()}_${todayStr()}`;
}

function todayFedKey() {
  return `nv_fed_${getUser()}_${todayStr()}`;
}

function getVisitedToday() {
  if (!getUser()) return [];
  return JSON.parse(localStorage.getItem(todayNutrientVisitedKey()) || '[]');
}

export function canCollect(id) {
  if (!getUser() || !NUTRIENTS[id]) return false;
  return !getVisitedToday().includes(id);
}

export function getBag() {
  if (!getUser()) return [];
  return JSON.parse(localStorage.getItem('nv_bag_' + getUser()) || '[]');
}

function saveBag(bag) {
  localStorage.setItem('nv_bag_' + getUser(), JSON.stringify(bag));
}

function getFedTypes() {
  if (!getUser()) return [];
  try { return JSON.parse(localStorage.getItem(todayFedKey()) || '[]'); } catch { return []; }
}

function getIndCounts() {
  if (!getUser()) return { '비료': 0, '물': 0, '양분': 0 };
  return JSON.parse(localStorage.getItem('nv_given_' + getUser()) || '{"비료":0,"물":0,"양분":0}');
}

function getIndSets() {
  if (!getUser()) return 0;
  return parseInt(localStorage.getItem('nv_ind_sets_' + getUser()) || '0');
}

export function collectNutrient(id) {
  if (!canCollect(id)) return;
  const visited = getVisitedToday();
  visited.push(id);
  localStorage.setItem(todayNutrientVisitedKey(), JSON.stringify(visited));
  const bag = getBag();
  bag.push(NUTRIENTS[id].name);
  saveBag(bag);
  updateBagUI();
}

export function applyDecay(user) {
  const u = user || getUser();
  if (!u) return;
  const last  = localStorage.getItem('nv_lastcheck_' + u);
  const today = todayStr();
  if (!last) { localStorage.setItem('nv_lastcheck_' + u, today); return; }
  if (last === today) return;
  const days  = Math.round((new Date(today) - new Date(last)) / 86400000);
  const level = parseInt(localStorage.getItem('nv_level_' + u) || '0');
  localStorage.setItem('nv_level_' + u, Math.max(0, level - days));
  localStorage.setItem('nv_lastcheck_' + u, today);
}

export function getCurrentLevel() {
  if (!getUser()) return 0;
  applyDecay();
  return parseInt(localStorage.getItem('nv_level_' + getUser()) || '0');
}

export function getUserFedCount(user) {
  applyDecay(user);
  return parseInt(localStorage.getItem('nv_level_' + user) || '0');
}

export function growTree() {
  if (!getUser()) return;
  applyDecay();
  const level = parseInt(localStorage.getItem('nv_level_' + getUser()) || '0');
  localStorage.setItem('nv_level_' + getUser(), Math.min(3, level + 1));
  localStorage.setItem('nv_lastcheck_' + getUser(), todayStr());
  updateTree();
  syncToSupabase();
}

export function feedSet() {
  const bag = getBag();
  const has = type => bag.includes(type);
  if (!has('비료') || !has('물') || !has('양분')) return;
  ['비료', '물', '양분'].forEach(type => {
    const idx = bag.indexOf(type);
    bag.splice(idx, 1);
  });
  saveBag(bag);
  growTree();
  updateBagUI();
}

export function feedOneNutrient(type) {
  const bag = getBag();
  const idx = bag.indexOf(type);
  if (idx === -1) return;
  bag.splice(idx, 1);
  saveBag(bag);

  const counts = getIndCounts();
  counts[type] = (counts[type] || 0) + 1;
  localStorage.setItem('nv_given_' + getUser(), JSON.stringify(counts));

  const possible  = Math.min(counts['비료'], counts['물'], counts['양분']);
  const completed = getIndSets();
  const newSets   = possible - completed;
  if (newSets > 0) {
    localStorage.setItem('nv_ind_sets_' + getUser(), possible);
    for (let i = 0; i < newSets; i++) growTree();
  }

  updateBagUI();
}

export function updateBagUI() {
  const bag    = getBag();
  const counts = { '비료': 0, '물': 0, '양분': 0 };
  bag.forEach(n => { if (counts[n] !== undefined) counts[n]++; });

  Object.keys(counts).forEach(name => {
    const countEl = document.getElementById('bag-count-' + name);
    if (countEl) countEl.textContent = counts[name];
    const btn = document.getElementById('ni-btn-' + name);
    if (btn) btn.disabled = counts[name] === 0;
  });

  const canFeed = counts['비료'] >= 1 && counts['물'] >= 1 && counts['양분'] >= 1;
  const btn = document.getElementById('feed-set-btn');
  if (btn) {
    btn.disabled = !canFeed;
    btn.style.opacity = canFeed ? '1' : '0.35';
    btn.style.cursor  = canFeed ? 'pointer' : 'default';
  }
}

export function updateTree() {
  const level  = getCurrentLevel();
  const treeEl = document.getElementById('mh-tree');
  if (!treeEl) return;
  treeEl.innerHTML = level === 0
    ? ''
    : `<img src="${treeImages[level]}" height="${treeSizes[level]}" alt="나무">`;
  document.getElementById('mh-level-badge').textContent = treeLevels[level];
  document.getElementById('mh-progress-label').textContent = `레벨 ${level} / 3`;
  document.getElementById('mh-progress-fill').style.width = (level / 3 * 100) + '%';
}

export function openBoutiqueModal(id, title, body) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = body.replace(/\n/g, '<br>');
  const nutrientSection = document.getElementById('modal-nutrient');
  const nutrientContent = document.getElementById('modal-nutrient-content');
  const n = NUTRIENTS[id];
  if (n && getUser()) {
    const alreadyHad = !canCollect(id);
    if (!alreadyHad) collectNutrient(id);
    nutrientSection.style.display = 'block';
    const icon = NUTRIENT_ICONS[n.name] || '';
    nutrientContent.innerHTML = alreadyHad
      ? `<div class="modal-nutrient-chip" style="background:#888">${icon} ${n.name}</div>
         <div class="modal-nutrient-msg">오늘 이미 받았어요.</div>`
      : `<div class="modal-nutrient-chip" style="background:${n.color}">${icon} ${n.name}</div>
         <div class="modal-nutrient-msg" style="color:#2d6a4f;font-weight:700">가방에 담겼어요!</div>`;
  } else if (n && !getUser()) {
    nutrientSection.style.display = 'block';
    nutrientContent.innerHTML =
      `<div class="modal-nutrient-msg">로그인하면 <strong>${n.name}</strong>을 받을 수 있어요.</div>`;
  } else {
    nutrientSection.style.display = 'none';
  }
  document.getElementById('modal-bg').classList.add('open');
}

window.openBoutiqueModal = openBoutiqueModal;
window.feedSet           = feedSet;
window.feedOneNutrient   = feedOneNutrient;
