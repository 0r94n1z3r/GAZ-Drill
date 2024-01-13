<template>
    <div class="filters" :drop="drop || null" v-click-outside="()=>drop = false">
        <div class="option" @click="drop = !drop">
            <IFunnel class="ico"/>
        </div>
        <div class="drop">
            <div class="block" v-for="(b, bk) in props.filters" :key="bk">
                <label 
                    class="checkbox"
                    v-for="(f,fk) in b"
                    :key="fk"
                >
                    <input type="checkbox" v-model="f.value" @change="changeHandler(f)">
                    <span>{{f.title}}</span>
                </label>
            </div>
        </div>
    </div>
</template>

<script setup>
    import IFunnel from "@/components/icons/IFunnel.vue";
    import vClickOutside from 'click-outside-vue3/src/v-click-outside';
    import User from "@/stores/user.js";
    
    import { onMounted, ref, watch } from "vue";

    const props = defineProps({
        filters: Object
    });

    const drop = ref(false);

    onMounted(() => {
        Object.values(props.filters).flat().forEach(f => {
            f.value = User().settings[f.name];
        });
    });

    const changeHandler = (f)=>{
        User().changeSetting(f.name, f.value)
    }
</script>

<style lang="scss" scoped>
    .filters{
        position: relative;

        .drop{
            position: absolute;
            top: 100%;
            left: -1px;
            z-index: 5;
            padding: 10px;
            border-radius: 0 0 4px 4px;
            border: 1px solid var(--bg-border);
            background: var(--bg-default);
            transition: .3s;
            max-width: 269px;
            width: max-content;
            @include flex-col;
            gap: 10px;
        }

        &:not([drop]){
            .drop{
                @include hidden(-5px);
            }
        }

        .block{
            @include flex-col;
            gap: 5px;
            border: 1px solid var(--bg-border);
            border-radius: 4px;
            padding: 5px;
            overflow-y: auto;
            max-height: 500px;
        }
        
        label{
            span{
                font-size: 16px;

                &::before{
                    transform: translateY(2px);
                }
            }
        }
    }
</style>