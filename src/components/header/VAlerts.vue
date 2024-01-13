<template>
    <div class="alerts">
        <div class="title">
            <h3>Уведомления</h3>
        </div>
        <div class="list">
            <div class="alert" v-for="(i,k) in 12" :key="k">
                <div class="spacer"></div>
                <div class="content">
                    <VAvatar :name="`Тест Тестович`"/> 
                    <div class="text">
                        <h4>Тест Тестович</h4>
                        <p>Это текст уведомления. Это текст уведомления. Это текст уведомления. Это текст уведомления. Это текст уведомления</p>
                    </div>
                </div>
                <div class="date">
                    {{moment().format('DD-MM-YYYY HH:MM')}}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import VAvatar from "@/components/header/VAvatar.vue";
    import moment from "moment";
</script>

<style lang="scss" scoped>
    .alerts{
        background: var(--bg-default);
        border: 1px solid var(--bg-border);
        border-radius: 0 0 4px 4px;
        width: 450px;
        max-height: 450px;
        transition: .3s;
        box-shadow: 0px 4px 4px rgba(0, 32, 51, 0.04), 0px 8px 24px rgba(0, 32, 51, 0.12);
        @include flex-col;
    }

    .title{
        font-size: 20px;
        padding: 14px 25px;
    }

    .list{
        height: 100%;
        overflow-y: auto;
    }

    .alert{
        width: 100%;

        .spacer{
            height: 15px;
            background: var(--bg-ghost);
            border: solid var(--bg-border);
            border-width: 1px 0;
        }

        .content{
            display: flex;
            gap: 15px;
            padding: 20px;
            
            h4{
                font-weight: 600;
                font-size: 16px;
                margin-bottom: 6px;
                color: var(--typo-dark);
            }

            p{
                font-size: 14px;
                color: var(--typo-dark);
            }

            .avatar{
                flex-shrink: 0;
                height: 32px;
                width: 32px;
            }
        }

        .date{
            padding: 20px;
            padding-top: 0;
            width: 100%;
            text-align: end;
            font-size: 12px;
            color: var(--typo-secondary);
        }

    }
</style>