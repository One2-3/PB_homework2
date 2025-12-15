<script setup lang="ts">
  import AppHeader from "@/components/layout/AppHeader.vue";
  </script>
  
  <template>
    <AppHeader />
    <main class="main">
      <RouterView v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
  </template>
  
  <style scoped>
  .main{ padding: 18px 0 34px; }
  .page-enter-active,.page-leave-active{ transition: opacity .2s, transform .2s; }
  .page-enter-from,.page-leave-to{ opacity:0; transform: translateY(8px); }
  </style>
  