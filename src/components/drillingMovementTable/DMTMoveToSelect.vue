<template>
    <div class="text-select" v-click-outside="()=>{checkValid(); blurHandler()}" :focused="focused || null" :disabled="disabled || null">
        <input type="text" ref="inp" v-model="text" @keydown="noBtn = false" @focus="focusHandler">

        <div class="drop" v-if="displayList.length" :drop="drop || null">
            <div class="group-wr" v-for="(g,gk) in displayList" :key="gk">
                <div class="item" @click="confirm(null)">Не переезжает</div>
                <div class="group-title-wr">
                    <div class="group-title">
                        {{g.name}}
                    </div>
                </div>
                <div class="item" v-for="(i,k) in g.well_groups" :key="k" @click="confirm(i)">{{i.name}}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import vClickOutside from 'click-outside-vue3/src/v-click-outside';

    import Project from '@/stores/project.js';
    import ProjectItems from "@/script/projectItems.js";

    import IRefresh from "@/components/icons/IRefresh.vue";

    import { computed, onMounted, ref, watch } from "@vue/runtime-core";

    const props = defineProps({
        group: Object,
        disabled: Boolean,
    })

    const emit = defineEmits(['change', 'focus', 'blur']);

    const drop = ref(false);

//list
    const list = computed(()=>
        Project().projects.map((pr)=>{
            return {
                id: pr.id,
                name: pr.name,
                well_groups: Project().demoGroups.filter((g)=>g?.project == pr?.id && g.id != props.group.id)
            }
        })
        .sort((a,b)=>{
            if(a.id == props.group.project) return -1;
            return 1;
        })
    );

    const selectedGroup = ref(Project().demoGroups?.find(e => e.id == props.group?.move_to) || null);

    const text = ref(selectedGroup.value?.name || '');

    const displayList = computed(()=>{
        if(!text.value || noBtn.value)return list.value;

        let l = JSON.parse(JSON.stringify(list.value));

        return l
            .reduce((acc, e) => {
                if(!e.well_groups || e.name.toLowerCase().includes(text.value.toLowerCase())){
                    acc.push(e);
                    return acc;
                }

                e.well_groups = e.well_groups.filter(g => 
                    g.name.toLowerCase().includes(text.value.toLowerCase())
                )

                acc.push(e);
                return acc;
            }, [])
            .filter(e =>
                e.name.toLowerCase().includes(text.value.toLowerCase()) ||
                !e.well_groups ||
                e.well_groups?.length
            );        
    });

//noBtn
    const noBtn = ref(true);
    
    watch(drop, ()=>noBtn.value = true);

//finishers
    const checkValid = ()=>{
        if(!drop.value)return;

        let obj = displayList.value.map(e => e.well_groups || []).flat().find(e => e.name?.toLowerCase() == text?.value?.toLowerCase());
        if(obj){
            confirm(obj);
        }else{
            text.value = '';
            confirm(null);
        }
    }

    const confirm = (gr)=>{
        text.value = gr?.name || '';

        props.group.move_to = gr?.id || null;

        if(gr){
            selectedGroup.value = Project().demoGroups.find(e => e.id == gr.id);
        }

        if(gr?.id){
            ProjectItems.group.edit(
                gr.id,
                {drill: props.group.drill || null},
                (res)=>{
                    gr.drill = props.group.drill;
                    console.log(res);

                    ProjectItems.group.edit(
                        props.group.id,
                        {move_to: gr?.id || null},
                        (res)=>{
                            console.log(res);
                        },
                        (err)=>{
                            console.log(err);
                        }
                    )
                },
                (err)=>{
                    console.log(err);
                }
            )
        }else{
            ProjectItems.group.edit(
                props.group.id,
                {move_to: gr?.id || null},
                (res)=>{
                    console.log(res);
                },
                (err)=>{
                    console.log(err);
                }
            )
        }

        
        
        setTimeout(()=>drop.value = false);
    }

//focus
    const inp = ref();

    const focused = ref(false);

    const focus = ()=>{
        setTimeout(()=>inp.value?.focus?.());
    }

    const focusHandler = ()=>{
        emit('focus');
        drop.value = true;
        focused.value = true;
    }

//blur
    const blurHandler = ()=>{
        emit('blur');
        drop.value = false;
        focused.value = false;
    }

    const blur = ()=>inp.value.blur();
    
</script>

<style lang="scss" scoped>
    @import '@/style/mixins.scss';

    .text-select{
        position: relative;
        height: 32px; 
        border: 1px solid var(--bg-border);
        border-radius: 4px;
        display: flex;
        align-items: center;

        transition: .3s;

        input{
            margin: 0;
            width: 100%;
            border: none;
            display: flex;
            padding: 0 9px;
            border-radius: 3px;
            font-size: inherit;
            background: transparent;
            height: 100%;

            &::placeholder{
                color: #00203359;
            }
        }

        &[focused]{
            border-color: var(--bg-border-focus);
        }

        &[disabled]{
            opacity: 0.6;
            pointer-events: none;
        }

        .drop{
            position: absolute;
            left: 0;
            top: 100%;
            background: #fff;
            padding: 5px 0;
            width: 100%;
            border-radius: 0 0 5px 5px;
            box-shadow: (0 0 5px #00000040);
            max-height: 40vh;
            overflow-y: auto;
            z-index: 5;
            transition: .3s;
            min-width: 198px;

            .group-title-wr{
                min-width: 0;
                @include flex-jtf;
                padding: 2px 5px 3px;
                background: var(--bg-ghost);
                border: solid var(--bg-border);
                border-width: 1px 0;
                color: var(--typo-secondary);

                .action{
                    width: 17px;
                    height: 17px;
                    flex-shrink: 0;
                    transition: .3s;
                    cursor: pointer;

                    &[hidden]{
                        @include hidden-hor(5px);
                    }
                }
            }

            .item{
                padding: 5px;
                cursor: pointer;
                word-break: break-word;
                text-align: left;

                &:hover{
                    background: #f5f5f5;
                }
            }

            &:not([drop]){
                @include hidden(-10px);
            }
        }
    }
</style>