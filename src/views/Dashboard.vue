<template>
    <div class="dashboard"> 
        <div class="loader-wr" v-if="Project.projectExtensionLoading">
            <VLoading/>
        </div>

        <template v-else>
            <PageControls>
                <template #btns>
                    <VButton @click="router.push({name: 'NewWell'})">Комментарии</VButton>
                </template>
            </PageControls>

            <div class="page-wr">
                <div class="db-container">
                    <DbTable/>
                </div>

                <div class="db-container">
                    <DbChart/>
                </div>
            </div>
            <div class="page-wr">
                <div class="db-container">
                    <DbDynamicsChart/>
                </div>

                <div class="db-container">
                    <DbSpeedChart/>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
    import DbChart from "@/components/dashboard/DbChart.vue";
    import DbTable from "@/components/dashboard/DbTable.vue";
    import DbDynamicsChart from "@/components/dashboard/DbDynamicsChart.vue";
    import DbSpeedChart from "@/components/dashboard/DbSpeedChart.vue";

    import IPlus from "@/components/icons/IPlus.vue";

    import ProjectStore from "@/stores/project.js";
    const Project = ProjectStore();
</script>

<style lang="scss" scoped>
    .page-wr{
        display: flex;
        gap: 24px;
        margin-bottom: 24px;
    }

    .charts-wr{
        width: 100%;
    }

    .db-container{
        @include flex-col;
        gap: 24px;

        :deep(h3){
            font-size: 20px;
            color: var(--bg-shadow);
            padding-top: 2px;
        }        
    }

    .btn{
        width: max-content;

        .ico{
            width: 14px;
            height: 14px;
            margin-bottom: -1px;
        }
    }

    .db-container{
        border: 1px solid var(--bg-border);
        padding: 10px;
        width: 100%;
        border-radius: 10px;
    }

    .loader-wr{
        width: 100%;
        height: 100%;

        @include flex-c;

        flex-grow: 1;
    }
</style>