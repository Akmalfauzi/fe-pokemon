export const TYPE_COLORS = {
    normal: 'bg-gray-400',
    fire: 'bg-orange-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-500',
    grass: 'bg-green-500',
    ice: 'bg-cyan-400',
    fighting: 'bg-red-600',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-lime-500',
    rock: 'bg-yellow-700',
    ghost: 'bg-indigo-700',
    dragon: 'bg-purple-600',
    dark: 'bg-gray-700',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-400',
    unknown: 'bg-gray-400'
}

export const TYPE_GRADIENTS = {
    normal: 'from-gray-50 via-white to-gray-100',
    fire: 'from-red-50 via-orange-50 to-yellow-50',
    water: 'from-blue-50 via-cyan-50 to-blue-100',
    electric: 'from-yellow-50 via-amber-50 to-yellow-100',
    grass: 'from-green-50 via-emerald-50 to-green-100',
    ice: 'from-cyan-50 via-blue-50 to-indigo-100',
    fighting: 'from-red-100 via-orange-100 to-red-200',
    poison: 'from-purple-50 via-pink-50 to-purple-100',
    ground: 'from-yellow-50 via-amber-50 to-yellow-100',
    flying: 'from-indigo-50 via-blue-50 to-sky-100',
    psychic: 'from-pink-50 via-purple-50 to-pink-100',
    bug: 'from-lime-50 via-green-50 to-emerald-100',
    rock: 'from-yellow-100 via-amber-100 to-yellow-200',
    ghost: 'from-purple-100 via-indigo-100 to-purple-200',
    dragon: 'from-purple-100 via-pink-100 to-indigo-200',
    dark: 'from-gray-100 via-gray-200 to-gray-300',
    steel: 'from-slate-100 via-gray-100 to-slate-200',
    fairy: 'from-pink-50 via-rose-50 to-pink-100',
    unknown: 'from-gray-50 via-gray-100 to-gray-200'
}

export const STAT_NAMES = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    speed: 'Speed'
}

export const getTypeColor = (type) => {
    return TYPE_COLORS[type?.toLowerCase()] || 'bg-gray-500'
}

export const getTypeGradient = (type) => {
    return TYPE_GRADIENTS[type?.toLowerCase()] || TYPE_GRADIENTS.normal
}

export const getTypeName = (type) => {
    if (typeof type === 'string') return type
    return type?.type?.name || type?.name || 'normal'
}

export const getPokemonImage = (pokemon) => {
    if (!pokemon) return ''

    if (pokemon.image_url) {
        return pokemon.image_url
    }

    return pokemon?.sprites?.other?.['official-artwork']?.front_default ||
        pokemon?.sprites?.front_default ||
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id || pokemon.pokedex_number}.png`
}

export const formatPokemonId = (id) => {
    return `#${String(id).padStart(3, '0')}`
}

export const formatHeight = (height) => {
    return (height / 10).toFixed(1) + ' m'
}

export const formatWeight = (weight) => {
    return (weight / 10).toFixed(1) + ' kg'
}

export const getStatPercentage = (baseStat, maxStat = 255) => {
    return (baseStat / maxStat) * 100
}

export const formatAbilityName = (abilityName) => {
    return abilityName
        .replace('-', ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export const getCardGradient = (types) => {
    if (!types || !types.length) return TYPE_GRADIENTS.normal

    const firstType = types[0]
    const primaryType = typeof firstType === 'string'
        ? firstType
        : firstType.type?.name || firstType.name || 'normal'

    return getTypeGradient(primaryType)
}

export const getStatColor = (baseStat) => {
    if (baseStat >= 100) return 'bg-green-500'
    if (baseStat >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
}
