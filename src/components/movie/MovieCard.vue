<script setup lang="ts">
    import { computed } from "vue";
    import type { MovieSummary } from "@/types/tmdb";
    
    const props = defineProps<{ movie: MovieSummary; wished: boolean }>();
    const emit = defineEmits<{ (e: "toggle", movie: MovieSummary): void }>();
    
    const poster = computed(() =>
      props.movie.poster_path ? `https://image.tmdb.org/t/p/w500${props.movie.poster_path}` : ""
    );
    </script>
    
    <template>
      <article class="cardWrap" :class="{ on: wished }" @click="emit('toggle', movie)">
        <img class="poster" v-if="poster" :src="poster" :alt="movie.title" />
        <div class="meta">
          <div class="row">
            <h3 class="title">{{ movie.title }}</h3>
            <span v-if="wished" class="badge">Saved</span>
          </div>
          <div class="sub">
            <span>⭐ {{ movie.vote_average.toFixed(1) }}</span>
            <span>{{ movie.release_date?.slice(0,4) }}</span>
          </div>
        </div>
      </article>
    </template>
    
    <style scoped>
    .cardWrap{
      border-radius:var(--r-lg); overflow:hidden; background:var(--surface);
      border:1px solid var(--line); box-shadow:var(--shadow);
      transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease;
      cursor:pointer;
    }
    .cardWrap:hover{transform:translateY(-2px) scale(1.02);box-shadow:0 16px 36px rgba(27,20,23,.10)}
    .cardWrap.on{border-color:rgba(122,31,61,.55);box-shadow:0 18px 40px rgba(122,31,61,.12)}
    .poster{aspect-ratio:2/3;width:100%;object-fit:cover;display:block;background:#eee}
    .meta{padding:12px 12px 14px}
    .row{display:flex;align-items:center;justify-content:space-between;gap:10px}
    .title{margin:0;font-size:14px;font-weight:800;line-height:1.2;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .sub{margin-top:8px;color:var(--muted);font-size:12px;display:flex;justify-content:space-between}
    </style>
    