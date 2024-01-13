<template>
    <div class="fortnight-placeholder" :readonly="readonly || null" @click="addFortnight()" v-if="!fortnight || fortnight.empty"><IPlus/></div>
    <VTextInputSwitch :readonly="readonly || null" ref="inp" v-else v-model="fortnight.drilling_amount" @blur="confirm"/>
</template>

<script setup>
    import { computed, ref } from "vue";
    import IPlus from "@/components/icons/IPlus.vue";
    import VTextInputSwitch from "@/components/ui/inputs/VTextInputSwitch.vue";

    import ProjectItems from "@/script/projectItems.js";

    const props = defineProps({
        group: Object,
        year: String,
        month: String,
        half: [String, Number],
        status: String,
        readonly: Boolean,
    })

    const inp = ref();

    const fortnight = computed(()=>{
        let res = props.group?.fortnight_data?.find(e => 
            e.year == props.year &&
            e.month == props.month &&
            e.half == props.half &&
            e.status == props.status
        )
        
        if(res && res.drilling_amount == 0){
            res.empty = true;
            res.drilling_amount = null;
        }

        return res;
    })

    const addFortnight = () => {
        if(fortnight.value){
            fortnight.value.empty = false;
            setTimeout(()=>inp.value.pClick());
            return;
        }
   
        props.group.fortnight_data.push({
            year: props.year,
            month: props.month,
            half: props.half,
            status: props.status,
            drilling_amount: null
        })

        setTimeout(()=>inp.value.pClick());
    }

//confirm
    const bcp = ref(fortnight.value?.drilling_amount);

    const confirm = () => {
        if(fortnight.value.drilling_amount === bcp.value)return;
        bcp.value = fortnight.value.drilling_amount;

        if(!fortnight.value.drilling_amount){
            fortnight.value.empty = true;
            return;
        }

        fortnight.value.loading = true;

        ProjectItems.group.setFortnight(
            props.group.id,
            fortnight.value,
            ()=>{},
            (err)=>{console.log(err)},
            ()=>{fortnight.value.loading = false;}
        )
    }
</script>

<style lang="scss" scoped>
    .fortnight-placeholder{
        width: 100%;
        @include flex-c;
        color: var(--typo-ghost);
        height: 20px;
        cursor: pointer;
        transition: .3s;

        &:hover{
            color: var(--typo-control-ghost);
        }

        &[readonly]{
            opacity: 0;
        }
    }

    .text-input-switch{
        width: 100%;

        :deep(p){
            @include text-overflow;
            padding: 2px 1px;
            color: var(--typo-control-ghost);
        }
    }

    .text-input-switch{
        min-width: 0;
        :deep(.text-input){
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 5;
            max-width: none;
            min-width: 100%;

            .content{
                height: 20px;
                background: var(--bg-default);

                input{
                    padding: 0 0px;
                } 
            }
        }
    }

    [readonly]{
        pointer-events: none;
    }
    
    
</style>