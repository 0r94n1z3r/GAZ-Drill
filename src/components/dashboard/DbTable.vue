<template>
    <div class="table-wr">
        <h3 class="title">Статистика</h3>
        <table class="table-default">
            <thead>
                <tr>
                    <th></th>
                    <th>План</th>
                    <th>Факт</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(i,k) in data" :key="k">
                    <td class="title">{{i.title}}</td>
                    <td>{{i.plan}}</td>
                    <td>{{i.fact}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
    import ProjectStore from "@/stores/project.js";
    import { computed } from "vue";

    const Project = ProjectStore();

    const proj = computed(() => Project.activeProject);
    const groups = computed(() => proj.value?.well_groups || []);

    const data = computed(() => {
        // console.log(proj.value, proj.value?.drills?.length)
        // console.log(groups.value)

        return{
            drills: {
                title: 'Кол-во станков:', 
                plan: null, 
                fact: proj.value?.drills?.length
            }, //оно?
            development_stages: {
                title: 'Скважин, находящихся в освоении:', 
                plan: groups.value?.reduce((acc, g) => acc + g.development_stages?.filter(e => e.status == 'plan').length, 0), 
                fact: groups.value?.reduce((acc, g) => acc + g.development_stages?.filter(e => e.status == 'fact').length, 0)
            },
            drill_stages: {
                title: 'Скважин, находящихся в бурении:', 
                plan: groups.value?.reduce((acc, g) => acc + g.drill_stages?.filter(e => e.status == 'plan').length, 0), 
                fact: groups.value?.reduce((acc, g) => acc + g.drill_stages?.filter(e => e.status == 'fact').length, 0)
            },
            fortnight_data: {
                title: 'Проходка:', 
                plan: groups.value?.reduce((acc, g) => acc + g.fortnight_data?.filter(e => e.status == 'plan')?.reduce((acc2, f) => acc2 + f?.drilling_amount || 0, 0), 0), 
                fact: groups.value?.reduce((acc, g) => acc + g.fortnight_data?.filter(e => e.status == 'fact')?.reduce((acc2, f) => acc2 + f?.drilling_amount || 0, 0), 0)
            },
        }
    });
</script>

<style lang="scss" scoped>
    .table-wr{
        padding: 0 20px;
    }

    h3{
        margin-bottom: 30px;
    }

    table{
        width: 100%;

        th, .title{
            background: var(--bg-ghost);
        }

        td{
            &:not(:first-child){
                text-align: center;
            }
        }
    }
</style>