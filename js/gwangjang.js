  'use strict';

  const SAMPLE = [
    { id:1, cat:'notice', badge:'공지', bc:'gj-badge-notice', title:'광장 게시판 이용 안내', author:'편집부', date:'2026.05.03', views:312, likes:24,
      body:'광장은 마을 주민 모두의 공론장입니다.\n\n· 비방·욕설·허위 사실 게시물은 삭제됩니다.\n· 광고성 글은 통보 없이 삭제될 수 있습니다.\n· 제보는 제보란을, 기고는 투고란을 이용해 주세요.\n\n건강한 광장 문화를 함께 만들어 주세요.', comments:[] },
    { id:2, cat:'tip', badge:'제보', bc:'gj-badge-tip', title:'마을회관 앞 보도블록 파손 3개월째 방치 중입니다', author:'마을주민A', date:'2026.05.07', views:87, likes:15,
      body:'마을회관 정문 앞 보도블록이 파손된 지 3개월이 지났습니다.\n어르신들이 걸려 넘어질 위험이 있는데 아직도 고쳐지지 않고 있습니다.\n\n같은 문제를 겪고 계신 분 있으시면 댓글 남겨 주세요.',
      comments:[{author:'마을주민B', time:'10:34', text:'저도 지난주에 거기서 넘어질 뻔 했어요.'},{author:'마을주민C', time:'11:02', text:'구의회 고성준 의원께 직접 연락해 보세요.'}] },
    { id:3, cat:'free', badge:'자유', bc:'gj-badge-free', title:'문화 다방 봄 전시 다녀왔습니다', author:'진새민', date:'2026.05.06', views:143, likes:31,
      body:'주말에 문화 다방 봄 전시 다녀왔는데 정말 좋았어요.\n수채화 작품들 위주로 꾸며져 있어 색감이 참 봄답더라고요.', comments:[{author:'박민수', time:'14:22', text:'이번 주말 가봐야겠네요!'}] },
    { id:4, cat:'discuss', badge:'토론', bc:'gj-badge-free', title:'신규 국내선 노선 취항, 지역 경제에 도움이 될까요?', author:'김미항', date:'2026.05.05', views:209, likes:18,
      body:'이번에 공항에 신규 국내선 노선이 취항한다는 기사 보셨나요?\n\n긍정론: 관광객 유입 → 지역 상권 활성화\n부정론: 수요 예측 실패 시 단기 적자\n\n여러분 생각은 어떠신가요?',
      comments:[{author:'고성준', time:'09:15', text:'예산 심의 당시 수요 조사를 꼼꼼히 검토했습니다.'},{author:'하채림', time:'09:47', text:'탐정 하우스에서 운항 실적 6개월 추적 취재 예정입니다.'}] },
    { id:5, cat:'question', badge:'질문', bc:'gj-badge-free', title:'식물원 희귀 식물 공개, 사전 예약 없이 정말 가능한가요?', author:'묘목123', date:'2026.05.04', views:62, likes:7,
      body:'기사에서 사전 예약 없이 관람 가능하다고 했는데, 혹시 다녀오신 분 계신가요?',
      comments:[{author:'진새민', time:'16:55', text:'네, 어제 다녀왔는데 예약 없이 바로 입장했어요.'}] },
    { id:6, cat:'free', badge:'자유', bc:'gj-badge-free', title:'LP샵에서 우연히 들은 곡이 귀에 맴돕니다', author:'정현서', date:'2026.05.03', views:95, likes:42,
      body:'LP샵에서 오후 내내 음반을 뒤지다가 어떤 재즈 앨범을 우연히 들었는데\n지금도 그 멜로디가 머릿속에서 떠나질 않아요.', comments:[] },
  ];

  let posts = JSON.parse(JSON.stringify(SAMPLE));
  let myPosts = [], myComments = [], currentCat = 'all', currentId = null, likesUsed = {};

  function today() {
    const d = new Date();
    return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
  }
  function nowTime() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }
  function toast(msg) {
    const t = document.getElementById('gj-toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2200);
  }
  function $(id) { return document.getElementById(id); }

  $('gj-today-date').textContent = today();

  document.querySelectorAll('.gj-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.gj-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.gj-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      $(`gj-panel-${tab.dataset.tab}`).classList.add('active');
      if (tab.dataset.tab === 'my') renderMyActivity();
    });
  });

  function switchGjTab(name) {
    document.querySelectorAll('.gj-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    document.querySelectorAll('.gj-panel').forEach(p => p.classList.remove('active'));
    $(`gj-panel-${name}`).classList.add('active');
  }

  function renderPosts() {
    const filtered = currentCat === 'all' ? posts : posts.filter(p => p.cat === currentCat);
    $('gj-post-list').innerHTML = filtered.map(p => `
      <div class="gj-post-item" data-id="${p.id}">
        <span class="gj-post-badge ${p.bc}">${p.badge}</span>
        <div>
          <div class="gj-post-title">${p.title}${p.comments.length ? `<span class="gj-cmts">[${p.comments.length}]</span>` : ''}</div>
          <div class="gj-post-meta">${p.author} · ${p.date}</div>
        </div>
        <div class="gj-post-right">조회 ${p.views}<br>♡ ${p.likes}</div>
      </div>
    `).join('') || '<div style="padding:20px 4px;font-size:13px;color:var(--gj-ink-light)">게시글이 없습니다.</div>';
    $('gj-post-list').querySelectorAll('.gj-post-item').forEach(el => {
      el.addEventListener('click', () => openPost(parseInt(el.dataset.id)));
    });
  }

  function openPost(id) {
    const p = posts.find(x => x.id === id);
    if (!p) return;
    currentId = id; p.views++;
    $('gj-view-badge').textContent = p.badge;
    $('gj-view-badge').className = `gj-post-badge ${p.bc}`;
    $('gj-view-title').textContent = p.title;
    $('gj-view-author').textContent = p.author;
    $('gj-view-date').textContent = p.date;
    $('gj-view-views').textContent = `조회 ${p.views}`;
    $('gj-view-body').textContent = p.body;
    $('gj-like-count').textContent = `${p.likes}명이 공감`;
    renderComments(p);
    $('gj-board-list-wrap').classList.add('hidden');
    $('gj-post-view').classList.add('active');
  }

  $('gj-back-btn').addEventListener('click', () => {
    $('gj-board-list-wrap').classList.remove('hidden');
    $('gj-post-view').classList.remove('active');
    renderPosts();
  });

  function renderComments(p) {
    $('gj-comment-count').textContent = `댓글 ${p.comments.length}`;
    $('gj-comment-list').innerHTML = p.comments.map(c => `
      <div class="gj-comment-item">
        <span class="gj-comment-author">${c.author}</span>
        <span class="gj-comment-time">${c.time}</span>
        <div class="gj-comment-text">${c.text}</div>
      </div>`).join('');
  }

  $('gj-comment-submit').addEventListener('click', () => {
    const input = $('gj-comment-input');
    const text = input.value.trim();
    if (!text) return;
    const p = posts.find(x => x.id === currentId);
    const c = { author: '나', time: nowTime(), text };
    p.comments.push(c); myComments.push({ postTitle: p.title, ...c });
    input.value = '';
    renderComments(p);
    $('gj-comment-count').textContent = `댓글 ${p.comments.length}`;
    toast('댓글이 등록되었습니다');
  });

  $('gj-like-btn').addEventListener('click', () => {
    if (!currentId || likesUsed[currentId]) { toast('이미 공감한 글입니다'); return; }
    const p = posts.find(x => x.id === currentId);
    p.likes++; likesUsed[currentId] = true;
    $('gj-like-count').textContent = `${p.likes}명이 공감`;
    toast('공감했습니다 ♡');
  });

  document.querySelectorAll('.gj-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gj-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); currentCat = btn.dataset.cat; renderPosts();
    });
  });

  $('gj-goto-write-btn').addEventListener('click', () => switchGjTab('write'));

  $('gj-write-title').addEventListener('input', function () {
    $('gj-title-count').textContent = `${this.value.length} / 60`;
  });
  $('gj-write-body').addEventListener('input', function () {
    $('gj-body-count').textContent = `${Math.min(this.value.length, 2000)} / 2000`;
  });

  $('gj-write-submit').addEventListener('click', () => {
    const title = $('gj-write-title').value.trim();
    const body  = $('gj-write-body').value.trim();
    const nick  = $('gj-write-nick').value.trim() || '마을 주민';
    const cat   = $('gj-write-cat').value;
    if (!title || !body) { toast('제목과 내용을 모두 입력해 주세요'); return; }
    const catMap   = { '자유':'free', '토론':'discuss', '질문':'question', '제보':'tip' };
    const badgeMap = { '자유':'gj-badge-free', '토론':'gj-badge-free', '질문':'gj-badge-free', '제보':'gj-badge-tip' };
    const post = { id: Date.now(), cat: catMap[cat]||'free', badge: cat, bc: badgeMap[cat]||'gj-badge-free',
                   title, author: nick, date: today(), views: 0, likes: 0, body, comments: [] };
    posts.unshift(post); myPosts.unshift(post);
    $('gj-write-title').value = ''; $('gj-write-body').value = '';
    $('gj-title-count').textContent = '0 / 60'; $('gj-body-count').textContent = '0 / 2000';
    toast('글이 광장에 게시되었습니다!');
    switchGjTab('board'); renderPosts();
  });

  $('gj-anon-check').addEventListener('change', function () {
    const n = $('gj-tip-name');
    n.disabled = this.checked;
    n.placeholder = this.checked ? '익명' : '이름을 입력해 주세요';
    n.value = '';
  });

  $('gj-tip-submit').addEventListener('click', () => {
    if (!$('gj-tip-title').value.trim() || !$('gj-tip-body').value.trim()) {
      toast('제목과 내용을 입력해 주세요'); return;
    }
    $('gj-tip-title').value = ''; $('gj-tip-body').value = ''; $('gj-tip-contact').value = '';
    toast('제보가 편집부로 전달되었습니다. 감사합니다!');
  });

  $('gj-contrib-body').addEventListener('input', function () {
    $('gj-contrib-count').textContent = `${Math.min(this.value.length, 2000)} / 2000`;
  });

  $('gj-contrib-submit').addEventListener('click', () => {
    if (!$('gj-contrib-title').value.trim() || !$('gj-contrib-body').value.trim() || !$('gj-contrib-contact').value.trim()) {
      toast('제목, 내용, 연락처를 모두 입력해 주세요'); return;
    }
    $('gj-contrib-title').value = ''; $('gj-contrib-body').value = ''; $('gj-contrib-contact').value = '';
    $('gj-contrib-count').textContent = '0 / 2000';
    toast('투고가 접수되었습니다. 편집부가 검토 후 연락드립니다.');
  });

  function renderMyActivity() {
    $('gj-my-post-count').textContent = myPosts.length;
    $('gj-my-comment-count').textContent = myComments.length;
    $('gj-my-posts-list').innerHTML = myPosts.length
      ? myPosts.map(p => `<div class="gj-post-item" style="cursor:default"><span class="gj-post-badge ${p.bc}">${p.badge}</span><div><div class="gj-post-title">${p.title}</div><div class="gj-post-meta">${p.date}</div></div><div class="gj-post-right">조회 ${p.views}</div></div>`).join('')
      : '<div style="padding:14px 4px;font-size:13px;color:var(--gj-ink-light)">아직 작성한 글이 없습니다.</div>';
    $('gj-my-comments-list').innerHTML = myComments.length
      ? myComments.map(c => `<div class="gj-comment-item"><span style="font-size:11px;color:var(--gj-ink-light)">${c.postTitle}</span><div class="gj-comment-text" style="margin-top:4px">${c.text}</div><div style="font-size:11px;color:var(--gj-ink-light);margin-top:3px">${c.time}</div></div>`).join('')
      : '<div style="padding:14px 4px;font-size:13px;color:var(--gj-ink-light)">아직 작성한 댓글이 없습니다.</div>';
  }

  renderPosts();
  renderMyActivity();
