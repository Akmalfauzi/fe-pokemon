<script setup>
const props = defineProps({
    isFavorite: {
        type: Boolean,
        required: true,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    size: {
        type: String,
        default: "medium",
        validator: (value) => ["small", "medium", "large"].includes(value),
    },
});

const emit = defineEmits(["click"]);

const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-5 h-5",
    large: "w-6 h-6",
};

const handleClick = (event) => {
    event.stopPropagation();
    emit("click");
};
</script>

<template>
    <button
        @click="handleClick"
        class="p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all duration-200 hover:scale-110 cursor-pointer"
        :class="isFavorite ? 'text-red-500' : 'text-gray-400'"
        :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
        :disabled="loading"
    >
        <svg
            :class="sizeClasses[size]"
            :fill="isFavorite ? 'currentColor' : 'none'"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
        </svg>
    </button>
</template>
