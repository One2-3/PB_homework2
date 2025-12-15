<script setup lang="ts">
    import { onMounted } from "vue";
    import MovieCard from "@/components/movie/MovieCard.vue";
    import { useWishlistStore } from "@/stores/wishlist";
    import { useRouter } from "vue-router";
    
    const wish = useWishlistStore();
    const router = useRouter();
    onMounted(() => wish.hydrate());
    </script>
    
    <template>
      <div class="container">
        <div class="topline">
          <h2>Wishlist</h2>
          <span class="badge">{{ wish.items.length }} saved</span>
        </div>
    
        <div v-if="wish.items.length===0" class="empty card">
          <h3>아직 담은 영화가 없어요</h3>
          <p>마음에 드는 포스터를 눌러 저장해 보세요.</p>
          <button class="btn primary" @click="router.push('/search')">Search로 가기</button>
        </div>
    
        <div v-else class="grid">
          <MovieCard
            v-for="m in wish.items"
            :key="m.id"
            :movie="m"
            :wished="true"
            @toggle="wish.toggle"
          />
        </div>
      </div>
    </template>
    
    <style scoped>
    .topline{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom: 10px; }
    h2{ margin:0; font-size: 18px; }
    .grid{ display:grid; gap:12px; grid-template-columns: repeat(6, 1fr); }
    .empty{ padding: 18px; }
    .empty h3{ margin:0 0 6px; }
    .empty p{ margin:0 0 12px; color:var(--muted); }
    @media (max-width: 1100px){ .grid{ grid-template-columns: repeat(4, 1fr); } }
    @media (max-width: 760px){ .grid{ grid-template-columns: repeat(2, 1fr); } }
    </style>
    