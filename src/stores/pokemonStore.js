import { defineStore } from 'pinia'
import { pokemonApi } from '../services/pokemonApi.js'

export const usePokemonStore = defineStore('pokemon', {
    state: () => ({
        pokemons: [],
        filteredPokemons: [],
        loading: false,
        loadingMore: false,
        loadingDetail: false,
        error: null,
        currentPage: 1,
        pageSize: 20,
        totalCount: 0,
        isSearchMode: false,
        searchQuery: '',
        selectedPokemon: null,
        isModalOpen: false,
        pokemonDetails: new Map()
    }),

    getters: {
        totalPages: (state) => Math.ceil(state.totalCount / state.pageSize),

        currentPagePokemons: (state) => {
            return state.filteredPokemons
        },

        hasMorePages: (state) => {
            if (state.isSearchMode) {
                return false
            }
            const calculatedTotalPages = Math.ceil(state.totalCount / state.pageSize)
            return state.currentPage < calculatedTotalPages
        },

        isFirstPage: (state) => state.currentPage === 1,

        isLastPage: (state) => {
            const calculatedTotalPages = Math.ceil(state.totalCount / state.pageSize)
            return state.currentPage >= calculatedTotalPages
        }
    },

    actions: {
        async loadPokemons(reset = false) {
            if (this.loading || this.loadingMore) return

            try {
                if (reset) {
                    this.loading = true
                    this.currentPage = 1
                } else if (this.currentPage === 1) {
                    this.loading = true
                } else {
                    this.loadingMore = true
                }

                this.error = null

                const params = {
                    page: this.currentPage,
                    per_page: this.pageSize
                }

                if (this.searchQuery) {
                    params.search = this.searchQuery
                }

                const response = await pokemonApi.getPokemonList(params)

                const paginationData = response.data
                const pokemonData = paginationData.data || []
                const isSearch = paginationData.is_search || false

                if (reset || this.currentPage === 1) {
                    this.pokemons = pokemonData
                } else {
                    this.pokemons = [...this.pokemons, ...pokemonData]
                }

                this.filteredPokemons = this.pokemons
                this.isSearchMode = isSearch
                this.totalCount = paginationData.total || 0
            } catch (err) {
                this.error = 'Failed to load Pokemon. Please try again later.'
                console.error('Error loading pokemons:', err)
            } finally {
                this.loading = false
                this.loadingMore = false
            }
        },

        async loadMorePokemons() {
            if (this.hasMorePages && !this.loadingMore && !this.loading) {
                this.currentPage++
                await this.loadPokemons(false)
            }
        },

        filterPokemons() {
            this.currentPage = 1
            this.loadPokemons(true)
        },

        async searchPokemon(query) {
            this.searchQuery = query
            this.filterPokemons()
        },

        clearFilters() {
            this.searchQuery = ''
            this.currentPage = 1
            this.isSearchMode = false
            this.loadPokemons(true)
        },

        async openPokemonDetail(pokemon) {
            try {
                const cached = this.pokemonDetails.get(pokemon.name)
                if (cached) {
                    this.selectedPokemon = cached
                    this.isModalOpen = true
                    return
                }

                this.loadingDetail = true
                this.isModalOpen = true
                
                const details = await pokemonApi.getPokemonDetails(pokemon.id || pokemon.name)

                this.pokemonDetails.set(pokemon.name, details)

                const index = this.pokemons.findIndex(p => p.name === pokemon.name)
                if (index !== -1) {
                    this.pokemons[index] = details
                }

                this.selectedPokemon = details
            } catch (error) {
                console.error('Error loading Pokemon details:', error)
                this.error = 'Failed to load Pokemon details'
                this.isModalOpen = false
            } finally {
                this.loadingDetail = false
            }
        },

        closeModal() {
            this.isModalOpen = false
            this.selectedPokemon = null
            this.loadingDetail = false
        },

        async initializeApp() {
            try {
                await this.loadPokemons()
            } catch (error) {
                this.error = 'Failed to initialize app. Please try again.'
            }
        }
    }
})