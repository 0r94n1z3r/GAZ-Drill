<template>
    <div class="page"
        @mouseleave="timeShift.stop()" 
        @mouseup="timeShift.stop()" 
        @mousemove="timeShift.shift($event)"
    >
        <div class="loader-wr" v-if="Project.projectExtensionLoading">
            <VLoading/>
        </div>

        <div class="calendar" v-else :style="{'--side-w': scale.side + 'px'}">
            <div class="top content-block">
                <div class="side">
                    <div class="options">
                        <CFilters :filters="filters"/>
                        <VTextInput class="search" v-model="search" placeholder="Поиск">
                            <template #pre>
                                <div class="ico-wr"><ISearch class="ico"/></div>
                            </template>
                            <div class="close" v-if="search" @click="search = ''">
                                <ICross class="ico"/>
                            </div>
                        </VTextInput>
                    </div>
                    <div class="drills-table">
                        <div class="cells">
                            <div class="cell">
                                <p>Название проекта</p>
                            </div>
                        </div>
                        <div class="cells">
                            <div class="cell">
                                <p>Буровая установка / Организация</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="body">
                    <div 
                        class="rubber" 
                    >
                        <div 
                            class="years-wr"
                            :style="{
                                transform: `translateX(${-timelineSelected.shift * 100}%)`,
                                width: `${1/timelineSelected.width * 100}%`
                            }"  
                        >
                            <div 
                                class="year-block" 
                                v-for="(i,k) in datesArray" :key="k"

                                :style="{width: `${i.dy / daysNum * 100}%`}"
                            >
                                <div 
                                    class="year y-block" 
                                    @click="Carpet.setStart(`${i.y}-01-01`); resYear = i.y"
                                >
                                    <p>{{i.y}}</p>
                                </div>
                                <div class="months spacer">
                                    <div 
                                        class="month y-block" 
                                        v-for="(m,n) in i.ms" 
                                        :key="n"

                                        :style="{width: `${m.dm / i.dy * 100}%`}"

                                        @click="Carpet.setStart(`${i.y}-${m.m}-01`); resYear = i.y"
                                    ><p>{{monthCaption(parseInt(m.m)-1)}}</p></div>
                                </div>
                            </div>
                        </div>

                        <CLegend/>
                    </div>
                </div>
            </div>

            <div class="calendar-content content-block">
                <div class="side">
                    <div class="drills-table" v-for="(i,k) in filteredProjects" :key="k">
                        <div class="cells">
                            <div class="cell">
                                <p>{{i.name}}</p>
                            </div>
                        </div>
                        <div class="cells">
                            <div class="cell org-cell" 
                                v-for="(d, dk) in filteredDrills[k]" 
                                :key="dk"
                                :style="{height: '41px', 'min-height': (activeStatuses.length * 23) + 18 + 'px'}"
                            >
                                <p>{{d.name}}</p>
                                <p class='org'>{{Static.extOrganizations.find(e => e.id == d.owner)?.name || '-'}}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="body" ref="body">
                    <div class="rubber"
                        :style="{
                            transform: `translateX(${-timelineSelected.shift * 100}%)`,
                            width: `${1/timelineSelected.width * 100}%`
                        }"
                        ref="contentRubber"
                        @mousedown.self="timeShift.start($event, 'bodyDrag')"
                    >
                        <div class="years-wr">
                            <div 
                                class="year-block" 
                                v-for="(y,k) in datesArray" :key="k"

                                :style="{width: `${y.dy / daysNum * 100}%`}"
                            >
                                <div class="months">
                                    <div 
                                        class="month" 
                                        v-for="(m,n) in y.ms" :key="n"

                                        :style="{width: `${m.dm / y.dy * 100}%`}"
                                    >
                                    </div>
                                </div>
                            </div>
                        </div>
                        

                        <div class="row" 
                            v-for="(i,k) in filteredDrills.flat()" 
                            @mousedown="timeShift.start($event, 'bodyDrag')"
                            :key="k"
                            :style="{'min-height': '41px', height: (activeStatuses.length * 23) + 18 + 'px'}"
                        >
                            <div 
                                class="block" 
                                v-for="(j,f) in parsedDrillStages(i.drill_stages)" 
                                :key="f"

                                :style="{
                                    top: (
                                        filters.status.reduce((acc, e) => acc && e.value, true)?
                                        (j.status == 'fact'?9+22:9):
                                        9
                                    ) + 'px',
                                    left: (moment.range(Carpet.timeRange[0], j.dates[0]).diff('d'))*dpx().display+'px'
                                }"

                                :status="j.status"
                            >
                                <div class="block-content"
                                    :style="{
                                        width: (moment.range(j.dates[0], j.dates[1]).diff('d'))*dpx().display+'px',
                                        background: j.color
                                    }"
                                >
                                    <p>{{j.title}}</p>
                                </div>
                            </div>                            
                        </div>

                        <template v-if="isFilterOn('filter_move_to')">
                            <CMoveToArrow 
                                v-for="(i,k) in moveToArrows" 
                                :key="k" 
                                :groups="filteredDrills.flat()" 
                                :filters="filters" 
                                :dpx="dpx()" 
                                :arrow-info="i"

                                drills-only
                            />
                        </template>

                    </div>
                </div>
            </div>

            <div class="bottom content-block">
                <div class="side"></div>
                <div class="body">
                    <div class="timeline" ref="timeline">
                        <div class="year-block" 
                            v-for="(i,k) in datesArray" 
                            :key="k"
                            
                            :style="{width: `${i.dy / daysNum * 100}%`}"
                        >
                            <div class="months">
                                <div 
                                    class="month" 
                                    v-for="(m,n) in i.ms" 
                                    :key="n"
                                    :style="{width: `${m.dm / i.dy * 100}%`}"
                                ><p>{{m.m}}</p></div>
                            </div>
                            <div class="year"><p>{{i.y}}</p></div>
                        </div>

                        <div 
                            class="range"
                            :style="{left: `${timelineSelected.shift * 100}%`, width: `${timelineSelected.width * 100}%`}"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import ISearch from "@/components/icons/ISearch.vue";
    import IWell from "@/components/icons/IWell.vue";
    import IPlus from "@/components/icons/IPlus.vue";
    import ICross from "@/components/icons/ICross.vue";

    import AddToProjectControls from "@/components/carpet/edit/AddToProjectControls.vue";
    
    import vClickOutside from 'click-outside-vue3/src/v-click-outside';

    import ProjectStore from "@/stores/project.js";
    import CarpetStore from "@/stores/carpet.js";
    import StaticStore from "@/stores/static.js"
    import User from "@/stores/user.js";

    import ProjectItems from "@/script/projectItems.js";

    import { computed, onMounted, reactive, ref } from "vue";

    import CCarpetObject from "@/components/carpet/CCarpetObject.vue";
    import CFilters from "@/components/carpet/CFilters.vue";

    import StageWindow from "@/components/carpet/StageWindow.vue";

    import StageInfoModal from "@/components/carpet/stageModals/StageInfoModal.vue"
    import StageCommentModal from "@/components/carpet/stageModals/StageCommentModal.vue"

    import CLegend from "@/components/carpet/CLegend.vue";

    import CMoveToArrow from "@/components/carpet/CMoveToArrow.vue";

    import Moment from 'moment';
    import { extendMoment } from 'moment-range';
    const moment = extendMoment(Moment);

    const Project = ProjectStore();
    const Carpet = CarpetStore();
    const Static = StaticStore();

    const projects = computed(()=>Project.projects);

    const scale = reactive({
        side: 500,
    })

    onMounted(()=>{
        Project.extendAllProjects();
    })

//search
    const search = ref('');

//filtered
    const filteredProjects = computed(()=>
        projects.value.filter(e =>
            e.name.toUpperCase().includes(search.value.toUpperCase()) ||
            e.drills.some(d => d.name.toUpperCase().includes(search.value.toUpperCase()) && d.drill_stages?.length)
        )
    )

    const filteredDrills = computed(()=>
        filteredProjects.value
        .map(e => {
            let res = e.drills?.filter(d => 
                d.drill_stages?.length &&
                d.name?.toUpperCase().includes(search.value.toUpperCase())
            )||[]
            return res.length?res:[{empty: true, drill_stages: [], name: ''}]
        })
    )

//filters
    const filters = ref({
        status: [
            {name: 'filter_plan', title: 'План', value: true},
            {name: 'filter_fact', title: 'Факт', value: true},
        ],
        blocks: [
            {name: 'filter_move_to', title: 'Переезд БУ', value: true},
        ]
    });

    const isFilterOn = (key)=>Object.entries(filters.value).map(e => e[1]).flat().find(e => e.name == key)?.value

//time
    const monthsArray = computed(() => 
        Array.from(
            moment.range(
                moment(Carpet.timeRange[0]), 
                moment(Carpet.timeRange[1])
            ).by('months')
        ).map(e => {
            return {
                m: e.format('MM'),
                y: e.format('YYYY'),
                dm: e.daysInMonth()
            }
        })
    )

    const datesArray = computed(()=>
        monthsArray.value.reduce((acc, e)=>{
            let y = acc.find(f => f.y == e.y);
            let m = {m: e.m, dm: e.dm};
            if(y){
                y.ms.push(m);
                y.dy += m.dm;
            }else{
                acc.push({y: e.y, dy: m.dm, ms: [m]});
            }
            return acc;
        }, [])
    );

    const daysNum = computed(()=>datesArray.value.reduce((acc,e)=>acc+=e.dy, 0));

    const timelineSelected= computed(()=>{
        return {
            shift: moment.range(
                    moment(Carpet.timeRange[0]), 
                    moment(Carpet.selectedRange[0])
                ).diff('d') / daysNum.value,
            width: moment.range(
                    moment(Carpet.selectedRange[0]), 
                    moment(Carpet.selectedRange[1])
                ).diff('d') / daysNum.value,
        }
    });

    //
        const monthCaption = num =>
            dpx().display < 2?
            ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'][parseInt(num)]:
            dpx().display < 3.6?
            ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'][parseInt(num)]:
            ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'][parseInt(num)]

//parsedDrillStages
    const activeStatuses = computed(()=>filters.value.status.filter(e => e.value).map(e => e.name.replace('filter_', '')));

    const parsedDrillStages = stages=>{
        return stages.filter(e => activeStatuses.value.includes(e.status)).map(stage => {return {
            title: stage.type == "drill_assembly"?"Монтаж Б/У":stage.well_name,
            color: User().settings[`${stage.type}_color`],
            type: 'drill_stages',
            status: stage.status,
            dates: [
                moment(stage.date_start),
                moment(stage.date_end)
            ],
            stage
        }})
    }

//arrows
    onMounted(()=>Project.updateDemoGroups());

    const moveToArrows = computed(()=>{
        let drills = filteredDrills.value.flat();

        let res = 
            Project.demoGroups
            ?.filter(e => e.move_to)
            .map(e => {
                let obj = {
                    from: null,
                    to: null,
                    need_date: e.need_date,
                    ready_date: e.ready_date
                }

                drills.forEach((d,k) => {
                    let wg_ids = d.drill_stages.map(ds => ds.well_group);
                    if(wg_ids.includes(e.id))obj.from = k;
                    if(wg_ids.includes(e.move_to))obj.to = k;
                })

                console.log(obj);

                return obj;
            }).
            filter(e => e.from != null && e.to != null && e.from != e.to)

        return res;
    });

//timeShift
    const body = ref();
    const timeline = ref();

    const dpx = ()=>{//pixels per day
        let timelineWidth = timeline.value?.offsetWidth || 0;

        return {
            timeline: timelineWidth / daysNum.value,
            display: (1 / timelineSelected.value.width) * (timelineWidth / daysNum.value),
        }
    }

    const contentRubber = ref();

    const timeShift = reactive({
        state: false,
        startPoint: null,
        startDate: null,

        cursor: null,

        start(e, state){
            this.state = state;
            window.getSelection()?.removeAllRanges();

            this.startPoint = e.clientX;
            this.startDate = [Carpet.selectedRange[0], Carpet.selectedRange[1]];

            
        },
        stop(){
            this.state = false;
            this.startPoint = null;
            this.startDate = null;
        },
        shift(e){
            if(!this.state)return;
            
            window.getSelection()?.removeAllRanges();
            this.cursor = e;

            // console.log(this.state);

            switch(this.state){
                case 'start': 
                    this.changeStart(
                        this.calculateTimeShift(this.startDate[0])
                    ); 
                break;
                case 'end':
                    this.changeEnd(
                        this.calculateTimeShift(this.startDate[1])
                    ); 
                break;
                case 'move': 
                    this.move(
                        this.calculateTimeShift(this.startDate[0]),
                        this.calculateTimeShift(this.startDate[1])
                    ); 
                break;
                case 'bodyDrag':
                    this.move(
                        this.calculateTimeShift(this.startDate[0], -1),
                        this.calculateTimeShift(this.startDate[1], -1)
                    );  
                break;
            }
        },

        calculateTimeShift(startingDate, k=1){
            return moment(startingDate).add(k*((this.cursor?.clientX||0) - this.startPoint) / dpx().display, 'd')._d
        },

        //window
            changeStart(newDate){
                if(newDate < Carpet.timeRange[0])newDate = Carpet.timeRange[0];

                if(
                    (
                        newDate > Carpet.selectedRange[0] &&
                        moment.range(
                            Carpet.selectedRange[0],
                            Carpet.selectedRange[1]
                        ).diff('d') < 20
                    )
                )return false;

                Carpet.selectedRange[0] = moment(newDate);
            },
            changeEnd(newDate){

                if(newDate > Carpet.timeRange[1]){newDate = Carpet.timeRange[1]._d;}

                if(
                    (
                        newDate < Carpet.selectedRange[1] &&
                        moment.range(
                            Carpet.selectedRange[0],
                            Carpet.selectedRange[1]
                        ).diff('d') < 20
                    )
                )return false;

                Carpet.selectedRange[1] = moment(newDate);
            },
            move(newStart, newEnd){
                if(
                    newStart < Carpet.timeRange[0] ||
                    newEnd > Carpet.timeRange[1]
                )return false;

                this.changeStart(newStart);
                this.changeEnd(newEnd);
            },
    });
</script>

<style lang="scss" scoped>
    .page{
        padding: 0!important;
        @include flex-col;
    }

    .loader-wr{
        width: 100%;
        height: 100%;

        @include flex-c;

        flex-grow: 1;
    }

    .calendar{
        flex-grow: 1;
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

    .side{
        .options{
            display: flex;

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
    }

    .calendar{
        width: 100%;
        border: 1px solid var(--bg-border);
        @include flex-col;

        .content-block{
            display: flex;
            width: 100%;
        }

        .side{
            border-right: 1px solid var(--bg-border);
            width: var(--side-w);
            flex-shrink: 0;
        }

        .body{
            width: 100%;
            overflow: hidden;
        }

        .table{
            width: 344px;
            flex-shrink: 0;

            .cells{
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                background: var(--bg-border);
                gap: 1px;
                height: 100%;
                width: 100%;
                color: var(--typo-control-ghost);
            }

            .cell{
                @include flex-c;
                text-align: center;

                &[fail]{background: #ffb6b6!important;}
                &[success]{background: #94df94!important;}
            }
        }
        
        .top{
            position: sticky;
            top: 0;
            left: 0;
            background: var(--bg-default);
            z-index: 1;
            

            .search, .spacer, .year{
                height: 32px;
            }

            .spacer{
                background: var(--bg-ghost);
                border-top: 1px solid var(--bg-border);
            }

            .drills-table{
                border-top: 1px solid var(--bg-border);
            }

            .body{
                overflow: visible;
                position: relative;
                min-width: 0;

                .rubber {
                    overflow: hidden;
                }
            }

            .years-wr{
                display: flex;
            }

            .year-block{
                flex-shrink: 0;
                width: min-content;
                cursor: pointer;

                .year{
                    @include flex-c;
                    padding: 0 3px;
                    border-right: 1px solid var(--bg-border);

                    p{
                        @include text-overflow;
                    }
                }

                .months{
                    display: flex;

                    .month{
                        @include flex-c;
                        padding: 0 3px;
                        border-right: 1px solid var(--bg-border);

                        p{
                            @include text-overflow;
                        }
                    }
                }

                .y-block{
                    position: relative;

                    &::after{
                        @include pseudo-absolute;
                        height: 100%;
                        width: 100%;
                        top: 0;
                        left: 0;
                        border: 1px solid var(--bg-border-focus);
                        transition: .3s;
                    }

                    &:not(:hover)::after{
                        opacity: 0;
                    }
                }
            }

            .table{
                height: 64px;
                border-left: 1px solid var(--bg-border);
                @include flex-col;
                border-bottom: 1px solid var(--bg-border);

                .table-top{
                    height: 13px;
                    font-size: 10px;
                    border-bottom: 1px solid var(--bg-border);
                    flex-shrink: 0;
                }

                .cells{

                    .cell{
                        background: #fff;
                        overflow: hidden;
                        font-size: 9px;
                        height: 100%;
                    }

                    .cell-2{
                        grid-column: span 2;
                        flex-direction: column;

                        .cells{
                            height: 20px;
                            flex-shrink: 0;
                            border-top: 1px solid var(--bg-border);
                            grid-template-columns: repeat(2, 1fr);
                        }
                    }
                }
            }
        }

        .org-cell{
            flex-direction: column;

            p{
                width: 100%;

                &.org{
                    font-size: 12px;
                    color: var(--typo-control-ghost);
                }
            }
        }

        .calendar-content{
            // height: 100%;
            flex-grow: 1;

            .body{
                @include grab;
                position: relative;

                .rubber{
                    height: 100%;
                }

                .years-wr{
                    width: 100%;
                    display: flex;
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    pointer-events: none;

                    .months{
                        display: flex;
                        height: 100%;

                        .month{
                            border-right: 1px solid var(--bg-border);
                            height: 100%;
                        }
                    }
                }
                

                .row{
                    position: relative;
                    border-bottom: 1px solid var(--bg-border);

                    :deep(.obj-wr){
                        border-bottom: 0;
                    }

                    &[loading]{
                        opacity: .3;
                        pointer-events: none;
                    }

                    .block{
                        position: absolute;
                        top: 8px;
                        margin: auto;
                        height: 23px;
                        border: 1px solid #000;
                        cursor: default;

                        &[movable]{
                            &:active{
                                cursor: ew-resize;
                            }
                        }

                        &-content{
                            padding: 0 4px;
                            @include flex-col;
                            justify-content: center;
                            height: 100%;
                            font-size: 16px;
                            text-align: center;
                            position: relative;
                            
                            *{
                                @include text-overflow;
                            }

                            .floaty{
                                position: absolute;
                                height: 50px;
                                left: -2px;
                                width: calc(100% + 4px);
                                z-index: 5;
                                cursor: move;

                                &-top{
                                    bottom: 100%;
                                }

                                &-bottom{
                                    top: 100%;
                                }
                            }

                            .expander{
                                position: absolute;
                                height: 100%;
                                width: 5px;
                                max-width: 33.3333%;
                                min-width: 2px;
                                z-index: 5;
                                cursor: col-resize;
                                top: 0;

                                &-left{
                                    left: 0;
                                }

                                &-right{
                                    right: 0;
                                }
                            }
                        }

                        &[floaty]{
                            position: fixed;
                            z-index: 1000;
                            opacity: .5;
                            pointer-events: none;
                        }

                        &[status="fact"]{
                            .block-content{
                                position: relative;

                                &::after{
                                    @include pseudo-absolute;
                                    position: absolute;
                                    height: 100%;
                                    width: 100%;
                                    top: 0;
                                    left: 0;
                                    background: url(/img/pattern.svg);
                                    opacity: .5;
                                }
                            }
                        }
                    }
                }
            }

            .table{
                position: relative;
                background: var(--bg-secondary);

                .cols{
                    position: absolute;
                    height: 100%;
                    width: 100%;
                    left: 0;
                    top: 0;
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    pointer-events: none;

                    .col{
                        border-left: 1px solid var(--bg-border);
                    }
                }

                .table-item{
                    position: relative;

                    .cells{
                        position: absolute;
                        left: 0;
                        top: 0;
                        gap: 0;

                        .cell{
                            background: var(--bg-secondary);
                            flex-wrap: wrap;
                            font-size: 12px;
                            border-bottom: 1px solid var(--bg-border);
                            padding: 4px;
                        }
                    }
                }
            }
        }

        .bottom{
            position: sticky;
            left: 0;
            bottom: 0;
            flex-shrink: 0;
            background: var(--bg-default);

            .row{
                height: 21px;
                border-top: 1px solid var(--bg-border);
                @include text-overflow;
                font-size: 12px;
                padding: 0 10px;
                color: var(--typo-control-ghost);

                &:nth-child(2n){
                    background: var(--bg-secondary);
                }
            }

            .body{
                position: relative;

                .row{
                    position: relative;
                    
                    .years-wr{
                        width: 100%;
                        display: flex;
                        position: absolute;
                        top: 0;
                        left: 0;
                        height: 100%;

                        .months{
                            display: flex;
                            height: 100%;

                            .month{
                                border-right: 1px solid var(--bg-border);
                                height: 100%;
                                @include flex-c;

                                p{
                                    @include text-overflow;
                                }
                            }
                        }
                    }

                    

                    .block{
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        margin: auto;
                        height: calc(100% - 20px);

                        &-content{
                            background: lightblue;
                            border-radius: 4px;
                            padding: 0 4px;
                            @include flex-col;
                            justify-content: center;
                            height: 100%;
                            
                            *{
                                @include text-overflow;
                            }
                        }
                    }
                }

                .timeline{
                    width: 100%;
                    display: flex;
                    position: relative;
                    user-select: none;
                    position: absolute;
                    bottom: 0;
                    @include hidden(0);
                    
                    .year-block{
                        width: 100%;
                        
                        .months{
                            height: 50%;
                            display: flex;
                            width: 100%;

                            .month{
                                width: 100%;
                                padding: 1px 3px;
                                &:not(:last-child){
                                    border-right: 1px solid var(--bg-border);
                                }
                            }
                        }

                        .year{
                            height: 16px;
                            padding: 3px;
                            display: flex;
                            align-items: end;
                        }

                        &:not(:last-child){
                            border-right: 1px solid var(--bg-border);
                        }

                        p{
                            font-size: 10px;
                            color: var(--typo-secondary);
                        }
                    }

                    .range{
                        position: absolute;
                        top: 0;
                        height: 100%;
                        @include flex-jtf;
                        background: var(--bg-ghost);

                        @include grab;


                        .border{
                            width: 4px;
                            height: 100%;
                            &:first-child{
                                border-left: 1px solid var(--bg-border-focus);
                            }
                            &:last-child{
                                border-right: 1px solid var(--bg-border-focus);
                            }
                            cursor: col-resize;
                        }
                    }
                }
            }

            .table{
                border-left: 1px solid var(--bg-border);
                border-top: 1px solid var(--bg-border);

                .table-item{
                    position: relative;
                    height: 100%;

                    .cells{
                        .cell{
                            background: var(--bg-secondary);
                            flex-wrap: wrap;
                            font-size: 12px;
                            border-bottom: 1px solid var(--bg-border);
                            padding: 4px;
                        }
                    }

                    &:last-child{
                        .cells .cell{
                            border-bottom: 0;
                        }
                    }
                }
            }
        }



        .drills-table{
            display: flex;

            .cells{
                width: 100%;
                @include flex-col;
                min-width: 0;

                &:first-child{
                    width: 155px;
                    flex-shrink: 0;
                }

                &:not(:last-child){
                    border-right: 1px solid var(--bg-border);
                }

                .cell{
                    @include flex-c;
                    height: 100%;
                    min-height: 30px;
                    padding: 0 8px;
                    border-bottom: 1px solid var(--bg-border);

                    p{
                        @include text-overflow;
                    }
                }
            }
        }
    }

    .legend{
        position: absolute;
        right: 0;
        top: 0;
    }
</style>