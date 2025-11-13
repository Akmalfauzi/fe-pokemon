import { computed } from 'vue'
import { usePokemonStore } from '../stores/pokemonStore.js'
import { toast } from 'vue-sonner'
import { useSound } from './useSound.js'

export function useFavorite() {
    const pokemonStore = usePokemonStore()
    const { playClickSound } = useSound()

    const toggleFavorite = async (pokemon) => {
        playClickSound()

        try {
            const newStatus = await pokemonStore.toggleFavorite(pokemon.id)

            if (newStatus) {
                toast.success(`${pokemon.name} added to favorites!`, {
                    description: 'You can view your favorites anytime'
                })
            } else {
                toast.info(`${pokemon.name} removed from favorites`, {
                    description: 'Pokemon removed from your collection'
                })
            }

            return newStatus
        } catch (error) {
            toast.error('Failed to update favorites', {
                description: 'Please try again later'
            })
            throw error
        }
    }

    const isFavorite = (pokemonId) => {
        return computed(() => pokemonStore.isFavorite(pokemonId))
    }

    return {
        toggleFavorite,
        isFavorite
    }
}
