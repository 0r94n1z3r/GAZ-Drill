import { defineStore } from 'pinia';
import { ref, computed, reactive, onMounted, watch } from "vue";
import { sendAPI } from '@/script/api';
import { getCookie, setCookie, deleteCookie } from "@/script/cookie.js";

export default defineStore("user", ()=>{

    const isLogged = ref(null); //null by default
    const info = ref({});

    const login = (username, password, errCb)=>{
        sendAPI(
            'post',
            '/auth/login/',
            {username, password},
            (res)=>{
                if(res.access_token){
                    setCookie('token', res.access_token, {'max-age': 2678400000});
                    setCookie('refresh-token', res.refresh_token, {'max-age': 2678400000});
                    setCookie('user', JSON.stringify(res.user), {'max-age': 2678400000});
                    info.value = res.user;
                    isLogged.value = true;
                    project.updateProjects();
                }else{
                    errCb(res);
                }
            },
            (err)=>{
                errCb(err);
            }
        )
    };


    const exit = ()=>{
        isLogged.value = false;
        deleteCookie('token');
        deleteCookie('refresh-token');
        deleteCookie('user');
        info.value = {};
    };

    onMounted(()=>{ 
        if(!getCookie('token')){
            exit();
            return;
        }

        verify();
    });

    const refresh = (callback)=>{
        if(!getCookie('refresh-token')){
            exit();
            return;
        }

        sendAPI(
            'post',
            '/auth/token/refresh/',
            {refresh: getCookie('refresh-token')},
            (resp)=>{
                setCookie('token', resp.access, {'max-age': 2678400000});
                callback();
            },
            exit
        );
    }

    const verify = ()=>{
        sendAPI(
            'post',
            '/auth/token/verify/',
            {token: getCookie('token')},
            ()=>{;
                setCookie('token', getCookie('token'), {'max-age': 2678400000});
                setCookie('refresh-token', getCookie('refresh-token'), {'max-age': 2678400000});
                setCookie('user', getCookie('user'), {'max-age': 2678400000});
                info.value = JSON.parse(getCookie('user'));
                isLogged.value = true;
            }
        );
    }

//-----
    const settings = ref({});

    const defaultColors = {
        drill_assembly_color: "#ff9900",
        well_drilling_color: "#00ccff",
        well_development_color: "#99cc00",
        move_to_color: "#ff0000"
    }

    const updateSettings = ()=>{
        sendAPI(
            'get',
            '/auth/user/settings/',
            null,
            (res)=>{
                settings.value = res;

                Object.keys(settings.value).forEach(key => {
                    if(settings.value[key] === '')settings.value[key] = defaultColors[key]
                })
            }
        );
    }

    watch(isLogged, n => {
        if(n)updateSettings();
    });

    const changeSetting = (key, value) => {
        settings.value[key] = value;

        sendAPI(
            'post',
            '/auth/user/settings/',
            settings.value
        );
    }

    const flushColor = (key)=>changeSetting(key, defaultColors[key]);
    

//----------------------------------------------------------------
    return {
        isLogged,
        info,

        login,
        exit,
        refresh,
        verify,

        settings,
        defaultColors,
        changeSetting,
        flushColor
    }
})