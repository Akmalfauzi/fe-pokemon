import { describe, it, expect } from 'vitest'
import { getTypeColor, getTypeGradient, formatPokemonId, formatHeight, formatWeight, getStatPercentage, formatAbilityName } from '../../utils/pokemonHelpers'

describe('pokemonHelpers', () => {
    describe('getTypeColor', () => {
        it('should return correct color for fire type', () => {
            expect(getTypeColor('fire')).toBe('bg-orange-500')
        })

        it('should return correct color for water type', () => {
            expect(getTypeColor('water')).toBe('bg-blue-500')
        })

        it('should return default color for unknown type', () => {
            expect(getTypeColor('unknown-type')).toBe('bg-gray-500')
        })

        it('should handle uppercase type names', () => {
            expect(getTypeColor('FIRE')).toBe('bg-orange-500')
        })
    })

    describe('getTypeGradient', () => {
        it('should return correct gradient for grass type', () => {
            expect(getTypeGradient('grass')).toBe('from-green-50 via-emerald-50 to-green-100')
        })

        it('should return default gradient for unknown type', () => {
            expect(getTypeGradient('unknown-type')).toBe('from-gray-50 via-white to-gray-100')
        })
    })

    describe('formatPokemonId', () => {
        it('should format single digit id', () => {
            expect(formatPokemonId(1)).toBe('#001')
        })

        it('should format double digit id', () => {
            expect(formatPokemonId(25)).toBe('#025')
        })

        it('should format triple digit id', () => {
            expect(formatPokemonId(150)).toBe('#150')
        })

        it('should format four digit id', () => {
            expect(formatPokemonId(1000)).toBe('#1000')
        })
    })

    describe('formatHeight', () => {
        it('should convert decimeters to meters', () => {
            expect(formatHeight(10)).toBe('1.0 m')
        })

        it('should handle decimal values', () => {
            expect(formatHeight(17)).toBe('1.7 m')
        })
    })

    describe('formatWeight', () => {
        it('should convert hectograms to kilograms', () => {
            expect(formatWeight(69)).toBe('6.9 kg')
        })

        it('should handle large values', () => {
            expect(formatWeight(1000)).toBe('100.0 kg')
        })
    })

    describe('getStatPercentage', () => {
        it('should calculate percentage correctly', () => {
            expect(getStatPercentage(100, 255)).toBeCloseTo(39.22, 1)
        })

        it('should handle max stat', () => {
            expect(getStatPercentage(255, 255)).toBe(100)
        })

        it('should use default max stat of 255', () => {
            expect(getStatPercentage(128)).toBeCloseTo(50.2, 1)
        })
    })

    describe('formatAbilityName', () => {
        it('should capitalize first letter', () => {
            expect(formatAbilityName('overgrow')).toBe('Overgrow')
        })

        it('should replace hyphens with spaces', () => {
            expect(formatAbilityName('battle-armor')).toBe('Battle Armor')
        })

        it('should capitalize all words', () => {
            expect(formatAbilityName('compound-eyes')).toBe('Compound Eyes')
        })
    })
})
