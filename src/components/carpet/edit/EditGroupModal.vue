<template>
    <VModal title="Кустовая площадка" ref="modal">
        <div class="content">
            <div class="static">
                <p>Название: {{info.name}}</p>
                <p>Буровая установка: {{Project.getDrill(info.drill)?.name}}</p>
            </div>            
        </div>

        <div class="content pf">
            <div class="pf-switch">
                <VButton :hollow="status == 'fact'" @click="status = 'plan'">План</VButton>
                <VButton :hollow="status == 'plan'" @click="status = 'fact'">Факт</VButton>
            </div>
        </div>

        <div class="content inputs">
            <div class="content-wr" v-for="(stage, key) in sortedStages" :key="key">
                <h3>{{key == "drill_stages"?"Бурение":"Освоение"}}</h3>

                <div 
                    class="stage-block" 
                    v-for="(i,k) in stage" 
                    :key="k"
                    :ref="prepareStage(i)"
                >  
                    <div class="top">
                        <p class="name">{{typeName(i.type || key, key)}}</p>
                        <div class="btns">
                            <template v-if="i.edit">
                                <VButton class="ico-btn" :loading="i.loading || null" hollow @click="cancelEdit(i, key)"><ICross class="ico"/></VButton>
                                <VButton class="ico-btn" :loading="i.loading || null" @click="confirmEdit(i, key)"><ITick class="ico"/></VButton>
                            </template>
                            <VButton v-else class="ico-btn" :loading="i.loading || null" hollow red @click="deleteStage(i, key, k)"><ITrash class="ico"/></VButton>
                        </div>
                    </div>
                    

                    <div class="stage-content" v-if="i.editInfo" @click="i.edit=true">
                        <div class="date-input">
                            <VDatePicker 
                                v-if="i.editInfo.tmpDates" 
                                v-model="i.editInfo.tmpDates" 
                                is-range
                                :popover="{visibility: 'click'}"
                            >
                                <template #default="{ inputValue, inputEvents }">
                                    <input @click="i.edit=true" type="text" :value="inputValue.start" v-on="inputEvents.start" />
                                    <input @click="i.edit=true" type="text" :value="inputValue.end" v-on="inputEvents.end" />
                                </template>
                            </VDatePicker>
                        </div>

                        <div class="inp-wr perc-input">
                            <VTextInput v-model="i.editInfo.percentage"><div class="symbol">%</div></VTextInput>
                        </div>

                        <div class="inp-wr well-input" v-if="i.editInfo.well != null">
                            <p>Скважина:</p>
                            <VTextInput v-model="i.editInfo.well"/>
                        </div>
                    </div>

                    
                    <p v-if="i.err" err>{{i.err}}</p>
                </div>
                <div class="stage-block stage-tmp-block" v-for="(i,k) in tmpStages[key]" :key="i.id">
                    <div class="top">
                        <p class="name">{{typeName(i.type || key, key)}}</p>

                        <div class="btns">
                            <VButton class="ico-btn" :loading="i.loading || null" hollow @click="tmpStages[key].splice(k,1)"><ICross class="ico"/></VButton>
                            <VButton class="ico-btn" :loading="i.loading || null" @click="uploadStage(i, key, k)"><ITick class="ico"/></VButton>
                        </div>
                    </div>
                    
                    <div class="stage-content" @click="i.edit=true">
                        <div class="date-input">
                            <VDatePicker 
                                v-if="i.tmpDates" 
                                v-model="i.tmpDates" 
                                is-range
                                :popover="{visibility: 'click'}"
                            >
                                <template #default="{ inputValue, inputEvents }">
                                    <input @click="i.edit=true" type="text" :value="inputValue.start" v-on="inputEvents.start" />
                                    <input @click="i.edit=true" type="text" :value="inputValue.end" v-on="inputEvents.end" />
                                </template>
                            </VDatePicker>
                        </div>

                        <div class="inp-wr perc-input">
                            <VTextInput v-model="i.percentage"><div class="symbol">%</div></VTextInput>
                        </div>

                        <div class="inp-wr well-input" v-if="i.well != null">
                            <p>Скважина:</p>
                            <VTextInput v-model="i.well"/>
                        </div>
                    </div>

                    <p v-if="i.err" err>{{i.err}}</p>
                </div>

                <div class="add-field stage-block">
                    <TextSelect v-model="selectedType[key]" :list="stagesTypes.drill_stages" keyName="name" v-if="key == 'drill_stages'"/>
                    <VButton :disabled="!selectedType[key] || null" class="ico-btn" @click="addStage(selectedType[key], key)"><IPlus class="ico"/></VButton>
                </div>
            </div>
        </div>

        <div class="btns content">
            <VErr :err="err"/>
            <VButton red :loading="loading || null" hollow @click="deleteGroup">Удалить КП</VButton>
            <VButton :loading="loading || null" @click="close()">Готово</VButton>
        </div>
        
    </VModal>
</template>

<script setup>
    import VModal from "@/components/ui/VModal.vue";
    import { computed, ref } from "vue";

    import ProjectItems from "@/script/projectItems.js";
    import ProjectStore from "@/stores/project.js";

    import IPlus from "@/components/icons/IPlus.vue";
    import ITrash from "@/components/icons/ITrash.vue";
    import ITick from "@/components/icons/ITick.vue";
    import ICross from "@/components/icons/ICross.vue";

    import Moment from 'moment';
    import { extendMoment } from 'moment-range';
    

    const props = defineProps({
        info: Object
    });

    const moment = extendMoment(Moment);

    const Project = ProjectStore();

//status
    const status = ref('plan');

//stages
    const stages = computed(()=>{
        return {
            drill_stages: props.info.drill_stages,
            development_stages: props.info.development_stages
        }
    });
    const tmpStages = ref({
        drill_stages: [],
        development_stages: []
    }); 

    const sortedStages = computed(()=>{
        const srt = (a, b)=>{
            if ( new Date(a.date_start) < new Date(b.date_start) ) return -1;
            if ( new Date(a.date_start) > new Date(b.date_start) ) return 1;
            return 0;
        }

        return {
            drill_stages: stages.value.drill_stages.filter(e => e.status == status.value).sort(srt),
            development_stages: stages.value.development_stages.filter(e => e.status == status.value).sort(srt),
        }
    });

//prepareStage
    const prepareStage = (stage)=>{
        if(!stage.editInfo){
            stage.editInfo = JSON.parse(JSON.stringify(stage));

            stage.editInfo.tmpDates = {
                start: stage.date_start,
                end: stage.date_end
            }
            
            if(stage.well != null){
                stage.editInfo.well = props.info.wells.find(e => stage.well == e.id)?.name || '';
                stage.editInfo.legacyWell =  stage.editInfo.well;
            }
        }
    };

//well
    const uploadWell = (wellName, cb, cbErr, fin=()=>{})=>{
        let well = props.info.wells.find(e => wellName == e.name);

        if(well){
            cb(well);
            return;
        }

        ProjectItems.well.set(
            {
                name: wellName,
                well_group: props.info.id,
                "construction_type": "unknown" // notdone
            },
            (res)=>{
                props.info.wells.push(res);
                cb(res);
            },
            cbErr,
            fin
        )
    }

//edit
    const cancelEdit = (stage)=>{
        stage.err = '';
        stage.editInfo = null;
        prepareStage(stage);
        stage.edit = false;
    }

    const confirmEdit = (stage, type)=>{
        stage.loading = true;
        stage.err = '';

        const checkWell = (cb)=>{
            if(stage.editInfo.well == null || stage.editInfo.well == stage.editInfo.legacyWell){
                cb(null);
                return;
            }

            uploadWell(
                stage.editInfo.well,
                res => cb(res.id),
                err => {
                    stage.err = err;
                    stage.loading = false;
                }
            )
        }

        checkWell(
            (wellId)=>{
                ProjectItems.stage[type].edit(
                    stage.id,
                    Object.assign(
                        {
                            date_start: moment(stage.editInfo.tmpDates.start).format('YYYY-MM-DD'),
                            date_end:  moment(stage.editInfo.tmpDates.end).format('YYYY-MM-DD'),
                            percentage: stage.editInfo.percentage,
                            status: status.value
                        },
                        wellId?{well: wellId}:{}
                    ),
                    res => {
                        Object.keys(res).forEach(key => {
                            stage[key] = res[key];
                        });

                        console.log(stage, res);

                        stage.edit = false;
                        stage.editInfo = null;
                        prepareStage(stage);
                    },
                    err => stage.err = err,
                    fin => stage.loading = false
                )
            }
        )
    }

//add
    const addStage = (typeObject, type)=>{
        tmpStages.value[type].push(JSON.parse(JSON.stringify(typeObject.object)));
    }

    //stagesTypes
        const stagesTypes = computed(()=>{
            return {
                drill_stages: [
                    {
                        name: "Бурение скважины", 
                        type: "well_drilling",
                        object: {
                            type: "well_drilling",
                            tmpDates: {
                                start: null,
                                end: null,
                            },
                            percentage: 100,
                            well: ''
                        }
                    },
                    {
                        name: "Монтаж Б/У", 
                        type: "drill_assembly",
                        object: {
                            type: "drill_assembly",
                            tmpDates: {
                                start: null,
                                end: null,
                            },
                            percentage: 100,
                        }
                    },
                ],
                development_stages:  [
                    {
                        name: "Освоение", 
                        type: 'development_stages', 
                        object: {
                            tmpDates: {
                                start: null,
                                end: null,
                            },
                            percentage: 100,
                            well: ''
                        }
                    },
                ]   
            }
        })

        const typeName = (type, globType)=>stagesTypes.value[globType].find(e => e.type == type)?.name;

        const selectedType = ref({
            drill_stages: stagesTypes.value.drill_stages[0],
            development_stages: stagesTypes.value.development_stages[0]
        });

    const uploadStage = (stage, type, k)=>{
        stage.loading = true;
        stage.err = '';

        const checkWell = (cb)=>{
            if(stage.well == null){
                cb(null);
                return;
            }

            uploadWell(
                stage.well,
                res => cb(res.id),
                err => {
                    stage.err = err;
                    stage.loading = false;
                }
            )
        }

        checkWell(
            (wellId)=>{
                ProjectItems.stage[type].set(
                    Object.assign(
                        {
                            date_start: moment(stage.tmpDates.start).format('YYYY-MM-DD'),
                            date_end: moment(stage.tmpDates.end).format('YYYY-MM-DD'),
                            percentage: stage.percentage,
                            well_group: props.info.id,
                            status: status.value
                        }, 
                        stage.type?{type: stage.type}:{},
                        wellId?{well: wellId}:{}
                    ),
                    res => {
                        stages.value[type].push(res);
                        tmpStages.value[type].splice(k, 1);
                    },
                    err => {
                        stage.err = err;
                    },
                    () => stage.loading = false
                )
            }
        )
    }

//delete
    const deleteStage = (stage, type)=>{
        stage.loading = true;
        stage.err = '';

        ProjectItems.stage[type].delete(
            stage.id,
            res => {
                stages.value[type].splice(
                    stages.value[type].map(e => e.id).indexOf(stage.id),
                    1
                )
            },
            err => {
                stage.loading = false;
                stage.err = err;
            }
        );
    }

//deleteGroup
    const loading = ref(false);
    const err = ref('');

    const deleteGroup = ()=>{
        loading.value = true;
        err.value = '';

        ProjectItems.group.delete(
            props.info.id,
            res => {
                console.log(res);
                Project.activeProject.well_groups.splice(
                    Project.activeProject.well_groups.map(e => e.id).indexOf(props.info.id),
                    1
                ),
                close();
            },
            error => err.value = error,
            ()=>loading.value = false
        );
    }

//call
    const modal = ref(null);

    const call = ()=>{
        modal.value.call();
    }

    const close = ()=>{
        modal.value.close();
    }

    defineExpose({
        call,
        close
    });
</script>

<style lang="scss" scoped>
    :deep(.modal){
        width: 100%;
        height: 90vh;
        max-width: 1116px;
        @include flex-col;
        
        &>.content{
            @include flex-col;
            min-height: 0;
            height: 100%;
        }
    }

    .content{
        padding: 14px 57px;
        padding-top: 0;
        @include flex-col;
        gap: 10px;

        .input-wr{
            p{
                color: var(--typo-secondary);
                margin-bottom: 3px;
            }
        }
    }

    .pf{
        border-top: 1px solid var(--bg-border);
        padding-top: 14px;

        .pf-switch{
            display: flex;
            gap: 10px;

            .btn{
                border-radius: 4px;
                width: max-content;
            }
        }
    }
    

    .content.inputs{
        border: solid var(--bg-border);
        margin-bottom: 14px;
        border-width: 1px 0;
        overflow-y: auto;
        height: 100%;
        padding-top: 15px;
        display: flex;
        flex-direction: row;
        gap: 30px;

        .content-wr{ 
            @include flex-col;
            gap: 10px;
            width: 100%;

            h3{
                font-size: 20px;
                margin-bottom: 8px;
            }
        }
    }

    .content.btns{
        display: flex;
        flex-direction: row;
        justify-content: end;

        .btn{
            width: max-content;
            align-self: end;
        }
    }

    p[err]{
        color: var(--typo-alert);
    }

    .stage-block{

        &:not(:last-child){
            border-bottom: 1px solid var(--bg-border);
            padding-bottom: 10px;
        }

        &:first-of-type{
            border-top: 1px solid var(--bg-border);
            padding-top: 10px;
        }

        .stage-wr{
            display: flex;
            gap: 14px;
            width: 100%;
            align-items: baseline;
        }

        .top{
            display: flex;
            @include flex-jtf;
            margin-bottom: 10px;
            align-items: center;
        }

        .name{
            white-space: nowrap;
            padding-left: 10px;
        }

        .stage-content{
            display: flex;
            gap: 5px 14px;
            width: 100%;
            flex-wrap: wrap;
        }

        .ico-btn{
            width: 32px;
            height: 32px;
            padding: 0;
            flex-shrink: 0;

            .ico{
                height: 50%;
                width: 100%;
            }
        }

        &.add-field{
            display: flex;
            gap: 14px;

            .text-select{
                width: 100%;
            }
        }

        .date-input{
            position: relative;
            display: flex;
            border-radius: 32px;
            height: 32px;
            border: 1px solid var(--bg-border);

            :deep(.vc-popover-content-wrapper[data-popper-placement="top-start"]){
                transform: translate(15px, -32px)!important;
            }
            
            :deep(.vc-popover-content-wrapper[data-popper-placement="bottom-start"]){
                transform: translate(15px, 32px)!important;
            }

            input{
                background: transparent;
                border: none;
                padding: 0 17px;
                width: 115px;

                &:not(:first-child){
                    border-left: 1px solid var(--bg-border);
                }
            }
        }

        .inp-wr{
            display: flex;
            align-items: baseline;
            gap: 10px;

            &.perc-input{
                max-width: 69px;
            }

            &.well-input{
                .input{
                    max-width: 68px;
                }
            }

            .symbol{
                padding-right: 5px;
            }
        }

        

        .btns{
            display: flex;
            gap: 8px;
        }
    }
</style>