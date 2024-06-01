<script setup lang="ts">
import CustomInput from '@/components/CustomInput.vue';
import { ref } from 'vue';

// TODO Retrieve from URL
const links = ref([
  { name: "Wikipedia", uri: "https://en.wikipedia.org" },
  { name: "The Crimson White", uri: "https://thecrimsonwhite.com/" }
]);
const search = ref("");

</script>

<template>
  <main>
    <CustomInput class="search-input" v-model="search"/>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
}
.search-input {
  display: flex;
  flex-direction: column;
  font-size: 24px;
}
</style>