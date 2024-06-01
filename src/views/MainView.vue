<script setup lang="ts">
import CustomInput from '@/components/CustomInput.vue';
</script>

<template>
  <main>
    <CustomInput class="search"/>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
}
.search {
  display: flex;
  flex-direction: column;
  font-size: 24px;
}
</style>