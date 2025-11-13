<template>
    <div class="flex flex-col items-center justify-center min-h-[500px]">
        <div class="relative">
            <div class="w-20 h-20 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            <div class="absolute inset-0 flex items-center justify-center">
                <component
                    :is="pokeballWhiteIcon"
                    alt="Loading"
                    class="w-10 h-10 text-red-600 animate-pulse"
                />
            </div>
        </div>
        <p class="mt-6 text-lg font-jakarta font-semibold text-gray-600 animate-pulse">
            Loading Pokemon details...
        </p>
    </div>
</template>

<script setup>
import pokeballWhiteIcon from "../assets/svg/pokeball-white.svg?component";
</script>
