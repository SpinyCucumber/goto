<script setup lang="ts">
import CustomInput from '@/components/CustomInput.vue';
import { SuffixArrayBuilder } from '@/utility/suffixArray';
import { computed, ref, type Ref } from 'vue';

interface Link {
  name: string;
  uri: string;
  tags: string[];
}

// TODO Retrieve from URL
const search = ref("");
const links: Ref<Link[]> = ref([
  { name: "Wikipedia", uri: "https://en.wikipedia.org", tags: ["wiki"] },
  { name: "The Crimson White", uri: "https://thecrimsonwhite.com/", tags: ["news", "bama"] }
]);

// We compute a search index from list of links
const suffixArray = computed(() => {
  const builder = new SuffixArrayBuilder<Link>();
  for (const link of links.value) {
    // Use name, URI host, URI path, and tags as labels
    const uri = new URL(link.uri);
    builder.addLabel(link, link.name);
    builder.addLabel(link, uri.host);
    for (const tag of link.tags) {
      builder.addLabel(link, tag);
    }
  }
  return builder.build();
});

// Search results computed using search term and search index
const searchResults = computed(() => {
  return suffixArray.value.search(search.value);
})

function activate(link: Link) {
  window.open(link.uri);
}

</script>

<template>
  <main>
    <CustomInput class="search-input" v-model="search"/>
    <ul class="results">
      <li v-for="result in searchResults" @click="activate(result)">
        <span class="result-name">{{ result.name }}</span>
        <span class="result-tags">({{ result.tags.join(",") }})</span>
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  padding-left: 0.4rem;
  transition: background-color 0.25s;
}

.results > li + li {
  border-top: 1px solid color-mix(in srgb, var(--color-border) 25%, transparent);
}

.results > li:hover {
  background-color: var(--color-link-hover);
}

.results > li:hover .result-name {
  color: var(--color-link);
}

.results > li:hover .result-tags {
  color: color-mix(in srgb, var(--color-link) 25%, transparent);
}

.result-name {
  font-size: 18px;
  transition: color 0.25s;
}

.result-tags {
  font-size: 16px;
  color: color-mix(in srgb, var(--color-text) 25%, transparent);
  transition: color 0.25s;
}
</style>