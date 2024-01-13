<template>
    <div class="page">
        <!-- top -->
        <div class="top">
            <div class="options">
                <AddToProjectControls class="option"/>
                <VTextInput class="search" v-model="search" placeholder="Поиск">
                    <template #pre>
                        <div class="ico-wr"><ISearch class="ico"/></div>
                    </template>
                    <div class="close" v-if="search" @click="search = ''">
                        <ICross class="ico"/>
                    </div>
                </VTextInput>
            </div>
        </div>
        <div class="table">
            <!-- head -->
                <div class="cell head-cell">КГС</div>
                <div class="cell head-cell">№ скважины</div>
                <div class="cell head-cell">Тип конструкции</div>
                <div class="cell head-cell">План/Факт</div>
                <div class="cell head-cell cell-container" style="grid-column: span 2;">
                    <div class="sub-cells">
                        <div class="cell">Сроки бурения</div>
                    </div>
                    <div class="sub-cells">
                        <div class="cell">Начало</div>
                        <div class="cell">Окончание</div>
                    </div>
                </div>
                <div class="cell head-cell cell-container" style="grid-column: span 2;">
                    <div class="sub-cells">
                        <div class="cell">Сроки строительства</div>
                    </div>
                    <div class="sub-cells">
                        <div class="cell">Начало</div>
                        <div class="cell">Окончание</div>
                    </div>
                </div>
                <div class="cell head-cell">Фактические сроки строительства</div>
                <div class="cell head-cell">Забой скважины</div>
                <div class="cell head-cell">Скорость бурения (м/сут)</div>
                <div class="cell head-cell">Факт проходки</div>
                <div class="cell head-cell">Остаток</div>
                <div class="cell head-cell">Дата движения на след. скв</div>
                <div class="cell head-cell">Дата освобождения устья из-под БУ</div>
                <div class="cell head-cell">Переезда на КГС</div>
                <div class="cell head-cell">Дата потребности в КГС</div>
                <div class="cell head-cell">Дата готовности КГС</div>
                <div class="cell head-cell">Разница</div>
            <!-- body -->
                <div class="table-content-wr" v-for="(gr, kGr) in filteredGroups" :key="kGr">
                    <div class="cell" :style="{'grid-row': `span ${gr.wells.length + 1}`}">
                        {{gr.name}}
                    </div>
                    <div class="well-container" v-for="(w, wk) in gr.wells" :key="wk">
                        <div class="cell">
                            <VTextInput v-model="w.name" @change="editWellValue(w, {'name': w.name})"/>
                        </div>
                        <div class="cell">?</div>
                        <div class="cell cell-half">
                            <div class="cell">План</div>
                            <div class="cell">Факт</div>
                        </div>
                        <div class="cell cell-half cell-dates">
                            <VDatePicker 
                                v-if="w.drilling_stage_info_plan?.tmpDates" 
                                v-model="w.drilling_stage_info_plan.tmpDates" 
                                is-range
                                :popover="{visibility: 'click'}"
                                @dayclick="finDate(w, 'drilling_stage_info_plan', 'drill_stages')"
                            >
                                <template #default="{ inputValue, inputEvents }">
                                    <div class="cell"><input class="date-inp" type="text" :value="inputValue.start" v-on="inputEvents.start"/></div>
                                    <div class="cell"><input class="date-inp" type="text" :value="inputValue.end" v-on="inputEvents.end"/></div>
                                </template>
                            </VDatePicker>

                            <VDatePicker 
                                v-if="w.drilling_stage_info_fact?.tmpDates" 
                                v-model="w.drilling_stage_info_fact.tmpDates" 
                                is-range
                                :popover="{visibility: 'click'}"
                                @dayclick="finDate(w, 'drilling_stage_info_fact', 'drill_stages')"
                            >
                                <template #default="{ inputValue, inputEvents }">
                                    <div class="cell"><input class="date-inp" type="text" :value="inputValue.start" v-on="inputEvents.start" /></div>
                                    <div class="cell"><input class="date-inp" type="text" :value="inputValue.end" v-on="inputEvents.end" /></div>
                                </template>
                            </VDatePicker>
                        </div>
                        <div class="cell cell-half cell-dates">
                            <VDatePicker 
                                v-if="w.development_stage_info_plan?.tmpDates" 
                                v-model="w.development_stage_info_plan.tmpDates" 
                                is-range
                                :popover="{visibility: 'click'}"
                                @dayclick="finDate(w, 'development_stage_info_plan', 'development_stages')"
                            >
                                <template #default="{ inputValue, inputEvents }">
                                    <div class="cell"><input class="date-inp" type="text" :value="inputValue.start" v-on="inputEvents.start" /></div>
                                    <div class="cell"><input class="date-inp" type="text" :value="inputValue.end" v-on="inputEvents.end" /></div>
                                </template>
                            </VDatePicker>
                            <VDatePicker 
                                v-if="w.development_stage_info_fact?.tmpDates" 
                                v-model="w.development_stage_info_fact.tmpDates" 
                                is-range
                                :popover="{visibility: 'click'}"
                                @dayclick="finDate(w, 'development_stage_info_fact', 'development_stages')"
                            >
                                <template #default="{ inputValue, inputEvents }">
                                    <div class="cell"><input class="date-inp" type="text" :value="inputValue.start" v-on="inputEvents.start" /></div>
                                    <div class="cell"><input class="date-inp" type="text" :value="inputValue.end" v-on="inputEvents.end" /></div>
                                </template>
                            </VDatePicker>
                        </div>
                        <div class="cell">123</div>
                        <div class="cell cell-half">
                            <div class="cell">0</div>
                            <div class="cell">0</div>
                        </div>
                        <div class="cell"><VTextInput/></div>
                        <div class="cell"><VTextInput/></div>
                        <div class="cell"><VTextInput/></div>
                        <div class="cell"><VTextInput/></div>
                        <div class="cell"><VTextInput/></div>
                    </div>
                    <div class="well-container">
                        <div class="cell add-cell" @click="addWell(gr)" style="grid-column: 1 / -1">+</div>
                    </div>
                    <div class="cell" :vertical="true || null" :style="{'grid-area': `1 / -5 / span ${gr.wells.length + 1}`}">
                        <DMTMoveToSelect v-if="Project().demoGroups" :group="gr"/>
                        <!-- <p>Не переезжает</p> -->
                    </div>
                    <div class="cell" :vertical="true || null" :style="{'grid-area': `1 / -4 / span ${gr.wells.length + 1}`}">
                        <VDatePicker 
                            v-if="gr" 
                            v-model="gr.need_date" 
                            :popover="{visibility: 'click', placement: 'bottom-end'}"
                            @dayclick="editGroupValue(gr, {'need_date': moment(gr.need_date).format('YYYY-MM-DD')})"
                        >
                            <template #default="{ inputValue, inputEvents }">
                                <div class="inp-wr">
                                    <input class="date-inp" type="text" :value="inputValue" v-on="inputEvents"/>
                                </div>
                            </template>
                        </VDatePicker>
                    </div>
                    <div class="cell" :vertical="true || null" :style="{'grid-area': `1 / -3 / span ${gr.wells.length + 1}`}">
                        <VDatePicker 
                            v-if="gr" 
                            v-model="gr.ready_date" 
                            :popover="{visibility: 'click', placement: 'bottom-end'}"
                            @dayclick="editGroupValue(gr, {'ready_date': moment(gr.ready_date).format('YYYY-MM-DD')})"
                        >
                            <template #default="{ inputValue, inputEvents }">
                                <div class="inp-wr">
                                    <input class="date-inp" type="text" :value="inputValue" v-on="inputEvents"/>
                                </div>
                            </template>
                        </VDatePicker>
                    </div>
                    <div class="cell" :style="{'grid-area': `1 / -2 / span ${gr.wells.length + 1}`}">
                        <p>0</p>
                    </div>
                </div>
                
        </div>
    </div>
</template>

<script setup>
    import Project from '@/stores/project.js';

    import VTextInputSwitch from "@/components/ui/inputs/VTextInputSwitch.vue";

    import AddToProjectControls from "@/components/carpet/edit/AddToProjectControls.vue";

    import ProjectItems from "@/script/projectItems.js";

    import DMTMoveToSelect from "@/components/drillingMovementTable/DMTMoveToSelect.vue";
    
    import { computed, onMounted, watch, ref } from 'vue';

    import ISearch from "@/components/icons/ISearch.vue";
    import IWell from "@/components/icons/IWell.vue";
    import IPlus from "@/components/icons/IPlus.vue";
    import ICross from "@/components/icons/ICross.vue";

    import Moment from 'moment';
    import { extendMoment } from 'moment-range';
    const moment = extendMoment(Moment);
    
    const groups = computed(()=>Project()?.activeProject?.well_groups);

    onMounted(()=>{
        // console.log(groups.value);
        if(groups.value){
            groups.value.forEach(g => 
                g.wells.forEach(w => expandWellInfo(g,w))
            )
        }else{
            watch(
                groups,
                (n)=>{
                    if(n)groups.value.forEach(g => 
                            g.wells.forEach(w => expandWellInfo(g,w))
                        )
                }
            )
        }

        Project().updateDemoGroups();
    });

    const expandWellInfo = (group, well)=>{
        const expand = (wellKey, groupKey)=>{
            let infoKey = wellKey.split('_');
            infoKey.splice(-1, 0, 'info');
            infoKey = infoKey.join('_');

            // console.log(group?.[groupKey], well[wellKey]);

            well[infoKey] = group?.[groupKey]?.find(e => e.id == well[wellKey]) || {};
            well[infoKey].tmpDates = {
                start: well[infoKey]?.date_start || null,
                end: well[infoKey]?.date_end || null
            };
            well[infoKey].tmpDates
        }

        expand('drilling_stage_plan', 'drill_stages');
        expand('drilling_stage_fact', 'drill_stages');
        expand('development_stage_plan', 'development_stages');
        expand('development_stage_fact', 'development_stages');

        // console.log(well);
    }

    //search
        const search = ref('');

        const filteredGroups = computed(()=>
            groups.value
            ?.filter(e => e.name.toUpperCase().includes(search.value.toUpperCase()))
            .sort((a,b)=>{
                if ( a.id < b.id ) return -1;
                if ( a.id > b.id ) return 1;
                return 0;
            })
        )

    //migration
        const migrationList = computed(()=>{
            Project().projects()
        })


    //add
        const addWell = (group)=>{
            group.wells.push({
                tmpId: group.length+''+Math.random(),
                name: '',
                well_group: group.id
            })
        }

    //edit
        const editWellValue = (well, val)=>{
            if(!well.id){
                ProjectItems.well.set(
                    {
                        name: well.name,
                        well_group: well.well_group,
                        "construction_type": "unknown",//notdone
                    },
                    res => {
                        // console.log(res);

                        let wls = groups.value.find(e => e.id == res.well_group).wells 

                        wls.splice(
                            wls.map(e => e.tmpId).indexOf(well.tmpId),
                            1,
                            res
                        )

                        expandWellInfo(null, wls.find(e => e.id == res.id));
                    },
                    err => {
                        console.log(err);
                    }
                )
            }else{
                ProjectItems.well.edit(
                    well.id,
                    val,
                    (res)=>{console.log(res)},
                    (err)=>{console.log(err)}
                )
            }
        } 
        
        const editGroupValue = (well, val)=>{
            ProjectItems.group.edit(
                well.id,
                val,
                (res)=>{console.log(res)},
                (err)=>{console.log(err)}
            )
        }

    //finDate
        const finDate = (w, key, stageType)=>{
            let dates = {
                start: moment(w[key].tmpDates?.start).format('YYYY-MM-DD'),
                end: moment(w[key].tmpDates?.end).format('YYYY-MM-DD')
            }

            if(dates.start == dates.end)return;
            
            if(!w[key].id){                
                ProjectItems.stage[stageType].set(
                    Object.assign(
                        {
                            "date_start": dates.start,
                            "date_end": dates.end,
                            "status": key.split('_').slice(-1)[0],
                            "percentage": 100,
                            "well_group": w.well_group,
                            "well": w.id
                        },
                        stageType.startsWith('drill')?{type: 'well_drilling'}:{}
                    ),
                    (res)=>{
                        w[key] = res;
                        w[key].tmpDates = dates;
                        w[key.replace('_info', '')] = res.id;
                        groups.value.find(e => e.id == res.well_group)[stageType].push(res);
                    }
                )
            }else if(
                moment(w[key].date_start).format('YYYY-MM-DD') != dates.start ||
                moment(w[key].date_end).format('YYYY-MM-DD') != dates.end
            ){
                //edit stage
                ProjectItems.stage[stageType].edit(
                    w[key].id,
                    {
                        date_start: dates.start,
                        date_end: dates.end
                    },
                    (res)=>{
                        w[key].date_start = dates.start;
                        w[key].date_end = dates.end;
                    },
                    (err)=>{
                        console.log(err)
                    }
                )
            }
        }
</script>

<style lang="scss" scoped>
    .page{
        padding: 0!important;
    }

    .search{
        display: flex;
        align-items: center;

        :deep(.content){
            border: none!important;
            width: 100%;
        }

        .ico-wr{
            @include flex-c;
            width: 30px;
            height: 30px;
            margin: 0 -7px 0 4px;
            flex-shrink: 0;

            .ico{
                width: 66%;
                color: var(--bg-border-focus);
            }
        }

        .close{
            width: 30px;
            height: 30px;
            @include flex-c;
            cursor: pointer;
            color: var(--bg-border);
            transition: .3s;

            &:hover{
                color: var(--bg-border-focus);
            }
        }
    }

    .options{
        display: flex;
        grid-column: span 3;
        position: relative;

        &::after{
            @include pseudo-absolute;
            right: -1px;
            top: 0px;
            height: 100%;
            width: 1px;
            background: var(--bg-border);
        }

        :deep(.option){
            height: 32px;
            width: 32px;
            position: relative;
            @include flex-c;
            flex-shrink: 0;
            
            border-right: 1px solid var(--bg-border);
            cursor: pointer;

            transition: .3s;

            .ico{
                height: 48%;
                width: 48%;
                color: var(--bg-border-focus);
            }

            &:hover{
                background: var(--bg-ghost);

                .ico{
                    color: var(--typo-control-secondary);
                }
            }

            .drop{
                position: absolute;
                top: 100%;
                left: -1px;
                z-index: 5;
                padding: 5px 10px;
                border-radius: 0 0 4px 4px;
                border: 1px solid var(--bg-border);
                background: var(--bg-default);
                transition: .3s;
            }

            &:not([drop]){
                .drop{
                    @include hidden(-5px);
                }
            }

            .btns-drop{
                display: flex;
                gap: 8px;

                .btn{
                    font-size: 14px;
                }
            }
        }
    }

    .top{
        height: 32px;
        grid-template-columns: repeat(19, 1fr);
        display: grid;
        width: calc(100%);
        border: 1px solid var(--bg-border);
        border-top: 0;
    }

    .table{
        display: grid;
        width: 100%;
        grid-template-columns: repeat(19, 1fr);
        gap: 1px;
        background: var(--bg-border);
        padding: 0 1px 1px!important;

        .cell{
            background: var(--bg-default);
            grid-column: span 1;
            font-size: 13px;
            word-break: break-word;
            @include flex-c;
            text-align: center;
            padding: 2px 4px;

            // &[vertical]{
            //     writing-mode: vertical-lr;
            //     transform: rotate(180deg);
            //     padding: 4px 2px;
            // }

            &:deep(input){
                text-align: center;
            }
        }

        .cell-container{
            @include flex-col;
            background: transparent;
            gap: 1px;
            padding: 0;

            .sub-cells{
                display: flex;
                width: 100%;
                height: 100%;
                gap: 1px;

                .cell{
                    width: 100%;
                }
            }
        }

        .table-content-wr{
            display: grid;
            grid-template-columns: repeat(19, 1fr);
            gap: 1px;
            grid-column: 1 / -1;

            &:nth-child(2n+1){
                .cell{
                    background: #edf2f4;
                }
            }

            .well-container{
                display: grid;
                grid-template-columns: repeat(14, 1fr);
                grid-column: 2 / span 14;
                gap: 1px;
            }

            .cell-half{
                @include flex-col;
                gap: 1px;
                background: transparent!important; 
                padding: 0;

                .cell{
                    height: 100%;
                    width: 100%;
                }
            }

            input.date-inp{
                background: transparent;
                border: none;
                width: 100%;
                border: 1px solid var(--bg-border);
                border-radius: 4px;
                transition: .3s;
                height: 32px;

                &:focus{
                    border-color: var(--bg-border-focus);
                }

                &:not(:first-child){
                    border-left: 1px solid var(--bg-border);
                }
            }

            .cell-dates{
                display: grid;
                grid-template-columns: repeat(2, 2fr);

                grid-column: span 2;

                input.date-inp{
                    height: 21px;
                }
            }

            
        }

        .add-cell{
            cursor: pointer;
        }
    }
</style>