<template>
    <div class="input text-input" :err="error || null" :dynamic="dynamic || null">
        <div class="content" @click="focus()" :focused="focused || null">
            <slot name="pre"/>

            <input 
                :type="type" 
                v-model="text" 
                :placeholder="placeholder"
                :step="0.01"
                ref="inp"
                @focus="focusHandler"
                @blur="blurHandler"
            >

            <div class="fake-div" v-if="dynamic"><pre>{{text}}</pre></div>

            <div class="options">
                <slot/>
            </div>
        </div>
        <div class="err" v-if="typeof error == 'string' && error">{{error}}</div>
    </div>
</template>

<script setup>
    import { ref, watch } from "vue";

    const props = defineProps({
        modelValue: [String, Number],
        type:{
            type: String,
            default: 'text'
        },
        err: [String, Boolean, Object],
        placeholder: [String, Number],
        dynamic: Boolean,
        delay: {
            type: Number,
            default: 0
        },
        borders: String // [1.23;4.56)
    });

    const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'update']);

//text
    const text = ref(props.modelValue != null ? props.modelValue : '');
    let delayTimeout = null;
    watch(text, (n)=>{
        if(delayTimeout)clearTimeout(delayTimeout);

        delayTimeout = setTimeout(
            ()=>{
                emit('update:modelValue', n)
                setTimeout(()=>emit('update', n),1);
            },
            props.delay
        )
    });
    watch(()=>props.modelValue, (n)=>text.value = n);


const inp = ref(null);

//err 
    const error = ref(props.err);

    watch(()=>props.err, e => error.value = e);

//focus
    const focus = ()=>{
        setTimeout(()=> inp.value.focus());
        error.value = null;
    }

    const focused = ref(false);

    const focusHandler = ()=>{
        emit('focus');
        focused.value = true;
    }

//blur
    const blurHandler = ()=>{
        emit('blur');
        focused.value = false;
        
        if(!inBorders(text.value))error.value = `Введено недопустимое значение. Вне ${props.borders}`;
    }

    const blur = ()=>inp.value.blur()



//borders
    let inBorders = (val)=>{
        let brds = props.borders;
        if(!brds)return true;

        let nums = [parseFloat(brds.split(';')[0].slice(1)), parseFloat(brds.split(';')[1].slice(0,-1))];
        val = parseFloat(val);


        return  (isNaN(nums[0]) || (brds[0] == '[' && nums[0]<=val)             || nums[0]<val) &&
                (isNaN(nums[1]) || (brds[brds.length-1] == ']' && nums[1]>=val) || nums[1]>val)
    }


defineExpose({focus, blur});
</script>

<style lang="scss" scoped>
    .input{
        width: 100%;

        .content{
            height: 32px; 
            border: 1px solid var(--bg-border);
            border-radius: 4px;
            display: flex;
            align-items: center;

            transition: .3s;

            input{
                border: none;
                background: transparent;
                width: 100%;
                height: 100%;
                padding: 0 9px;
                border-radius: 3px;
                font-size: inherit;

                &::placeholder{
                    color: #00203359;
                }
            }

            &[focused]{
                border-color: var(--bg-border-focus);
            }
        }

        &[big]{
            .content{
                height: 48px;

                input{
                    padding: 0 13px;
                    font-size: 18px;
                }
            }
        }

        .err{
            font-size: 12px;
            color: var(--typo-alert);
            padding: 1px 9px;
        }

        &[big]{
            .err{
                padding: 2px 13px;
            }
        }

        &[err]{
            .content{
                border-color: var(--bg-alert);
            }
        }

        &[dynamic]{
            width: max-content;
            max-width: 100%;
            overflow: hidden;

            .content{position: relative;}

            input{
                position: absolute;
                height: 100%;
            }

            .fake-div{
                padding: 0 9px;
                font-size: inherit;
                height: 100%;
                pointer-events: none;
                font-family: inherit;
                opacity: 0;

                pre{
                    max-width: 100%;
                    height: 100%;
                }
            }

        }

        &[err-absolute]{
            position: relative;
            
            .err{
                position: absolute;
                background: var(--bg-default);
                padding: 2px 5px;
                border-radius: 3px;
                z-index: 10;
                box-shadow: 0px 4px 4px 0px rgb(0 32 51 / 4%)
            }

            &[err-absolute=top]{
                .err{
                    bottom: calc(100% + 10px);
                    left: 0;
                }
            }
            
            &[err-absolute=bottom]{
                .err{
                    top: calc(100% + 10px);
                    left: 0;
                }
            }
        }

        &[disabled]{
            opacity: .6;
            pointer-events: none;
        }

    }
</style>