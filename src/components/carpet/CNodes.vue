<template>
    <div class="calendar" :style="{'--side-w': scale.side + 'px'}">
        <div class="top content-block">
            <div class="side">
                <div class="options">
                    <AddToProjectControls class="option" :disabled="!isEdit || null"/>
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
                <div class="spacer"></div>
            </div>
            <div class="body">
                <div class="rubber">
                <!-- @mousedown="timeShift.start($event, 'bodyDrag')" -->
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
            <div class="table">
                <div class="table-top cell">
                    План/Факт ({{resYear}})
                    {{isFilterOn('use_current_date')?`по состоянию на ${moment().format('DD.MM.YYYY')}`:''}}
                </div>
                <div class="cells">
                    <div class="cell">Суммарная<br>проходка</div>
                    <div class="cell">Сутки<br>строи-ства</div>
                    <div class="cell cell-2">
                        <div class="cell">
                            Законченные<br>бурением
                        </div>
                        <div class="cells">
                            <div class="cell">Скважины</div>
                            <div class="cell">Сутки</div>
                        </div>
                    </div>
                    <div class="cell cell-2">
                        <div class="cell">
                            Законченные<br>строительством 
                        </div>
                        <div class="cells">
                            <div class="cell">Скважины</div>
                            <div class="cell">Сутки</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="calendar-content content-block">
            <div class="side">
                <CCarpetObject v-for="(i,k) in filteredGroups" :filters="filters" :disabled="!isEdit || null" :loading="i.loading || null" :key="k" :info="i" :node-rows="i.displayedRowsLen" :w="scale.side"/>
            </div>
            <div class="body" ref="body">
                <div class="rubber"
                    :style="{
                        transform: `translateX(${-timelineSelected.shift * 100}%)`,
                        width: `${1/timelineSelected.width * 100}%`
                    }"
                    @mousedown.self="timeShift.start($event, 'bodyDrag')"
                    ref="contentRubber"
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
                        v-for="(i,k) in filteredGroups" 
                        :key="k"
                        @mousedown="timeShift.start($event, 'bodyDrag')"
                        @mouseup.stop="timeShift.blockRelease($event, i)"
                        :loading="i.loading || null"
                    >
                        <CCarpetObject ghost :filters="filters" :disabled="!isEdit || null" :info="i" :node-rows="i.displayedRowsLen" :w="scale.side" bump/>

                        <!-- fortnights -->
                            <div 
                                class="fortnights-wr" 
                                v-show="isFilterOn('filter_drilling_amount') && isFilterOn('filter_plan')"
                                :style="{bottom: (!isFilterOn('filter_fact')?2:20)+'px'}"
                            >
                                <div class="y-wr"
                                    v-for="(y,yk) in datesArray" :key="yk"
                                    :style="{width: `${y.dy / daysNum * 100}%`}" 
                                >
                                    <div 
                                        class="fortnights" 
                                        v-for="(m,n) in y.ms" :key="n"
                                        :style="{width: `${m.dm / y.dy * 100}%`}"
                                    >
                                        <div class="fortnight">
                                            <FortnightInput
                                                :group="i"
                                                :year="y.y"
                                                :month="m.m"
                                                :half="1"
                                                :status="'plan'"
                                                :readonly="!isEdit"
                                            />
                                        </div>
                                        <div class="fortnight">
                                            <FortnightInput
                                                :group="i"
                                                :year="y.y"
                                                :month="m.m"
                                                :half="2"
                                                :status="'plan'"
                                                :readonly="!isEdit"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div 
                                class="fortnights-wr" 
                                v-show="isFilterOn('filter_drilling_amount') && isFilterOn('filter_fact')"
                            >
                                <div class="y-wr"
                                    v-for="(y,yk) in datesArray" :key="yk"
                                    :style="{width: `${y.dy / daysNum * 100}%`}" 
                                >
                                    <div 
                                        class="fortnights" 
                                        v-for="(m,n) in y.ms" :key="n"
                                        :style="{width: `${m.dm / y.dy * 100}%`}"
                                    >
                                        <div class="fortnight">
                                            <FortnightInput
                                                :group="i"
                                                :year="y.y"
                                                :month="m.m"
                                                :half="1"
                                                :status="'fact'"
                                                :readonly="!isEdit"
                                            />
                                        </div>
                                        <div class="fortnight">
                                            <FortnightInput
                                                :group="i"
                                                :year="y.y"
                                                :month="m.m"
                                                :half="2"
                                                :status="'fact'"
                                                :readonly="!isEdit"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        <!-- drill -->
                            <div 
                                class="block" 
                                :movable="isEdit || null"

                                v-for="(j,f) in parsedDrillStages(i)" 
                                :key="f"

                                :style="Object.assign(
                                    {
                                        top: (
                                            filters.status.reduce((acc, e) => acc && e.value, true)?
                                            (j.status == 'fact'?8+22:8):
                                            8
                                        ) + 'px',
                                        left: (moment.range(Carpet.timeRange[0], j.dates[0]).diff('d'))*dpx().display+'px'
                                    },
                                    j.stage.floaty?{
                                        top: j.stage.floaty?.top + 'px',
                                        left: j.stage.floaty?.left + 'px'
                                    }:{}
                                )"

                                :floaty="j.stage.floaty || null"
                                :status="j.status"
                                
                                @mousedown.left.stop="(e)=>{
                                    if(!isEdit){
                                        timeShift.start(e, 'bodyDrag');
                                        return;
                                    }
                                    timeShift.start(
                                        e, 
                                        'blockDrag', 
                                        {
                                            block: j,
                                            row: i,
                                            stageKey: 'drill_stages',
                                        }
                                    )
                                }"
                                @contextmenu.prevent="e => callStageInfoWindow(e, j)"

                                
                            >
                                <div class="block-content"
                                    :style="{
                                        width: (moment.range(j.dates[0], j.dates[1]).diff('d'))*dpx().display+'px',
                                        background: j.color
                                    }"
                                >
                                    <p>{{j.title}}</p>
                                    <div 
                                        v-if="isEdit"
                                        class="expander expander-left"
                                        @mousedown.stop="timeShift.start(
                                            $event, 
                                            'blockExpand', 
                                            {
                                                block: j,
                                                row: i,
                                                stageKey: 'drill_stages',
                                                side: 'start',
                                            }
                                        )"
                                    ></div>
                                    <div 
                                        v-if="isEdit"
                                        class="expander expander-right"
                                        @mousedown.stop="timeShift.start(
                                            $event, 
                                            'blockExpand', 
                                            {
                                                block: j,
                                                row: i,
                                                stageKey: 'drill_stages',
                                                side: 'end',
                                            }
                                        )"
                                    ></div>
                                    <div v-if="j.stage.preFloaty" class="floaty floaty-top" @mouseenter="timeShift.startBlockFloating()"></div>
                                    <div v-if="j.stage.preFloaty" class="floaty floaty-bottom" @mouseenter="timeShift.startBlockFloating()"></div>
                                    
                                    <div v-if="j.stage.preFloaty || j.stage.expanding" class="date-shower date-shower-start">{{moment(j.dates[0]).format('DD.MM.YYYY')}}</div>                                
                                    <div v-if="j.stage.preFloaty || j.stage.expanding" class="date-shower date-shower-end">{{moment(j.dates[1]).format('DD.MM.YYYY')}}</div>                                
                                </div>
                            </div>

                        <!-- dev -->
                            <div 
                                class="block" 
                                :movable="isEdit || null"
                                v-for="(j,f) in parsedDevStages(i)" 
                                :key="f"
                                :style="Object.assign(
                                    {
                                        top: 8 + 22*((isFilterOn('filter_drilling_stage') ? (filters.status.reduce((acc, e) => acc && e.value, true)?2:1) : 0) + j.lvl) + 'px',
                                        left: (moment.range(Carpet.timeRange[0], j.dates[0]).diff('d'))*dpx().display+'px'
                                    },
                                    j.stage.floaty?{
                                        top: j.stage.floaty?.top + 'px',
                                        left: j.stage.floaty?.left + 'px'
                                    }:{}
                                )"

                                :floaty="j.stage.floaty || null"
                                :status="j.status"

                                @mousedown.left.stop="(e)=>{
                                    if(!isEdit){
                                        timeShift.start(e, 'bodyDrag');
                                        return;
                                    }
                                    timeShift.start(
                                        e, 
                                        'blockDrag', 
                                        {
                                            block: j,
                                            row: i,
                                            stageKey: 'development_stages',
                                            collision: false
                                        }
                                    )
                                }"
                                @contextmenu.prevent="e => callStageInfoWindow(e, j)"
                                
                            >
                                <div class="block-content" 
                                    :style="{
                                        width: (moment.range(j.dates[0], j.dates[1]).diff('d'))*dpx().display+'px',
                                        background: j.color
                                    }"
                                >
                                    <p>{{j.title}}</p>
                                    <div 
                                        v-if="isEdit"
                                        class="expander expander-left"
                                        @mousedown.stop="timeShift.start(
                                            $event, 
                                            'blockExpand', 
                                            {
                                                block: j,
                                                row: i,
                                                stageKey: 'development_stages',
                                                side: 'start',
                                                collision: false
                                            }
                                        )"
                                    ></div>
                                    <div 
                                        v-if="isEdit"
                                        class="expander expander-right"
                                        @mousedown.stop="timeShift.start(
                                            $event, 
                                            'blockExpand', 
                                            {
                                                block: j,
                                                row: i,
                                                stageKey: 'development_stages',
                                                side: 'end',
                                                collision: false
                                            }
                                        )"
                                    ></div>
                                    <div v-if="j.stage.preFloaty" class="floaty floaty-top" @mouseenter="timeShift.startBlockFloating()"></div>
                                    <div v-if="j.stage.preFloaty" class="floaty floaty-bottom" @mouseenter="timeShift.startBlockFloating()"></div>
                                </div>
                            </div>                            
                    </div>

                    <template v-if="isFilterOn('filter_move_to')">
                        <CMoveToArrow 
                            v-for="(i,k) in moveToArrows" 
                            :key="k" 
                            :groups="filteredGroups" 
                            :filters="filters" 
                            :dpx="dpx()" 
                            :arrow-info="i"
                        />
                    </template>
                    

                    <div class="today"
                        :style="{left: (moment.range(Carpet.timeRange[0], moment()).diff('d'))*dpx().display+'px'}"
                    ></div>
                </div>
            </div>
            <div class="table">
                <div class="table-item" v-for="(i,k) in filteredGroups" :key="k">
                    <CCarpetObject ghost :filters="filters" :disabled="!isEdit || null" :info="i" :key="k" :node-rows="i.displayedRowsLen" :w="scale.side"/>
                    <div class="cells">
                        <div class="cell" 
                            v-for="(res,j) in groupsResult[i.id]" 
                            :key="j" 
                            
                            :fail="res.k*res.plan > res.k*res.fact && res.plan != null || null" 
                            :success="res.k*res.plan < res.k*res.fact && res.plan != null || null"
                        >
                            <p>
                                <span>{{res.plan}}</span> 
                                {{res.plan != null?`/`:''}}
                                <span>{{res.fact}}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="cols">
                    <div class="col" v-for="i in 6" :key="i"></div>
                </div>
            </div>
        </div>
        <div class="bottom content-block">
            <!-- <div class="side">
                <div class="row">Проходка м (месяц)</div>
                <div class="row">Проходка м (нарастающая)</div>
                <div class="row">Закончены бурением/строит-вом (месяц)</div>
                <div class="row">Закончены бурением/строит-вом (год)</div>
            </div> -->
            <div class="side">
                <div class="row">Проходка</div>
                <div class="row">Проходка (нарастающая)</div>
                <div class="row">Закончены бурением (План/Факт)</div>
                <div class="row">Закончены бурением (План/Факт) (нарастающая)</div>
                <div class="row">Закончены строит-вом (План/Факт)</div>
                <div class="row">Закончены строит-вом (План/Факт) (нарастающая)</div>
            </div>
            <div class="body">
                <div class="rubber"
                    :style="{
                        transform: `translateX(${-timelineSelected.shift * 100}%)`,
                        width: `${1/timelineSelected.width * 100}%`
                    }"
                >
                    <div class="row" 
                        v-for="(r,key) in monthsResult" :key="key"
                    >
                        <div class="years-wr">
                            <div 
                                class="year-block" 
                                v-for="(i,k) in r" :key="k"

                                :style="{width: `${i.dy / daysNum * 100}%`}"
                            >
                                <div class="months">
                                    <div 
                                        class="month cell" 
                                        v-for="(m,n) in i.ms" 
                                        :key="n"

                                        :style="{width: `${m.dm / i.dy * 100}%`}"
                                    >
                                        <p>
                                            <span>{{(key.endsWith('_acc')?m.accValue:m.value).plan}}</span> 
                                            {{(key.endsWith('_acc')?m.accValue:m.value).plan != null?`/`:''}}
                                            <span>{{(key.endsWith('_acc')?m.accValue:m.value).fact}}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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
                        @mousedown.self="timeShift.start($event, 'move')"
                    >
                        <div class="border"
                            @mousedown="timeShift.start($event, 'start')"
                        ></div>
                        <div class="border"
                            @mousedown="timeShift.start($event, 'end')"
                        ></div>
                    </div>
                </div>
            </div>
            <div class="table">
                <div class="table-item">
                    <div class="cells">
                        <div 
                            class="cell" v-for="(res,j) in yearResult" 
                            :key="j" 
                            :fail="res.k*res.plan > res.k*res.fact && res.plan != null || null" 
                            :success="res.k*res.plan < res.k*res.fact && res.plan != null || null"
                        >
                            <p>
                                <span>{{res.plan}}</span> 
                                {{res.plan != null?`/`:''}}
                                <span>{{res.fact}}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <template v-if="groups?.length">
            <StageWindow ref="stageWindow" @action="callStageModal"/>

            <StageInfoModal :ref="e => stageModals.info = e"/>
            <StageCommentModal :ref="e => stageModals.comment = e"/>
        </template>
        

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
    import User from "@/stores/user.js";

    import ProjectItems from "@/script/projectItems.js";

    import { computed, onMounted, reactive, ref } from "vue";

    import CCarpetObject from "@/components/carpet/CCarpetObject.vue";
    import CFilters from "@/components/carpet/CFilters.vue";

    import StageWindow from "@/components/carpet/StageWindow.vue";

    import StageInfoModal from "@/components/carpet/stageModals/StageInfoModal.vue"
    import StageCommentModal from "@/components/carpet/stageModals/StageCommentModal.vue"

    import FortnightInput from "@/components/carpet/FortnightInput.vue";

    import CLegend from "@/components/carpet/CLegend.vue";

    import CMoveToArrow from "@/components/carpet/CMoveToArrow.vue";

    import Moment from 'moment';
    import { extendMoment } from 'moment-range';
    const moment = extendMoment(Moment);

    const props = defineProps({
        unitView: Object,
        scale: Object,
    })

    const Project = ProjectStore();
    const Carpet = CarpetStore();

    const groups = computed(()=>Project.activeProject?.well_groups);
    const project = computed(()=>Project.activeProject);

//search
    const search = ref('');

    const filteredGroups = computed(()=>
        groups.value
        ?.filter(e => 
            (e.name.toUpperCase()).includes(search.value.toUpperCase()) ||
            (Project.getDrill(e.drill)?.name.toUpperCase()).includes(search.value.toUpperCase())
        ) 
        || []
    )

//edit
    const isEdit = computed(()=>Carpet.isEdit);

//filters
    const filters = ref({
        status: [
            {name: 'filter_plan', title: 'План', value: true},
            {name: 'filter_fact', title: 'Факт', value: true},
        ],
        blocks: [
            {name: 'filter_drilling_stage', title: 'Бурение', value: true},
            {name: 'filter_development_stage', title: 'Освоение', value: true},
            {name: 'filter_drilling_amount', title: 'Проходка', value: true},
            {name: 'filter_move_to', title: 'Переезд БУ', value: true},
        ],
        use_current_date: [
            {name: 'use_current_date', title: 'Результаты от текущей даты', value: true}
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

//parsedStages
    const activeStatuses = computed(()=>filters.value.status.filter(e => e.value).map(e => e.name.replace('filter_', '')));

    const parsedDrillStages = group=>{
        if(!isFilterOn('filter_drilling_stage'))return [];

        return group.drill_stages.filter(e => activeStatuses.value.includes(e.status)).map(stage => {return {
            title: stage.type == "drill_assembly"?"Монтаж Б/У":group.wells.find(e => e.id == stage.well)?.name,
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

    const parsedDevStages = group=>{
        if(!isFilterOn('filter_development_stage')){
            group.displayedRowsLen = 0;
            return [];
        }

        let arr = group.development_stages.filter(e => activeStatuses.value.includes(e.status)).map(stage => {return {
            title: group.wells.find(e => e.id == stage.well).name,
            color: User().settings['well_development_color'],
            type: 'development_stages',
            status: stage.status,
            dates: [
                moment(stage.date_start),
                moment(stage.date_end)
            ],
            stage
        }})

        if(!arr.length)return[];

        const srt = (a,b)=>{
            let A = a.dates[0]._d;
            let B = b.dates[0]._d;

            if ( A < B ) return -1;
            if ( A > B ) return 1;
            return 0;
        };

        let pf = {
            plan: arr.filter(s => s.status == 'plan').sort(srt),
            fact: arr.filter(s => s.status == 'fact').sort(srt),
        }

        let res = [
            [Object.assign(pf.plan.length?pf.plan[0]:pf.fact[0], {lvl: 0})]
        ];

        const pushStage = (n, stage)=>{
            if(!res[n]){
                res[n] = [Object.assign(stage, {lvl: n})];
                return;
            }
            
            if(
                res[n][res[n].length-1].dates[1]._d > stage.dates[0]._d
            ){
                pushStage(n+1, stage);
                return;
            }

            res[n].push(Object.assign(stage, {lvl: n}));
        }

        (pf.plan.length?pf.plan:pf.fact).slice(1).forEach(e => pushStage(0, e));

        let fact_start = res.length;
        if(pf.plan.length)pf.fact.forEach(e => pushStage(fact_start, e));

        group.displayedRowsLen = res.length;

        res.flat();

        return arr;
    }

//arrows
    const moveToArrows = computed(()=>{
        let gr_ids = filteredGroups.value?.map(e => e.id);
        let gr = filteredGroups.value
        ?.filter(e => e.move_to && gr_ids.includes(e.move_to))
        .map(e => {
            return {
                id: e.id,
                from: gr_ids.indexOf(e.id),
                to: gr_ids.indexOf(e.move_to),
                need_date: e.need_date,
                ready_date: e.ready_date
            }
        })

        return gr;
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

        start(e, state, extra){
            this.state = state;
            window.getSelection()?.removeAllRanges();

            this.startPoint = e.clientX;
            this.startDate = [Carpet.selectedRange[0], Carpet.selectedRange[1]];
            
            if(extra?.block){
                this.block = extra.block;
                this.backupBlock = JSON.parse(JSON.stringify((extra.block)));
            }

            this.stageKey = extra?.stageKey;

            if(extra?.row){
                this.row = extra.row;
                this.backupStages = {
                    [this.stageKey]: JSON.parse(JSON.stringify((this.row[this.stageKey]))),
                }
            }

            this.side = extra?.side;
            this.collision = extra?.collision == null?true:extra?.collision;
        },
        stop(){
            this.state = false;
            this.startPoint = null;
            this.startDate = null;

            if(this.block){
                delete this.block?.stage?.preFloaty;
                delete this.block?.stage?.floaty;
            }

            this.block = null;
            this.backupBlock = null;
            this.row = null;
            this.backupStages = null;
        },
        shift(e){
            if(!this.state)return;
            
            window.getSelection()?.removeAllRanges();
            this.cursor = e;

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
                case 'blockDrag':
                    this.blockMoveHandler();
                break;
                case 'blockExpand':
                    this.blockExpansionHandler();
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
        
        //block
            block: null,
            backupBlock: null,

            row: null,
            backupStages: null,

            floatyShift: 0, 

            side: null,

            stageKey: null,
            collision: true,

            blockMoveHandler(){
                if(this.block.stage.floaty){
                    let rect = contentRubber.value.getBoundingClientRect();

                    this.block.stage.floaty = {
                        top: this.cursor.clientY - rect.top - 5,
                        left: -1*rect.left + this.cursor.clientX - this.floatyShift
                    };
                    return;
                }

                this.block.stage.preFloaty = true;
                this.shiftRow();
            },

            startBlockFloating(){
                delete this.block?.stage?.preFloaty;
                delete this.block?.stage?.expanding;

                let rect = contentRubber.value.getBoundingClientRect();
                
                this.floatyShift = 
                    (-1*rect.left + this.cursor.clientX) - 
                    moment.range(Carpet.timeRange[0], this.block.stage.date_start).diff('d')*dpx().display;

                this.block.stage.floaty = {};
                this.row[this.stageKey].forEach((s,k) => {
                    s.date_start = this.backupStages[this.stageKey].find(e => e.id == s.id).date_start;
                    s.date_end = this.backupStages[this.stageKey].find(e => e.id == s.id).date_end;
                })
            },

            shiftRow(){
                this.row[this.stageKey].filter(s => s.status == this.block.status).forEach((s,k) => {
                    s.date_start = this.calculateTimeShift(this.backupStages[this.stageKey].find(e => e.id == s.id).date_start);
                    s.date_end = this.calculateTimeShift(this.backupStages[this.stageKey].find(e => e.id == s.id).date_end);
                })
            },

            blockRelease(e, releaseRow){
                if(
                    !this.block || 
                    releaseRow?.id != this.row?.id //tmp
                ){
                    this.stop();
                    return;
                }

                if(!this.block.stage.floaty){
                    if(//tmp
                        !moment.range(
                            this.block.stage.date_start,
                            this.backupBlock.stage.date_start
                        ).diff('d') &&
                        !moment.range(
                            this.block.stage.date_end,
                            this.backupBlock.stage.date_end
                        ).diff('d') 
                    ){
                        this.stop()
                    }else{
                        this.finishRowShift()
                    }
                }else{
                    this.releasedOnRow(releaseRow)
                }
            },
            releasedOnRow(releaseRow){
                //add
                    releaseRow[this.stageKey].push(this.block.stage);
                    releaseRow.wells.push(this.row.wells?.find(e => e?.id == this.block.stage.well));

                //remove
                    this.row[this.stageKey].splice(
                        this.row[this.stageKey].map(e => e.id).indexOf(this.block.stage.id),
                        1
                    );

                //shift
                    this.block.stage.date_start = this.calculateTimeShift(this.backupBlock.stage.date_start);
                    this.block.stage.date_end = this.calculateTimeShift(this.backupBlock.stage.date_end);

                    let shift = 0;

                    if(this.collision){
                        this.row[this.stageKey].filter(s => s.status == this.block.status).forEach((s,k) => {
                            if(
                                moment(s.date_end)._d > moment(this.block.stage.date_start)._d && 
                                this.block.stage.id != s.id
                            ){
                                if(
                                    !shift && 
                                    moment(this.block.stage.date_start)._d <= moment(s.date_end)._d && 
                                    moment(this.block.stage.date_end)._d >= moment(s.date_start)._d
                                ){
                                    shift = moment.range(s.date_start, this.block.stage.date_end).diff('d') + 1
                                }
                                
                                if(!shift)return;
                                
                                s.date_start = moment(s.date_start).add(shift, 'd')._d
                                s.date_end = moment(s.date_end).add(shift, 'd')._d
                            }
                        })
                    }

                this.finishRowShift();
            },

            blockExpansionHandler(){
                this.block.stage[`date_${this.side}`] = this.calculateTimeShift(this.backupBlock.stage[`date_${this.side}`]);
                this.block.stage.expanding = true;

                if(!this.collision)return;
                
                let shift = moment.range(this.backupBlock.stage[`date_${this.side}`], this.block.stage[`date_${this.side}`]).diff('d');

                this.row[this.stageKey].filter(s => s.status == this.block.status).forEach((s,k) => {
                    if(
                        this.block.stage.id != s.id &&
                        this.side == 'start'?
                        moment(this.block.stage.date_start)._d > moment(s.date_start)._d:
                        moment(this.block.stage.date_end)._d < moment(s.date_end)._d
                    ){
                        s.date_start = moment(this.backupStages[this.stageKey].find(e => e.id == s.id).date_start).add(shift, 'd')._d
                        s.date_end = moment(this.backupStages[this.stageKey].find(e => e.id == s.id).date_end).add(shift, 'd')._d
                    }
                })
            },

            finishRowShift(){
                this.row.loading = true;
                this.state = false;
                
                delete this.block?.stage?.expanding;
                
                ProjectItems.stage[this.stageKey].shiftStages?.(
                    this.row[this.stageKey].map(e=>{
                        return {
                            id: e.id,
                            date_start: moment(e.date_start).format('YYYY-MM-DD'),
                            date_end: moment(e.date_end).format('YYYY-MM-DD')
                        }
                    }),
                    ()=>{},
                    (err)=>{
                        console.log(err)
                    },
                    ()=>{
                        if(this.row)this.row.loading = false;
                        this.stop();
                    }
                )
            }
    });

    defineExpose({
        timeShift
    });

//callStageModal
    const stageWindow = ref();

    const callStageInfoWindow = (e, stage)=>{
        stageWindow.value.call(
            {
                x: e.clientX,
                y: e.clientY
            },
            stage
        );
    }

    const stageModals = ref({});

    const callStageModal = (type, stage)=>{
        stageModals.value[type]?.call(stage);
    }

//result
    const resYear = ref(moment().format('YYYY'));

    const getGroupResults = (group)=>{
        let res = [];

        const isBeforeToday = isFilterOn('use_current_date');
        
        if(isBeforeToday && moment().diff(resYear.value, 'Y', true) < 0){
            return new Array(6).fill({
                plan: 0,
                fact: 0
            })
        }

        res[0] = {
            plan: group.fortnight_data.filter(e => e.year == resYear.value && (!isBeforeToday || (e.month <= moment().format('M'))) && e.status == 'plan').reduce((acc, e)=>acc + parseFloat(e.drilling_amount || 0),0),
            fact: group.fortnight_data.filter(e => e.year == resYear.value && (!isBeforeToday || (e.month <= moment().format('M'))) && e.status == 'fact').reduce((acc, e)=>acc + parseFloat(e.drilling_amount || 0),0)
        }

        const inYearStages = (stages)=>
            stages.map((s)=>{
                return {
                    date_start: moment(s.date_start).format('YYYY-MM-DD'), 
                    date_end: moment(s.date_end).format('YYYY-MM-DD'),
                    status: s.status,
                    type: s.type
                }
            })
            .filter(s => {
                let d = s.date_end.split('-');
                return d[0] == resYear.value+'' &&  (!isBeforeToday || d[1] <= moment().format('MM'))
            })

        const drill_stages = {
            plan: inYearStages(group.drill_stages).filter(e => e.status == 'plan' && e.type == "well_drilling"),
            fact: inYearStages(group.drill_stages).filter(e => e.status == 'fact' && e.type == "well_drilling"),
        };

        const development_stages = {
            plan: inYearStages(group.development_stages).filter(e => e.status == 'plan'),
            fact: inYearStages(group.development_stages).filter(e => e.status == 'fact')
        }

        const datesRange = (stages)=>
            stages.reduce((acc, s)=>acc + parseInt(moment.range([s.date_start, s.date_end]).diff('d')),0)

        res[1] = {
            plan: datesRange(development_stages.plan.concat(drill_stages.plan)) || 0,
            fact: datesRange(development_stages.fact.concat(drill_stages.fact)) || 0,
            k: -1
        }

        res[2] = {
            plan: drill_stages.plan?.length || 0,
            fact: drill_stages.fact?.length || 0,
            k: 1
        }

        res[3] = {
            plan: datesRange(drill_stages.plan) || 0,
            fact: datesRange(drill_stages.fact) || 0,
            k: -1
        }

        res[4] = {
            plan: development_stages.plan?.length || 0,
            fact: development_stages.fact?.length || 0,
            k: 1
        }

        res[5] = {
            plan: datesRange(development_stages.plan) || 0,
            fact: datesRange(development_stages.fact) || 0,
            k: -1
        }

        return res;
    }

    const groupsResult = computed(()=>
        groups.value?.reduce((acc, e) => {
            acc[e.id] = getGroupResults(e);
            return Object.assign({}, acc);
        }, [])
    );

    const yearResult = computed(()=>{
        let arr = JSON.parse(JSON.stringify(groupsResult.value || {}));

        if(!arr)return [];

        let res = Object.keys(arr).reduce((acc, k) => {
            if(!acc)return arr[k];

            arr[k].forEach((e,key)=>{
                if(e.plan != null)acc[key].plan += e.plan;
                if(e.fact != null)acc[key].fact += e.fact;
            })

            return acc;
        }, null);

        return res;
    });

    const monthsResult = computed(()=>{
        const grps = JSON.parse(JSON.stringify(groups.value || {}));
        if(!grps || !grps.length)return {};

        let res = {}

        //fortnight
            let flatFortnight = grps
                ?.map(e => e.fortnight_data)
                .flat()
                .reduce((acc, e) => {
                    let obj = acc.find(a => a.year == e.year && a.month == e.month);

                    if(!obj){
                        e.drilling_amount = parseFloat(e.drilling_amount || 0);
                        acc.push(e);
                        return acc;
                    }

                    obj.drilling_amount += parseFloat(e.drilling_amount || 0);

                    return acc;
                },[])

            res.fortnight = JSON.parse(JSON.stringify(datesArray.value))

            res.fortnight.forEach(y => 
                y.ms.forEach((m,k) => {
                    m.value = {
                        plan: null,
                        fact: flatFortnight.find(f => f.year == y.y && f.month == m.m)?.drilling_amount || 0
                    }

                    m.accValue = {
                        plan: null,
                        fact: (y.ms[k-1]?.accValue?.fact || 0) + m.value.fact
                    }
                })
            )

            res.fortnight_acc = res.fortnight;

        const parseStages = (stagesKey, allowed=[])=>{
            let flatDrills = grps
                ?.map(e => e[stagesKey])
                .flat()
                .reduce((acc, s)=>{
                    if(allowed.length && !allowed.includes(s.type))return acc;

                    let date = moment(s.date_end).format('YYYY-MM-DD').split('-');

                    let obj = acc.find(e => e.year == date[0] && e.month == date[1] && e.status == s.status);

                    if(!obj){
                        acc.push(
                            {
                                year: date[0],
                                month: date[1],
                                value: 1,
                                status: s.status
                            }
                        )
                    }else{
                        obj.value += 1;
                    }

                    return acc;
                }, [])

            res[stagesKey] = JSON.parse(JSON.stringify(datesArray.value))
            res[stagesKey].forEach(y => 
                y.ms.forEach((m,k) => {
                    m.value = {
                        plan: flatDrills.find(f => f.year == y.y && f.month == m.m && f.status=="plan")?.value || 0,
                        fact: flatDrills.find(f => f.year == y.y && f.month == m.m && f.status=="fact")?.value || 0
                    }
                    m.accValue = {
                        plan: (y.ms[k-1]?.accValue?.plan || 0) + m.value.plan,
                        fact: (y.ms[k-1]?.accValue?.fact || 0) + m.value.fact
                    }
                })
            )

            res[stagesKey + '_acc'] = res[stagesKey];
        }

        parseStages('drill_stages', ["well_drilling"]);
        parseStages('development_stages');

        return res;
    })

</script>

<style lang="scss" scoped>
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
                    transition: .3s;

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

                    .fortnights-wr{
                        display: flex;
                        position: absolute;
                        bottom: 2px;
                        width: 100%;

                        .y-wr{
                            display: flex;

                            .fortnights{
                                @include flex-jtf;

                                .fortnight{
                                    width: 50%;
                                    flex-shrink: 0;
                                    font-size: 12px;
                                    display: flex;
                                    align-items: end;
                                    cursor: auto;
                                    position: relative;
                                    height: 18px;
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

        .today{
            position: absolute;
            top: 0;
            height: 100%;
            width: 1px;
            border-right: 2px dashed var(--bg-border-focus);
            pointer-events: none;
        }
    }

    .legend{
        position: absolute;
        right: 0;
        top: 0;
    }

    .block-content{
        .date-shower{
            position: absolute;
            top: calc(100% + 1px);
            padding: 0px 2px 1px;
            background: var(--bg-default);
            font-size: 10px;
            box-shadow: 1px 2px 3px rgba(0, 32, 51, 0.12);

            &-start{
                left: 0;
                border-bottom-left-radius: 2px;
                z-index: 5;
            }

            &-end{
                right: 0;
                border-bottom-right-radius: 2px;
                z-index: 6;
            }
        }
    }
</style>