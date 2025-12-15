<script setup lang="ts">
    import { onMounted, ref } from "vue";
    import { tmdbApi } from "@/services/tmdbApi";
    import type { MovieSummary } from "@/types/tmdb";
    import MovieRow from "@/components/movie/MovieRow.vue";
    import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
    import { useWishlistStore } from "@/stores/wishlist";
    import { useToast } from "vue-toastification";
    
    const toast = useToast();
    const wish = useWishlistStore();
    
    const loading = ref(false);
    const hero = ref<MovieSummary | null>(null);
    const sections = ref<{ title: string; items: MovieSummary[] }[]>([]);
    
    function pickHero(list: MovieSummary[]) {
      hero.value = list.find(m => m.backdrop_path) || list[0] || null;
    }
    
    async function load() {
      loading.value = true;
      try {
        const [np, pop, top, up] = await Promise.all([
          tmdbApi.nowPlaying(1),
          tmdbApi.popular(1),
          tmdbApi.topRated(1),
          tmdbApi.upcoming(1),
        ]);
        pickHero(np.results);
        sections.value = [
          { title: "Now Playing", items: np.results.slice(0, 12) },
          { title: "Popular", items: pop.results.slice(0, 12) },
          { title: "Top Rated", items: top.results.slice(0, 12) },
          { title: "Upcoming", items: up.results.slice(0, 12) },
        ];
      } catch {
        toast.error("TMDB 로딩에 실패했어요. API Key(비밀번호)를 확인해 주세요.");
      } finally {
        loading.value = false;
      }
    }
    
    onMounted(() => { wish.hydrate(); load(); });
    
    function toggle(movie: MovieSummary) {
      wish.toggle(movie);
    }
    </script>
    
    <template>
      <div class="container">
        <section v-if="hero" class="hero card">
          <div class="bg" :style="{
            backgroundImage: hero.backdrop_path
              ? `linear-gradient(90deg, rgba(122,31,61,.35), rgba(255,255,255,.0)), url(https://image.tmdb.org/t/p/w1280${hero.backdrop_path})`
              : undefined
          }" />
          <div class="content">
            <span class="badge">Today’s pick</span>
            <h1>{{ hero.title }}</h1>
            <p>{{ hero.overview }}</p>
          </div>
        </section>
    
        <LoadingSpinner v-if="loading" />
    
        <MovieRow
          v-for="s in sections"
          :key="s.title"
          :title="s.title"
          :items="s.items"
          :wished="wish.has"
          @toggle="toggle"
        />
      </div>
    </template>
    
    <style scoped>
    .hero{ position:relative; overflow:hidden; padding: 18px; min-height: 240px; }
    .bg{
      position:absolute; inset:0;
      background-size: cover; background-position: center;
      filter: saturate(1.05);
    }
    .content{
      position:relative; z-index:1;
      max-width: 70ch;
    }
    h1{ margin: 12px 0 8px; font-size: 28px; line-height: 1.15; }
    p{ margin:0; color: rgba(27,20,23,.82); display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient: vertical; overflow:hidden; }
    @media (max-width: 900px){ .hero{ min-height: 220px; } h1{ font-size: 22px; } }
    </style>
    