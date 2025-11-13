<script setup>
import { computed } from "vue";
import { useSound } from "../composables/useSound.js";
import speakerOnIcon from "../assets/svg/speaker-on.svg?component";
import speakerOffIcon from "../assets/svg/speaker-off.svg?component";
import pokeballIcon from "../assets/svg/pokeball.svg?component";

const { playClickSound, soundEnabled, toggleSound } = useSound();

defineProps({
    showLeftButton: {
        type: Boolean,
        default: true,
    },
    leftButtonText: {
        type: String,
        default: "Button",
    },
    leftButtonIcon: {
        type: String,
        default: "list",
    },
    leftButtonBadge: {
        type: [String, Number],
        default: null,
    },
    leftButtonGradient: {
        type: String,
        default:
            "from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600",
    },
});

const emit = defineEmits(["left-button-click"]);

const currentSpeakerIcon = computed(() =>
    soundEnabled.value ? speakerOnIcon : speakerOffIcon
);

const handleSoundToggle = () => {
    if (soundEnabled.value) {
        playClickSound();
    }
    toggleSound();
};

const handleLeftButtonClick = () => {
    playClickSound();
    emit("left-button-click");
};
</script>

<template>
    <header class="bg-white shadow-lg sticky top-0 z-50">
        <div class="container mx-auto px-4 py-6">
            <!-- Top Navigation Bar -->
            <div class="flex justify-between items-center mb-6">
                <!-- Left: Navigation -->
                <div class="flex items-center gap-3">
                    <button
                        v-if="showLeftButton"
                        @click="handleLeftButtonClick"
                        :class="[
                            'px-4 py-2 rounded-lg bg-gradient-to-r text-white font-semibold transition-all flex items-center gap-2 shadow-md',
                            leftButtonGradient,
                        ]"
                    >
                        <!-- Icon Slot -->
                        <slot name="left-icon">
                            <svg
                                v-if="leftButtonIcon === 'list'"
                                class="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                            <svg
                                v-else-if="leftButtonIcon === 'heart'"
                                class="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                />
                            </svg>
                        </slot>
                        <span>{{ leftButtonText }}</span>
                        <span
                            v-if="leftButtonBadge"
                            class="bg-white text-purple-600 px-2.5 py-0.5 rounded-full text-sm font-bold ml-1"
                        >
                            {{ leftButtonBadge }}
                        </span>
                    </button>
                </div>

                <!-- Right: Controls -->
                <div class="flex items-center gap-3">
                    <!-- Sound Toggle -->
                    <button
                        @click="handleSoundToggle"
                        class="p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                        :title="
                            soundEnabled ? 'Turn Sound Off' : 'Turn Sound On'
                        "
                    >
                        <component
                            :is="currentSpeakerIcon"
                            class="w-5 h-5 text-gray-700"
                        />
                    </button>

                    <!-- GitHub Link -->
                    <a
                        href="https://github.com/akmalfauzi"
                        target="_blank"
                        rel="noopener noreferrer"
                        @click="playClickSound"
                        class="p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        title="View on GitHub"
                    >
                        <svg
                            class="w-5 h-5 text-gray-700"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                            />
                        </svg>
                    </a>
                </div>
            </div>

            <!-- Title Section -->
            <div class="flex items-center justify-center mb-6">
                <component
                    :is="pokeballIcon"
                    alt="Pokéball"
                    class="w-10 h-10 mr-3 animate-spin"
                    style="animation-duration: 3s"
                />
                <h1
                    class="text-4xl font-jakarta font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
                >
                    Pokédex
                </h1>
                <component
                    :is="pokeballIcon"
                    alt="Pokéball"
                    class="w-10 h-10 ml-3 animate-spin"
                    style="animation-duration: 3s; animation-direction: reverse"
                />
            </div>

            <!-- Search/Filter Slot -->
            <slot name="filters"></slot>
        </div>
    </header>
</template>
