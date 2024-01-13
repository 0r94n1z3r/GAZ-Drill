<template>
    <VModal title="Буровая установка" ref="modal">
        <div class="content">
            <div class="input-wr">
                <p>Организация:</p>
                <TextSelect :list="Static.extOrganizations" keyName="name" v-model="org"/>
            </div>

            <!-- <div class="input-wr">
                <p>Организация-владелец:</p>
                <TextSelect :disabled="!org?.branches?.length || null" keyName="name" :list="org?.branches || []" v-model="subOrg"/>
            </div> -->

            <div class="input-wr">
                <p>Название:</p>
                <VTextInput v-model="name"/>
            </div>

            <VErr :err="err"/>

            <div class="btns">
                <VButton :disabled="!name || !org?.id || null" :loading="loading || null" @click="confirm">Готово</VButton>
            </div>
        </div>
        
    </VModal>
</template>

<script setup>
    import VModal from "@/components/ui/VModal.vue";
    import { ref, watch } from "vue";

    import ProjectItems from "@/script/projectItems.js";

    import ProjectStore from "@/stores/project.js";
    import StaticStore from "@/stores/static.js";

    const Project = ProjectStore();
    const Static = StaticStore();

    const name = ref('');

//org
    const org = ref(null);
    // watch(org, (n,o)=>{if(n?.id != o?.id)subOrg.value = null});
    
    // const subOrg = ref(null);

//confirm
    const loading = ref(false);
    const err = ref('');

    const confirm = ()=>{
        loading.value = true;
        err.value = '';

        let dataToSend = Object.assign(
            {
                name: name.value,
                owner: org.value.id//subOrg.value.id
            }
        );

        ProjectItems.drill.set(
            dataToSend,
            res => {
                Project.activeProject.drills.push(res);
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