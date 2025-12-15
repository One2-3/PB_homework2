<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import { useRoute, RouterLink } from "vue-router";
  import { useAuthStore } from "@/stores/auth";
  import { useUiStore } from "@/stores/ui";
  
  const auth = useAuthStore();
  const ui = useUiStore();
  
  const route = useRoute();
  const isOpen = ref(false);
  
  watch(
    () => route.fullPath,
    () => {
      isOpen.value = false; // 이동하면 자동 닫기
    }
  );
  
  const isAuthed = computed(() => auth.isLoggedIn);
  
  function logout() {
    auth.signout?.(); // 프로젝트에서 함수명이 다르면 맞춰줘
    isOpen.value = false;
  }
  </script>
  
  <template>
    <header class="header">
      <div class="inner">
        <!-- Left: Logo -->
        <RouterLink class="logo" to="/" @click="isOpen = false">
          <span class="dot" aria-hidden="true" />
          <span class="brand">BurgundyFlix</span>
        </RouterLink>
  
        <!-- Mobile: Hamburger -->
        <button
          class="menuBtn"
          type="button"
          :aria-expanded="isOpen"
          aria-controls="mobileNav"
          aria-label="메뉴"
          @click="isOpen = !isOpen"
        >
          <span class="hamburger" :class="{ open: isOpen }" aria-hidden="true">
            <i></i><i></i><i></i>
          </span>
        </button>
  
        <!-- Desktop Nav -->
        <nav class="nav desktop">
          <RouterLink class="navLink" to="/">Home</RouterLink>
          <RouterLink class="navLink" to="/popular">Popular</RouterLink>
          <RouterLink class="navLink" to="/search">Search</RouterLink>
          <RouterLink class="navLink" to="/wishlist">Wishlist</RouterLink>
        </nav>
  
        <!-- Right -->
        <div class="right">
          <button class="btn theme" type="button" @click="ui.cycleTheme" :title="`Theme: ${ui.themeLabel}`">
            {{ ui.themeLabel }}
          </button>
  
          <template v-if="isAuthed">
            <span class="email" :title="auth.email">{{ auth.email }}</span>
            <button class="btn" type="button" @click="logout">Logout</button>
          </template>
          <RouterLink v-else class="btn" to="/signin">Sign in</RouterLink>
        </div>
      </div>
  
      <!-- ✅ Mobile Dropdown Nav -->
      <transition name="drop">
        <div v-if="isOpen" id="mobileNav" class="mobileNav">
          <RouterLink class="mLink" to="/" @click="isOpen=false">Home</RouterLink>
          <RouterLink class="mLink" to="/popular" @click="isOpen=false">Popular</RouterLink>
          <RouterLink class="mLink" to="/search" @click="isOpen=false">Search</RouterLink>
          <RouterLink class="mLink" to="/wishlist" @click="isOpen=false">Wishlist</RouterLink>
        </div>
      </transition>
    </header>
  </template>
  
  <style scoped>
  .header{
    position: sticky;
    top: 0;
    z-index: 50;
    background: color-mix(in srgb, var(--bg) 55%, rgba(0,0,0,0));
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--line);
  }
  
  .inner{
    max-width: var(--wrap);
    margin: 0 auto;
    padding: 12px 14px;
    display:flex;
    align-items:center;
    gap: 10px;
  }
  
  /* Logo */
  .logo{
    display:flex;
    align-items:center;
    gap:10px;
    font-weight: 900;
    margin-right: 6px;
    flex: 0 0 auto;
  }
  .dot{
    width:10px; height:10px; border-radius:50%;
    background: var(--primary);
  }
  .brand{ color: var(--text); }
  
  /* Desktop Nav */
  .nav{
    display:flex;
    align-items:center;
    gap: 10px;
    flex: 1 1 auto;
    justify-content:center;
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
    background: color-mix(in srgb, var(--primarySoft) 60%, transparent);
  }
  .router-link-active{
    color: var(--text);
    background: color-mix(in srgb, var(--primarySoft) 75%, transparent);
    border: 1px solid color-mix(in srgb, var(--primary) 25%, var(--line));
  }
  
  /* Right */
  .right{
    display:flex;
    align-items:center;
    gap: 8px;
    flex: 0 0 auto;
    min-width: 0;
  }
  .email{
    max-width: 160px;
    overflow:hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--muted);
    font-weight: 800;
  }
  
  /* Buttons */
  .btn{
    border: 1px solid var(--line);
    background: color-mix(in srgb, var(--surface) 70%, transparent);
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
  
  /* Hamburger button (hidden on desktop) */
  .menuBtn{
    display:none;
    border: 1px solid var(--line);
    background: color-mix(in srgb, var(--surface) 70%, transparent);
    color: var(--text);
    border-radius: 12px;
    padding: 8px 10px;
    cursor:pointer;
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
  
  /* Mobile dropdown */
  .mobileNav{
    max-width: var(--wrap);
    margin: 0 auto;
    padding: 10px 14px 14px;
    display:flex;
    gap: 8px;
    flex-wrap: wrap;
    border-top: 1px solid var(--line);
    background: color-mix(in srgb, var(--bg) 70%, rgba(0,0,0,0));
  }
  
  .mLink{
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid var(--line);
    background: color-mix(in srgb, var(--surface) 70%, transparent);
    color: var(--text);
    font-weight: 900;
  }
  .mLink:hover{
    border-color: color-mix(in srgb, var(--primary) 35%, var(--line));
  }
  
  /* ✅ Transition */
  .drop-enter-active, .drop-leave-active{
    transition: all .16s ease;
  }
  .drop-enter-from, .drop-leave-to{
    opacity: 0;
    transform: translateY(-6px);
  }
  
  /* ✅ Mobile breakpoint: 좁아지면 desktop nav 숨기고 햄버거/드롭다운 사용 */
  @media (max-width: 860px){
    .nav.desktop{ display:none; }
    .menuBtn{ display:inline-flex; }
    .email{ max-width: 110px; }
  }
  
  /* 더 작은 화면에서 이메일 숨김 */
  @media (max-width: 520px){
    .email{ display:none; }
    .btn{ padding: 8px 10px; }
  }
  </style>
  