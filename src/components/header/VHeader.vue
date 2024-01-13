<template>
    <div class="header">
        <div class="navigation">
            <RouterLink to="/">
                <img src="/img/logo.svg" alt="">
            </RouterLink>
            <template v-if="User().isLogged">
                <div class="burger-menu" v-click-outside="()=>callerDrop = false">
                    <VButton grey class="caller" @click="callerDrop = !callerDrop">
                        <IBurgerMenu class="ico"/>
                    </VButton>
                    <div class="drop list" :drop="callerDrop || null">
                        <div class="item">
                            <div class="content" @click="goto({name: 'Projects'})">
                                <div class="icon"><IFolder class="ico"/></div>
                                <div class="title"><p>Проекты</p></div>
                            </div>
                            <div class="icon arrow"><IDropArr class="ico"/></div>
                            <div class="list">
                                <RouterLink class="item" v-for="(i,k) in projects" :key="k" :to="i.href">
                                    <div class="content">
                                        <div class="icon"><IFolder class="ico"/></div>
                                        <div class="title"><p>{{i.title}}</p></div>
                                    </div>
                                </RouterLink>
                            </div>
                        </div>

                        <RouterLink class="item" :to="{name: 'DrillsList'}">
                            <div class="content">
                                <div class="icon"><IWell class="ico"/></div>
                                <div class="title"><p>Загрузка буровых станков</p></div>
                            </div>
                        </RouterLink>

                        <template v-if="route.params.projId">
                            <div class="split">
                                {{Project.activeProject?.name}}
                            </div>
                            <RouterLink class="item" v-for="(i,k) in navList" :key="k" :to="i.href" :disabled="i.disabled || null">
                                <div class="content">
                                    <div class="icon"><Component class="ico" :is="i.ico"/></div>
                                    <div class="title"><p>{{i.title}}</p></div>
                                </div>
                            </RouterLink>
                        </template>
                    </div>
                </div>

                <div class="crumbs" v-if="Project.activeProject">
                    <RouterLink class="crumb" :to="{name: 'Carpet', params: {projId: Project.activeProject.id}}">{{Project.activeProject.name}}</RouterLink>
                    <IDropArr class="split"/>
                    <p class="crumb">{{Static.getField(Project.activeProject.field)?.name}} месторождение</p>
                    <IDropArr class="split"/>
                    <p class="crumb" v-if="route.meta?.verboseName">{{route.meta.verboseName}}</p>
                </div>
            </template>
        </div>
        <div class="options" v-if="User().isLogged">
            <CarpetControls class="carpet-controls" v-if="route.meta?.carpetControls"/>

            <HeaderOptions/>
            <UserDrop/>
        </div>
        
    </div>
</template>

<script setup>
    import UserDrop from '@/components/header/UserDrop.vue';
    import HeaderOptions from '@/components/header/HeaderOptions.vue';

    import vClickOutside from 'click-outside-vue3/src/v-click-outside';

    import IBurgerMenu from "@/components/icons/IBurgerMenu.vue";
    import IDropArr from "@/components/icons/IDropArr.vue";
    import IWell from "@/components/icons/IWell.vue";

    import IAnalytics from "@/components/icons/menu/IAnalytics.vue";
    import IBook from "@/components/icons/menu/IBook.vue";
    import ICalendar from "@/components/icons/menu/ICalendar.vue";
    import IFlag from "@/components/icons/menu/IFlag.vue";
    import IFolder from "@/components/icons/menu/IFolder.vue";
    import IHistory from "@/components/icons/menu/IHistory.vue";
    import ITimetable from "@/components/icons/menu/ITimetable.vue";
    import IWindow from "@/components/icons/menu/IWindow.vue";

    import User from "@/stores/user.js";

    import ProjectStore from "@/stores/project.js";
    import StaticStore from "@/stores/static.js";

    import CarpetControls from "@/components/carpet/CarpetControls.vue";
    
    import { computed, ref, watch } from 'vue';

    import { useRoute, useRouter } from 'vue-router';

    const route = useRoute(), router = useRouter();
    
    const Project = ProjectStore();
    const Static = StaticStore();

    const navList = computed(()=>[
        {title: "Производственная программа", href: {name: "Carpet", params: {projId: route.params.projId}}, ico: ICalendar, disabled: true},
        {title: "Реализация проекта ", href: {name: "Carpet", params: {projId: route.params.projId}}, ico: IFlag},
        {title: "График бурения и движения БУ", href: {name: "DrillingMovementTable", params: {projId: route.params.projId}}, ico: ITimetable},
        {title: "Сроки строительства по секциям", href: {name: "Carpet", params: {projId: route.params.projId}}, ico: IHistory, disabled: true},
        {title: "Интервалы бурения по секциям", href: {name: "Carpet", params: {projId: route.params.projId}}, ico: IWindow, disabled: true},
        {title: "Аналитика", href: {name: "Dashboard", params: {projId: route.params.projId}}, ico: IAnalytics},
        {title: "Справочники", href: {name: "Carpet", params: {projId: route.params.projId}}, ico: IBook, disabled: true},
    ]);

    const projects = computed(()=>
        Project.projects.map(e=>{
            return {title: e.name, href: {name: "Carpet", params: {projId: e.id}}}
        })
    )

    const goto = (href)=>{
        router.push(href);
    };

    //caller
        const callerDrop = ref(false);
        watch(()=>[route.name, route.params.projId], ()=>{
            callerDrop.value = false;
        });
</script>

<style lang="scss" scoped> 
    .header{
        height: 60px;
        @include flex-jtf;
        align-items: center;
        padding: 0 24px;
        border-bottom: 1px solid var(--bg-border);
        flex-shrink: 0;

        .logo{
            height: 43px;

            img{
                height: 100%;
            }
        }
    }

    .navigation{
        display: flex;
        align-items: center;
        gap: 8px 24px;

        .burger-menu, .crumbs{
            transform: translateY(5px);
        }

        .burger-menu{
            position: relative;
            z-index: 5;

            .caller{
                height: 32px;
                width: 32px;
                padding: 0;
                border-radius: 6px;
            }

            .list{
                position: absolute;
                left: 0;
                top: 100%;
                background: var(--bg-default);
                border: 1px solid var(--bg-border);
                border-radius: 0 0 4px 4px;
                max-width: 400px;
                padding: 6px 0;
                transition: .3s;
                box-shadow: 0px 4px 4px rgba(0, 32, 51, 0.04), 0px 8px 24px rgba(0, 32, 51, 0.12);

                .item{
                    width: 100%;
                    position: relative;
                    transition: .3s;
                    @include flex-jtf;
                    align-items: center;
                    font-size: 16px;
                    font-weight: 800;
                    padding: 3px 13px;
                    cursor: pointer;

                    .icon{
                        display: flex;
                        align-items: center;
                        color: var(--typo-secondary);
                        width: 25px;
                        flex-shrink: 0;
                    }

                    .arrow{
                        transform: rotate(-.25turn);
                        justify-content: center;
                    }
                    
                    .content{
                        display: flex;
                        gap: 12px;
                        min-width: 0;
                        width: 100%;

                        .title {
                            min-width: 0;

                            p{
                                @include text-overflow;
                            }
                        }
                    }

                    &:hover{
                        background: var(--bg-ghost);
                    }

                    .list{
                        left: 100%;
                        top: -7px;
                        max-height: 50vh;
                        overflow-y: auto;
                    }

                    &:not(:hover){
                        .list{
                            @include hidden-hor(-10px);
                        }
                    }

                    &[disabled]{
                        opacity: .3;
                        pointer-events: none;
                    }
                }

                .split{
                    color: var(--bg-border-focus);
                    border: solid var(--bg-border);
                    border-width: 1px 0;
                    padding: 0px 12px 2px;
                    margin: 12px 0 4px;
                    background: var(--bg-ghost);
                }
            }

            .drop:not([drop]){
                @include hidden(-10px);
            }
        }

        .crumbs{
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 0px 8px;

            .split{
                transform: rotate(-.25turn) translateX(-2px);
                width: 8px;
            }
        }
    }

    .carpet-controls{
        display: flex;
        align-items: center;
        gap: 12px;
        padding-right: 12px;

        .btn{
            width: max-content;

        }
    }

    .options{
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
</style>