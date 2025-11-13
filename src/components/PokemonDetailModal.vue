<script setup>
import { ref, computed, watch, toRef } from "vue";
import { useFavoriteStore } from "../stores/favoriteStore.js";
import { usePokemonStore } from "../stores/pokemonStore.js";
import { useSound } from "../composables/useSound.js";
import { usePokemon } from "../composables/usePokemon.js";
import { toast } from "vue-sonner";
import {
    formatHeight,
    formatWeight,
    getStatPercentage,
    getStatColor,
} from "../utils/pokemonHelpers.js";
import LazyImage from "./LazyImage.vue";
import TypeBadge from "./TypeBadge.vue";
import FavoriteButton from "./FavoriteButton.vue";
import PokemonDetailLoading from "./PokemonDetailLoading.vue";
import pokeballWhiteIcon from "../assets/svg/pokeball-white.svg?component";

const props = defineProps({
    pokemon: {
        type: Object,
        required: true,
    },
    isOpen: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(["close"]);

const favoriteStore = useFavoriteStore();
const pokemonStore = usePokemonStore();
const { playClickSound } = useSound();
const activeTab = ref("stats");

const pokemonRef = toRef(props, "pokemon");
const { imageUrl } = usePokemon(pokemonRef);

const isLoading = computed(() => pokemonStore.loadingDetail);

const abilities = computed(() => {
    if (!props.pokemon?.abilities || !Array.isArray(props.pokemon.abilities)) {
        return [];
    }
    return props.pokemon.abilities.map((ability) => {
        const abilityName =
            typeof ability === "string"
                ? ability
                : ability.ability?.name || ability.name || "";
        return abilityName
            .replace("-", " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    });
});

const stats = computed(() => {
    if (!props.pokemon) return [];
    return [
        { name: "hp", label: "HP", value: props.pokemon.hp || 0 },
        { name: "attack", label: "Attack", value: props.pokemon.attack || 0 },
        {
            name: "defense",
            label: "Defense",
            value: props.pokemon.defense || 0,
        },
        {
            name: "special-attack",
            label: "Sp. Atk",
            value: props.pokemon.special_attack || 0,
        },
        {
            name: "special-defense",
            label: "Sp. Def",
            value: props.pokemon.special_defense || 0,
        },
        { name: "speed", label: "Speed", value: props.pokemon.speed || 0 },
    ];
});

const isFavorite = computed(() => favoriteStore.isFavorite(props.pokemon?.id));

const closeModal = () => {
    playClickSound();
    emit("close");
};

const changeTab = (tab) => {
    playClickSound();
    activeTab.value = tab;
};

const handleFavoriteClick = async () => {
    playClickSound();

    try {
        const newStatus = await favoriteStore.toggleFavorite(props.pokemon.id);

        if (newStatus) {
            toast.success(`${props.pokemon.name} added to favorites!`, {
                description: "You can view your favorites anytime",
            });
        } else {
            toast.info(`${props.pokemon.name} removed from favorites`, {
                description: "Pokemon removed from your collection",
            });
        }
    } catch (error) {
        toast.error("Failed to update favorites", {
            description: "Please try again later",
        });
    }
};

watch(
    () => props.isOpen,
    (newValue) => {
        if (!newValue) {
            activeTab.value = "stats";
        }
    }
);
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 z-50" @click.self="closeModal">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/30 backdrop-blur-sm"></div>

        <!-- Modal Content -->
        <div class="fixed inset-0 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen p-4">
                <div
                    class="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide"
                >
                    <!-- Background -->
                    <div
                        class="absolute top-0 left-0 right-0 bottom-0 flex items-start justify-center pt-30 pointer-events-none overflow-hidden"
                    >
                        <component
                            :is="pokeballWhiteIcon"
                            alt="Pokéball Background"
                            class="w-75 h-75 text-black/5"
                        />
                    </div>

                    <!-- Close Button -->
                    <button
                        @click="closeModal"
                        class="absolute top-4 right-4 z-20 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <svg
                            class="w-6 h-6 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>

                    <!-- Favorite Button -->
                    <div v-if="!isLoading" class="absolute top-4 right-16 z-20">
                        <FavoriteButton
                            :is-favorite="isFavorite"
                            size="large"
                            @click="handleFavoriteClick"
                        />
                    </div>

                    <!-- Loading State -->
                    <div v-if="isLoading" class="relative p-8 z-10">
                        <PokemonDetailLoading />
                    </div>

                    <div v-else class="relative p-8 z-10">
                        <!-- Header Section -->
                        <div class="text-center mb-8">
                            <h2
                                class="text-4xl font-jakarta font-bold capitalize text-gray-800 mb-2"
                            >
                                {{ pokemon.name }}
                            </h2>
                            <p class="text-xl font-jakarta text-gray-500">
                                No. {{ String(pokemon.id).padStart(3, "0") }}
                            </p>

                            <!-- Pokemon Image -->
                            <div
                                class="relative h-64 flex items-center justify-center my-8"
                            >
                                <LazyImage
                                    :src="imageUrl"
                                    :alt="pokemon.name"
                                    width="224"
                                    height="224"
                                    className="h-56 w-56 object-contain drop-shadow-2xl"
                                    style="background: transparent !important"
                                />
                            </div>

                            <!-- Types -->
                            <div class="flex justify-center gap-4 mb-6">
                                <TypeBadge
                                    v-for="type in pokemon.types"
                                    :key="type.type?.name || type"
                                    :type="type"
                                    size="large"
                                />
                            </div>
                        </div>

                        <!-- Tabs Navigation -->
                        <div
                            class="flex justify-center mb-6 border-b border-gray-200"
                        >
                            <button
                                @click="changeTab('stats')"
                                :class="[
                                    'px-6 py-3 font-semibold text-lg transition-all duration-200 cursor-pointer',
                                    activeTab === 'stats'
                                        ? 'text-red-600 border-b-2 border-red-600'
                                        : 'text-gray-500 hover:text-gray-700',
                                ]"
                            >
                                Stats & Info
                            </button>
                            <button
                                @click="changeTab('abilities')"
                                :class="[
                                    'px-6 py-3 font-semibold text-lg transition-all duration-200 cursor-pointer',
                                    activeTab === 'abilities'
                                        ? 'text-red-600 border-b-2 border-red-600'
                                        : 'text-gray-500 hover:text-gray-700',
                                ]"
                            >
                                Abilities
                            </button>
                        </div>

                        <!-- Tab Content -->
                        <div class="min-h-[300px]">
                            <!-- Stats & Info Tab -->
                            <div
                                v-show="activeTab === 'stats'"
                                class="grid md:grid-cols-2 gap-8"
                            >
                                <!-- Basic Info -->
                                <div class="bg-gray-50 rounded-2xl p-6">
                                    <h3
                                        class="text-2xl font-jakarta font-bold text-gray-800 mb-4"
                                    >
                                        Basic Info
                                    </h3>

                                    <div class="space-y-3">
                                        <div class="flex justify-between">
                                            <span class="text-gray-600"
                                                >Height:</span
                                            >
                                            <span
                                                class="font-semibold text-gray-800"
                                                >{{
                                                    formatHeight(pokemon.height)
                                                }}</span
                                            >
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600"
                                                >Weight:</span
                                            >
                                            <span
                                                class="font-semibold text-gray-800"
                                                >{{
                                                    formatWeight(pokemon.weight)
                                                }}</span
                                            >
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600"
                                                >Base Experience:</span
                                            >
                                            <span
                                                class="font-semibold text-gray-800"
                                                >{{
                                                    pokemon.base_experience
                                                }}</span
                                            >
                                        </div>
                                    </div>
                                </div>

                                <!-- Stats -->
                                <div class="bg-gray-50 rounded-2xl p-6">
                                    <h3
                                        class="text-2xl font-jakarta font-bold text-gray-800 mb-4"
                                    >
                                        Stats
                                    </h3>

                                    <div class="space-y-4">
                                        <div
                                            v-for="stat in stats"
                                            :key="stat.name"
                                            class="space-y-1"
                                        >
                                            <div
                                                class="flex justify-between text-sm"
                                            >
                                                <span
                                                    class="font-medium text-gray-700"
                                                    >{{ stat.label }}</span
                                                >
                                                <span class="text-gray-600">{{
                                                    stat.value
                                                }}</span>
                                            </div>
                                            <div
                                                class="w-full bg-gray-200 rounded-full h-2"
                                            >
                                                <div
                                                    class="h-2 rounded-full transition-all duration-500"
                                                    :class="
                                                        getStatColor(stat.value)
                                                    "
                                                    :style="{
                                                        width: `${getStatPercentage(
                                                            stat.value
                                                        )}%`,
                                                    }"
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Abilities Tab -->
                            <div
                                v-show="activeTab === 'abilities'"
                                class="bg-gray-50 rounded-2xl p-8"
                            >
                                <h3
                                    class="text-3xl font-jakarta font-bold text-gray-800 mb-6 text-center"
                                >
                                    Abilities
                                </h3>
                                <div
                                    class="flex flex-wrap justify-center gap-3"
                                >
                                    <span
                                        v-for="ability in abilities"
                                        :key="ability"
                                        class="px-6 py-3 bg-red-100 text-red-700 rounded-full text-lg font-semibold"
                                    >
                                        {{ ability }}
                                    </span>
                                </div>
                                <p
                                    v-if="abilities.length === 0"
                                    class="text-center text-gray-500 text-lg mt-6"
                                >
                                    No abilities available
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
