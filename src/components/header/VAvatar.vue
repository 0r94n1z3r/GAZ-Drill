<template>
    <div class="avatar">
        <div class="sign">{{sign}}</div>
    </div>
</template>

<script setup>
    import { computed } from "vue";

    const props = defineProps({
        name: String
    })

    const sign = computed(()=>{
        const words = props.name.trim().split(' ');
  
        if (words.length > 1) {
            return words[0][0] + words[1][0];
        } else {
            return words[0].substring(0, 2);
        }
    })
</script>

<style lang="scss" scoped>
    .avatar{
        @include flex-c;
        background: var(--bg-ghost);
        color: var(--typo-brand);
        font-weight: 500;
        border-radius: 50%;
        font-size: 14px;
    }
</style>