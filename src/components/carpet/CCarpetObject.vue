<template>
    <div 
        class="obj-wr" 
        :ghost="ghost || null"
        :style="{
            'min-height': 
                (9 * 2) //paddings
                + (isFilterOn('filter_drilling_stage')? //drill
                    (22 * (isStatuses?2:1)):
                    0 
                )
                + (22 * (nodeRows || 0)) //nodeRows (dev)
                - (bump?1:0) //body bump
                + (isFilterOn('filter_drilling_amount')?(isStatuses?40:18):0) //two-weeks
                + 'px',
            'width': 
                w + 'px'
        }"
        :loading="loading || null"
    >
        <VLoading class="loading" v-if="loading"/>
        <div class="obj" @click="modal.call">
            <div class="icon-wr"><IWell/></div>
            <div class="text">
                <h3>Куст {{info.name}}</h3>
                <p>{{Project.getDrill(info.drill)?.name}}</p>
            </div>
        </div>
        <EditGroupModal v-if="!ghost" ref="modal" :info="info"/>
    </div>
    
</template>

<script setup>
    import IWell from "@/components/icons/IWell.vue";

    import ProjectStore from "@/stores/project.js";
    import StaticStore from "@/stores/static.js";
    import EditGroupModal from "@/components/carpet/edit/EditGroupModal.vue";
    
    import { computed, ref } from "vue";
    
    const Project = ProjectStore();
    const Static = StaticStore();

    const props = defineProps({
        info: Object,
        ghost: Boolean,
        nodeRows: Number,
        w: Number,
        bump: Boolean,
        loading: Boolean,
        filters: Object,
    });

    let modal = ref();

    const isFilterOn = (key)=>Object.entries(props.filters).map(e => e[1]).flat().find(e => e.name == key)?.value

//status
    const isStatuses = computed(()=>props.filters.status.reduce((acc, e) => acc && e.value, true))
</script>

<style lang="scss" scoped>
    .obj-wr{
        position: relative;
        display: flex;
        border-bottom: 1px solid var(--bg-border);

        &[ghost]{
            opacity: 0;
            width: 100%;
            overflow: hidden;
            pointer-events: none;
        }

        .loading{
            position: absolute;
            @include all-directions(0);
            margin: auto;
        }

        &[loading]{
            .obj{
                opacity: .3;
            }
        }

        &[disabled]{
            .obj{
                pointer-events: none;
                cursor: auto;
            }
        }
    }

    .obj{
        padding: 5px 10px 10px;
        display: flex;
        gap: 10px;
        overflow: hidden;
        cursor: pointer;
        transition: .3s;
        width: 100%;

        &:hover{
            background: var(--bg-ghost);
        }

        .icon-wr{
            margin-top: 4px;

            svg{
                height: 21px;
                width: 21px;
            }
        }

        .text{
            min-width: 0;
            width: 100%;
            align-items: baseline;
            
            p{
                transform: translateY(-1px);
            }
        }

        h3{
            font-size: 20px;
            color: var(--typo-brand);
            @include text-overflow;
        }

        p{
            color: var(--typo-secondary);
            white-space: nowrap;
            @include text-overflow;
            font-size: 12px;
        }
        
    }
</style>