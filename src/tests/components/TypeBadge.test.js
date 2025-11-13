import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TypeBadge from '../../components/TypeBadge.vue'

describe('TypeBadge', () => {
    it('should render type name', () => {
        const wrapper = mount(TypeBadge, {
            props: {
                type: 'fire'
            }
        })

        expect(wrapper.text()).toContain('fire')
    })

    it('should apply correct color class for fire type', () => {
        const wrapper = mount(TypeBadge, {
            props: {
                type: 'fire'
            }
        })

        expect(wrapper.classes()).toContain('bg-orange-500')
    })

    it('should apply correct color class for water type', () => {
        const wrapper = mount(TypeBadge, {
            props: {
                type: 'water'
            }
        })

        expect(wrapper.classes()).toContain('bg-blue-500')
    })

    it('should handle object type input', () => {
        const wrapper = mount(TypeBadge, {
            props: {
                type: {
                    type: {
                        name: 'grass'
                    }
                }
            }
        })

        expect(wrapper.text()).toContain('grass')
        expect(wrapper.classes()).toContain('bg-green-500')
    })

    it('should apply small size classes', () => {
        const wrapper = mount(TypeBadge, {
            props: {
                type: 'electric',
                size: 'small'
            }
        })

        expect(wrapper.classes()).toContain('px-3')
        expect(wrapper.classes()).toContain('py-1')
        expect(wrapper.classes()).toContain('text-xs')
    })

    it('should apply large size classes', () => {
        const wrapper = mount(TypeBadge, {
            props: {
                type: 'electric',
                size: 'large'
            }
        })

        expect(wrapper.classes()).toContain('px-6')
        expect(wrapper.classes()).toContain('py-2')
        expect(wrapper.classes()).toContain('text-base')
    })

    it('should display type name', () => {
        const wrapper = mount(TypeBadge, {
            props: {
                type: 'psychic'
            }
        })

        expect(wrapper.text()).toContain('psychic')
    })
})
