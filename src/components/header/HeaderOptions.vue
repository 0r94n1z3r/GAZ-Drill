<template>
    <div class="header-options">
        <div class="item"><ILetter class="ico"/></div>
        <div class="item"><IQuestion class="ico"/></div>
        <div class="item-wr" v-click-outside="()=>alertsDrop = false">
            <div class="item" @click="alertsDrop = !alertsDrop">
                <IBell class="ico"/>
            </div>
            <VAlerts :drop="alertsDrop || null"/>
        </div>
        
    </div>
</template>

<script setup>
    import IBell from "@/components/icons/IBell.vue";
    import ILetter from "@/components/icons/ILetter.vue";
    import IQuestion from "@/components/icons/IQuestion.vue";
    
    import vClickOutside from 'click-outside-vue3/src/v-click-outside';
    
    import VAlerts from "@/components/header/VAlerts.vue";
    
    import { ref } from "vue";

//alerts
    const alertsDrop = ref(false);
</script>

<style lang="scss" scoped>
    .header-options{
        display: flex;
        align-items: center;
        gap: 4px;

        .item-wr{
            position: relative;
        }

        .item{
            @include flex-c;
            height: 32px;
            width: 32px;
            cursor: pointer;

            .ico{
                transition: .3s;
                color: var(--typo-placeholder);
                height: 65%;
                width: 65%;
            }

            &:hover{
                .ico{
                    color: var(--typo-control-ghost);
                }
            }
        }
    }

    .alerts{
        position: absolute;
        top: calc(100% + 13px);
        right: 0;
        z-index: 1000;

        &:not([drop]){
            @include hidden(-10px);
        }
    }
</style>