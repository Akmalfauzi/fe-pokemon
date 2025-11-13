import { http, httpGet } from './http'

export const pokemonApi = {
    async getPokemonList(params = {}) {
        try {
            const response = await httpGet('/pokemons', { params })
            return response
        } catch (error) {
            console.error('Error fetching Pokemon list:', error)
            throw error
        }
    },

    async getPokemonDetails(idOrName) {
        try {
            const response = await httpGet(`/pokemons/${idOrName}`)
            return response.data
        } catch (error) {
            console.error('Error fetching Pokemon details:', error)
            throw error
        }
    },

    async getPokemonStats() {
        try {
            const response = await httpGet('/pokemons/stats')
            return response.data
        } catch (error) {
            console.error('Error fetching Pokemon stats:', error)
            throw error
        }
    },

    async addToFavorites(pokemonId) {
        try {
            const response = await http.post(`/pokemons/${pokemonId}/favorite`)
            return response.data
        } catch (error) {
            console.error('Error adding to favorites:', error)
            throw error
        }
    },

    async removeFromFavorites(pokemonId) {
        try {
            const response = await http.delete(`/pokemons/${pokemonId}/favorite`)
            return response.data
        } catch (error) {
            console.error('Error removing from favorites:', error)
            throw error
        }
    },

    async getFavorites(params = {}) {
        try {
            const response = await httpGet('/pokemons/favorites', { params })
            return response.data || []
        } catch (error) {
            console.error('Error fetching favorites:', error)
            return []
        }
    },

    async getAbilities() {
        try {
            const response = await httpGet('/pokemons/favorites/abilities')
            return response.data || []
        } catch (error) {
            console.error('Error fetching abilities:', error)
            return []
        }
    },

    async toggleFavorite(pokemonId, isFavorite) {
        return isFavorite
            ? await this.removeFromFavorites(pokemonId)
            : await this.addToFavorites(pokemonId)
    }
}