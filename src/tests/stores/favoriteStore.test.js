import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFavoriteStore } from '../../stores/favoriteStore'
import { pokemonApi } from '../../services/pokemonApi'

vi.mock('../../services/pokemonApi', () => ({
    pokemonApi: {
        getFavorites: vi.fn(),
        getAbilities: vi.fn(),
        addToFavorites: vi.fn(),
        removeFromFavorites: vi.fn()
    }
}))

describe('favoriteStore', () => {
    let store

    beforeEach(() => {
        setActivePinia(createPinia())
        store = useFavoriteStore()
        vi.clearAllMocks()
    })

    describe('initial state', () => {
        it('should have correct initial state', () => {
            expect(store.favorites).toEqual([])
            expect(store.abilities).toEqual([])
            expect(store.loading).toBe(false)
            expect(store.searchQuery).toBe('')
            expect(store.selectedAbility).toBe('')
        })
    })

    describe('fetchFavorites', () => {
        it('should fetch favorites successfully', async () => {
            const mockFavorites = [
                { id: 1, name: 'bulbasaur', types: ['grass', 'poison'], abilities: ['overgrow'] },
                { id: 25, name: 'pikachu', types: ['electric'], abilities: ['static'] }
            ]

            pokemonApi.getFavorites.mockResolvedValue(mockFavorites)

            await store.fetchFavorites()

            expect(store.favorites).toHaveLength(2)
            expect(store.loading).toBe(false)
        })

        it('should handle fetch errors', async () => {
            pokemonApi.getFavorites.mockRejectedValue(new Error('API Error'))

            await store.fetchFavorites()

            expect(store.error).toBeTruthy()
            expect(store.loading).toBe(false)
        })
    })

    describe('toggleFavorite', () => {
        it('should add pokemon to favorites', async () => {
            const mockResponse = {
                data: { id: 1, name: 'bulbasaur', types: ['grass'], abilities: ['overgrow'] }
            }

            pokemonApi.addToFavorites.mockResolvedValue(mockResponse)

            const result = await store.toggleFavorite(1)

            expect(result).toBe(true)
            expect(store.favorites).toHaveLength(1)
        })

        it('should remove pokemon from favorites', async () => {
            store.favorites = [
                { id: 1, name: 'bulbasaur', types: ['grass'], abilities: ['overgrow'] }
            ]

            pokemonApi.removeFromFavorites.mockResolvedValue({})

            const result = await store.toggleFavorite(1)

            expect(result).toBe(false)
            expect(store.favorites).toHaveLength(0)
        })
    })

    describe('isFavorite', () => {
        it('should return true for favorited pokemon', () => {
            store.favorites = [
                { id: 1, name: 'bulbasaur' },
                { id: 25, name: 'pikachu' }
            ]

            expect(store.isFavorite(1)).toBe(true)
            expect(store.isFavorite(25)).toBe(true)
        })

        it('should return false for non-favorited pokemon', () => {
            store.favorites = [
                { id: 1, name: 'bulbasaur' }
            ]

            expect(store.isFavorite(25)).toBe(false)
        })
    })

    describe('filteredFavorites getter', () => {
        beforeEach(() => {
            store.favorites = [
                {
                    id: 1,
                    name: 'bulbasaur',
                    abilities: [{ ability: { name: 'overgrow' } }]
                },
                {
                    id: 25,
                    name: 'pikachu',
                    abilities: [{ ability: { name: 'static' } }]
                },
                {
                    id: 4,
                    name: 'charmander',
                    abilities: [{ ability: { name: 'blaze' } }]
                }
            ]
        })

        it('should filter by search query', () => {
            store.searchQuery = 'pika'

            expect(store.filteredFavorites).toHaveLength(1)
            expect(store.filteredFavorites[0].name).toBe('pikachu')
        })

        it('should filter by ability', () => {
            store.selectedAbility = 'overgrow'

            expect(store.filteredFavorites).toHaveLength(1)
            expect(store.filteredFavorites[0].name).toBe('bulbasaur')
        })

        it('should filter by both search and ability', () => {
            store.searchQuery = 'char'
            store.selectedAbility = 'blaze'

            expect(store.filteredFavorites).toHaveLength(1)
            expect(store.filteredFavorites[0].name).toBe('charmander')
        })

        it('should return all favorites when no filters applied', () => {
            expect(store.filteredFavorites).toHaveLength(3)
        })
    })

    describe('clearFilters', () => {
        it('should clear all filters', () => {
            store.searchQuery = 'pikachu'
            store.selectedAbility = 'static'

            store.clearFilters()

            expect(store.searchQuery).toBe('')
            expect(store.selectedAbility).toBe('')
        })
    })
})
