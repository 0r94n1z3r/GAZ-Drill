<template>
    <div 
        class="user-drop" 
        v-Click-Outside="()=>{drop = false}" 
        @click="drop = !drop" 
        :drop="drop || null"
    >
        <VAvatar :name="`${User().info.first_name} ${User().info.last_name}`"/>
        <!-- <img v-if="userInfo['avatar']" :src="userInfo['avatar']" alt="" class="avatar"> -->
        <div class="info">
            <div class="name">{{`${User().info.first_name} ${User().info.last_name}`}}</div>
            <!-- <div class="status">test</div> -->
        </div>
        <IDrop class="drop-icon"/>

        <div class="drop">
            <VButton hollow @click="User().exit();">Выйти</VButton>
        </div>
    </div>
</template>

<script setup>
    import IDrop from '@/components/icons/IDrop.vue';
    import VAvatar from '@/components/header/VAvatar.vue';

    import vClickOutside from 'click-outside-vue3/src/v-click-outside';
    import { getCookie } from '@/script/cookie.js';

    import { reactive, ref } from 'vue';

    import User from "@/stores/user.js";

    const drop = ref(false);
</script>

<style lang="scss" scoped>
    

    .user-drop{
        position: relative;
        display: flex;
        gap: 10px;
        align-items: center;
        cursor: pointer;
        max-width: 200px;

        .avatar{
            border-radius: 50%;
            height: 32px;
            width: 32px;
            flex-shrink: 0;
        }

        .info{
            @include flex-col;
            justify-content: center;
            min-width: 0;

            .name{
                font-size: 16px;
                line-height: .8;
                @include text-overflow;
            }

            .status{
                font-size: 12px;
                color: var(--typo-secondary);
            }
        }

        .drop-icon{
            color: var(--c-dark);
            flex-shrink: 0;
            transition: .3s;
        }

        .drop{
            position: absolute;
            right: 0;
            top: calc(100% + 10px);
            width: 100px;
            padding: 5px;
            border-radius: 4px;
            transition: .3s;

            z-index: 5;

            background: var(--c-white);
            box-shadow: var(--shadow);

            .btn{
                height: 30px;
            }
        }

        &:not([drop]){
            .drop{
                @include hidden(-10px)
            }
        }

        &[drop]{
            .drop-icon{
                transform: rotate(.5turn);
            }
        }
    }
</style>