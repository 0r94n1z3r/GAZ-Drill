<template>
    <div class="db-chart">
        <div class="top">
            <h3>Динамика НПВ по классам, доля %</h3>
        </div>

        <div class="chart-wr">
            <apexchart height="350" :options="chartOptions" :series="series"></apexchart>
        </div>
    </div>
</template>

<script setup>
    import { computed, ref } from "vue";

    const series = computed(()=>[
        {
            name: 'Браки',
            data: [44, 55, 41, 67, 22, 43, 21, 49]
        }, 
        {
            name: 'Инциденты',
            data: [13, 23, 20, 8, 13, 27, 33, 12]
        }, 
        {
            name: 'Осложнения',
            data: [11, 17, 15, 15, 21, 14, 15, 13]
        }
    ])

    const chartOptions =  computed(()=>{return {
        chart: {
            type: 'bar',
            stacked: true,
            stackType: '100%',
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
        responsive: [{
            breakpoint: 480,
            options: {
            legend: {
                position: 'bottom',
                offsetX: -10,
                offsetY: 0
            }
            }
        }],
        xaxis: {
            categories: ['янв.', 'фев.', 'мар.', 'апр.', 'май', 'июн.', 'июл', 'авг'],
        },
        fill: {
            opacity: 1
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
        },
    }});


</script>

<style lang="scss" scoped>

</style>