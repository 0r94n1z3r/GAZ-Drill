<template>
    <div class="page">
        <PageControls>
            <template #btns>
                <VButton hollow @click="router.push(router.options.history?.state?.back || {name: 'Data'})">Отменить</VButton>
            </template>
        </PageControls>
        <div class="page-content">
            <div class="block">
                <div class="ico-wr"><IDownload class="ico"/></div>
                <p>Перенесите файл со скважинами в эту область</p>
                <p class="spacer">или</p>
                <VButton><IClip class="ico"/>Выберите файл</VButton>
            </div>
            <div class="block">
                <div class="ico-wr"><IWell class="ico"/></div>
                <p>Создать скважину, заполнив данные в системе</p>
                <p class="spacer"></p>
                <VButton @click="router.push({name: 'Well', params: {id: -1}})"><IPlus class="ico"/>Создать скважину</VButton>
            </div>
        </div>
    </div>
</template>

<script setup>
    import IPlus from "@/components/icons/IPlus.vue";
    import IClip from "@/components/icons/IClip.vue";
    import IWell from "@/components/icons/IWell.vue";
    import IDownload from "@/components/icons/IDownload.vue";

    import { useRoute, useRouter} from "vue-router";

    const route = useRoute(), router = useRouter(); 
</script>

<style lang="scss" scoped>
    .page{
        height: 100%;
        @include flex-col; 

        .page-content{
            height: 100%;
            flex-grow: 1;
            @include flex-c;
            gap: 32px;

            .block{
                @include flex-col;
                @include flex-c;
                gap: 8px;
                border: 1px dashed var(--bg-border);
                transition: .3s;
                border-radius: 10px;
                height: 250px;
                width: 100%;
                max-width: 550px;

                *{text-align: center;}

                p{
                    &.spacer{
                        color: var(--typo-secondary);
                        height: 30px;
                    }
                }

                .btn{
                    width: max-content;

                    .ico{
                        width: 14px;
                        height: 14px;
                        margin-bottom: -2px;
                    }
                }
            }

        }
    }
</style>