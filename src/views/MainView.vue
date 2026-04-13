<template>
  <div class="flex h-screen overflow-hidden">
    <AppSidebar v-model:collapsed="collapsed" />
    <main class="flex-1 overflow-auto">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const collapsed = ref(false)
</script>
