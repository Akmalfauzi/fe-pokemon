<script setup>
import { computed, toRef } from "vue";
import { useFavoriteStore } from "../stores/favoriteStore.js";
import { useSound } from "../composables/useSound.js";
import { usePokemon } from "../composables/usePokemon.js";
import { toast } from "vue-sonner";
import { formatPokemonId } from "../utils/pokemonHelpers.js";
import LazyImage from "./LazyImage.vue";
import TypeBadge from "./TypeBadge.vue";
import FavoriteButton from "./FavoriteButton.vue";
import pokeballWhiteIcon from "../assets/svg/pokeball-white.svg?component";

const { playClickSound } = useSound();
const favoriteStore = useFavoriteStore();

const props = defineProps({
    pokemon: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(["click"]);

const pokemonRef = toRef(props, "pokemon");
const { imageUrl, cardGradient } = usePokemon(pokemonRef);

const isFavorite = computed(() => favoriteStore.isFavorite(props.pokemon.id));

const handleCardClick = () => {
    playClickSound();
    emit("click", props.pokemon);
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
</script>

<template>
    <div
        class="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
        :class="cardGradient"
        @click="handleCardClick"
    >
        <!-- Background -->
        <div
            class="absolute top-0 left-0 right-0 bottom-0 flex items-start justify-center pt-13 pointer-events-none"
        >
            <component
                :is="pokeballWhiteIcon"
                alt="Pokéball Pattern"
                class="w-40 h-40 text-black/10"
            />
        </div>

        <!-- Card Content -->
        <div class="relative p-6 z-10">
            <div class="flex justify-between items-start mb-3">
                <!-- Pokemon ID -->
                <div class="text-sm font-bold text-gray-500">
                    {{ formatPokemonId(pokemon.id) }}
                </div>

                <!-- Favorite Button -->
                <FavoriteButton
                    :is-favorite="isFavorite"
                    @click="handleFavoriteClick"
                />
            </div>

            <!-- Pokemon Image -->
            <div class="relative h-32 flex items-center justify-center mb-3">
                <LazyImage
                    :src="imageUrl"
                    :alt="pokemon.name"
                    width="112"
                    height="112"
                    className="relative h-28 w-28 object-contain drop-shadow-lg transition-transform group-hover:scale-110"
                    style="background: transparent !important"
                />
            </div>

            <!-- Pokemon Name -->
            <h3
                class="text-lg font-jakarta font-semibold text-center capitalize text-gray-800 mb-3"
            >
                {{ pokemon.name }}
            </h3>

            <!-- Pokemon Types -->
            <div class="flex justify-center gap-2">
                <TypeBadge
                    v-for="(type, index) in pokemon.types"
                    :key="index"
                    :type="type"
                    size="small"
                />
            </div>

            <!-- Hover Effect Overlay -->
            <div
                class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            ></div>
        </div>
    </div>
</template>
