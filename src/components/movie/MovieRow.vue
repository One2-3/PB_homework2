<script setup lang="ts">
    import MovieCard from "./MovieCard.vue";
    import type { MovieSummary } from "@/types/tmdb";
    
    defineProps<{ title: string; items: MovieSummary[]; wished: (id:number)=>boolean }>();
    const emit = defineEmits<{ (e: "toggle", movie: MovieSummary): void }>();
    </script>
    
    <template>
      <section class="section">
        <div class="head">
          <h2>{{ title }}</h2>
          <span class="hint">가로 스크롤</span>
        </div>
        <div class="row">
          <MovieCard
            v-for="m in items"
            :key="m.id"
            :movie="m"
            :wished="wished(m.id)"
            @toggle="emit('toggle', $event)"
          />
        </div>
      </section>
    </template>
    
    <style scoped>
    .section{ margin: 18px 0 26px; }
    .head{ display:flex; align-items:baseline; justify-content:space-between; gap:12px; }
    h2{ margin:0; font-size:18px; }
    .hint{ color:var(--muted); font-size:12px; }
    .row{
      margin-top: 12px;
      display:flex; gap:12px;
      overflow:auto; padding-bottom: 8px;
      scroll-snap-type: x mandatory;
    }
    .row > *{ width: 170px; flex: 0 0 auto; scroll-snap-align: start; }
    </style>
    