import { defineStore } from 'pinia';
import { ref, computed, reactive, onMounted, watch } from "vue";

import ProjectStore from "@/stores/project.js";

import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

export default defineStore("Carpet", ()=>{
    const Project = ProjectStore();

    const selectedRange = ref([null, null]);
    
    const timeRange = computed(()=>{
        let noDate = [moment().startOf('year'), moment().endOf('year')];

        if(Project.activeProject && !Project.activeProject?.well_groups)return noDate;

        let stages = [];

        if(!Project.activeProject){
            if(!Project.projects?.[0]?.drills)return noDate;
            stages = Project.projects.map(e => e.drills)?.flat()?.map(e => e?.drill_stages)?.flat() || [];
        }else{
            stages = [
                ...Project.activeProject.well_groups.map(e => e.drill_stages).flat(),
                ...Project.activeProject.well_groups.map(e => e.development_stages).flat(),
            ]
        }

        if(!stages.length){
            return noDate;
        }

        let dates = stages
        .filter(e => e)
        .map(e => [new Date(e.date_start), new Date(e.date_end)])
        .flat();

        if(!dates.length)dates = [moment().subtract(1, 'year').startOf('month'), moment().endOf('month')]

        let range = [
            moment(Math.min(...dates)).subtract(1, 'month').startOf('month'), 
            moment(Math.max(...dates)).add(1, 'month').endOf('month')
        ]

        range = [
            range[0].format('MM') == '12'?range[0]:range[0].startOf('year'),
            range[1].format('MM') == '01'?range[1]:range[1].endOf('year')
        ]

        if(selectedRange.value[0] == null){
            setStart(moment().format('YYYY-01-01'));
        }

        if(selectedRange.value[0]._d > range[1]._d || selectedRange.value[1]._d < range[0]._d){
            selectedRange.value = [moment(range[1]).subtract((activeMode.value.months || 12)-1, 'months').startOf('month'), moment(range[1]).endOf('month')]
        }

        if(selectedRange.value[0] < range[0])range[0] = selectedRange.value[0];
        if(selectedRange.value[1] > range[1])range[1] = selectedRange.value[1];

        // console.log(
        //     range[0]?.format?.('DD.MM.YYYY'),
        //     range[1]?.format?.('DD.MM.YYYY'),
        //     selectedRange.value[0]?.format?.('DD.MM.YYYY'),
        //     selectedRange.value[1]?.format?.('DD.MM.YYYY')
        // )

        return range;
    })

//mode
    const timeModes = ref([
        {title: 'Год', months: 12, days: 365, active: true},
        {title: 'Квартал', months: 3, days: 92},
        {title: 'Месяц', months: 1, days: 31},
    ]);

    const activeMode = computed(()=>timeModes.value.find(e => e.active));

    watch(()=>activeMode.value.days, n => {
        selectedRange.value[0] = moment().subtract(n/2, 'days');
        selectedRange.value[1] = moment(selectedRange.value[0]).add(n, 'days');
    });

//setStart
    const setStart = (date) => {
        selectedRange.value = [
            moment(date).startOf('month'),
            moment(date).add(activeMode.value.months-1, 'months').endOf('month')
        ]
    }

    watch(()=>Project.activeProject, ()=>setStart(moment().format('YYYY-01-01')));
    onMounted(()=>setStart(moment().format('YYYY-01-01')))

//edit
    const isEdit = ref(false);

//----------------------------------------------------------------
    return {
        selectedRange,
        timeRange,
        timeModes,
        setStart,

        isEdit
    }
})