import { getCookie } from '@/script/cookie.js';
import axios from 'axios';
import config from "@/config.json";

import User from '@/stores/user.js';

export const api = config.api;

export const sendAPI = (method, url, data, cb=()=>{}, errCb=()=>{})=>{
    if(data && data.token != null)data.token = getCookie('token');

    let body = {
        method,
        url: api + url,
        headers: {
            'authorization': getCookie('token') && 'Bearer ' + getCookie('token')
        }
    }

    if(method.toLowerCase() == 'get'){
        body.params = data;
    }else{
        body.data = data;
    }

    axios(body)
    .then((resp) => {
        cb(resp.data);
    })
    .catch((err) => {
        if(err?.response?.status == 401)User().refresh(()=>sendAPI(method, url, data, cb, errCb));
        
        errCb(parseError(err));
    })
}

const parseError = (err)=>{
    let data = err.response?.data;
    if(!data)return err;

    let res = data.detail ||
    data.non_field_errors?.[0] || 
    data;

    console.log(res);

    return res;
}
