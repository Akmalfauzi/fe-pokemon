import { defineStore } from 'pinia'
import { pokemonApi } from '../services/pokemonApi.js'

export const useFavoriteStore = defineStore('favorite', {
    state: () => ({
        favorites: [],
        abilities: [],
        loading: false,
        error: null,
        searchQuery: '',
        selectedAbility: ''
    }),

    getters: {
        filteredFavorites: (state) => {
            let result = state.favorites

            if (state.searchQuery) {
                const query = state.searchQuery.toLowerCase()
                result = result.filter(pokemon =>
                    pokemon.name.toLowerCase().includes(query) ||
                    pokemon.id.toString().includes(query)
                )
            }

            if (state.selectedAbility) {
                result = result.filter(pokemon => {
                    const pokemonAbilities = pokemon.abilities.map(a =>
                        typeof a === 'string' ? a : a.ability?.name || a.name || a
                    )
                    return pokemonAbilities.includes(state.selectedAbility)
                })
            }

            return result
        },

        favoriteIds: (state) => state.favorites.map(f => f.id)
    },

    actions: {
        transformFavorite(favorite) {
            const pokedexNumber = favorite.pokedex_number || favorite.id
            return {
                id: favorite.id,
                name: favorite.name,
                pokedex_number: pokedexNumber,
                types: Array.isArray(favorite.types) ? favorite.types.map(type => ({
                    type: { name: typeof type === 'string' ? type : type.name || type }
                })) : [],
                abilities: Array.isArray(favorite.abilities) ? favorite.abilities.map(ability => ({
                    ability: { name: typeof ability === 'string' ? ability : ability.name || ability }
                })) : [],
                height: favorite.height || 0,
                weight: favorite.weight || 0,
                stats: [
                    { stat: { name: 'hp' }, base_stat: favorite.hp || 0 },
                    { stat: { name: 'attack' }, base_stat: favorite.attack || 0 },
                    { stat: { name: 'defense' }, base_stat: favorite.defense || 0 },
                    { stat: { name: 'special-attack' }, base_stat: favorite.special_attack || 0 },
                    { stat: { name: 'special-defense' }, base_stat: favorite.special_defense || 0 },
                    { stat: { name: 'speed' }, base_stat: favorite.speed || 0 }
                ],
                sprites: {
                    front_default: favorite.image_url || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokedexNumber}.png`,
                    other: {
                        'official-artwork': {
                            front_default: favorite.image_url || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokedexNumber}.png`
                        }
                    }
                }
            }
        },

        async fetchFavorites(query = '') {
            try {
                this.loading = true
                this.error = null

                const params = {}
                if (query) {
                    params.search = query
                }

                const response = await pokemonApi.getFavorites(params)
                this.favorites = (response || []).map(fav => this.transformFavorite(fav))
            } catch (err) {
                this.error = 'Failed to load favorites'
                console.error('Error loading favorites:', err)
            } finally {
                this.loading = false
            }
        },

        async fetchAbilities() {
            try {
                this.loading = true
                this.error = null

                const response = await pokemonApi.getAbilities()
                this.abilities = response || []
            } catch (err) {
                if (this.favorites.length > 0) {
                    const abilitiesSet = new Set()
                    this.favorites.forEach(pokemon => {
                        if (Array.isArray(pokemon.abilities)) {
                            pokemon.abilities.forEach(ability => {
                                const abilityName = typeof ability === 'string' ? ability : ability.ability?.name || ability.name || ability
                                abilitiesSet.add(abilityName)
                            })
                        }
                    })
                    this.abilities = Array.from(abilitiesSet).map(name => ({ name }))
                }
                console.error('Error loading abilities:', err)
            } finally {
                this.loading = false
            }
        },

        async addFavorite(pokemonId) {
            try {
                const response = await pokemonApi.addToFavorites(pokemonId)
                if (response && response.data) {
                    const transformed = this.transformFavorite(response.data)
                    if (!this.favorites.find(f => f.id === pokemonId)) {
                        this.favorites.push(transformed)
                    }
                }
                return true
            } catch (err) {
                this.error = 'Failed to add to favorites'
                console.error('Error adding favorite:', err)
                throw err
            }
        },

        async removeFavorite(pokemonId) {
            try {
                await pokemonApi.removeFromFavorites(pokemonId)
                this.favorites = this.favorites.filter(f => f.id !== pokemonId)
                return true
            } catch (err) {
                this.error = 'Failed to remove from favorites'
                console.error('Error removing favorite:', err)
                throw err
            }
        },

        async toggleFavorite(pokemonId) {
            const isFavorite = this.favoriteIds.includes(pokemonId)

            if (isFavorite) {
                await this.removeFavorite(pokemonId)
            } else {
                await this.addFavorite(pokemonId)
            }

            return !isFavorite
        },

        filterByAbility(ability) {
            this.selectedAbility = ability
        },

        searchFavorites(query) {
            this.searchQuery = query
        },

        clearFilters() {
            this.searchQuery = ''
            this.selectedAbility = ''
        },

        isFavorite(pokemonId) {
            return this.favoriteIds.includes(pokemonId)
        }
    }
})
