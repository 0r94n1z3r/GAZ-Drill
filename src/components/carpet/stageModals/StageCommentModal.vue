<template>
    <VModal :title="`Комментарии ${stage?.title}`" ref="modal">
        <div class="comments" ref="comments" v-if="stage">
            <div class="comment" v-for="i in stage.stage.comments" :key="i">
                <!-- <div class="comment-top">
                    15.03.2022
                </div> -->
                <div class="comment-content">
                    <h3>{{i.author.first_name}} {{i.author.last_name}}</h3>
                    <p>{{i.text}}</p>
                </div>
            </div>
        </div>

        <div class="comment-input">
            <VTextarea v-model="text" dynamic rows="1" max-height="40vh" @keydown.prevent.enter="confirm"/>
            <div class="btns">
                <VErr :err="err"/>
                <VButton :loading="loading || null" @click="confirm">Отправить</VButton>
            </div>
        </div>
    </VModal>
</template>

<script setup>
    import VModal from "@/components/ui/VModal.vue";
    import { computed, ref } from "vue";
    
    import VTextarea from "@/components/ui/inputs/VTextarea.vue";

    import projectItems from "@/script/projectItems.js";

    import moment from "moment";
    
    const stage = ref(null);

    const text = ref('');

//send
    const loading = ref(false);
    const err = ref('');

    const comments = ref();

    const confirm = ()=>{
        if(!text.value){
            err.value = "Заполните поле";
            return;
        }
        
        loading.value = true;
        err.value = '';

        projectItems.stage[stage.value.type].comment(
            stage.value.stage.id,
            text.value,
            res => {
                stage.value.stage.comments.push(res);
                text.value = ' ';
                text.value = '';
                setTimeout(()=>{
                    comments.value.scrollTo(0, comments.value.scrollHeight);
                })
            },
            error => err.value = error,
            () => loading.value = false
        )
    };

//call
    const modal = ref(null);

    const call = (stg)=>{
        stage.value = stg;
        text.value = '';
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
    :deep(.modal){
        width: 100%;
        max-width: 600px;
        @include flex-col;

        .content{
            @include flex-col;
            min-height: 0;
        }

        .top{
            padding-left: 23px;
        }
    }

    .comment-input{
        @include flex-col;
        gap: 10px;
        padding: 15px 23px;
        border-top: 1px solid var(--bg-border);
    }

    .btns{
        @include flex-jtf;
        gap: 10px;
        justify-content: end;
        align-items: baseline;

        .btn{
            width: max-content;
        }
    }

    .comments{
        max-height: 60vh;
        overflow-y: auto;
    }

    .comment{
        &-top{
            background: var(--bg-ghost);
            border-top: solid var(--bg-border);
            border-width: 1px 0;
            display: flex;
            align-items: center;
            padding: 4px 23px;
            font-size: 10px;
            font-weight: 700;
            color: var(--typo-secondary);
        }

        &-content{
            color: var(--bg-shadow);
            padding: 14px 23px 24px;
            border-top: 1px solid var(--bg-border);

            h3{
                font-size: 18px;
                margin-bottom: 4px;
                word-break: break-word;
            }

            p{
                font-size: 16px;
                word-break: break-word;
            }
        }
    }
    
</style>