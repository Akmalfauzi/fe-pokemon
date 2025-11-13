<script setup>
import { onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useFavoriteStore } from "../stores/favoriteStore.js";
import { usePokemonStore } from "../stores/pokemonStore.js";
import PokemonCard from "../components/PokemonCard.vue";
import PokemonDetailModal from "../components/PokemonDetailModal.vue";
import PokemonLoading from "../components/PokemonLoading.vue";
import AppHeader from "../components/AppHeader.vue";
import SearchBar from "../components/SearchBar.vue";
import { useSound } from "../composables/useSound.js";

const router = useRouter();
const favoriteStore = useFavoriteStore();
const pokemonStore = usePokemonStore();
const { playClickSound } = useSound();

const {
    filteredFavorites,
    loading,
    error,
    searchQuery,
    selectedAbility,
    abilities,
} = storeToRefs(favoriteStore);

const { selectedPokemon, isModalOpen } = storeToRefs(pokemonStore);

const {
    fetchFavorites,
    fetchAbilities,
    searchFavorites,
    filterByAbility,
    clearFilters,
    removeFavorite,
} = favoriteStore;

const { openPokemonDetail, closeModal } = pokemonStore;

// Debounce timer for search
let searchDebounceTimer = null;

const handleSearchInput = (value) => {
    if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
    }

    searchDebounceTimer = setTimeout(() => {
        fetchFavorites(value);
    }, 500);
};

const handleAbilityFilter = (event) => {
    playClickSound();
    filterByAbility(event.target.value);
};

const handleClearFilters = () => {
    playClickSound();
    clearFilters();
    fetchFavorites();
};

const handleBackToList = () => {
    playClickSound();
    router.push("/pokemons");
};

onMounted(async () => {
    await fetchFavorites();
    await fetchAbilities();
});

// Watch favorites changes and update abilities list
watch(
    () => favoriteStore.favorites.length,
    () => {
        fetchAbilities();
    }
);
</script>

<template>
    <div
        class="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50"
    >
        <!-- Header -->
        <AppHeader
            left-button-text="All Pokémon"
            left-button-icon="list"
            @left-button-click="handleBackToList"
        >
            <template #filters>
                <div
                    class="flex flex-col lg:flex-row gap-4 items-center justify-center"
                >
                    <SearchBar
                        :model-value="searchQuery"
                        @update:model-value="handleSearchInput"
                        placeholder="Search favorite Pokémon by name"
                        container-class="w-full lg:w-96"
                    />

                    <!-- Ability Filter -->
                    <div class="w-full lg:w-64">
                        <select
                            :value="selectedAbility"
                            @change="handleAbilityFilter"
                            class="w-full px-4 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        >
                            <option value="">All Abilities</option>
                            <option
                                v-for="ability in abilities"
                                :key="ability.name"
                                :value="ability.name"
                            >
                                {{
                                    ability.name.charAt(0).toUpperCase() +
                                    ability.name.slice(1).replace("-", " ")
                                }}
                            </option>
                        </select>
                    </div>

                    <!-- Clear Filters Button -->
                    <button
                        v-if="searchQuery || selectedAbility"
                        @click="handleClearFilters"
                        class="px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors whitespace-nowrap"
                    >
                        Clear Filters
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
                    text="Loading favorites..."
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
                            fetchFavorites();
                        }
                    "
                    class="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                    Try Again
                </button>
            </div>

            <!-- Favorites Grid -->
            <div v-else>
                <!-- Results Count -->
                <div class="mb-6 text-center">
                    <p class="text-gray-600">
                        <span class="font-semibold">{{
                            filteredFavorites.length
                        }}</span>
                        favorite Pokémon
                        <span v-if="searchQuery || selectedAbility">
                            matching your criteria</span
                        >
                    </p>
                </div>

                <!-- Grid -->
                <div
                    v-if="filteredFavorites.length > 0"
                    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                >
                    <PokemonCard
                        v-for="pokemon in filteredFavorites"
                        :key="pokemon.id"
                        :pokemon="pokemon"
                        @click="openPokemonDetail"
                    />
                </div>

                <!-- No Results -->
                <div v-else class="text-center py-20">
                    <div class="text-gray-500 text-xl mb-4">
                        {{
                            searchQuery || selectedAbility
                                ? "No Pokémon found matching your search."
                                : "No favorite Pokémon yet."
                        }}
                    </div>
                    <button
                        v-if="searchQuery || selectedAbility"
                        @click="handleClearFilters"
                        class="px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
                    >
                        Clear Search
                    </button>
                    <button
                        v-else
                        @click="handleBackToList"
                        class="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                        Browse Pokémon
                    </button>
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
