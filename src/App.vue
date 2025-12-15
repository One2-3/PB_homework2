<template>
  <AppHeader />
  <RouterView v-slot="{ Component }">
    <transition name="page" mode="out-in">
      <component :is="Component" />
    </transition>
  </RouterView>
</template>

<style>
.page-enter-active, .page-leave-active { transition: opacity .2s, transform .2s; }
.page-enter-from, .page-leave-to { opacity: 0; transform: translateY(8px); }
</style>
