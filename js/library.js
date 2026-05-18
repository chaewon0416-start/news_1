  'use strict';

  const LIB_ARTICLES = [
    { id:1, section:'구의회', author:'고성준', date:'2026.05.03',
      title:'구의회, 마을 환경 개선 예산안 최종 통과',
      summary:'주민 편의시설 확충과 녹지 공간 조성에 중점을 둔 예산안이 이번 회기 최종 통과되었다.',
      body:`이번 회기에서 마을 환경 개선을 위한 예산안이 최종 통과되었습니다.\n\n주요 내용은 다음과 같습니다.\n\n· 주민 편의시설 확충 (벤치, 쉼터, 음수대 등)\n· 녹지 공간 조성 — 마을 회관 인근 소공원 신설\n· 보도블록 전면 정비 (마을회관~광장 구간 우선)\n· 야간 조명 개선\n\n예산안은 찬성 8표, 반대 1표, 기권 1표로 통과되었으며, 올해 하반기부터 순차적으로 공사에 들어갈 예정입니다.` },
    { id:2, section:'문화', author:'박민수', date:'2026.05.03',
      title:'문화 다방, 봄맞이 특별 전시회 이번 주말 개최',
      summary:'지역 예술가 12인이 참여한 봄 수채화 전시회. 입장 무료, 주말 내내 진행.',
      body:`문화 다방에서는 이번 주말부터 지역 예술가들의 봄 작품 전시회를 개최합니다.\n\n이번 전시에는 총 12인의 마을 예술가가 참여하며, 주제는 '봄, 마을, 사람'입니다.\n\n· 수채화 중심의 계절 풍경 작품 40여 점\n· 토요일 오후 2시 작가와의 대화\n· 일요일 어린이 체험 워크숍 (무료)\n\n누구나 무료로 관람할 수 있습니다.` },
    { id:3, section:'공항', author:'김미항', date:'2026.05.04',
      title:'신규 국내선 노선 취항, 지역 접근성 크게 향상',
      summary:'다음 달부터 신규 국내선 2개 노선 운항 시작. 하루 왕복 4편 예정.',
      body:`공항에 신규 국내선 노선이 취항하며 마을의 이동 편의성이 크게 향상될 전망입니다.\n\n신규 노선 개요:\n· A노선 — 수도권 직항 (하루 왕복 2편)\n· B노선 — 남부 거점 도시 직항 (하루 왕복 2편)\n\n운항은 다음 달 첫 주부터 시작되며, 초기 3개월간 취항 기념 할인 요금이 적용됩니다.` },
    { id:4, section:'식물원', author:'진새민', date:'2026.05.04',
      title:'희귀 식물 20여 종, 이번 주 토요일 최초 공개',
      summary:'해외에서 들여온 희귀 식물 20여 종이 이번 주 토요일 마을 식물원에서 공개된다.',
      body:`지역 식물원에서 해외에서 들여온 희귀 식물 20여 종을 새롭게 공개합니다.\n\n주요 전시 식물:\n· 파라과이산 수련 변종\n· 말레이시아산 식충 식물 3종\n· 안데스 고산 선인장류 8종\n· 아프리카 원산 다육식물 희귀 품종 5종\n\n사전 예약 없이 관람 가능하며, 전문 해설사가 오전 11시와 오후 2시 두 차례 가이드 투어를 진행합니다.` },
    { id:5, section:'탐사', author:'하채림', date:'2026.05.05',
      title:'[탐정 하우스] 석 달의 추적 — 미확인 제보의 진실',
      summary:'독자 제보로 시작된 탐사 보도. 석 달간의 추적 끝에 드러난 마을 행정의 이면.',
      body:`독자 제보로 시작된 이번 탐사 보도는 석 달간의 끈질긴 추적 끝에 완성되었습니다.\n\n발단은 지난 2월, 한 독자의 짧은 제보였습니다. "마을 공사 계약 과정이 수상하다"는 내용이었습니다.\n\n취재팀은 정보공개 청구, 관계자 인터뷰, 문서 분석을 통해 다음을 확인했습니다.\n\n· 특정 업체에 대한 수의계약 반복 체결 (3년간 7건)\n· 입찰 공고 기간이 법정 기준보다 짧은 사례 다수\n· 감리 기록과 현장 시공 내용의 불일치` },
    { id:6, section:'영화', author:'이재림', date:'2026.05.06',
      title:'이번 주 개봉작 리뷰 — 기대작 3편 한눈에',
      summary:'장르도 분위기도 제각각인 이번 주 개봉 3편. 어떤 작품을 고를지 고민된다면.',
      body:`이번 주 영화관에는 개성 강한 세 편의 신작이 걸립니다.\n\n─ 첫 번째 작품 ─\n장르: 스릴러 / 상영시간: 118분\n조용하고 느린 전반부가 후반부의 폭발적인 반전을 위한 준비였음을 깨닫는 순간, 숨이 막힙니다.\n\n─ 두 번째 작품 ─\n장르: 애니메이션 / 상영시간: 94분\n어른이 봐도 충분히 울 수 있는 작품. 가족 관람 추천.\n\n─ 세 번째 작품 ─\n장르: 다큐멘터리 / 상영시간: 87분\n지역 소상공인들의 이야기를 담은 독립 다큐.` },
  ];

  const LIB_ANSWERS = {
    '오늘의 뉴스를 요약해 줘': '오늘 뉴스 마을의 주요 소식입니다. 구의회에서 마을 환경 개선 예산안이 최종 통과되었고, 문화 다방에서는 이번 주말 봄 전시회가 열립니다. 공항에 신규 국내선 노선이 취항하며 접근성이 크게 향상될 예정이고, 식물원에서는 희귀 식물 20여 종을 토요일에 공개합니다.',
    '마을 행사 일정을 알려줘': '이번 주 마을 행사입니다. 토요일에는 식물원 희귀 식물 공개 행사가, 주말 내내 문화 다방 봄 전시회가 진행됩니다. 토요일 오후 2시에는 작가와의 대화, 일요일에는 어린이 체험 워크숍도 있습니다.',
    '탐사 보도란 무엇인가요?': '탐사 보도는 공공의 이익을 위해 숨겨진 사실을 심층 취재하는 저널리즘입니다. 뉴스 마을에서는 탐정 하우스의 하채림이 담당하며, 독자 제보를 바탕으로 긴 시간 추적 취재를 진행합니다. 제보는 광장 제보란을 이용해 주세요.',
    '투고하려면 어떻게 하나요?': '독자 기고는 광장 서비스의 투고란을 통해 신청할 수 있습니다. 에세이, 칼럼, 시, 소설, 리뷰 등 형식은 자유이며 600~2,000자를 권장합니다. 편집부 검토 후 M북에 게재되며, 채택 시 연락처로 개별 안내 드립니다.',
  };
  const LIB_FALLBACKS = [
    '사서가 열심히 찾아보았지만 조금 더 연구가 필요한 질문입니다. 광장 게시판에 올려 마을 주민들의 지혜를 빌려보는 건 어떨까요?',
    '흥미로운 질문이네요. 편집부에 직접 문의하시거나 광장의 제보란을 이용해 주세요.',
    '좋은 질문입니다. 이 주제는 마을 주민들과 광장에서 함께 토론해보면 더 풍부한 답을 얻을 수 있을 것 같습니다.',
  ];

  let libFbIdx = 0;

  function libGetAnswer(q) {
    for (const k of Object.keys(LIB_ANSWERS)) {
      if (q.includes(k.slice(0, 5))) return LIB_ANSWERS[k];
    }
    return LIB_FALLBACKS[libFbIdx++ % LIB_FALLBACKS.length];
  }

  function libNowStr() {
    const d = new Date();
    return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }
  function $(id) { return document.getElementById(id); }

  let libEntryCount = 0;

  function libSubmit() {
    const inp = $('lib-input');
    const q = inp.value.trim();
    if (!q) return;
    inp.value = '';

    const prompts = ['또 다른 질문이 있으신가요?', '더 궁금한 것을 물어보세요.', '사서가 기다리고 있습니다.', '무엇이든 물어보세요.'];
    $('lib-prompt').textContent = prompts[libEntryCount % prompts.length];

    libEntryCount++;
    const id   = Date.now();
    const num  = String(libEntryCount).padStart(2, '0');
    const time = libNowStr();

    const empty = $('lib-empty');
    if (empty) empty.remove();

    $('lib-log-count').textContent = `${libEntryCount}건`;

    const div = document.createElement('div');
    div.className = 'lib-entry';
    div.id = `lib-entry-${id}`;
    div.innerHTML = `
      <div class="lib-entry-num">${num}</div>
      <div>
        <div class="lib-entry-q">${q}</div>
        <div class="lib-entry-a" id="lib-a-${id}">
          <div class="lib-typing"><span></span><span></span><span></span></div>
        </div>
        <div class="lib-entry-time">${time}</div>
      </div>`;

    const log = $('lib-log');
    log.insertBefore(div, log.firstChild);

    setTimeout(() => {
      const ans = libGetAnswer(q);
      const el  = $(`lib-a-${id}`);
      if (el) el.textContent = ans;
    }, 900 + Math.random() * 500);

    $('lib-log-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  $('lib-send').addEventListener('click', libSubmit);
  $('lib-input').addEventListener('keydown', e => { if (e.key === 'Enter') libSubmit(); });
  document.querySelectorAll('.lib-sug').forEach(b => {
    b.addEventListener('click', () => {
      $('lib-input').value = b.dataset.q;
      libSubmit();
    });
  });

  function libRenderArticles() {
    const grid = $('lib-grid');
    grid.innerHTML = LIB_ARTICLES.map(a => `
      <div class="lib-article" data-id="${a.id}">
        <div class="lib-article-section">${a.section}</div>
        <div class="lib-article-title">${a.title}</div>
        <div class="lib-article-body">${a.summary}</div>
        <div class="lib-article-meta">
          <span>${a.author} · ${a.date}</span>
          <span class="lib-article-badge">읽기 →</span>
        </div>
      </div>`).join('');

    grid.querySelectorAll('.lib-article').forEach(el => {
      el.addEventListener('click', () => libOpenArticle(parseInt(el.dataset.id)));
    });
  }

  function libOpenArticle(id) {
    const a = LIB_ARTICLES.find(x => x.id === id);
    if (!a) return;
    $('lib-full-section').textContent = a.section;
    $('lib-full-title').textContent   = a.title;
    $('lib-full-meta').textContent    = `${a.author} · ${a.date}`;
    $('lib-full-body').textContent    = a.body;
    $('lib-full').classList.add('active');
    $('lib-full').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  $('lib-af-back').addEventListener('click', () => {
    $('lib-full').classList.remove('active');
    $('lib-articles-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  libRenderArticles();
