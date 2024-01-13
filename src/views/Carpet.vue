<template>
    <div 
        class="page" 
        @mouseleave="calendar?.timeShift.stop()" 
        @mouseup="calendar?.timeShift.stop()" 
        @mousemove="calendar?.timeShift.shift($event)"
    >
        <!-- <PageControls>
            <div class="switches">
                <div class="switch-wr">
                    <p>Отображать данные по:</p>
                    <BtnsSwitch 
                        :list="switchListView"
                        v-model="activeView"
                        keyName="title"
                    />
                </div>

                <BtnsSwitch 
                    v-if="activeView.title == 'Подразделениям'"
                    :list="switchListUnitsView"
                    v-model="activeUnitView"
                    keyName="title"
                />
            </div>
            
            
        </PageControls> -->

        <div class="loader-wr" v-if="Project.projectExtensionLoading">
            <VLoading/>
        </div>

        <Component 
            class="calendar"
            ref="calendar"

            v-else

            :is="activeView.object" 

            :unitView="activeUnitView" 
            :scale="scale"
        />       
    </div>
</template>

<script setup>
    import { computed, onMounted, reactive, ref, watch } from "vue";
    
    import BtnsSwitch from "@/components/ui/inputs/BtnsSwitch.vue";

    import CNodes from "@/components/carpet/CNodes.vue";
    import CUnits from "@/components/carpet/CUnits.vue";

    import ProjectStore from "@/stores/project.js";

    import Moment from 'moment';
    import { extendMoment } from 'moment-range';
    const moment = extendMoment(Moment);

    const Project = ProjectStore();
    
    const switchListView = ref([
        {title: 'Скважинам/кустам', object: CNodes},
        {title: 'Подразделениям', object: CUnits},        
    ]);

    const activeView = ref(switchListView.value[0]);

    const calendar = ref();

//--
    const switchListUnitsView = ref([
        {title: 'Бурение'},
        {title: 'КРС'},        
    ]);

    const activeUnitView = ref(switchListView.value[0]);
    
//--
    const scale = reactive({
        side: 300,
    })

</script>

<style lang="scss" scoped>
    .page{
        @include flex-col;

        .calendar{
            flex-grow: 1;
        }

        padding: 0!important;
    }

    .page-controls{
        .switches{
            display: flex;
            gap: 50px;

            .switch-wr{
                display: flex;
                align-items: center;
                gap: 10px;

                p{
                    padding-bottom: 2px;
                }
            }
        }

        .btn{
            width: max-content;
        }
    }

    .loader-wr{
        width: 100%;
        height: 100%;

        @include flex-c;

        flex-grow: 1;
    }
    

</style>