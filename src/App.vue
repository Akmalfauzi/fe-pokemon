<script setup>
import { Toaster } from "vue-sonner";
</script>

<template>
    <Toaster position="top-right" richColors :duration="3000" />
    <RouterView />
</template>
