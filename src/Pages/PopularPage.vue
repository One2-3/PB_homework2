<script setup lang="ts">
    import { computed, onMounted, onUnmounted, ref } from "vue";
    import { tmdbApi } from "@/services/tmdbApi";
    import type { MovieSummary } from "@/types/tmdb";
    import MovieCard from "@/components/movie/MovieCard.vue";
    import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
    import { useWishlistStore } from "@/stores/wishlist";
    import { useToast } from "vue-toastification";
    import { lsGet, lsSet } from "@/composables/useLocalStorage";
    
    const toast = useToast();
    const wish = useWishlistStore();
    
    type Mode = "table" | "infinite";
    const MODE_KEY = "popularViewMode";
    
    const mode = ref<Mode>(lsGet<Mode>(MODE_KEY, "table"));
    const loading = ref(false);
    
    const page = ref(1);
    const totalPages = ref(1);
    const items = ref<MovieSummary[]>([]);
    
    // Table view: 한 화면에 보이도록 8~12 권장(여기선 10)
    const perPage = 10;
    const tableItems = computed(() => items.value);
    
    const scroller = ref<HTMLElement | null>(null);
    const sentinel = ref<HTMLElement | null>(null);
    const showTop = ref(false);
    
    let io: IntersectionObserver | null = null;
    
    function lockBody(lock: boolean) {
      document.body.style.overflow = lock ? "hidden" : "";
    }
    
    function setMode(m: Mode) {
      mode.value = m;
      lsSet(MODE_KEY, m);
    
      // 초기화
      page.value = 1;
      totalPages.value = 1;
      items.value = [];
    
      // Popular 페이지에서는 컨테이너 스크롤을 강제 → body는 잠가두는 게 안전
      lockBody(true);
    
      // 컨테이너 스크롤 맨 위로
      requestAnimationFrame(() => scroller.value?.scrollTo({ top: 0 }));
    
      loadPage(1, true);
    }
    
    async function loadPage(p: number, replace: boolean) {
      loading.value = true;
      try {
        const data = await tmdbApi.popular(p);
        page.value = data.page;
        totalPages.value = data.total_pages;
    
        if (mode.value === "table") {
          // table은 페이지 단위 교체
          items.value = data.results.slice(0, perPage);
        } else {
          // infinite는 누적
          items.value = replace ? data.results : [...items.value, ...data.results];
        }
      } catch {
        toast.error("Popular 로딩 실패. TMDB API Key(비밀번호)를 확인해 주세요.");
      } finally {
        loading.value = false;
      }
    }
    
    async function loadNext() {
      if (loading.value) return;
      if (page.value >= totalPages.value) return;
      await loadPage(page.value + 1, false);
    }
    
    function goto(p: number) {
      if (p < 1 || p > totalPages.value) return;
      loadPage(p, true);
      // table 모드에서 상단으로(컨테이너)
      requestAnimationFrame(() => scroller.value?.scrollTo({ top: 0, behavior: "smooth" }));
    }
    
    function toggle(movie: MovieSummary) {
      wish.toggle(movie);
    }
    
    function onScroll() {
      const el = scroller.value;
      if (!el) return;
      showTop.value = el.scrollTop > 320;
    }
    
    function goTop() {
      scroller.value?.scrollTo({ top: 0, behavior: "smooth" }); // ✅ ref로 컨테이너 스크롤 제어
    }
    
    onMounted(() => {
      wish.hydrate();
    
      // Popular는 컨테이너 스크롤이 요구사항 → body 스크롤 막기
      lockBody(true);
    
      loadPage(1, true);
    
      // ✅ Infinite Scroll: IntersectionObserver root를 scroller로 설정(핵심)
      io = new IntersectionObserver(
        (entries) => {
          if (mode.value !== "infinite") return;
          if (entries.some((e) => e.isIntersecting)) loadNext();
        },
        {
          root: scroller.value,   // ✅ viewport가 아니라 컨테이너
          rootMargin: "300px",
          threshold: 0,
        }
      );
    
      if (sentinel.value) io.observe(sentinel.value);
    
      scroller.value?.addEventListener("scroll", onScroll, { passive: true });
    });
    
    onUnmounted(() => {
      lockBody(false);
      io?.disconnect();
      scroller.value?.removeEventListener("scroll", onScroll);
    });
    </script>
    
    <template>
      <div class="container">
        <div class="topbar card">
          <div class="seg">
            <button class="btn" :class="{ primary: mode === 'table' }" @click="setMode('table')">
              Table View
            </button>
            <button class="btn" :class="{ primary: mode === 'infinite' }" @click="setMode('infinite')">
              Infinite Scroll
            </button>
          </div>
          <span class="badge">page {{ page }} / {{ totalPages }}</span>
        </div>
    
        <!-- ✅ 스크롤 컨테이너 -->
        <section ref="scroller" class="scrollBox card">
          <LoadingSpinner v-if="loading && items.length === 0" />
    
          <!-- TABLE -->
          <div v-if="mode === 'table'" class="table">
            <div class="thead">
              <div>Movie</div><div>Rating</div><div>Year</div>
            </div>
    
            <div class="trow" v-for="m in tableItems" :key="m.id">
              <div class="cell movie" @click="toggle(m)">
                <span class="title">{{ m.title }}</span>
                <span v-if="wish.has(m.id)" class="badge">Saved</span>
              </div>
              <div class="cell">⭐ {{ m.vote_average.toFixed(1) }}</div>
              <div class="cell">{{ m.release_date?.slice(0, 4) }}</div>
            </div>
    
            <div class="pager">
              <button class="btn" :disabled="page === 1" @click="goto(page - 1)">Prev</button>
              <button class="btn" :disabled="page === totalPages" @click="goto(page + 1)">Next</button>
            </div>
          </div>
    
          <!-- INFINITE -->
          <div v-else class="grid">
            <MovieCard
              v-for="m in items"
              :key="m.id"
              :movie="m"
              :wished="wish.has(m.id)"
              @toggle="toggle"
            />
    
            <!-- ✅ 바닥 감지용 sentinel -->
            <div ref="sentinel" class="sentinel" />
    
            <LoadingSpinner v-if="loading && items.length > 0" />
          </div>
    
          <!-- ✅ Top 버튼: 컨테이너 기준 -->
          <button v-show="showTop" class="topbtn btn primary" @click="goTop">Top</button>
        </section>
      </div>
    </template>
    
    <style scoped>
    .topbar{
      padding: 12px;
      display:flex; align-items:center; justify-content:space-between; gap:12px;
      margin-bottom: 12px;
    }
    .seg{ display:flex; gap:10px; flex-wrap:wrap; }
    
    .scrollBox{
      position: relative;
      height: calc(100vh - 64px - 18px - 76px); /* header(64) + main padding + topbar */
      overflow: auto; /* ✅ 컨테이너 스크롤 */
      padding: 12px;
    }
    
    .table{ overflow: hidden; } /* ✅ table은 스크롤 금지 */
    .thead,.trow{
      display:grid;
      grid-template-columns: 1fr 120px 80px;
      gap:12px;
      align-items:center;
    }
    .thead{
      color:var(--muted);
      font-size:12px;
      padding: 10px 8px;
      border-bottom:1px solid var(--line);
    }
    .trow{
      padding: 12px 8px;
      border-bottom:1px solid var(--line);
    }
    .trow:last-child{ border-bottom:none; }
    .movie{ display:flex; gap:10px; align-items:center; cursor:pointer; }
    .title{ font-weight:800; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .pager{ display:flex; justify-content:flex-end; gap:10px; padding-top: 12px; }
    
    .grid{
      display:grid; gap:12px;
      grid-template-columns: repeat(6, 1fr);
    }
    .sentinel{ height: 1px; }
    
    .topbtn{
      position: sticky; /* 컨테이너 내부에 고정 느낌 */
      bottom: 10px;
      margin-left: auto;
      display: block;
    }
    
    @media (max-width: 1100px){ .grid{ grid-template-columns: repeat(4, 1fr); } }
    @media (max-width: 760px){
      .grid{ grid-template-columns: repeat(2, 1fr); }
      .thead,.trow{ grid-template-columns: 1fr 90px 70px; }
      .scrollBox{ height: calc(100vh - 64px - 18px - 96px); }
    }
    </style>
    