<script setup>
import { getTypeColor, getTypeName } from "../utils/pokemonHelpers.js";

const props = defineProps({
    type: {
        type: [String, Object],
        required: true,
    },
    size: {
        type: String,
        default: "medium",
        validator: (value) => ["small", "medium", "large"].includes(value),
    },
});

const sizeClasses = {
    small: "px-3 py-1 text-xs",
    medium: "px-4 py-1.5 text-sm",
    large: "px-6 py-2 text-base",
};

const typeName = getTypeName(props.type);
const displayName = typeName === "unknown" ? "normal" : typeName;
</script>

<template>
    <span
        :class="[
            'rounded-full font-semibold text-white capitalize shadow-sm inline-block',
            sizeClasses[size],
            getTypeColor(displayName),
        ]"
    >
        {{ displayName }}
    </span>
</template>
