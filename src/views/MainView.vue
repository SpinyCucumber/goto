<script setup lang="ts">
import CustomInput from '@/components/CustomInput.vue';
import { SuffixArrayBuilder } from '@/utility/suffixArray';
import { computed, onMounted, ref, type Ref } from 'vue';
import axios from 'axios';

interface Link {
  name: string;
  uri: string;
  tags?: string[];
}

const props = defineProps<{sourceUri: string}>();
const search = ref("");
const links: Ref<Link[]> = ref([]);

// We compute a search index from list of links
const suffixArray = computed(() => {
  const builder = new SuffixArrayBuilder<Link>();
  for (const link of links.value) {
    // Use name, URI host, URI path, and tags as labels
    const uri = new URL(link.uri);
    builder.addLabel(link, link.name);
    builder.addLabel(link, uri.host);
    if (link.tags !== undefined) {
      for (const tag of link.tags) {
        builder.addLabel(link, tag);
      }
    }
  }
  return builder.build();
});

// Search results computed using search term and search index
// We sort results by number of substring matches
const searchResults = computed(() => {
  if (search.value === "") return [];
  return suffixArray.value.search(search.value).frequencies
    .toSeq()
    .sort().reverse()
    .keySeq()
    .toArray()
})

function activate(link: Link) {
  window.open(link.uri, "_blank");
}

async function fetchLinks() {
  const response = await axios.get<Link[]>(props.sourceUri);
  links.value = response.data;
}

onMounted(async () => {
  await fetchLinks();
});

</script>

<template>
  <main>
    <CustomInput class="search-input" v-model="search" @enter="activate(searchResults[0])" autofocus/>
    <ul class="results">
      <li v-for="result in searchResults" @click="activate(result)">
        <span class="result-name">{{ result.name }}</span>
        <span class="result-tags" v-if="result.tags">({{ result.tags.join(",") }})</span>
      </li>
    </ul>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  --color: var(--color-text);
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
  --color: var(--color-link);
}

.result-name {
  font-size: 18px;
  color: var(--color);
}

.result-tags {
  font-size: 16px;
  color: color-mix(in srgb, var(--color) 25%, transparent);
}
</style>