import { defineStore } from 'pinia';
import { ref, computed, reactive, onMounted, watch } from "vue";

import ProjectItems from "@/script/projectItems.js";
import { useRoute } from 'vue-router';

export default defineStore("Project", ()=>{
    const route = useRoute();

//startup
    const startup = ()=>{
        ProjectItems.project.getList(res =>{
            projects.value = res;

            if(route?.params?.projId)extendProject(route.params.projId);
        })
    };

//projects
    const projects = ref([]);
    const activeProject = computed(()=>
        projects.value.find(e => e.id == route.params.projId)
    );

//groups
    const demoGroups = ref(null);

    const updateDemoGroups = (cb)=>{
        demoGroups.value = null;

        ProjectItems.group.getList(res => {
            demoGroups.value = res;
            cb();
        });
    }

//drills
    const drills = computed(()=>projects.value.map(e => e.drills).filter(e => e).flat());
    const getDrill = (id)=>drills.value.find(e => e.id == id)

//extendProject
    const projectExtensionLoading = ref(false);

    onMounted(()=>{if(route.params.projId)extendProject(route.params.projId)});
    watch(()=>activeProject.value?.id, (n,o)=>{if(n && n != o)extendProject(n)});

    const extendAllProjects = ()=>{
        projectExtensionLoading.value = true;

        ProjectItems.project.getAllWithDrills(
            res => {
                projects.value.forEach(p =>{
                    Object.assign(
                        p, 
                        res.find(e => e.id == p.id)
                    );
                })
            },
            err => {
                //notdone err
            },
            () => projectExtensionLoading.value = false
        )
    }

    const extendProject = (id)=>{
        projectExtensionLoading.value = true;

        ProjectItems.project.get(
            id,
            res1 => {
                let p = projects.value.find(e => e.id == id);

                ProjectItems.project.getWithDrills(
                    id,
                    res2 => {
                        // res1.well_groups.forEach(e => {
                        //     if(!e.move_to){
                        //         e.move_to_group = null;
                        //         return;
                        //     }

                        //     let gr = res1.well_groups.find(g => g.id == e.move_to);

                        //     if(!gr){
                        //         //notdone ищем внешне
                        //         return;
                        //     }

                        //     e.move_to_group = {
                        //         name: gr.name,
                        //         id: gr.id
                        //     }
                        // });
                        
                        Object.assign(p, res1, res2);
                    },
                    err => {
                        //notdone err
                    },
                    () => projectExtensionLoading.value = false
                )
            },
            err => {
                () => projectExtensionLoading.value = false
                //notdone err
            }
        )
    }




//----------------------------------------------------------------
    return {
        projects,
        activeProject,

        startup,

        demoGroups,
        updateDemoGroups,

        drills,
        getDrill,

        projectExtensionLoading,
        extendAllProjects,
    }
})