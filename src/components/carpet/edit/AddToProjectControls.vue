<template>
    <div class="option" @click="addDrop = true;" :drop="addDrop || null" v-click-outside="()=>addDrop = false">
        <IPlus class="ico"/>
        <div class="drop btns-drop">
            <VButton @click="addGroupModal.call()" fit :disabled="!Project.activeProject?.drills?.length || null">КП</VButton>
            <VButton @click="addDrillModal.call()" fit>БУ</VButton>
        </div>

        <AddGroupModal ref="addGroupModal"/>
        <AddDrillModal ref="addDrillModal"/>
    </div>
</template>

<script setup>
    import vClickOutside from 'click-outside-vue3/src/v-click-outside';
    import ProjectStore from "@/stores/project.js";

    import IPlus from "@/components/icons/IPlus.vue";

    import AddGroupModal from "@/components/carpet/edit/AddGroupModal.vue";
    import AddDrillModal from "@/components/carpet/edit/AddDrillModal.vue";
    
    import { ref } from 'vue';
    
    const Project = ProjectStore();

    const addGroupModal = ref();
    const addDrillModal = ref();

//add
    const addDrop = ref(false);
</script>

<style lang="scss" scoped>
    .option{
        .ico{
            height: 48%;
            width: 48%;
            color: var(--bg-border-focus);
            transition: .3s;
        }

        &[disabled]{
            pointer-events: none;

            .ico{
                opacity: .3;
            }
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
    
</style>