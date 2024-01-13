<template>
    <div class="carpet-controls">
        <div class="mode">
            <VButton 
                v-for="i in Carpet.timeModes" 
                :key="i.title" 

                fit 
                :hollow="!i.active || null" 

                @click="()=>{
                    Carpet.timeModes.forEach(e => e.active = false);
                    i.active = true;
                }"
            >
                {{i.title}}
            </VButton>
        </div>
        <!-- notdone -->
        <!-- <VButton>Статистика</VButton> -->
        <div class="edit-wr" v-if="route.name == 'Carpet'">
            <p>Режим: </p>
            <VButton v-if="!Carpet.isEdit" hollow @click="Carpet.isEdit = true"><IEyeOpen class="ico"/></VButton>
            <VButton v-else  @click="Carpet.isEdit = false"><IEdit class="ico"/></VButton>            
        </div>
    </div>
</template>

<script setup>
    import IEdit from "@/components/icons/IEdit.vue";
    import IEyeOpen from "@/components/icons/IEyeOpen.vue";

    import CarpetStore from "@/stores/carpet.js";
    
    import { onUnmounted } from "vue";

    import { useRoute, useRouter } from 'vue-router';
    const route = useRoute(), router = useRouter();

    const Carpet = CarpetStore();
    
    onUnmounted(()=>{
        Carpet.isEdit = false;
    })
</script>

<style lang="scss" scoped>
    .mode{
        display: flex;
        gap: 4px;

        .btn{
            border-radius: 4px;
            padding-bottom: .2em;
            padding-top: .1em;
        }
    }

    .edit-wr{
        display: flex;
        gap: 8px;
        align-items: center;
        padding: 0 16px;

        .btn{
            padding-top: 0;
            padding-bottom: 0;
        }

        .ico{
            width: 25px;
        }
    }
</style>