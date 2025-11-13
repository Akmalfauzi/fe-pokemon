<script setup>
import { computed } from "vue";
import pokemonLogoIcon from "../assets/pokemon-icon.svg?component";

const props = defineProps({
    size: {
        type: String,
        default: "medium",
        validator: (value) =>
            ["small", "medium", "large", "xlarge"].includes(value),
    },
    text: {
        type: String,
        default: "Loading...",
    },
    animation: {
        type: String,
        default: "bounce",
        validator: (value) =>
            ["bounce", "pulse", "spin", "none"].includes(value),
    },
    textColor: {
        type: String,
        default: "text-gray-600",
    },
    textSize: {
        type: String,
        default: "text-base",
        validator: (value) =>
            ["text-sm", "text-base", "text-lg", "text-xl"].includes(value),
    },
    fullScreen: {
        type: Boolean,
        default: false,
    },
    vertical: {
        type: Boolean,
        default: true,
    },
});

const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-12 w-12",
    large: "h-16 w-16",
    xlarge: "h-20 w-20",
};

const animationClasses = {
    bounce: "animate-bounce",
    pulse: "animate-pulse",
    spin: "animate-spin",
    none: "",
};

const containerClasses = computed(() =>
    props.fullScreen
        ? "fixed inset-0 z-50 flex justify-center items-center bg-white/80 backdrop-blur-sm"
        : props.vertical
        ? "inline-flex flex-col justify-center items-center"
        : "inline-flex justify-center items-center"
);
</script>

<template>
    <div :class="containerClasses">
        <!-- Pokemon Logo -->
        <div class="inline-flex">
            <component
                :is="pokemonLogoIcon"
                :alt="text"
                :class="[
                    sizeClasses[size],
                    animationClasses[animation],
                    'flex-shrink-0 transition-all duration-300',
                ]"
                :style="{
                    filter: `drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1)) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05))`,
                }"
            />
        </div>

        <!-- Optional Text -->
        <p
            v-if="text"
            :class="[
                textColor,
                textSize,
                'font-jakarta mt-4',
                vertical ? 'text-center' : 'ml-4 text-left',
            ]"
        >
            {{ text }}
        </p>
    </div>
</template>
