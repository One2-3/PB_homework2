<script setup lang="ts">
    import { computed, onMounted, onUnmounted, ref } from "vue";
    import { useRoute, useRouter } from "vue-router";
    import { useAuthStore } from "@/stores/auth";
    
    const route = useRoute();
    const router = useRouter();
    const auth = useAuthStore();
    
    const y = ref(0);
    const ready = ref(false);
    
    const onScroll = () => (y.value = window.scrollY || 0);
    onMounted(() => {
      window.addEventListener("scroll", onScroll, { passive: true });
      requestAnimationFrame(() => (ready.value = true)); // 진입 애니메이션 트리거
    });
    onUnmounted(() => window.removeEventListener("scroll", onScroll));
    
    const elevated = computed(() => y.value > 6);
    
    function logout() {
      auth.signout();
      router.push("/signin");
    }
    </script>
    
    <template>
      <header class="hdr" :class="{ elevated, ready }">
        <div class="container inner">
          <RouterLink to="/" class="brand">
            <span class="dot" aria-hidden="true" />
            <span class="name">BurgundyFlix</span>
          </RouterLink>
    
          <nav class="nav" aria-label="Primary">
            <RouterLink to="/" class="link" :class="{ on: route.path==='/' }">Home</RouterLink>
            <RouterLink to="/popular" class="link" :class="{ on: route.path==='/popular' }">Popular</RouterLink>
            <RouterLink to="/search" class="link" :class="{ on: route.path==='/search' }">Search</RouterLink>
            <RouterLink to="/wishlist" class="link" :class="{ on: route.path==='/wishlist' }">Wishlist</RouterLink>
          </nav>
    
          <div class="right">
            <template v-if="auth.isLoggedIn">
              <span class="user" :title="auth.email">{{ auth.email }}</span>
              <button class="btn" @click="logout">Logout</button>
            </template>
            <RouterLink v-else class="btn" to="/signin">Sign in</RouterLink>
          </div>
        </div>
      </header>
    </template>
    
    <style scoped>
    .hdr{
      position:sticky; top:0; z-index:50;
      background: rgba(255,255,255,.82);
      backdrop-filter: blur(10px);
      border-bottom:1px solid var(--line);
      transition: box-shadow .2s ease, transform .25s ease, opacity .25s ease;
      transform: translateY(-6px);
      opacity: 0;
    }
    .hdr.ready{ transform: translateY(0); opacity: 1; }
    .hdr.elevated{ box-shadow:0 8px 20px rgba(27,20,23,.06); }
    
    .inner{ display:flex; align-items:center; justify-content:space-between; height:64px; gap:14px; }
    .brand{ display:flex; align-items:center; gap:10px; font-weight:800; }
    .dot{
      width:10px; height:10px; border-radius:50%;
      background: var(--primary);
      box-shadow: 0 0 0 0 rgba(122,31,61,.28);
      animation: pulse 2.2s ease-in-out infinite;
    }
    @keyframes pulse{
      0%, 100%{ box-shadow: 0 0 0 0 rgba(122,31,61,.22); }
      50%{ box-shadow: 0 0 0 10px rgba(122,31,61,0); }
    }
    
    .nav{ display:flex; gap:10px; flex-wrap:wrap; }
    .link{
      position: relative;
      padding: 8px 10px;
      border-radius: 999px;
      color: var(--muted);
      transition: background .15s ease, color .15s ease;
    }
    .link:hover{ background: rgba(122,31,61,.06); color: var(--text); }
    .link.on{ background: var(--primarySoft); color: var(--primary); }
    .link.on::after{
      content:"";
      position:absolute; left:12px; right:12px; bottom:6px;
      height:2px; border-radius: 99px;
      background: var(--primary);
      opacity:.65;
    }
    
    .right{ display:flex; gap:10px; align-items:center; }
    .user{
      color: var(--muted); font-size: 13px;
      max-width: 160px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
    }
    </style>
    