<template>
    <div   
        class="stage-window"
        v-if="show" 
        :style="{left: computedCoords.x+'px', top: computedCoords.y+'px'}"
        v-click-outside="()=>{show = false}"
    >
        <div class="title">
            {{stage?.title}}
        </div>
        <div class="btn" @click="action('info')">Информация</div>
        <div class="btn" @click="action('comment')">Комментарии</div>
    </div>
</template>

<script setup>
    import { computed, ref } from "vue";
    import vClickOutside from 'click-outside-vue3/src/v-click-outside';

    const emit = defineEmits(['action'])

    const show = ref(false);

    const stage = ref(null);

    const coords = ref({x:0, y:0});
    const computedCoords = computed(()=>{
        return coords.value;
    });

//action
    const action = (type)=>{
        emit('action', type, stage.value);
        show.value = false;
    }

//
    const call = (crds, stg)=>{
        show.value = true;
        coords.value = crds;
        stage.value = stg;
    }

    defineExpose({call})
</script>

<style lang="scss" scoped>
    .stage-window{
        position: fixed;
        z-index: 1000;
        background: var(--bg-default);
        width: 170px;
        border-radius: 4px;
        overflow: hidden;

            box-shadow: 0px 4px 4px rgba(0, 32, 51, 0.04), 0px 8px 24px rgba(0, 32, 51, 0.12);

        .title{
            padding: 6px 10px;
            color: var(--typo-brand);
            border-bottom: 1px solid var(--bg-border);
            @include text-overflow;
        }

        .btn{
            padding: 6px 10px;
            cursor: pointer;
            transition: .3s;
            @include text-overflow;

            &:hover{
                background: var(--bg-ghost);
            }
        }
    }
</style>