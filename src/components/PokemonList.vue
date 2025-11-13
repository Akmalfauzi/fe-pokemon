<script setup>
import { computed, onMounted, ref, onUnmounted, watch, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { usePokemonStore } from "../stores/pokemonStore.js";
import { useFavoriteStore } from "../stores/favoriteStore.js";
import PokemonCard from "./PokemonCard.vue";
import PokemonDetailModal from "./PokemonDetailModal.vue";
import PokemonLoading from "./PokemonLoading.vue";
import AppHeader from "./AppHeader.vue";
import SearchBar from "./SearchBar.vue";
import { useSound } from "../composables/useSound.js";

const router = useRouter();
const pokemonStore = usePokemonStore();
const favoriteStore = useFavoriteStore();
const { playClickSound } = useSound();

const {
    filteredPokemons,
    loading,
    loadingMore,
    error,
    searchQuery,
    totalCount,
    selectedPokemon,
    isModalOpen,
} = storeToRefs(pokemonStore);

// Actions
const {
    searchPokemon,
    clearFilters,
    openPokemonDetail,
    closeModal,
    initializeApp,
} = pokemonStore;

// Infinite scroll setup
const infiniteScrollTarget = ref(null);
const hasMorePages = computed(() => pokemonStore.hasMorePages);

// Debounce timer for search
let searchDebounceTimer = null;

// Sound click handlers
const handleClearFilters = () => {
    playClickSound();
    clearFilters();
};

const handleSearchInput = (value) => {
    // Clear previous timer
    if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
    }

    // reset if search is cleared
    if (!value || value.trim() === "") {
        clearFilters();
        return;
    }

    // Set new timer with 500ms delay
    searchDebounceTimer = setTimeout(() => {
        searchPokemon(value);
    }, 500);
};

const handleClearFiltersClick = () => {
    playClickSound();
    clearFilters();
};

// Computed properties
const favoritesCount = computed(() => favoriteStore.favoriteIds.length);
const searchValue = computed({
    get: () => searchQuery.value,
    set: (value) => {
        
    },
});

// Navigate to favorites
const goToFavorites = () => {
    playClickSound();
    router.push("/favorites");
};

// Infinite scroll observer
let observer = null;

const setupInfiniteScroll = () => {
    // Clean up existing observer
    if (observer) {
        observer.disconnect();
    }

    // Make sure target element exists
    if (!infiniteScrollTarget.value) {
        return;
    }

    observer = new IntersectionObserver(
        (entries) => {
            const target = entries[0];

            if (
                target.isIntersecting &&
                hasMorePages.value &&
                !loadingMore.value &&
                !loading.value
            ) {
                pokemonStore.loadMorePokemons();
            }
        },
        {
            root: null,
            rootMargin: "200px",
            threshold: 0.1,
        }
    );

    observer.observe(infiniteScrollTarget.value);
};

onMounted(async () => {
    await initializeApp();
    await favoriteStore.fetchFavorites();

    await nextTick();
    setupInfiniteScroll();
});

watch([() => pokemonStore.pokemons.length, hasMorePages], async () => {
    await nextTick();
    setupInfiniteScroll();
});

onUnmounted(() => {
    if (observer) {
        observer.disconnect();
    }
});
</script>

<template>
    <div
        class="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50"
    >
        <!-- Header -->
        <AppHeader
            left-button-text="Favorites"
            left-button-icon="heart"
            :left-button-badge="favoritesCount > 0 ? favoritesCount : null"
            left-button-gradient="from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            @left-button-click="goToFavorites"
        >
            <template #filters>
                <div
                    class="flex flex-col lg:flex-row gap-4 items-center justify-center"
                >
                    <SearchBar
                        :model-value="searchQuery"
                        @update:model-value="handleSearchInput"
                        placeholder="Search Pokémon by name"
                        container-class="w-full lg:w-96"
                    />

                    <button
                        v-if="searchQuery"
                        @click="handleClearFiltersClick"
                        class="px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors whitespace-nowrap"
                    >
                        Clear Search
                    </button>
                </div>
            </template>
        </AppHeader>

        <!-- Main Content -->
        <main class="container mx-auto px-4 py-8">
            <!-- Loading State -->
            <div v-if="loading" class="py-20 flex justify-center">
                <PokemonLoading
                    size="large"
                    text="Loading Pokémon..."
                    animation="bounce"
                />
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-20">
                <div class="text-red-500 text-xl mb-4">{{ error }}</div>
                <button
                    @click="
                        () => {
                            playClickSound();
                            pokemonStore.loadPokemons();
                        }
                    "
                    class="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                    Try Again
                </button>
            </div>

            <!-- Pokemon Grid -->
            <div v-else>
                <!-- Results Count -->
                <div class="mb-6 text-center">
                    <p class="text-gray-600">
                        Showing
                        <span class="font-semibold">{{
                            filteredPokemons.length
                        }}</span>
                        of
                        <span class="font-semibold">{{ totalCount }}</span>
                        Pokémon
                    </p>
                </div>

                <!-- Grid -->
                <div
                    v-if="filteredPokemons.length > 0"
                    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                >
                    <PokemonCard
                        v-for="pokemon in filteredPokemons"
                        :key="pokemon.id"
                        :pokemon="pokemon"
                        @click="openPokemonDetail"
                    />
                </div>

                <!-- No Results -->
                <div v-else class="text-center py-20">
                    <div class="text-gray-500 text-xl mb-4">
                        {{
                            searchQuery
                                ? "No Pokémon found matching your search."
                                : "No Pokémon available."
                        }}
                    </div>
                    <button
                        v-if="searchQuery"
                        @click="handleClearFilters"
                        class="px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
                    >
                        Clear Search
                    </button>
                </div>

                <!-- Infinite Scroll Loading Indicator -->
                <div v-if="loadingMore" class="py-12 flex justify-center">
                    <PokemonLoading
                        size="medium"
                        text="Loading more Pokémon..."
                        animation="pulse"
                    />
                </div>

                <!-- Infinite Scroll Trigger -->
                <div
                    ref="infiniteScrollTarget"
                    class="h-20 w-full flex items-center justify-center"
                >
                    <div v-if="hasMorePages" class="text-gray-400 text-sm">
                        Scroll for more Pokémon...
                    </div>
                </div>

                <!-- End of List Message -->
                <div
                    v-if="!hasMorePages && filteredPokemons.length > 0"
                    class="mt-8 text-center text-gray-500 pb-8"
                >
                    <p class="text-lg font-semibold">You've reached the end!</p>
                    <p class="text-sm mt-2">
                        All {{ totalCount }} Pokémon loaded
                    </p>
                </div>
            </div>
        </main>

        <!-- Pokemon Detail Modal -->
        <PokemonDetailModal
            :pokemon="selectedPokemon"
            :is-open="isModalOpen"
            @close="closeModal"
        />
    </div>
</template>
