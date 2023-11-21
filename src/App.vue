<script setup>
import Spinner from "@/components/Spinner.vue";
import { useRoute } from "vue-router";
const route = useRoute();
</script>
<template>
  <Transition :name="route.meta.transition || 'fade'">
    <Suspense timeout="0">
      <template #default>
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </template>
      <template #fallback>
        <Spinner />
      </template>
    </Suspense>
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
