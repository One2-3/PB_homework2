<script setup lang="ts">
    import { computed } from "vue";
    import type { MovieSummary } from "@/types/tmdb";
    
    const props = defineProps<{ movie: MovieSummary; isWishlisted: boolean }>();
    const emit = defineEmits<{ (e: "toggle", movie: MovieSummary): void }>();
    
    const posterUrl = computed(() =>
      props.movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${props.movie.poster_path}`
        : ""
    );
    </script>
    
    <template>
      <article
        class="card"
        :class="{ on: isWishlisted }"
        @click="emit('toggle', movie)"
      >
        <img v-if="posterUrl" :src="posterUrl" :alt="movie.title" />
        <div class="meta">
          <h3>{{ movie.title }}</h3>
          <p class="overview">{{ movie.overview }}</p>
        </div>
      </article>
    </template>
    
    <style scoped>
    .card { cursor:pointer; transition: transform .2s, box-shadow .2s; }
    .card:hover { transform: scale(1.06); }
    .card.on { outline: 2px solid #e50914; box-shadow: 0 0 0 2px rgba(229,9,20,.25); }
    .overview { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient: vertical; overflow:hidden; }
    </style>
    .cardWrap{
        border-radius: var(--r-lg);
        overflow: hidden;
        background: var(--surface);
        border: 1px solid var(--line);
        box-shadow: var(--shadow);
        transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
      }
      .cardWrap:hover{ transform: translateY(-2px) scale(1.02); box-shadow: 0 16px 36px rgba(27,20,23,.10); }
      .cardWrap.on{ border-color: rgba(122,31,61,.55); box-shadow: 0 18px 40px rgba(122,31,61,.12); }
      .poster{ aspect-ratio: 2/3; width: 100%; object-fit: cover; display:block; background: #eee; }
      .meta{ padding: 12px 12px 14px; }
      .title{ font-weight: 700; font-size: 14px; margin:0 0 6px; }
      .sub{ color: var(--muted); font-size: 12px; display:flex; justify-content:space-between; }
      