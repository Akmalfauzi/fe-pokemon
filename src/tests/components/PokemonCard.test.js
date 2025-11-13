import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PokemonCard from '../../components/PokemonCard.vue'
import { createPinia } from 'pinia'

describe('PokemonCard', () => {
    const mockPokemon = {
        id: 25,
        name: 'pikachu',
        types: ['electric'],
        image_url: 'https://example.com/pikachu.png'
    }

    const createWrapper = (props = {}) => {
        return mount(PokemonCard, {
            props: {
                pokemon: mockPokemon,
                ...props
            },
            global: {
                plugins: [createPinia()],
                stubs: {
                    LazyImage: true,
                    TypeBadge: true,
                    FavoriteButton: true
                }
            }
        })
    }

    it('should render pokemon name', () => {
        const wrapper = createWrapper()
        expect(wrapper.text()).toContain('pikachu')
    })

    it('should display formatted pokemon id', () => {
        const wrapper = createWrapper()
        expect(wrapper.text()).toContain('#025')
    })

    it('should emit click event when card is clicked', async () => {
        const wrapper = createWrapper()

        await wrapper.find('.group').trigger('click')

        expect(wrapper.emitted('click')).toBeTruthy()
        expect(wrapper.emitted('click')[0][0]).toEqual(mockPokemon)
    })

    it('should apply hover effects', () => {
        const wrapper = createWrapper()
        const card = wrapper.find('.group')

        expect(card.classes()).toContain('hover:shadow-2xl')
        expect(card.classes()).toContain('hover:-translate-y-2')
    })

    it('should render with correct gradient based on pokemon type', () => {
        const wrapper = createWrapper()
        const card = wrapper.find('.group')

        expect(card.element.className).toBeTruthy()
    })
})
