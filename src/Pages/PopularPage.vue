<script setup lang="ts">
    import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
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
    
    const perPageTable = 8; // ✅ 스크롤 없이 한 화면에 확실히 들어오게 줄임
    const tableItems = computed(() => items.value.slice(0, perPageTable));
    
    const scroller = ref<HTMLElement | null>(null);
    const sentinel = ref<HTMLElement | null>(null);
    
    const showTop = ref(false);
    let io: IntersectionObserver | null = null;
    
    function lockBody(lock: boolean) {
      document.body.style.overflow = lock ? "hidden" : "";
    }
    
    function posterThumb(path: string | null) {
      return path ? `https://image.tmdb.org/t/p/w92${path}` : "";
    }
    
    async function loadPage(p: number, replace: boolean) {
      loading.value = true;
      try {
        const data = await tmdbApi.popular(p);
        page.value = data.page;
        totalPages.value = data.total_pages;
    
        if (mode.value === "table") {
          // ✅ table은 페이지마다 교체 (스크롤 없이 8개만)
          items.value = data.results.slice(0, perPageTable);
        } else {
          // ✅ infinite는 누적
          items.value = replace ? data.results : [...items.value, ...data.results];
        }
      } catch (e: any) {
        toast.error(e?.message || "Popular 로딩 실패. API Key(비밀번호)를 확인해 주세요.");
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
      scroller.value?.scrollTo({ top: 0, behavior: "smooth" });
    }
    
    function setMode(m: Mode) {
      mode.value = m;
      lsSet(MODE_KEY, m);
    
      // 항상 body는 잠금(과제에서 table 스크롤 금지 안정)
      lockBody(true);
    
      // 데이터 초기화 후 다시 로드
      page.value = 1;
      totalPages.value = 1;
      items.value = [];
    
      nextTick(() => {
        if (scroller.value) scroller.value.scrollTop = 0;
        loadPage(1, true);
      });
    }
    
    // ✅ infinite에서만 observer 붙이기
    async function setupObserver() {
      io?.disconnect();
      io = null;
    
      await nextTick();
      if (mode.value !== "infinite") return;
      if (!scroller.value || !sentinel.value) return;
    
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) loadNext();
        },
        { root: scroller.value, rootMargin: "300px", threshold: 0 }
      );
    
      io.observe(sentinel.value);
    }
    
    onMounted(async () => {
      wish.hydrate();
    
      // Popular 페이지는 컨테이너 스크롤 사용 → body는 고정
      lockBody(true);
    
      await loadPage(1, true);
      await setupObserver();
    
      scroller.value?.addEventListener("scroll", onScroll, { passive: true });
    });
    
    watch(mode, () => setupObserver());
    
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
            <button class="btn" :class="{ primary: mode === 'table' }" @click="setMode('table')">Table View</button>
            <button class="btn" :class="{ primary: mode === 'infinite' }" @click="setMode('infinite')">Infinite Scroll</button>
          </div>
          <span class="badge">page {{ page }} / {{ totalPages }}</span>
        </div>
    
        <!-- ✅ Table: overflow hidden(스크롤 불가) / Infinite: overflow auto -->
        <section ref="scroller" class="box card" :class="mode">
          <LoadingSpinner v-if="loading && items.length === 0" />
    
          <!-- TABLE (포스터 포함, 스크롤 0) -->
          <div v-if="mode === 'table'" class="table">
            <div class="thead">
              <div>Poster / Movie</div><div>Rating</div><div>Year</div>
            </div>
    
            <div class="trow" v-for="m in tableItems" :key="m.id">
              <div class="cell movie" @click="toggle(m)">
                <img v-if="posterThumb(m.poster_path)" class="thumb" :src="posterThumb(m.poster_path)" :alt="m.title" />
                <div class="info">
                  <div class="title">{{ m.title }}</div>
                  <div class="sub">
                    <span v-if="wish.has(m.id)" class="badge">Saved</span>
                  </div>
                </div>
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
            <div ref="sentinel" class="sentinel"></div>
            <LoadingSpinner v-if="loading && items.length > 0" />
          </div>
    
          <button v-show="mode==='infinite' && showTop" class="topbtn btn primary" @click="goTop">Top</button>
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
    
    /* ✅ 공통 컨테이너 높이(뷰포트에 맞게) */
    .box{
      position: relative;
      height: calc(100vh - 64px - 18px - 76px);
      padding: 12px;
    }
    
    /* ✅ Table: 스크롤 완전 금지 */
    .box.table{
      overflow: hidden;
    }
    
    /* ✅ Infinite: 컨테이너 스크롤 */
    .box.infinite{
      overflow: auto;
    }
    
    .table{ overflow: hidden; }
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
      padding: 10px 8px;
      border-bottom:1px solid var(--line);
    }
    .trow:last-child{ border-bottom:none; }
    
    .movie{
      display:flex; gap:10px; align-items:center;
      cursor:pointer;
      min-width: 0;
    }
    .thumb{
      width: 40px; height: 60px;
      border-radius: 10px;
      object-fit: cover;
      border: 1px solid var(--line);
      background: #eee;
      flex: 0 0 auto;
    }
    .info{ min-width:0; }
    .title{
      font-weight: 800;
      overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
    }
    .sub{ margin-top: 4px; }
    
    .pager{
      display:flex; justify-content:flex-end; gap:10px;
      padding-top: 12px;
    }
    
    /* Infinite grid */
    .grid{
      display:grid; gap:12px;
      grid-template-columns: repeat(6, 1fr);
    }
    .sentinel{ height: 1px; }
    
    .topbtn{
      position: sticky;
      bottom: 10px;
      margin-left: auto;
      display:block;
    }
    
    @media (max-width: 1100px){ .grid{ grid-template-columns: repeat(4, 1fr); } }
    @media (max-width: 760px){
      .grid{ grid-template-columns: repeat(2, 1fr); }
      .thead,.trow{ grid-template-columns: 1fr 90px 70px; }
      .box{ height: calc(100vh - 64px - 18px - 96px); }
    }
    </style>
    