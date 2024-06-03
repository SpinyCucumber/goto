<script setup lang="ts">
import CustomInput from '@/components/CustomInput.vue';
import { SuffixArrayBuilder } from '@/utility/suffixArray';
import { computed, onMounted, ref, type Ref } from 'vue';
import { type IConfig, type ILink, getLinks } from '@/config';
import { UsedTermsLocalStorage } from '@/usedTerms';
import Immutable from 'immutable';
import useLocalStorage from '@/utility/useLocalStorage';

const usedTerms = new UsedTermsLocalStorage();
const search = ref("");
const links: Ref<ILink[]> = ref([]);
const config = useLocalStorage<IConfig>("config", {});

// We compute a search index from list of links
const suffixArray = computed(() => {

  const start = performance.now();
  const builder = new SuffixArrayBuilder<ILink>();
  for (const link of links.value) {

    // Break URI into separate labels (host parts, path parts)
    // Must strip preceding "/" of path
    const uri = new URL(link.uri);
    const path = uri.pathname.substring(1);
    if (path !== "") {
      for (const pathPart of path.split("/")) {
        builder.addLabel(link, pathPart, 1)
      }
    }
    for (const hostPart of uri.hostname.split(".")) {
      builder.addLabel(link, hostPart, 1)
    }

    // Add link name (weight higher than URI components)
    builder.addLabel(link, link.name, 4);

    // Add tags as labels
    if (link.tags !== undefined) {
      for (const tag of link.tags) {
        builder.addLabel(link, tag, 1);
      }
    }

    // Add previously used terms as labels
    for (const [term, amount] of usedTerms.get(link)) {
      builder.addLabel(link, term, amount);
    }

  }
  const result = builder.build();
  const time = performance.now() - start;
  console.log(`Built search index in ${10e-4*time}s`);
  return result;
});

// Search results computed using search term and search index
// We sort results by number of substring matches
const searchResults = computed(() => {
  if (search.value === "") return [];
  return Immutable.Seq(suffixArray.value.search(search.value).frequencies)
    .sort((a, b) => b[1] - a[1])
    .toArray()
});

// Highest frequency of any search result
const maxFrequency = computed(() => {
  return Math.max(...searchResults.value.map(([_, frequency]) => frequency));
});

function activateLink(link: ILink) {
  usedTerms.increment(link, search.value);
  window.open(link.uri, "_blank");
}

onMounted(async () => {
  links.value = await getLinks(config.value);
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
  opacity: max(var(--score), 0.25);
}

.result-tags {
  font-size: 16px;
  opacity: 0.25;
}
</style>