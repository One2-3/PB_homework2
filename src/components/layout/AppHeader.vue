<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import { useRoute, RouterLink } from "vue-router";
  import { useAuthStore } from "@/stores/auth";
  import { useUiStore } from "@/stores/ui";
  
  const auth = useAuthStore();
  const ui = useUiStore();
  
  const route = useRoute();
  const menuOpen = ref(false);
  
  watch(
    () => route.fullPath,
    () => {
      menuOpen.value = false; // 페이지 이동 시 모바일 메뉴 자동 닫기
    }
  );
  
  const isAuthed = computed(() => auth.isLoggedIn);
  
  function logout() {
    auth.signout?.();
    // signout 함수명이 다르면 프로젝트에 맞춰 변경
  }
  </script>
  
  <template>
    <header class="header">
      <div class="inner">
        <!-- Left: Logo -->
        <RouterLink class="logo" to="/" @click="menuOpen = false">
          <span class="dot" aria-hidden="true" />
          <span class="brand">BurgundyFlix</span>
        </RouterLink>
  
        <!-- Mobile: Hamburger -->
        <button
          class="iconBtn menuBtn"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="app-nav"
          aria-label="메뉴 열기"
          @click="menuOpen = !menuOpen"
        >
          <span class="hamburger" :class="{ open: menuOpen }" aria-hidden="true">
            <i></i><i></i><i></i>
          </span>
        </button>
  
        <!-- Nav (desktop inline / mobile dropdown) -->
        <nav id="app-nav" class="nav" :class="{ open: menuOpen }">
          <RouterLink class="navLink" to="/" @click="menuOpen = false">Home</RouterLink>
          <RouterLink class="navLink" to="/popular" @click="menuOpen = false">Popular</RouterLink>
          <RouterLink class="navLink" to="/search" @click="menuOpen = false">Search</RouterLink>
          <RouterLink class="navLink" to="/wishlist" @click="menuOpen = false">Wishlist</RouterLink>
        </nav>
  
        <!-- Right -->
        <div class="right">
          <!-- Theme toggle (항상 보이게) -->
          <button class="btn ghost themeBtn" type="button" @click="ui.cycleTheme" :title="`Theme: ${ui.themeLabel}`">
            <span class="themeText">{{ ui.themeLabel }}</span>
          </button>
  
          <template v-if="isAuthed">
            <span class="email" :title="auth.email">{{ auth.email }}</span>
            <button class="btn ghost" type="button" @click="logout">Logout</button>
          </template>
          <RouterLink v-else class="btn ghost" to="/signin">Sign in</RouterLink>
        </div>
      </div>
    </header>
  </template>
  
  <style scoped>
  /* Header shell */
  .header{
    position: sticky;
    top: 0;
    z-index: 50;
    background: color-mix(in srgb, var(--bg) 40%, rgba(0,0,0,0));
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--line);
  }
  
  .inner{
    max-width: var(--wrap);
    margin: 0 auto;
    padding: 12px 14px;
    display: grid;
    grid-template-columns: auto auto 1fr auto;
    align-items: center;
    gap: 12px;
  }
  
  /* Logo */
  .logo{
    display:flex;
    align-items:center;
    gap:10px;
    font-weight: 900;
  }
  .dot{
    width:10px; height:10px; border-radius:50%;
    background: var(--primary);
  }
  .brand{
    letter-spacing:.2px;
    color: var(--text);
  }
  
  /* Desktop nav */
  .nav{
    display:flex;
    align-items:center;
    justify-content:center;
    gap: 10px;
  }
  .navLink{
    padding: 8px 12px;
    border-radius: 999px;
    color: var(--muted);
    font-weight: 800;
    white-space: nowrap;
  }
  .navLink:hover{
    color: var(--text);
    background: color-mix(in srgb, var(--primarySoft) 55%, transparent);
  }
  .router-link-active{
    color: var(--text);
    background: color-mix(in srgb, var(--primarySoft) 70%, transparent);
    border: 1px solid color-mix(in srgb, var(--primary) 25%, var(--line));
  }
  
  /* Right */
  .right{
    display:flex;
    align-items:center;
    justify-content:flex-end;
    gap: 10px;
    min-width: 0;
  }
  
  .email{
    max-width: 170px;
    overflow:hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--muted);
    font-weight: 800;
  }
  
  /* Buttons (헤더용 미니 스타일) */
  .btn{
    border: 1px solid var(--line);
    background: transparent;
    color: var(--text);
    border-radius: 999px;
    padding: 8px 12px;
    cursor: pointer;
    font-weight: 900;
    white-space: nowrap;
  }
  .btn:hover{
    border-color: color-mix(in srgb, var(--primary) 35%, var(--line));
  }
  
  .btn.ghost{
    background: color-mix(in srgb, var(--surface) 65%, transparent);
  }
  
  /* Theme label on mobile */
  .themeBtn .themeText{
    display:inline-block;
  }
  
  /* Mobile hamburger button */
  .iconBtn.menuBtn{
    display:none;
    border:1px solid var(--line);
    background: color-mix(in srgb, var(--surface) 65%, transparent);
    border-radius: 12px;
    padding: 8px 10px;
    cursor:pointer;
    color: var(--text);
  }
  
  .hamburger{
    width: 20px;
    height: 14px;
    display:inline-flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .hamburger i{
    display:block;
    height: 2px;
    width: 100%;
    background: color-mix(in srgb, var(--text) 85%, transparent);
    border-radius: 999px;
    transition: transform .18s ease, opacity .18s ease;
  }
  .hamburger.open i:nth-child(1){ transform: translateY(6px) rotate(45deg); }
  .hamburger.open i:nth-child(2){ opacity: 0; }
  .hamburger.open i:nth-child(3){ transform: translateY(-6px) rotate(-45deg); }
  
  /* ✅ Mobile layout */
  @media (max-width: 860px){
    .inner{
      grid-template-columns: auto 1fr auto;
      grid-template-areas:
        "logo  spacer right"
        "nav   nav    nav";
      align-items: center;
    }
  
    .logo{ grid-area: logo; }
    .right{ grid-area: right; }
    .nav{
      grid-area: nav;
      justify-content: flex-start;
      gap: 8px;
  
      /* dropdown 느낌 */
      display: none;
      padding-top: 10px;
      border-top: 1px solid var(--line);
      margin-top: 8px;
      flex-wrap: wrap;
    }
    .nav.open{ display:flex; }
  
    .menuBtn{
      display:inline-flex;
      grid-area: spacer;
      justify-self: center;
    }
  
    /* 이메일 폭 더 줄이기 */
    .email{ max-width: 110px; }
  
    /* 테마 버튼 글자 줄이기(너무 길면 깨짐 방지) */
    .themeBtn .themeText{ max-width: 70px; overflow:hidden; text-overflow: ellipsis; white-space: nowrap; display:inline-block; }
  }
  
  /* 더 작은 모바일: 이메일 숨김 */
  @media (max-width: 520px){
    .email{ display:none; }
    .btn{ padding: 8px 10px; }
  }
  </style>
  