<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import AppHeader from "@/components/layout/AppHeader.vue";
  
  const route = useRoute();
  const hideHeader = computed(() => route.path === "/signin");
  </script>
  
  <template>
    <AppHeader v-if="!hideHeader" />
    <main class="main" :class="{ full: hideHeader }">
      <RouterView v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
  </template>
  
  <style scoped>
  .main{ padding: 18px 0 34px; }
  .main.full{ padding: 0; min-height: 100vh; display:flex; }
  .page-enter-active,.page-leave-active{ transition: opacity .2s, transform .2s; }
  .page-enter-from,.page-leave-to{ opacity:0; transform: translateY(8px); }
  </style>
  