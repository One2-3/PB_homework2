import { defineStore } from "pinia";
import { lsGet, lsSet } from "@/composables/useLocalStorage";
import type { MovieSummary } from "@/types/tmdb";

const WISH_KEY = "movieWishlist";

export const useWishlistStore = defineStore("wishlist", {
  state: () => ({
    items: lsGet<MovieSummary[]>(WISH_KEY, []),
  }),
  getters: {
    has: (s) => (id: number) => s.items.some(m => m.id === id),
  },
  actions: {
    toggle(movie: MovieSummary) {
      const idx = this.items.findIndex(m => m.id === movie.id);
      if (idx >= 0) this.items.splice(idx, 1);
      else this.items.unshift(movie);
      lsSet(WISH_KEY, this.items);
    },
    hydrate() {
      this.items = lsGet<MovieSummary[]>(WISH_KEY, []);
    }
  },
});
