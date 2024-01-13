<template>
    <div class="db-chart">
        <div class="top">
            <h3>Сравнение законченных бурением скважин</h3>
            <div class="controls">
                <TextSelect :list="views" keyName="name" v-model="spoofView" @change="changeView"/>
                <div class="dates-selector">
                    <VButton
                        v-for="i in time" 
                        :key="i.type" 

                        fit 
                        :hollow="activeTime.type != i.type" 

                        @click="activeTime = i"
                    >
                        {{i.title}}
                        <template v-if="i.type == 'month' && yearsToSelect.length > 1">
                            за
                            <TextSelect :list="yearsToSelect" v-model="selectedYear" keyName="title"/>
                        </template>
                    </VButton>
                </div>
            </div>
        </div>

        <div class="chart-wr">
            <apexchart height="350" :options="chartOptions" :series="activeView.series"></apexchart>
        </div>
    </div>
</template>

<script setup>
    import { computed, onMounted, ref, watch } from "vue";
    import TextSelect from "@/components/ui/inputs/TextSelect.vue";

    import ProjectStore from "@/stores/project.js";
    import CarpetStore from "@/stores/carpet.js";

    import Moment from 'moment';
    import { extendMoment } from 'moment-range';
    const moment = extendMoment(Moment);

    const Project = ProjectStore();
    const Carpet = CarpetStore();

    const proj = computed(() => Project.activeProject);
    const groups = computed(() => proj.value?.well_groups || []);

//time
    const time = ref([
        {title: "Месяц", type: "month", format: "MM.YYYY"},
        {title: "Год", type: "year", format: "YYYY"},
    ]);

    const activeTime = ref(time.value[1]);

    const getDatesArray = (type, format)=>{
        let n = moment.range(Carpet.timeRange).diff('M');

        let arr = [];

        for (let i = 0; i < Math.ceil(n / (type == 'year'?12:1)); i++){
            arr.push(moment(Carpet.timeRange[0]).add(i, type).format(format))
        }

        return arr;
    }

    //--
        const yearsToSelect = computed(()=>[
            {title: 'все', value: null},
            ...getDatesArray('year', 'YYYY').map(e => {return {title: e, value: e}})
        ]);

        const selectedYear = ref(yearsToSelect.value[0]);

    

    const datesArray = computed(()=>{
        let res = getDatesArray(activeTime.value.type, activeTime.value.format);

        if(activeTime.value.type == 'year')return res;

        return res.filter(e => e.includes(selectedYear.value?.value || ''))
    });

    const dateIdAfter = computed(()=>{
        let res = 9999;

        datesArray.value.find((e,k) => {
            if(moment(e, activeTime.value.format)._d > moment()._d){
                res = k;
                return true;
            }
            return false;
        })

        return res;
    });

//view
    const views = computed(()=>{
        //notdone разберись с этими фантомными NaN

        let plans = {
            drill_stages: Object.values(reduceStagesByTime('drill_stages', 'plan')).filter(e => !isNaN(e)) || [],
            development_stages: Object.values(reduceStagesByTime('development_stages', 'plan')).filter(e => !isNaN(e)) || [],
            fortnight: Object.values(reduceFortnightByTime('plan')).filter(e => !isNaN(e)) || []
        }

        console.log(reduceStagesByTime('drill_stages', 'plan'), plans.drill_stages)

        return [
            // {
            //     title: "Сравнение законченных бурением скважин",
            //     name: "Сравнение"
            // },
            // {
            //     title: "Диаграмма отставания/опережения бурения",
            //     name: "Отставание/опережение"
            // },
            // {
            //     title: "Закончено бурением/освоением",
            //     name: "Закончено"
            // },
            // {
            //     title: "Производственная программа бурения",
            //     name: "Программа бурения"
            // },
            // {
            //     title: "Проходка тыс м",
            //     name: "Проходка"
            // },
            // {
            //     title: "Коммерческая скорость и МСП",
            //     name: "Коммерческая скорость"
            // },

            {
                title: "Сравнение законченных бурением скважин",
                name: "Бурение",
                series: [
                    {
                        name: "Бурение (План)",
                        type: 'bar',
                        data: plans.drill_stages
                    },
                    {
                        name: "Бурение (Факт)",
                        type: 'bar',
                        data: Object.values(reduceStagesByTime('drill_stages', 'fact'))?.map((e,k)=>{
                            if(k < dateIdAfter.value)return e;
                            return plans.drill_stages[k]
                        }).filter(e => !isNaN(e)) || []
                    },
                ]
            }, 
            {
                title: "Сравнение законченных освоением скважин",
                name: "Освоение",
                series: [
                    {
                        name: "Освоение (План)",
                        type: 'bar',
                        data: plans.development_stages
                    },
                    {
                        name: "Освоение (Факт)",
                        type: 'bar',
                        data: Object.values(reduceStagesByTime('development_stages', 'fact'))?.map((e,k)=>{
                            if(k < dateIdAfter.value)return e;
                            return plans.development_stages[k]
                        }).filter(e => !isNaN(e)) || []
                    },
                ]
            },
            {
                title: "Проходка",
                name: "Проходка",
                series: [
                    {
                        name: "Проходка (План)",
                        type: 'line',
                        data: plans.fortnight
                    },
                    {
                        name: "Проходка (Факт)",
                        type: 'line',
                        data: Object.values(reduceFortnightByTime('fact')).filter(e => !isNaN(e)) || []
                    },
                ]
            }
        ]
    });

    //--
        const reduceStagesByTime = (key, status)=>{
            let dates = Object.fromEntries(datesArray.value.map(e => [e, null]));

            return groups.value?.reduce((acc, g) => {  
                g[key]?.filter(e => e.status == [status]).forEach(s => {
                    acc[moment(s.date_end).format(activeTime.value.format)] += 1;
                });
                return acc;
            }, dates)
        }

        const reduceFortnightByTime = (status)=>{
            let dates = Object.fromEntries(datesArray.value?.map(e => [e, null]));

            return groups.value?.reduce((acc, g) => {  
                g['fortnight_data']?.filter(e => e.status == [status]).forEach(s => {
                    //notdone избавиться от warning (что-то с месяцем сделать)
                    acc[moment(`${s.year}-${s.month}-01`).format(activeTime.value.format)] += s.drilling_amount || 0;
                });

                return acc;
            }, dates)
        }
        

    const activeViewId = ref(0);
    const activeView = computed(()=>views.value[activeViewId.value]);
    const spoofView = ref(views.value[activeViewId.value]);

    const changeView = (e)=>{
        activeViewId.value = views.value.map(e => e.name).indexOf(e.name);
    }
    
//chart    
    const chartOptions =  computed(() => {
        const colors = ['#52e6aa', '#39a1fa']

        return {
            chart: {
                height: 350,
                // type: 'column',
                // stacked: false,
                margin: 20,
                toolbar: {
                    tools: {
                        download: false,
                        selection: false,
                        zoom: false,
                        zoomin: false,
                        zoomout: false,
                        pan: false,
                        reset: false
                    },
                    show: false,
                },
                animations: {
                    enabled: false
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false
                }
            },
            colors: [(opts)=>{
                if(/*activeView.value.series[opts.seriesIndex].type == 'bar' &&*/ opts.seriesIndex == 1 && opts.dataPointIndex >= dateIdAfter.value){
                    return colors[opts.seriesIndex]+'44';
                }

                return colors[opts.seriesIndex]
            }],
            dataLabels: {
                enabled: true,
                background: {
                    enabled: false,
                },
                textAnchor: 'middle',
                offsetY: -10,
                // offsetX: 2,
                // enabledOnSeries: [0,1,2],
                type: 'numeric',
                decimalsInFloat: 3
            },
            stroke: {
                width: 1
            },
            xaxis: {
                categories: datesArray.value,
            },
            yaxis: {
                axisTicks: {
                    show: true,
                    color: 'var(--bg-border-focus)'
                },
                axisBorder: {
                    show: true,
                    color: 'var(--bg-border-focus)'
                },
                tooltip: {
                    enabled: false
                },
                // min: 0,
                // max: 60,
            },
            legend: {
                show: false,
                // horizontalAlign: 'left',
                // offsetX: 20,
                // itemMargin: {
                //     horizontal: 20,
                //     vertical: 0
                // },
                // markers: {
                //     offsetX: -4,
                //     offsetY: 1,
                // },
            }
        }
    })
</script>

<style lang="scss" scoped>
    .top, .controls-bar{
        padding: 0 20px;
    }

    .top{
        @include flex-jtf;

        .controls{
            @include flex-col;
            gap: 6px;
        }
    }

    .dates-selector{
        display: flex;
        justify-content: end;
        gap: 4px;

        .btn{
            border-radius: 4px;
            padding-bottom: .2em;
            padding-top: .1em;
        }

        :deep(.text-select){
            width: 50px;
            height: 21px;

            input{
                background: var(--bg-default);
                padding: 0 6px;
            }

            .drop .item{
                color: #000;
            }
        }
    }

    
</style>