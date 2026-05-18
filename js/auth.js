import { sb, syncToSupabase } from './supabase.js';

const KAKAO_JS_KEY      = '3f744394bbccfd3efbe5231f8a786892';
const KAKAO_REDIRECT_URI = 'https://mimi079-coder.github.io/news_platform/';

try {
  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init(KAKAO_JS_KEY);
  }
} catch(e) { console.warn('Kakao SDK 초기화 실패', e); }

function onAuthChange() {
  const loggedIn = NV_AUTH.isLoggedIn;
  const user     = NV_AUTH.user;

  document.querySelectorAll('[data-auth="guest-only"]').forEach(el  => { el.style.display = loggedIn ? 'none' : ''; });
  document.querySelectorAll('[data-auth="member-only"]').forEach(el => { el.style.display = loggedIn ? '' : 'none'; });
  document.querySelectorAll('[data-auth="user-display"]').forEach(el => {
    el.textContent = loggedIn ? (user?.nickname || user?.id || '') : '';
  });

  document.querySelectorAll('[data-guest-guard]').forEach(el => {
    if (loggedIn) {
      el.removeAttribute('disabled');
      el.style.opacity = '1';
      el.style.pointerEvents = 'auto';
      el.title = '';
    } else {
      el.setAttribute('disabled', 'true');
      el.style.opacity = '0.45';
      el.style.pointerEvents = 'none';
      el.title = '로그인 후 이용할 수 있습니다';
    }
  });

  document.querySelectorAll('[data-guest-guard-wrap]').forEach(wrap => {
    const existing = wrap.querySelector('.nv-guest-banner');
    if (!loggedIn) {
      if (!existing) {
        const banner = document.createElement('div');
        banner.className = 'nv-guest-banner';
        banner.innerHTML = `
          <div class="nv-guest-banner-inner">
            <span class="nv-guest-badge">둘러보기 모드</span>
            <span class="nv-guest-msg">글 작성 · 댓글 · 제보 기능은 로그인 후 이용 가능합니다.</span>
            <button class="nv-guest-login-btn" data-auth-action="open-login">마을 입장하기 →</button>
          </div>`;
        wrap.prepend(banner);
        banner.querySelector('[data-auth-action="open-login"]')
          .addEventListener('click', () => window.openLoginModal?.());
      }
    } else {
      if (existing) existing.remove();
    }
  });
}

export const NV_AUTH = {
  user: null, token: null, isLoggedIn: false,

  login(user, token) {
    this.user = user; this.token = token; this.isLoggedIn = true;
    onAuthChange();
  },

  logout() {
    if (window.Kakao?.Auth?.getAccessToken()) window.Kakao.Auth.logout();
    sb.auth.signOut();
    this.user = null; this.token = null; this.isLoggedIn = false;
    onAuthChange();
  },

  syncFromExisting() {
    const id   = localStorage.getItem('nv_user');
    const nick = id ? localStorage.getItem('nv_nick_' + id) || id : null;
    this.user       = id ? { id, nickname: nick } : null;
    this.isLoggedIn = !!id;
    this.token      = id ? 'nv_local' : null;
    onAuthChange();
  },

  async init() {
    this.syncFromExisting();
  },
};

export function kakaoLogin() {
  if (!window.Kakao) { alert('연결 오류. 잠시 후 다시 시도해주세요.'); return; }
  window.Kakao.Auth.authorize({
    redirectUri: KAKAO_REDIRECT_URI,
    scope: 'profile_nickname',
  });
}

/* 카카오 OAuth 콜백 처리 */
(async function handleKakaoReturn() {
  const params = new URLSearchParams(window.location.search);
  const code   = params.get('code');
  if (!code) return;
  history.replaceState({}, '', window.location.pathname);

  try {
    const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      body: new URLSearchParams({
        grant_type:   'authorization_code',
        client_id:    KAKAO_JS_KEY,
        redirect_uri: KAKAO_REDIRECT_URI,
        code,
      }),
    });
    const data = await tokenRes.json();

    if (!data.access_token) {
      const errEl = document.getElementById('lp-kakao-error');
      if (errEl) errEl.textContent = '로그인 오류: ' + (data.error_description || JSON.stringify(data));
      return;
    }

    window.Kakao.Auth.setAccessToken(data.access_token);
    const res      = await window.Kakao.API.request({ url: '/v2/user/me' });
    const id       = String(res.id);
    const nickname = res.kakao_account?.profile?.nickname || '카카오유저';

    window.appState.currentUser = id;
    localStorage.setItem('nv_user', id);
    localStorage.setItem('nv_nick_' + id, nickname);
    NV_AUTH.syncFromExisting();
    await syncToSupabase();
    window.switchTo?.('mailbox');

  } catch(err) {
    console.error('카카오 로그인 처리 실패', err);
    const errEl = document.getElementById('lp-kakao-error');
    if (errEl) errEl.textContent = '로그인 처리 실패: ' + err.message;
  }
})();

window.NV_AUTH    = NV_AUTH;
window.kakaoLogin = kakaoLogin;
