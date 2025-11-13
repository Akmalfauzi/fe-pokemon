<script setup>
import { computed, ref } from "vue";
import pokeballIcon from "../assets/svg/pokeball.svg?component";

const props = defineProps({
    src: {
        type: String,
        required: true,
    },
    alt: {
        type: String,
        required: true,
    },
    width: {
        type: [String, Number],
        default: null,
    },
    height: {
        type: [String, Number],
        default: null,
    },
    className: {
        type: String,
        default: "",
    },
    loadingClass: {
        type: String,
        default: "animate-pulse bg-gray-200",
    },
    errorClass: {
        type: String,
        default: "bg-gray-100",
    },
});

const imageStyle = computed(() => {
    const style = {};
    if (props.width) {
        style.width =
            typeof props.width === "number" ? `${props.width}px` : props.width;
    }
    if (props.height) {
        style.height =
            typeof props.height === "number"
                ? `${props.height}px`
                : props.height;
    }
    return style;
});

const imageClass = computed(() => {
    return props.className;
});

const isLoading = ref(true);
const hasError = ref(false);

const handleImageError = (event) => {
    event.target.onerror = null;
    isLoading.value = false;
    hasError.value = true;

    const pokemonId = props.src.match(/\/(\d+)\.png$/)?.[1];
    if (pokemonId && !event.target.dataset.fallbackTried) {
        const githubUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
        event.target.dataset.fallbackTried = "true";
        event.target.src = githubUrl;
        hasError.value = false;
        isLoading.value = true;
    }
};

const handleLoadComplete = () => {
    isLoading.value = false;
    hasError.value = false;
};
</script>

<template>
    <div class="relative inline-block" :style="imageStyle">
        <div
            v-if="isLoading"
            class="absolute inset-0 flex items-center justify-center"
            :style="imageStyle"
        >
            <component
                :is="pokeballIcon"
                alt="Loading..."
                class="w-12 h-12 animate-pulse"
            />
        </div>

        <img
            :src="src"
            :alt="alt"
            :style="imageStyle"
            :class="[
                imageClass,
                { 'opacity-0': isLoading, 'opacity-100': !isLoading },
            ]"
            @error="handleImageError"
            @load="handleLoadComplete"
            class="transition-opacity duration-300"
        />
    </div>
</template>

<style scoped>
img[lazy="loading"],
img[lazy="loaded"],
img[lazy="error"] {
    background: transparent !important;
}

img {
    background-color: transparent !important;
}
</style>
