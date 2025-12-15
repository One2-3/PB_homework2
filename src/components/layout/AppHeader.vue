<script setup lang="ts">
    import { computed, onMounted, onUnmounted, ref } from "vue";
    import { useRoute } from "vue-router";
    
    const route = useRoute();
    const y = ref(0);
    
    const onScroll = () => (y.value = window.scrollY || 0);
    onMounted(() => window.addEventListener("scroll", onScroll, { passive: true }));
    onUnmounted(() => window.removeEventListener("scroll", onScroll));
    
    const elevated = computed(() => y.value > 6);
    </script>
    
    <template>
      <header class="hdr" :class="{ elevated }">
        <div class="container inner">
          <RouterLink to="/" class="brand">
            <span class="dot" />
            <span class="name">BurgundyFlix</span>
          </RouterLink>
    
          <nav class="nav">
            <RouterLink to="/" class="link" :class="{ on: route.path==='/' }">Home</RouterLink>
            <RouterLink to="/popular" class="link" :class="{ on: route.path==='/popular' }">Popular</RouterLink>
            <RouterLink to="/search" class="link" :class="{ on: route.path==='/search' }">Search</RouterLink>
            <RouterLink to="/wishlist" class="link" :class="{ on: route.path==='/wishlist' }">Wishlist</RouterLink>
          </nav>
    
          <div class="right">
            <!-- 로그인 상태면 유저/로그아웃, 아니면 Sign in -->
            <RouterLink class="btn" to="/signin">Sign in</RouterLink>
          </div>
        </div>
      </header>
    </template>
    
    <style scoped>
    .hdr{
      position: sticky; top:0; z-index: 50;
      background: rgba(255,255,255,.82);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--line);
      transition: box-shadow .2s ease;
    }
    .hdr.elevated{ box-shadow: 0 8px 20px rgba(27,20,23,.06); }
    .inner{ display:flex; align-items:center; justify-content:space-between; height:64px; gap:14px; }
    .brand{ display:flex; align-items:center; gap:10px; font-weight:700; }
    .dot{ width:10px; height:10px; border-radius:50%; background: var(--primary); }
    .nav{ display:flex; gap:14px; }
    .link{
      padding: 8px 10px; border-radius: 999px; color: var(--muted);
      transition: background .15s ease, color .15s ease;
    }
    .link.on{ background: var(--primary-soft); color: var(--primary); }
    .right{ display:flex; gap:10px; }
    </style>
    