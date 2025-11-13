<script setup>
defineProps({
    modelValue: {
        type: String,
        default: "",
    },
    placeholder: {
        type: String,
        default: "Search...",
    },
    containerClass: {
        type: String,
        default: "w-full",
    },
});

const emit = defineEmits(["update:modelValue"]);

const handleInput = (event) => {
    emit("update:modelValue", event.target.value);
};
</script>

<template>
    <div :class="['relative', containerClass]">
        <input
            :value="modelValue"
            @input="handleInput"
            type="text"
            :placeholder="placeholder"
            class="w-full px-4 py-3 pl-12 pr-4 text-gray-700 bg-white border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
        />
    </div>
</template>
