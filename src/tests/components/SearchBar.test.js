import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBar from '../../components/SearchBar.vue'

describe('SearchBar', () => {
    it('should render with placeholder', () => {
        const wrapper = mount(SearchBar, {
            props: {
                placeholder: 'Search Pokemon'
            }
        })

        const input = wrapper.find('input')
        expect(input.attributes('placeholder')).toBe('Search Pokemon')
    })

    it('should display model value', () => {
        const wrapper = mount(SearchBar, {
            props: {
                modelValue: 'pikachu'
            }
        })

        const input = wrapper.find('input')
        expect(input.element.value).toBe('pikachu')
    })

    it('should emit update:modelValue on input', async () => {
        const wrapper = mount(SearchBar)
        const input = wrapper.find('input')

        await input.setValue('bulbasaur')

        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')[0][0]).toBe('bulbasaur')
    })

    it('should apply custom container class', () => {
        const wrapper = mount(SearchBar, {
            props: {
                containerClass: 'custom-class'
            }
        })

        expect(wrapper.find('.custom-class').exists()).toBe(true)
    })
})
