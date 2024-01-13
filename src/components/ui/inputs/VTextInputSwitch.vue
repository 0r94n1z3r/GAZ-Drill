<template>
    <div class="text-input-switch" v-click-outside="()=>{
            emit('blur')
            state = false
        }">
        <p @click="pClick" v-show="!state">{{value}}</p>
        <VTextInput
            v-model="value" 
            ref="inp" 

            @blur="()=>{
                emit('blur')
                state = false
            }" 
            @focus="emit('focus')" 
            @keydown.enter="inp.blur()"
            
            :type="type"
            :err="err"
            :placeholder="placeholder"
            :dynamic="dynamic"
            :ultraDynamic="ultraDynamic"
            :delay="delay"
            :borders="borders"
            
            v-show="state"
        />
    </div>
    
</template>

<script setup>
    import { onMounted, ref, watch } from "vue";
    import vClickOutside from 'click-outside-vue3/src/v-click-outside';

    const props = defineProps({
        modelValue: [String, Number],
        type:{
            type: String,
            default: 'text'
        },
        err: [String, Boolean, Object],
        placeholder: [String, Number],
        dynamic: Boolean,
        ultraDynamic: Boolean,
        delay: {
            type: Number,
            default: 0
        },
        borders: String // [1.23;4.56)
    })

    const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'update']);

    const value = ref(props.modelValue);

    watch(()=>props.modelValue, n => {
        value.value = n;
        emit('update:modelValue', n)
        setTimeout(()=>emit('update', n),1);
    })

    watch(value, n => {
        emit('update:modelValue', n)
        setTimeout(()=>emit('update', n),1);
    })

    const inp = ref();

    const state = ref(false);

    const pClick = ()=>{
        inp.value.focus();
        state.value = true;
    }


    defineExpose({focus, blur, pClick});
</script>

<style lang="scss" scoped>
    p{
        padding: 6px 10px;
    }
</style>