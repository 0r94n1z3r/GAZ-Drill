<template>
    <div class="global-wr">
        <div class="page-wr">
            <VHeader class="header"/>

            <div class="loader-wr" v-if="user.isLogged === null">
                <VLoading/>
            </div>

            <VAuth v-else-if="!user.isLogged"/>

            <RouterView v-else class="page"/>
        </div>
    </div>
</template>

<script setup>
    import VHeader from '@/components/header/VHeader.vue';
    import VAuth from "@/components/auth/VAuth.vue";

    import ProjectStore from "@/stores/project.js";
    import StaticStore from "@/stores/static.js";

    import User from "@/stores/user.js";
    import { watch } from 'vue';

    const user = User();

    const Project = ProjectStore();
    const Static = StaticStore();

    watch(()=>user.isLogged, n => {
        if(n){
            Project.startup();
            Static.startup();
        }
    })
</script>

<style scoped lang="scss">
    .page-wr{
        min-height: 100vh;
        @include flex-col;

        .header{
            flex-shrink: 0;
        }

        .page{
            padding: 16px 24px;
            height: 100%;
            flex-grow: 1;
        }
    }

    .loader-wr{
        @include flex-c;
        height: 100%;
        flex-grow: 1;
    }
</style>