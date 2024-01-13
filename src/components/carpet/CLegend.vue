<template>
    <div class="legend">
        <div class="legend-wr" :drop="drop || null" v-click-outside="()=>drop = false">
            <div class="caller" @click="drop = !drop">
                <ILegend class="ico"/>
            </div>
            <div class="drop">
                <div class="title">
                    <h3>Легенда</h3>
                </div>
                <div 
                    class="block" 
                    v-for="(i,k) in list" 
                    :key="k"
                >
                    <div class="color-input-wr">
                        <ColorInput 
                            class="color-input" 
                            format="hex" 
                            
                            v-model="User().settings[i.key]" 
                            @pickEnd="changeColor(i)"

                            disable-alpha
                            :slim="i.extra?.slim || null"
                        />
                        <div 
                            class="flush-color"
                            v-if="User().settings[i.key] != User().defaultColors[i.key]"
                            @click="User().flushColor(i.key)"
                        >
                            <IRefresh/>
                        </div>
                    </div>
                    {{i.title}}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import ILegend from "@/components/icons/ILegend.vue";
    import ICross from "@/components/icons/ICross.vue";
    import IRefresh from "@/components/icons/IRefresh.vue";

    import User from "@/stores/user.js"

    import ColorInput from 'vue-color-input'

    import vClickOutside from 'click-outside-vue3/src/v-click-outside';
    
    import { computed, ref } from "vue";

    const drop = ref(false);

//
    const list = computed(()=>[
        {title: 'Бурение', key: 'well_drilling_color'},
        {title: 'Освоение', key: 'well_development_color'},
        {title: 'Монтаж Б/У', key: 'drill_assembly_color'},
        {title: 'Переезд Б/У', key: 'move_to_color', extra: {slim: true}},
    ]);

    const changeColor = (obj)=>{
        User().changeSetting(obj.key, User().settings[obj.key]);
    }
</script>

<style lang="scss" scoped>
    .legend-wr{
        position: relative;
        background: var(--bg-default);

        &:not([drop]){
            .drop{
                @include hidden-hor(5px);
            }
        }
    }
    
    .caller{
        height: 32px;
        width: 32px;
        @include flex-c;
        
        color: var(--bg-border-focus);
        transition: .3s;

        cursor: pointer;

        &:hover{
            background: var(--bg-ghost);
            color: var(--typo-brand);
        }
    }

    .drop{
        position: absolute;
        top: -1px;
        right: 100%;
        z-index: 5;
        padding: 10px;
        border-radius: 0 0 4px 4px;
        border: 1px solid var(--bg-border);
        background: var(--bg-default);
        transition: .3s;
        width: max-content;
        max-width: 300px;
        @include flex-col;
        gap: 10px;

        h3{
            text-align: center;
            font-weight: bold;
        }

        .block{
            display: flex;
            gap: 10px;
        }
    }

    .color-input-wr{
        width: 70px;
        height: 24px;
        
        @include flex-c;
    }

    .color-input{
        width: 100%;
        height: 100%;

        :deep(.box){
            width: 100%;
            height: 100%;
            border: 1px solid #000;
            border-radius: 0;
        }

        &[slim]{
            height: 6px;
        }
    }

    .flush-color{
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        @include flex-c;
        color: var(--typo-brand);
        cursor: pointer;

        svg{
            height: 17px;
        }
    }
</style>