<script setup lang="ts">
    import { onMounted, ref } from "vue";
    import { tmdbApi } from "@/services/tmdbApi";
    import type { Genre, MovieSummary } from "@/types/tmdb";
    import MovieCard from "@/components/movie/MovieCard.vue";
    import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
    import { useWishlistStore } from "@/stores/wishlist";
    import { useToast } from "vue-toastification";
    import { lsGet, lsSet } from "@/composables/useLocalStorage";
    
    const toast = useToast();
    const wish = useWishlistStore();
    
    const genres = ref<Genre[]>([]);
    const loading = ref(false);
    
    const q = ref("");
    const genreId = ref<number | "">("");
    const minRating = ref<number>(0);
    const year = ref<number | "">("");
    const sortBy = ref("popularity.desc");
    
    const results = ref<MovieSummary[]>([]);
    const page = ref(1);
    const totalPages = ref(1);
    
    const RECENT_KEY = "recentSearches";
    const recent = ref<string[]>(lsGet<string[]>(RECENT_KEY, []));
    
    const sortOptions = [
      { v: "popularity.desc", t: "인기순" },
      { v: "vote_average.desc", t: "평점순" },
      { v: "primary_release_date.desc", t: "최신순" },
    ];
    
    function reset() {
      q.value = "";
      genreId.value = "";
      minRating.value = 0;
      year.value = "";
      sortBy.value = "popularity.desc";
      results.value = [];
      page.value = 1;
      totalPages.value = 1;
    }
    
    function addRecent(keyword: string) {
      const k = keyword.trim();
      if (!k) return;
      recent.value = [k, ...recent.value.filter((x) => x !== k)].slice(0, 8);
      lsSet(RECENT_KEY, recent.value);
    }
    
    function applyClientFilters(list: MovieSummary[]) {
      let out = list;
    
      if (genreId.value !== "") {
        out = out.filter((m) => (m.genre_ids || []).includes(Number(genreId.value)));
      }
      if (minRating.value > 0) {
        out = out.filter((m) => m.vote_average >= minRating.value);
      }
      if (year.value !== "") {
        const y = String(year.value);
        out = out.filter((m) => (m.release_date || "").startsWith(y));
      }
    
      // sort(클라에서)
      out = [...out].sort((a, b) => {
        if (sortBy.value === "vote_average.desc") return b.vote_average - a.vote_average;
        if (sortBy.value === "primary_release_date.desc") return (b.release_date || "").localeCompare(a.release_date || "");
        return 0; // popularity는 search 결과가 이미 인기순에 가깝게 오는 편이라 유지
      });
    
      return out;
    }
    
    async function fetchPage(p = 1) {
      loading.value = true;
      try {
        page.value = p;
    
        const keyword = q.value.trim();
        const hasKeyword = keyword.length > 0;
    
        if (hasKeyword) {
          addRecent(keyword);
          const data = await tmdbApi.search(keyword, p);
    
          // ✅ 키워드 검색은 서버 정렬/필터가 제한적 → 클라 필터 적용으로 요구사항 충족
          results.value = applyClientFilters(data.results);
          totalPages.value = data.total_pages;
          return;
        }
    
        // ✅ 키워드 없으면 discover로 필터를 “서버에서” 처리 → 정확도↑
        const params: any = {
          page: p,
          sort_by: sortBy.value,
          "vote_average.gte": minRating.value || undefined,
          with_genres: genreId.value || undefined,
          "primary_release_date.gte": year.value ? `${year.value}-01-01` : undefined,
          "primary_release_date.lte": year.value ? `${year.value}-12-31` : undefined,
        };
    
        const data = await tmdbApi.discover(params);
        results.value = data.results;
        totalPages.value = data.total_pages;
      } catch {
        toast.error("검색 실패. TMDB API Key(비밀번호)를 확인해 주세요.");
      } finally {
        loading.value = false;
      }
    }
    
    onMounted(async () => {
      wish.hydrate();
      try {
        const g = await tmdbApi.genres();
        genres.value = g.genres;
      } catch {
        // 장르 로딩 실패해도 검색은 가능하게 유지
      }
    });
    </script>
    
    <template>
      <div class="container layout">
        <aside class="filters card">
          <div class="head">
            <h2>Filter</h2>
            <button class="btn" @click="reset">Reset</button>
          </div>
    
          <div class="field">
            <label>키워드</label>
            <input v-model="q" placeholder="예: interstellar" @keydown.enter="fetchPage(1)" />
          </div>
    
          <div class="field">
            <label>장르</label>
            <select v-model="genreId">
              <option value="">전체</option>
              <option v-for="g in genres" :key="g.id" :value="g.id">{{ g.name }}</option>
            </select>
          </div>
    
          <div class="field">
            <label>최소 평점 ({{ minRating }})</label>
            <input type="range" min="0" max="9" step="0.5" v-model.number="minRating" />
          </div>
    
          <div class="field">
            <label>년도</label>
            <input v-model="year" placeholder="예: 2024" />
          </div>
    
          <div class="field">
            <label>정렬</label>
            <select v-model="sortBy">
              <option v-for="o in sortOptions" :key="o.v" :value="o.v">{{ o.t }}</option>
            </select>
          </div>
    
          <button class="btn primary" @click="fetchPage(1)">Search</button>
    
          <div v-if="recent.length" class="recent">
            <div class="rt">Recent</div>
            <div class="chips">
              <button v-for="k in recent" :key="k" class="chip" @click="q = k; fetchPage(1)">{{ k }}</button>
            </div>
          </div>
        </aside>
    
        <section class="results">
          <div class="topline">
            <h2>Results</h2>
            <span class="badge">page {{ page }} / {{ totalPages }}</span>
          </div>
    
          <LoadingSpinner v-if="loading" />
    
          <div v-if="!loading && results.length === 0" class="empty card">
            <h3>검색 결과가 없어요</h3>
            <p>키워드를 바꾸거나 필터를 줄여보세요.</p>
          </div>
    
          <div class="grid" v-else>
            <MovieCard
              v-for="m in results"
              :key="m.id"
              :movie="m"
              :wished="wish.has(m.id)"
              @toggle="wish.toggle"
            />
          </div>
    
          <div class="pager" v-if="totalPages > 1">
            <button class="btn" :disabled="page === 1" @click="fetchPage(page - 1)">Prev</button>
            <button class="btn" :disabled="page === totalPages" @click="fetchPage(page + 1)">Next</button>
          </div>
        </section>
      </div>
    </template>
    
    <style scoped>
    .layout{ display:grid; gap:14px; grid-template-columns: 320px 1fr; align-items:start; }
    .filters{ padding: 14px; position: sticky; top: 78px; }
    .head{ display:flex; align-items:center; justify-content:space-between; gap:10px; }
    h2{ margin:0 0 10px; font-size:18px; }
    .field{ display:flex; flex-direction:column; gap:6px; margin:10px 0; }
    label{ font-size:12px; color:var(--muted); }
    input,select{ padding:12px; border-radius:12px; border:1px solid var(--line); background:#fff; }
    .results{ min-width:0; }
    .topline{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:10px; }
    .grid{ display:grid; gap:12px; grid-template-columns: repeat(5, 1fr); }
    .empty{ padding:18px; }
    .empty h3{ margin:0 0 6px; }
    .empty p{ margin:0; color:var(--muted); }
    .pager{ display:flex; justify-content:flex-end; gap:10px; margin-top:12px; }
    .recent{ margin-top:14px; }
    .rt{ font-size:12px; color:var(--muted); margin-bottom:8px; }
    .chips{ display:flex; gap:8px; flex-wrap:wrap; }
    .chip{ border:1px solid var(--line); background:#fff; border-radius:999px; padding:8px 10px; cursor:pointer; font-size:12px; }
    .chip:hover{ border-color: rgba(122,31,61,.35); }
    
    @media (max-width: 980px){
      .layout{ grid-template-columns: 1fr; }
      .filters{ position: static; }
      .grid{ grid-template-columns: repeat(2, 1fr); }
    }
    @media (min-width: 981px) and (max-width: 1200px){
      .grid{ grid-template-columns: repeat(4, 1fr); }
    }
    </style>
    