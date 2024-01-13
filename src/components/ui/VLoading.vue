<template>
    <div class="loader" :style="{'--color': color}">
        <ILoader class="ico"/>
    </div>
</template>

<script setup>
    import ILoader from "@/components/icons/ILoader.vue"

    const props = defineProps({
        color: String
    });
</script>

<style lang="scss" scoped>

    .loader{
        --color: var(--bg-control-primary);

        @include flex-c;
        background: var(--bg-default); 
        color: var(--color);

        width: 65px;
        height: 65px;
        border-radius: 50%;

        &[inversed]{
            background: var(--color);
            color: var(--bg-default); 
        }

        &[hollow]{
            background: transparent;
        }

        .ico{
            width: 75%;
            height: 100%;
        }
    }
</style>