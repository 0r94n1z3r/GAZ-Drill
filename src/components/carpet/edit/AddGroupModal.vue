<template>
    <VModal title="Кустовая площадка" ref="modal">
        <div class="content">
            <div class="input-wr">
                <p>Название:</p>
                <VTextInput v-model="name"/>
            </div>

            <div class="input-wr" v-if="Project.activeProject?.drills?.length">
                <p>Буровая установка:</p>
                <TextSelect v-model="drill" :list="Project.activeProject.drills" keyName="name"/>
            </div>

            <VErr :err="err"/>

            <div class="btns">
                <VButton :disabled="!name || !drill || null" :loading="loading || null" @click="confirm">Готово</VButton>
            </div>
        </div>
    </VModal>
</template>

<script setup>
    import VModal from "@/components/ui/VModal.vue";
    import { ref } from "vue";

    import ProjectItems from "@/script/projectItems.js";
    import ProjectStore from "@/stores/project.js";
    const Project = ProjectStore();

    const name = ref('');

    const drill = ref(null);

//confirm
    const loading = ref(false);
    const err = ref('');

    const confirm = ()=>{
        loading.value = true;
        err.value = '';

        let dataToSend = Object.assign(
            {
                name: name.value,
                project: Project.activeProject.id,
            },
            drill.value?{drill: drill.value.id}:{}
        );

        ProjectItems.group.set(
            dataToSend,
            res => {
                Project.activeProject.well_groups.push(res);
                close();
            },
            error => err.value = error,
            ()=>loading.value = false
        )
    }


//call
    const modal = ref(null);

    const call = ()=>{
        name.value = '';
        drill.value = null;
        modal.value.call();
    }

    const close = ()=>{
        modal.value.close();
    }

    defineExpose({
        call,
        close
    });
</script>

<style lang="scss" scoped>
    .content{
        padding: 14px;
        padding-top: 0;
        @include flex-col;
        gap: 10px;
        cursor: auto;

        .input-wr{
            p{
                color: var(--typo-secondary);
                margin-bottom: 3px;
            }
        }

        .btns{
            display: flex;
            justify-content: end;

            .btn{
                width: max-content;
            }
        }

        p[err]{
            color: var(--typo-alert);
        }
    }
</style>