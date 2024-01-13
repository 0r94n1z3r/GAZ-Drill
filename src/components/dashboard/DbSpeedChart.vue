<template>
    <div class="db-chart">
        <div class="top">
            <h3>Коммерческая стоимость и МСП</h3>
        </div>

        <div class="chart-wr">
            <apexchart height="350" :options="chartOptions" :series="series"></apexchart>
        </div>
    </div>
</template>

<script setup>
    import { computed, ref } from "vue";

    const series = computed(()=> [
        {
            name: "План ПП 1С (БПв4)",
            data: [28, 29, 33, 36, 32, 32, 33]
        },
        {
            name: "Факт/прогноз 1С (2+10)",
            data: [12, 11, 14, 18, 17, 13, 13]
        }
    ])

    const chartOptions =  computed(()=>{return {
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
            },
            markers: {
              size: 5
            },
            xaxis: {
              categories: ['янв.', 'фев.', 'мар.', 'апр.', 'май', 'июн.', 'июл', 'авг'],
            },
            legend: {
              position: 'top',
              horizontalAlign: 'left',
            }
        }});


</script>

<style lang="scss" scoped>

</style>