<script setup>
import { ref, computed, defineModel } from 'vue';
import { getCanvasFont, measureWidth } from '@/utility';

const input = ref(null);
const focused = ref(false);
const model = defineModel();
model.value = '';

const inputStyles = computed(() => {
    if (input.value !== null) {
        return window.getComputedStyle(input.value);
    }
});

const caretStyle = computed(() => {
    const result = { visibility: focused.value ? "visible" : "hidden" };
    // If input is loaded, retrieve width of input text
    // and move caret to appropriate place
    if (input.value !== null) {
        const font = getCanvasFont(inputStyles.value);
        console.log(font);
        const paddingLeft = parseInt(inputStyles.value.getPropertyValue('padding-left')) + 2;
        const width = measureWidth(model.value, font) + paddingLeft;
        result.transform = `translate(${width}px, -50%)`;
    }
    return result;
});

</script>

<template>
    <div class="container">
        <input class="input" type="text" ref="input" v-model="model"
            @focus="focused = true"
            @blur="focused = false"/>
        <span class="caret" :style="caretStyle">_</span>
    </div>
</template>

<style scoped>
.container {
    position: relative;
}

.input {
    font-family: inherit;
    color: inherit;
    background: none;
    border: 2px solid var(--color-border);
    padding: 0.5em;
    border-radius: 8px;
    caret-color: transparent;
}

.input:focus {
    outline: none;
}

.caret {
    position: absolute;
    left: 0;
    top: 50%;
    transition: transform 0.2s;
    animation: blink 1s infinite;
}

@keyframes blink {
    0% {
        opacity: 1.0;
    }
    50% {
        opacity: 0.0;
    }
}
</style>