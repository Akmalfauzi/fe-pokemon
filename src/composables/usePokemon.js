import { computed } from 'vue'
import {
    getTypeName,
    getPokemonImage,
    formatAbilityName,
    getCardGradient
} from '../utils/pokemonHelpers.js'

export const usePokemon = (pokemon) => {
    const abilities = computed(() => {
        if (!pokemon?.value?.abilities || !Array.isArray(pokemon.value.abilities)) {
            return []
        }
        return pokemon.value.abilities.map(ability =>
            formatAbilityName(ability.ability?.name || ability.name || '')
        )
    })

    const types = computed(() => {
        if (!pokemon?.value?.types || !Array.isArray(pokemon.value.types)) {
            return []
        }
        return pokemon.value.types.map(type => getTypeName(type))
    })

    const primaryType = computed(() => {
        const typesList = pokemon?.value?.types || []
        if (!typesList.length) return 'normal'
        return getTypeName(typesList[0])
    })

    const imageUrl = computed(() => {
        return getPokemonImage(pokemon?.value)
    })

    const cardGradient = computed(() => {
        return getCardGradient(pokemon?.value?.types)
    })

    return {
        abilities,
        types,
        primaryType,
        imageUrl,
        cardGradient,
    }
}
