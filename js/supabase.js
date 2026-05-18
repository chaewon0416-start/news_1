import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SB_URL, SB_KEY } from './config.js';

export const sb = createClient(SB_URL, SB_KEY);

export async function syncToSupabase() {
  const user = window.appState?.currentUser;
  if (!user) return;
  try {
    await sb.from('users').upsert({
      kakao_id:   user,
      nickname:   localStorage.getItem('nv_nick_' + user) || user,
      tree_level: parseInt(localStorage.getItem('nv_level_' + user) || '0'),
      given:      JSON.parse(localStorage.getItem('nv_given_' + user) || '{"비료":0,"물":0,"양분":0}'),
      last_check: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
    }, { onConflict: 'kakao_id' });
  } catch (e) { console.warn('Supabase sync failed:', e); }
}

export function shareMyLink() {
  const user = window.appState?.currentUser;
  if (!user) { alert('로그인 후 공유할 수 있어요!'); return; }
  const url = location.origin + location.pathname + '?view=' + user;
  navigator.clipboard.writeText(url)
    .then(() => alert('링크가 복사됐어요! 친구에게 공유해보세요 🌿'))
    .catch(() => prompt('아래 링크를 복사해서 친구에게 보내세요:', url));
}

export async function addFriend(friendId) {
  const user = window.appState?.currentUser;
  if (!user) { alert('로그인 후 친구 추가가 가능해요!'); return; }
  if (user === friendId) { alert('자기 자신은 추가할 수 없어요!'); return; }

  const { data, error } = await sb.from('users').select('friends').eq('kakao_id', user).single();
  if (error) { alert('오류가 발생했어요.'); return; }

  const friends = Array.isArray(data?.friends) ? data.friends : [];
  if (friends.includes(friendId)) { alert('이미 친구예요!'); return; }

  friends.push(friendId);
  const { error: updateError } = await sb.from('users').update({ friends }).eq('kakao_id', user);
  if (updateError) { alert('친구 추가 실패. 다시 시도해주세요.'); return; }

  const btn = document.getElementById('friend-add-btn');
  if (btn) { btn.textContent = '✓ 친구 추가됨'; btn.disabled = true; btn.style.opacity = '0.6'; }
  alert('친구가 추가됐어요! 🌳');
}

export async function loadFriendsListView() {
  const singleEl = document.getElementById('friend-single-view');
  const listEl   = document.getElementById('friends-list-view');
  if (singleEl) singleEl.style.display = 'none';
  if (listEl)   listEl.style.display = 'flex';
  window.switchTo?.('friends');

  const cardsEl = document.getElementById('friends-list-cards');
  if (!cardsEl) return;

  const user = window.appState?.currentUser;
  if (!user) {
    cardsEl.innerHTML = '<div class="friends-empty">로그인 후 친구 목록을 볼 수 있어요.</div>';
    return;
  }

  cardsEl.innerHTML = '<div class="friends-empty">불러오는 중...</div>';

  const { data: userData } = await sb.from('users').select('friends').eq('kakao_id', user).single();
  const friendIds = Array.isArray(userData?.friends) ? userData.friends : [];

  if (friendIds.length === 0) {
    cardsEl.innerHTML = '<div class="friends-empty">아직 추가한 친구가 없어요.<br><br>친구 링크를 받아서 추가해보세요!</div>';
    return;
  }

  const { data: friends } = await sb.from('users').select('kakao_id, nickname, tree_level').in('kakao_id', friendIds);
  const imgs  = ['', 'tree 1.png', 'tree 2.png', 'tree 3.png'];
  const names = ['묘목', '작은 나무', '중간 나무', '가장 큰 나무'];

  cardsEl.innerHTML = (friends || []).map(f => {
    const level = f.tree_level || 0;
    const treeHTML = level === 0
      ? '<div class="friend-tree-empty">씨앗 🌱</div>'
      : `<img src="${imgs[level]}" alt="나무">`;
    return `<div class="friend-card" style="cursor:pointer;" onclick="loadFriendView('${f.kakao_id}', true)">
      <div class="friend-tree-area">${treeHTML}</div>
      <div class="friend-name">${f.nickname || '친구'}</div>
      <div class="friend-level">${names[level]}</div>
    </div>`;
  }).join('');
}

export async function loadFriendView(kakaoId, fromList = false) {
  const singleEl = document.getElementById('friend-single-view');
  const listEl   = document.getElementById('friends-list-view');
  if (singleEl) singleEl.style.display = '';
  if (listEl)   listEl.style.display = 'none';

  document.getElementById('friend-view-title').textContent = '불러오는 중…';
  document.getElementById('friend-view-content').innerHTML = '';
  const treeEl = document.getElementById('friend-tree-display');
  if (treeEl) treeEl.innerHTML = '';

  const backVillage = document.getElementById('friend-back-village');
  const backList    = document.getElementById('friend-back-list');
  if (backVillage) backVillage.style.display = fromList ? 'none' : 'block';
  if (backList)    backList.style.display    = fromList ? 'block' : 'none';

  window._viewingFriendId = kakaoId;
  window.switchTo?.('friends');

  try {
    const { data: d, error } = await sb.from('users').select('nickname, tree_level')
      .eq('kakao_id', kakaoId).single();

    if (error || !d) {
      document.getElementById('friend-view-title').textContent = '친구의 정원';
      document.getElementById('friend-view-content').innerHTML =
        `<div class="mh-info"><div class="mh-level-badge" style="color:rgba(255,255,255,0.4);">존재하지 않는 친구예요</div></div>`;
      return;
    }

    const level = d.tree_level || 0;
    const imgs  = ['', 'tree 1.png', 'tree 2.png', 'tree 3.png'];
    const sizes = [0, 200, 320, 420];
    const names = ['묘목', '작은 나무', '중간 나무', '가장 큰 나무'];

    if (treeEl) {
      treeEl.innerHTML = level === 0
        ? ''
        : `<img src="${imgs[level]}" height="${sizes[level]}" alt="나무">`;
    }

    document.getElementById('friend-view-title').textContent = (d.nickname || '친구') + '님의 정원';
    document.getElementById('friend-view-content').innerHTML =
      `<div class="mh-info">` +
        `<div class="mh-level-badge">${names[level]}</div>` +
        `<div class="mh-progress-row">` +
          `<div class="mh-progress-label">레벨 ${level} / 3</div>` +
          `<div class="mh-progress-bar"><div class="mh-progress-fill" style="width:${(level / 3 * 100).toFixed(0)}%"></div></div>` +
        `</div>` +
      `</div>` +
      `<div class="mh-nav" id="friend-add-nav"></div>`;

    const currentUser = window.appState?.currentUser;
    if (currentUser && currentUser !== kakaoId) {
      const { data: myData } = await sb.from('users').select('friends').eq('kakao_id', currentUser).single();
      const myFriends = Array.isArray(myData?.friends) ? myData.friends : [];
      const isAlreadyFriend = myFriends.includes(kakaoId);

      const navEl = document.getElementById('friend-add-nav');
      if (navEl) {
        navEl.innerHTML = `<button class="mh-btn primary" id="friend-add-btn" onclick="addFriend(window._viewingFriendId)">${isAlreadyFriend ? '✓ 이미 친구예요' : '+ 친구 추가'}</button>`;
        const addBtn = document.getElementById('friend-add-btn');
        if (addBtn) { addBtn.disabled = isAlreadyFriend; addBtn.style.opacity = isAlreadyFriend ? '0.6' : '1'; }
      }
    }
  } catch(err) {
    document.getElementById('friend-view-content').innerHTML =
      `<div class="mh-info"><div class="mh-level-badge" style="color:rgba(255,255,255,0.4);">불러오기 실패</div></div>`;
  }
}

export function checkInviteLink() {
  const params = new URLSearchParams(window.location.search);
  const viewId = params.get('view');
  if (!viewId) return;
  history.replaceState({}, '', window.location.pathname);
  loadFriendView(viewId);
}

window.shareMyLink         = shareMyLink;
window.loadFriendView      = loadFriendView;
window.loadFriendsListView = loadFriendsListView;
window.addFriend           = addFriend;
window.checkInviteLink     = checkInviteLink;
