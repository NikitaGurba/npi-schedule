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