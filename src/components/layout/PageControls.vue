<template>
    <div class="page-controls">
        <div class="stuff"> 
            <slot/>
        </div>

        <div class="btns">
            <slot name="btns"/>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
    .page-controls{
        @include flex-jtf;
        align-items: center;
        gap: 20px;
        margin-bottom: 16px;
        min-height: 32px;
        flex-shrink: 0;

        .btns{
            display: flex;
            gap: 12px;
            align-items: center;
        }
    }
</style>