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
    .toArray()
});

// Highest frequency of any search result
const maxFrequency = computed(() => {
  return Math.max(...searchResults.value.map(([_, frequency]) => frequency));
});

function activateLink(link: Link) {
  window.open(link.uri, "_blank");
}

async function fetchLinks() {
  const response = await axios.get<Link[]>(props.sourceUri);
  links.value = response.data;
}

onMounted(async () => {
  await fetchLinks();
});

function onEnter() {
  if (searchResults.value.length > 0) {
    activateLink(searchResults.value[0][0]);
  }
}

</script>

<template>
  <main>
    <CustomInput class="search-input" v-model="search" @enter="onEnter" autofocus/>
    <div class="results">
      <ul class="result-list">
        <li v-for="result in searchResults"
          @click="activateLink(result[0])"
          :style="{ '--score': `${result[1] / maxFrequency}`}">
          <span class="result-name">{{ result[0].name }}</span>
          <span class="result-tags" v-if="result[0].tags">({{ result[0].tags.join(",") }})</span>
        </li>
      </ul>
    </div>
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
  flex: 1;
  position: relative;
  overflow: auto;
}

.result-list {
  position: absolute;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  list-style-type: none;
  padding-left: 0;
  margin-right: 1rem;
}

.result-list > li {
  --color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  padding-left: 0.4rem;
  transition: all 0.25s;
}

.result-list > li + li {
  border-top: 1px solid color-mix(in srgb, var(--color-border) 25%, transparent);
}

.result-list > li:hover {
  background-color: var(--color-link-hover);
  color: var(--color-link);
}

.result-name {
  font-size: 18px;
  opacity: var(--score);
}

.result-tags {
  font-size: 16px;
  opacity: 0.25;
}
</style>