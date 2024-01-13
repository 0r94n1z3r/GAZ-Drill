<template>
    <div>
        <PageControls>
            <VTextInput class="search" v-model="search" placeholder="Поиск">
                <template #pre>
                    <div class="ico-wr"><ISearch class="ico"/></div>
                </template>
                <div class="close" v-if="search" @click="search = ''">
                    <ICross class="ico"/>
                </div>
            </VTextInput>
            <template #btns>
                <template v-if="creationMode">
                    <VErr :err="creationProject.err"/>
                    <VButton hollow @click="cancelCreation" :loading="creationProject.loading">Отмена</VButton>
                    <VButton @click="createProject" :disabled="!readyToCreate || null" :loading="creationProject.loading">Сохранить</VButton>
                </template>
                <VButton v-else @click="startCreation"><IPlus class="ico"/>Добавить проект</VButton>
            </template>
        </PageControls>

        <div class="table">
            <table class="table-default">
                <thead>
                    <tr>
                        <th v-for="(i,k) in thead" :key="k" @click="setSortBy(i.sortId)">
                            <div class="th-wr">
                                {{i.title}}
                                <div class="arrows" v-if="i.sortId" :sort-by="i.sortId == sortBy.sortId?sortBy.v:null">
                                    <IDrop class="arr"/>
                                    <IDrop class="arr"/>
                                </div>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr edit v-if="creationMode">
                        <td><VTextInput v-model="creationProject.number"/></td>
                        <td><VTextInput v-model="creationProject.name"/></td>
                        <td>
                            <TextSelect 
                                v-model="creationProject.organization" 
                                :list="Static.organizations" 
                                keyName="name"

                                @change="(n)=>{if(!n){
                                    creationProject.organization_branch = null;
                                    creationProject.license_area = null;
                                }}"
                            />
                        </td>
                        <td>
                            <VTextInput disabled v-if="!creationProject.organization"/>
                            <TextSelect 
                                v-else 
                                v-model="creationProject.organization_branch" 
                                :list="creationProject.organization.branches" 
                                keyName="name"

                                @change="(n)=>{if(!n)creationProject.license_area = null}"
                            />
                        </td>
                        <td>
                            <VTextInput disabled v-if="!creationProject.organization_branch"/>
                            <TextSelect 
                                v-else 
                                v-model="creationProject.license_area" 
                                :list="Static.areasOfBranch(creationProject.organization_branch.id)" 
                                keyName="name"
                            />
                        </td>
                        <td><TextSelect v-model="creationProject.field" :list="Static.fields" keyName="name"/></td>
                        <td></td>
                    </tr>
                    <tr v-for="(i,k) in sortedBody" :key="k" @click="router.push({name: 'Carpet', params: {projId: i?.id}})">
                        <td>{{i?.code}}</td>
                        <td>{{i?.name}}</td>
                        <td>{{i?.organization?.name}}</td>
                        <td>{{i?.organization_branch?.name}}</td>
                        <td>{{i?.license_area?.name}}</td>
                        <td>{{i?.field?.name}}</td>
                        <td>
                            <ProjectStatus/>
                        </td>
                        <td>
                            <div class="options">
                                <div class="icon-wr" @click.stop="router.push({name: 'Carpet', params: {projId: i?.id}})">
                                    <IFlag class="ico"/>
                                </div>
                                <div class="icon-wr" @click.stop="router.push({name: 'DrillingMovementTable', params: {projId: i?.id}})">
                                    <ITimetable class="ico"/>
                                </div>
                                <div class="icon-wr" @click.stop="router.push({name: 'Dashboard', params: {projId: i?.id}})">
                                    <IAnalytics class="ico"/>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="options">
                                <div  class="icon-wr delete" @click.stop="deleteProject(i)">
                                    <ITrash class="ico"/>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
    import { computed, onMounted, ref } from "vue";

    import IPlus from "@/components/icons/IPlus.vue";
    import ISearch from "@/components/icons/ISearch.vue";
    import IDrop from "@/components/icons/IDrop.vue";
    import ICross from "@/components/icons/ICross.vue";
    import ITrash from "@/components/icons/ITrash.vue";

    import StaticStore from "@/stores/static.js"
    import ProjectStore from "@/stores/project.js"
    import ProjectItems from '@/script/projectItems.js'

    import IAnalytics from "@/components/icons/menu/IAnalytics.vue";
    import IBook from "@/components/icons/menu/IBook.vue";
    import ICalendar from "@/components/icons/menu/ICalendar.vue";
    import IFlag from "@/components/icons/menu/IFlag.vue";
    import IFolder from "@/components/icons/menu/IFolder.vue";
    import IHistory from "@/components/icons/menu/IHistory.vue";
    import ITimetable from "@/components/icons/menu/ITimetable.vue";
    import IWindow from "@/components/icons/menu/IWindow.vue";

    import { useRouter } from "vue-router";

    const router = useRouter();

    const Static = StaticStore();
    const Project = ProjectStore();

//search
    const search = ref('');

//thead
    const thead = ref([
        {title: "Код стройки", sortId: "code"},
        {title: "Имя проекта", sortId: "name"},
        {title: "Филиал инвест", sortId: "organization_branch"},
        {title: "Эксплуатирующее общество", sortId: "organization"},
        {title: "Лицензионный участок", sortId: "license_area"},
        {title: "Месторождение", sortId: "field"},
        {title: "Версия"},
        {title: "Действия"},
        {title: ""},
    ]);

//tbody
    const tbody = computed(()=>{
        return Project.projects
            .filter(e =>includesKeys(e, ['name', 'number']))
            .map(e => {
                let LAFamily = Static.getLAFamily(e.license_area);
                return {
                    id: e.id,
                    code: e.number,
                    name: e.name,
                    organization: LAFamily.organization,
                    organization_branch: LAFamily.organization_branch,
                    license_area: LAFamily.license_area,
                    field: Static.fields.find(f => f.id == e.field),
                }
            })
    })

    const includesKeys = (e, keys)=>keys.some((key) => e[key]?.toUpperCase().includes(search.value.toUpperCase()));

    const sortedBody = computed(()=>{
        return tbody.value.sort((a,b)=>{
            let key = sortBy.value.sortId;
            let v = sortBy.value.v

            let A = a[key].name || a[key];
            let B = b[key].name || b[key];

            if ( A < B ) return -1*v;
            if ( A > B ) return 1*v;
            return 0;
        });
    })

//edit
    const creationMode = ref(false);

    const creationProject = ref({});

    const readyToCreate = computed(()=>{
        let p = creationProject.value;

        return p.name && 
            p.organization && 
            p.organization_branch && 
            p.license_area && 
            p.field;
    })

    const startCreation = ()=>{
        cancelCreation();
        creationMode.value = true;
    }

    const cancelCreation = ()=>{
        creationMode.value = false;

        creationProject.value = {
            name: '',
            organization: null,
            organization_branch: null,
            license_area: null,
            field: null
        }
    }

    const createProject = ()=>{
        creationProject.value.loading = true;

        ProjectItems.project.set(
            {
                "number": creationProject.value.number,
                "name": creationProject.value.name,
                "license_area": creationProject.value.license_area.id,
                "field": creationProject.value.field.id
            },
            (res)=>{
                Project.projects.push(res);
                cancelCreation();
            },
            err=>{
                creationProject.value.err
            },
            ()=>{
                creationProject.value.loading = false;
            }
        )
    }


//sortby
    const sortBy = ref({sortId: "id", v: -1});

    const setSortBy = (sortId)=>{
        if(sortBy.value.sortId == sortId){
            sortBy.value.v = (sortBy.value.v == 1)?-1:1;
        }else{
            sortBy.value = {sortId, v: 1};
        }
    }

//delete
    const deleteProject = (i)=>{
        Project.projects.splice(
            Project.projects.map(e => e.id).indexOf(i.id),
            1
        );

        ProjectItems.project.delete(
            i.id,
            ()=>{},
            (err)=>{console.log(err)}
        )
    };
</script>

<style lang="scss" scoped>

    .page-controls{
        .search{
            display: flex;
            align-items: center;
            width: 250px;

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
        }

        .btn{
            width: max-content;

            .ico{
                width: 14px;
                height: 14px;
                margin-bottom: -1px;
            }
        }

        p[err]{
            color: var(--typo-alert);
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

    .table{
        table{
            width: 100%
        }

        th{
            cursor: pointer;
        }
        
        .th-wr{
            @include flex-jtf;
            gap: 10px;
            align-items: start;
            user-select: none;

            .arrows{
                @include flex-col;
                justify-content: center;
                gap: 3px;
                height: 20px;
                color: var(--typo-control-ghost);

                .arr{
                    display: block;
                    transition: .1s;
                    
                    &:first-child{
                        transform: rotate(.5turn);
                    }
                }

                &[sort-by="1"]{
                    .arr:first-child{opacity: .2;}
                }
                &[sort-by="-1"]{
                    .arr:last-child{opacity: .2;}
                }
            }
        }

        tbody{
            tr{
                transition: .3s;
                cursor: pointer;
                border-width: 1px 0 1px 0;
                position: relative;

                &::after{
                    @include pseudo-absolute;
                    width: 100%;
                    height: 100%;
                    left: 0;
                    top: 0;
                    border: 1px solid transparent;
                    pointer-events: none;
                }
                
                &:hover{
                    &::after{
                        border-color: var(--bg-border-focus);
                    }
                }

                &[edit]{
                    cursor: auto;
                }
            }

            td:last-child{//tmp
                width: 24px;
            }
        }

        .options{
            display: flex;

            .icon-wr{
                height: 24px;
                width: 24px;
                color: var(--bg-border-focus);
                transition: .3s;
                @include flex-c;

                &:hover{
                    color: var(--typo-brand);
                }

                .ico{
                    height: 100%;
                    width: 75%;
                }
            }
        }

        
        .options .icon-wr.delete{
            &:hover{
                color: var(--typo-alert);
            }
        }
        
    }

</style>