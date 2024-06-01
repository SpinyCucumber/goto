<script setup lang="ts">
import CustomInput from '@/components/CustomInput.vue';
import { SuffixArrayBuilder } from '@/utility/suffixArray';
import { computed, ref, type Ref } from 'vue';

interface Link {
  name: string;
  uri: string;
}

// TODO Retrieve from URL
const search = ref("");
const links: Ref<Link[]> = ref([
  { name: "Wikipedia", uri: "https://en.wikipedia.org" },
  { name: "The Crimson White", uri: "https://thecrimsonwhite.com/" }
]);

// We compute a search index from list of links
const suffixArray = computed(() => {
  const builder = new SuffixArrayBuilder<Link>();
  for (const link of links.value) {
    // Use name, URI host, and URI path as labels
    const uri = new URL(link.uri);
    builder.addLabel(link, link.name);
    builder.addLabel(link, uri.host);
  }
  return builder.build();
});

// Search results computed using search term and search index
const searchResults = computed(() => {
  return suffixArray.value.search(search.value);
})

</script>

<template>
  <main>
    <CustomInput class="search-input" v-model="search"/>
    <ul class="results">
      <li v-for="result in searchResults">
        <span class="result-name">{{ result.name }}</span>
      </li>
    </ul>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-input {
  display: flex;
  flex-direction: column;
  font-size: 24px;
}

.results {
  list-style-type: none;
  padding-left: 0;
}

.results > li {
  padding: 0.35rem;
}

.results > li + li {
  border-top: 1px solid color-mix(in srgb, var(--color-border) 25%, transparent)
}

.result-name {
  font-size: 20px;
}
</style>