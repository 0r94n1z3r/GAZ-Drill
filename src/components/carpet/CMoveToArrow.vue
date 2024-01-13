<template>
    <div 
        class="move-arrow"
        :style="{
            height: height+'px',
            top: top+'px',
            left: left+'px',
            width: width+'px',
            '--color': User().settings.move_to_color
        }"

        :rev="arrowInfo.from > arrowInfo.to || null"
    >
        <div class="arr-wr">
            <div class="body"></div>
        </div>
    </div>
</template>

<script setup>
    import Carpet from "@/stores/carpet.js";
    import User from "@/stores/user.js";

    import { computed } from "vue";

    import Moment from 'moment';
    import { extendMoment } from 'moment-range';
    const moment = extendMoment(Moment);

    const props = defineProps({
        groups: Array,
        arrowInfo: Object,
        dpx: Object,
        filters: Object,

        drillsOnly: Boolean
    })

    const isFilterOn = (key)=>Object.entries(props.filters).map(e => e[1]).flat().find(e => e.name == key)?.value
    const isStatuses = computed(()=>props.filters.status.reduce((acc, e) => acc && e.value, true))

    const start = computed(()=>props.arrowInfo.from < props.arrowInfo.to?props.arrowInfo.from:props.arrowInfo.to);
    const end = computed(()=>props.arrowInfo.from > props.arrowInfo.to?props.arrowInfo.from:props.arrowInfo.to);

    let getH = (gr)=>{
        let h = 0

        if(props.drillsOnly){
            h = isStatuses.value?64:41;
        }else{
            h = 
                (9 * 2) //paddings
                + (
                    isFilterOn('filter_drilling_stage')? //drill
                    (22 * (isStatuses.value?2:1)):
                    0 
                )
                + (22 * (gr.displayedRowsLen || 0)) //nodeRows (dev)
                + (isFilterOn('filter_drilling_amount')?(isStatuses.value?40:18):0) //two-weeks

            h = h<59?59:h;
        }

        return h
    }

    const top = computed(()=>
        props.groups
        .slice(0, start.value+1)
        .reduce((acc, e, k)=>{
            let h = getH(e);
                
            if(k == start.value){
                h /= 2;
            }

            return acc + h;
        }, 0)
    )

    const height = computed(()=>{
        return props.groups
            .slice(0, end.value+1)
            .reduce((acc, e, k)=>{
                let h = getH(e);

                if(k == end.value){
                    h /= 2;
                }

                return acc + h;
            }, 0) - top.value
    })

    const left = computed(()=>
        (moment.range(Carpet().timeRange[0], props.arrowInfo.need_date).diff('d'))*props.dpx.display
    )

    const width = computed(()=>
        Math.abs((moment.range(props.arrowInfo.need_date, props.arrowInfo.ready_date).diff('d'))*props.dpx.display)
    )


</script>

<style lang="scss" scoped>
    .move-arrow {
        width: 2px;
        position: absolute;
        pointer-events: none;

        .arr-wr{
            position: relative;
            width: 100%;
            height: 100%;
            @include flex-c;
                
            .body{
                width: 2px;
                min-width: 2px;
                height: 100%;
                background: var(--color);
            }

            &::before, &::after{
                @include pseudo-absolute;
                width: 50%;
                height: 2px;
                background: var(--color);
            }

            &::before{
                left: 0;
                top: 0;
            }

            &::after{
                bottom: 0;
                right: 0;
            }
        }

        &[rev] .arr-wr{
            &::before{
                top: unset;
                bottom: 0;
            }

            &::after{
                bottom: unset;
                top: 0;
            }
        }
    }
</style>