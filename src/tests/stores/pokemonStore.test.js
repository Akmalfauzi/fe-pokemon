import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePokemonStore } from '../../stores/pokemonStore'
import { pokemonApi } from '../../services/pokemonApi'

vi.mock('../../services/pokemonApi', () => ({
    pokemonApi: {
        getPokemonList: vi.fn(),
        getPokemonDetails: vi.fn()
    }
}))

describe('pokemonStore', () => {
    let store

    beforeEach(() => {
        setActivePinia(createPinia())
        store = usePokemonStore()
        vi.clearAllMocks()
    })

    describe('initial state', () => {
        it('should have correct initial state', () => {
            expect(store.pokemons).toEqual([])
            expect(store.loading).toBe(false)
            expect(store.currentPage).toBe(1)
            expect(store.searchQuery).toBe('')
            expect(store.selectedPokemon).toBeNull()
            expect(store.isModalOpen).toBe(false)
        })
    })

    describe('loadPokemons', () => {
        it('should load pokemons successfully', async () => {
            const mockResponse = {
                data: {
                    data: [
                        { id: 1, name: 'bulbasaur', types: ['grass', 'poison'] },
                        { id: 2, name: 'ivysaur', types: ['grass', 'poison'] }
                    ],
                    total: 100,
                    is_search: false
                }
            }

            pokemonApi.getPokemonList.mockResolvedValue(mockResponse)

            await store.loadPokemons()

            expect(store.pokemons).toHaveLength(2)
            expect(store.totalCount).toBe(100)
            expect(store.loading).toBe(false)
        })

        it('should handle errors gracefully', async () => {
            pokemonApi.getPokemonList.mockRejectedValue(new Error('API Error'))

            await store.loadPokemons()

            expect(store.error).toBeTruthy()
            expect(store.loading).toBe(false)
        })

        it('should set loading state correctly', async () => {
            pokemonApi.getPokemonList.mockImplementation(() =>
                new Promise(resolve => setTimeout(() => resolve({ data: [], total: 0 }), 100))
            )

            const loadPromise = store.loadPokemons()
            expect(store.loading).toBe(true)

            await loadPromise
            expect(store.loading).toBe(false)
        })
    })

    describe('searchPokemon', () => {
        it('should update search query', async () => {
            pokemonApi.getPokemonList.mockResolvedValue({
                data: [{ id: 25, name: 'pikachu', types: ['electric'] }],
                total: 1,
                is_search: true
            })

            await store.searchPokemon('pikachu')

            expect(store.searchQuery).toBe('pikachu')
        })
    })

    describe('modal actions', () => {
        it('should open modal with pokemon details', async () => {
            const mockPokemon = {
                id: 1,
                name: 'bulbasaur',
                hp: 45,
                attack: 49
            }

            pokemonApi.getPokemonDetails.mockResolvedValue(mockPokemon)

            await store.openPokemonDetail({ id: 1, name: 'bulbasaur' })

            expect(store.isModalOpen).toBe(true)
            expect(store.selectedPokemon).toEqual(mockPokemon)
        })

        it('should close modal and clear selected pokemon', () => {
            store.selectedPokemon = { id: 1, name: 'bulbasaur' }
            store.isModalOpen = true

            store.closeModal()

            expect(store.isModalOpen).toBe(false)
            expect(store.selectedPokemon).toBeNull()
        })
    })

    describe('getters', () => {
        it('should calculate hasMorePages correctly', () => {
            store.totalCount = 100
            store.pageSize = 20
            store.currentPage = 3
            store.isSearchMode = false

            expect(store.hasMorePages).toBe(true)

            store.currentPage = 5
            expect(store.hasMorePages).toBe(false)
        })

        it('should return false for hasMorePages in search mode', () => {
            store.isSearchMode = true
            store.totalCount = 100
            store.currentPage = 1

            expect(store.hasMorePages).toBe(false)
        })
    })
})
