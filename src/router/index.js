import { createRouter, createWebHistory } from 'vue-router'
import PokemonListView from '../views/PokemonListView.vue'
import FavoriteListView from '../views/FavoriteListView.vue'

const routes = [
    {
        path: '/',
        redirect: '/pokemons'
    },
    {
        path: '/pokemons',
        name: 'PokemonList',
        component: PokemonListView
    },
    {
        path: '/favorites',
        name: 'FavoriteList',
        component: FavoriteListView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
