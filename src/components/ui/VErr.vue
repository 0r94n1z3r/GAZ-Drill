<template>
    <p err v-if="err">{{err}}</p>
</template>

<script setup>
    const props = defineProps({err: [String, Number, Object]})
</script>

<style lang="scss" scoped>
    p[err]{
        color: var(--typo-alert);
    }
</style>