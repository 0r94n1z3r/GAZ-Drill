<template>
    <div class="links-switch">
        <div 
            class="btn" 
            v-for="i in list" 
            :key="i.keyName" 

            :active="i[keyName] == modelValue[keyName] || null"

            @click="update(i)"
        >{{i[keyName]}}</div>
    </div>
</template>

<script setup>
    const props = defineProps({
        list: Array,
        modelValue: Object,
        keyName: String
    });

    const emit = defineEmits(['update:modelValue']);

    const update = (val)=>{
        emit('update:modelValue', val)
    }
</script>

<style lang="scss" scoped>
    .links-switch{
        display: flex;
        gap: 10px;

        .btn{
            @include flex-c;
            height: 32px;
            width: max-content;
            border: 1px solid var(--bg-border);
            border-radius: 4px;
            padding: 0 8px 2px;
            transition: .3s;
            cursor: pointer;

            &[active]{
                border-color: var(--typo-control-secondary);
            }
        }
    }
</style>