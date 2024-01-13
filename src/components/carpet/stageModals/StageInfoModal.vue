<template>
    <VModal :title="stage?.title" ref="modal">
        <div class="content" v-if="stage">
            <div class="info-wr">
                <h4>Операция:</h4>
                <p>{{operation}}</p>
            </div>

            <div class="info-wr">
                <h4>Сроки:</h4>
                <p>{{moment(stage.dates[0]).format('DD.MM.YYYY')}} - {{moment(stage.dates[1]).format('DD.MM.YYYY')}}</p>
            </div>

            <div class="charts">
                <div class="speed-chart-wr chart-wr">
                    <div class="chart-title">
                        Скорость проходки
                    </div>
                    <apexchart class="speed-chart" height="350" :options="speedChart.options" :series="speedChart.series"></apexchart>
                </div>
                <div class="daily-chart-wr chart-wr">
                    <apexchart height="415" :options="dailyChart.options" :series="dailyChart.series"></apexchart>
                </div>
               
            </div>
        </div>
    </VModal>
</template>

<script setup>
    import VModal from "@/components/ui/VModal.vue";
    import { computed, ref } from "vue";

    import moment from "moment";
    
    const stage = ref(null);

    const operation = computed(()=>
        stage.value.stage.type == "well_drilling"?'Бурение':
        stage.value.stage.type == "drill_assembly"?'Монтаж Б/У':
        'Разработка'
    )

//charts
    //speed
        const speedChart = computed(()=>{
            return {
                series: [
                    {name: 'План', data: [2.3]},
                    {name: 'Факт', data: [3.4]},
                ],

                options: {
                    chart: {
                        height: 350,
                        type: 'bar',
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
                    tooltip:{
                        enabled: false
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {position: 'top'}
                        }
                    },
                    stroke: {
                        show: true,
                        width: 5,
                        colors: ['transparent']
                    },
                    dataLabels: {
                        enabled: true,
                        offsetY: -24,
                        style: {
                            colors: ["#304758"],
                            fontWeight: '400',
                            fontSize: '14px'
                        }
                    },
                    xaxis: {
                        categories: [""],
                        position: 'top',
                        axisBorder: {
                            show: false
                        },
                        axisTicks: {
                            show: false
                        },
                        tooltip: {
                            enabled: true,
                        }
                    }
                }
            }
        })

    //daily
        const dailyChart = computed(()=>{
            return {
                series: [
                    {name: 'План', data: [0, 1000, 1050, 1200, 1250, 1320, 1500, 1800]},
                    {name: 'Факт', data: [0, 910, 1040, 1210, 1220, 1320, 1510, 1900]},
                ],

                options: {
                    chart: {
                        height: 350,
                        type: 'line',

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
                    dataLabels: {
                        enabled: false,
                    },
                    grid: {
                        borderColor: 'var(--bg-border)',
                        xaxis: {
                            lines: {
                                show: true
                            }
                        },  
                    },
                    markers: {
                        size: 5
                    },
                    xaxis: {
                        position: 'top',
                        categories: [0,10,20,30,40,50,60,70],
                    },
                    yaxis: {
                        reversed: true
                    },
                    legend: {
                        show: false
                    }
                }
            }
        })

//call
    const modal = ref(null);

    const call = (stg)=>{
        stage.value = stg;
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
    .content{
        padding: 0 57px 24px;
        // max-width: 500px;

        .info-wr{
            display: flex;
            gap: 8px;
            font-size: 16px;

            h4{
                font-weight: 600;
            }
        }
    }

    .speed-chart-wr{
        width: 140px;
    }
    
    .daily-chart-wr{
        width: 700px;
    }

    .charts{
        display: flex;
        min-width: 0;
        gap: 25px;
        margin-top: 25px;
    }

    .chart-wr{
        border: 1px solid var(--bg-border);

        .chart-title{
            font-size: 20px;
            padding: 12px 14px 0;
            text-align: center;
            color: var(--typo-secondary);
        }
    }
</style>