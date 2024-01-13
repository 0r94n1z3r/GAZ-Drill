<template>
    <div class="page">
        <div class="loading-wr" v-if="loading"><VLoading/></div>
        
        <template v-else>
            <PageControls>
                <template #btns>
                    <VButton :loading="sendLoading || null" v-if="isEdit" red hollow @click="deleteWell">Удалить</VButton>
                    <VButton :loading="sendLoading || null" hollow @click="router.push(router.options.history?.state?.back || {name: 'Data'})">Отменить</VButton>
                    <VButton :loading="sendLoading || null" @click="confirm">Сохранить</VButton>
                </template>
            </PageControls>

            <div class="content">
                <div class="col">
                    <h2>Основные данные</h2>
                    <div class="inp-wr">
                        <div class="title">Название</div>
                        <VTextInput class="inp" v-model="well.name"/>
                    </div>
                    <!-- <div class="inp-wr">
                        <div class="title">Филиал</div>
                        <TextSelect class="inp" :list="tmp" v-model="tmpModel" keyName="name"/>
                    </div>
                    <div class="inp-wr">
                        <div class="title">Эксплуатирующая организация</div>
                        <TextSelect class="inp" :list="tmp" v-model="tmpModel" keyName="name"/>
                    </div>
                    <div class="inp-wr">
                        <div class="title">Лицензионный участок</div>
                        <TextSelect class="inp" :list="tmp" v-model="tmpModel" keyName="name"/>
                    </div>
                    <div class="inp-wr">
                        <div class="title">Месторождение</div>
                        <TextSelect class="inp" :list="tmp" v-model="tmpModel" keyName="name"/>
                    </div> -->
                    <div class="inp-wr">
                        <div class="title">Куст</div>
                        <TextSelect class="inp" :list="PItems.wellGroups" v-model="well.well_group" keyName="name"/>
                    </div>
                    <div class="inp-wr">
                        <div class="title">Буровая установка</div>
                        <TextSelect class="inp" :list="PItems.drills" v-model="well.drilling_plan.drill" keyName="name"/>
                    </div>
                    <!-- <div class="inp-wr">
                        <div class="title">Номер скважины</div>
                        <TextSelect class="inp" :list="tmp" v-model="tmpModel" keyName="name"/>
                    </div>
                    <div class="inp-wr">
                        <div class="title">Проектная глубина</div>
                        <VTextInput class="inp"/>
                    </div>
                    <div class="inp-wr">
                        <div class="title">Проходка за скважину</div>
                        <VTextInput class="inp"/>
                    </div>
                    <div class="inp-wr">
                        <div class="title">Коммерческая скорость</div>
                        <VTextInput class="inp"/>
                    </div>
                    <div class="inp-wr">
                        <div class="title">Скорость сутки / 1000м</div>
                        <VTextInput class="inp"/>
                    </div> -->
                </div>
                <div class="col">
                    <h2>Бурение</h2>

                    <div class="list">
                        <div class="block">
                            
                            <h4>Монтаж БУ</h4>
                            <div class="dates inp-wr">
                                <div class="titles">
                                    <div class="title">Дата начала</div>
                                    <div class="title">Дата окончания</div>
                                </div>
                                <div class="dates-wr">
                                    <DatePicker 
                                        mode="date" 
                                        v-model="wellDates.assembling" 
                                        is-range
                                        :popover="{visibility: 'click'}"
                                    >
                                        <template v-slot="{ inputValue, inputEvents }">
                                                <input :value="inputValue.start" v-on="inputEvents.start" class="cas-text-input"/>
                                                <input :value="inputValue.end" v-on="inputEvents.end" class="cas-text-input"/>
                                        </template>
                                    </DatePicker>
                                </div>
                            </div>

                            <h4>Бурение скважины</h4>
                            <div class="dates inp-wr">
                                <div class="titles">
                                    <div class="title">Дата начала</div>
                                    <div class="title">Дата окончания</div>
                                </div>
                                <div class="dates-wr">
                                    <DatePicker 
                                        mode="date" 
                                        v-model="wellDates.drilling" 
                                        is-range
                                        :popover="{visibility: 'click'}"
                                    >
                                        <template v-slot="{ inputValue, inputEvents }">
                                                <input :value="inputValue.start" v-on="inputEvents.start" class="cas-text-input"/>
                                                <input :value="inputValue.end" v-on="inputEvents.end" class="cas-text-input"/>
                                        </template>
                                    </DatePicker>
                                </div>
                            </div>
                            
                            <h4>Демонтаж БУ</h4>
                            <div class="dates inp-wr">
                                <div class="titles">
                                    <div class="title">Дата начала</div>
                                    <div class="title">Дата окончания</div>
                                </div>
                                <div class="dates-wr">
                                    <DatePicker 
                                        mode="date" 
                                        v-model="wellDates.disassembling" 
                                        is-range
                                        :popover="{visibility: 'click'}"
                                    >
                                        <template v-slot="{ inputValue, inputEvents }">
                                                <input :value="inputValue.start" v-on="inputEvents.start" class="cas-text-input"/>
                                                <input :value="inputValue.end" v-on="inputEvents.end" class="cas-text-input"/>
                                        </template>
                                    </DatePicker>
                                </div>
                            </div>
                        </div>
                        <!-- <div class="btns">
                            <VButton hollow class="add">
                                <IPlus class="ico"/>
                                Добавить бурение
                            </VButton>
                        </div> -->
                        
                    </div>
                    
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
    import { computed, onMounted, ref, watch } from "vue";

    
    import { DatePicker } from "v-calendar"

    import IPlus from "@/components/icons/IPlus.vue";

    import ProjectItems from "@/script/projectItems.js";
    const ApWell = ProjectItems('wells');

    import PItemsStore from "@/stores/projectItems.js";
    const PItems = PItemsStore();

    import Moment from 'moment';
    import { extendMoment } from 'moment-range';
    const moment = extendMoment(Moment);

    import { useRoute, useRouter} from "vue-router";
    const route = useRoute(), router = useRouter(); 
    

    const props = defineProps({
        id: String 
    });

    const isEdit = computed(()=>props.id != '-1');

    const well = ref({
        "name": "",
        "well_group": null,
        "drilling_plan": {
            "drill": null
        }
    });

    const wellDates = ref({
        assembling: {start: null, end: null},
        drilling: {start: null, end: null},
        disassembling: {start: null, end: null}
    })

//update
    const loading = ref(true); 

    const update = ()=>{
        loading.value = true;

        if(!isEdit.value){
            loading.value = false;
            well.value = {
                "name": "",
                "well_group": {name: 'Выберите куст', id: 0},
                "drilling_plan": {
                    "drill": {name: 'Выберите БУ', id: 0}
                }
            };

            wellDates.value = {
                assembling: {start: null, end: null},
                drilling: {start: null, end: null},
                disassembling: {start: null, end: null}
            }
        }else{
            ApWell.get(
                props.id,
                resp => {
                    let dp = resp.drilling_plan;

                    wellDates.value = {
                        assembling: {
                            start: dp.assembling_date_start?moment(dp.assembling_date_start, 'YYYY-MM-DD')._d:null, 
                            end: dp.assembling_date_end?moment(dp.assembling_date_end, 'YYYY-MM-DD')._d:null, 
                        },
                        drilling: {
                            start: dp.drilling_date_start?moment(dp.drilling_date_start, 'YYYY-MM-DD')._d:null, 
                            end: dp.drilling_date_end?moment(dp.drilling_date_end, 'YYYY-MM-DD')._d:null, 
                        },
                        disassembling: {
                            start: dp.disassembling_date_start?moment(dp.disassembling_date_start, 'YYYY-MM-DD')._d:null, 
                            end: dp.disassembling_date_end?moment(dp.disassembling_date_end, 'YYYY-MM-DD')._d:null, 
                        }
                    }

                    
                    resp.well_group = PItems.wellGroups.find(e => e.id == resp.well_group) || {name: 'Выберите куст', id: null};
                    dp.drill = PItems.drills.find(e => e.id == dp.drill) || {name: 'Выберите БУ', id: null};
                    
                    well.value = resp;
                },
                err => {},
                ()=>loading.value = false
            );
        }
    }

    onMounted(update);
    watch(()=>props.id, update)

//send
    const sendLoading = ref(false);
    const err = ref("");

    //set
        const confirm = ()=>{
            sendLoading.value = true;

            let res = JSON.parse(JSON.stringify(well.value));

            let dp = res.drilling_plan;
            dp.assembling_date_start = wellDates.value.assembling.start?
                moment(wellDates.value.assembling.start).format('YYYY-MM-DD'):
                null
            dp.assembling_date_end =  wellDates.value.assembling.end?
                moment(wellDates.value.assembling.end).format('YYYY-MM-DD'):
                null
            dp.drilling_date_start = wellDates.value.drilling.start?
                moment(wellDates.value.drilling.start).format('YYYY-MM-DD'):
                null
            dp.drilling_date_end = wellDates.value.drilling.end?
                moment(wellDates.value.drilling.end).format('YYYY-MM-DD'):
                null
            dp.disassembling_date_start = wellDates.value.disassembling.start?
                moment(wellDates.value.disassembling.start).format('YYYY-MM-DD'):
                null
            dp.disassembling_date_end = wellDates.value.disassembling.end?
                moment(wellDates.value.disassembling.end).format('YYYY-MM-DD'):
                null

            res.well_group = res.well_group?.id;
            res.drilling_plan.drill = res.drilling_plan?.drill?.id;

            let req = [
                res,
                ()=>{router.push({name: 'Data'})},
                resp=>{err.value = resp},
                ()=>{sendLoading.value = false}
            ]

            if(isEdit.value){
                ApWell.edit(...req);
            }else{
                ApWell.set(...req);
            }
        }
    
    //del
        const deleteWell = ()=>{
            sendLoading.value = true;
            
            ApWell.delete(
                well.value.id,
                ()=>{router.push({name: 'Data'})},
                resp=>{err.value = resp},
                ()=>{sendLoading.value = false}
            )
        }

     
</script>

<style lang="scss" scoped>
    .page{
        @include flex-col;
    }


    .loading-wr{
        @include flex-c;
        flex-grow: 1;
        height: 100%;
    }

    .content{
        display: flex;
        gap: 80px;
        max-width: 1320px;
        margin: 0 auto;

        .col{
            width: 50%;
            gap: 4px;
            @include flex-col;
        }

        h2{
            margin-bottom: 8px;
        }

        .inp-wr{
            display: flex;
            gap: 10px;

            .title{
                width: 240px;
                flex-shrink: 0;
            }

            .inp{
                width: 100%;
                height: 32px;
            }
        }

        .block{
            border: 1px solid var(--bg-border);
            border-radius: 10px;
            padding: 5px 10px;

            h3{
                margin-bottom: 8px;
                font-size: 20px;
            }

            h4{
                margin-bottom: 6px;
                margin-top: 15px;
                color: var(--typo-secondary);
                font-size: 18px;
            }

            .inp-group{
                @include flex-col;
                gap: 4px
            }
        }

        .list{
            @include flex-col;
            gap: 8px;

            .btns{
                display: flex;
                justify-content: end;

                .btn{
                    width: max-content;
                }

                .add{
                    width: max-content;

                    .ico{
                        width: 14px;
                        height: 14px;
                        margin-bottom: -2px;
                    }
                }
            }
            
        }

        .dates{
            .titles .title{
                height: 32px;
                display: flex;
                align-items: center;
            }

            .titles, .dates-wr{
                @include flex-col;
                gap: 4px;
            }
        }

        
    }
</style>