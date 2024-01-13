import { sendAPI } from "@/script/api.js";

let defaultFuncs = (objetType)=>{
    return {
        getList(
            cb=()=>{}, 
            cbErr=()=>{}, 
            fin=()=>{}
        ){
            sendAPI(
                'get',
                `/data/${objetType}/`,
                null,
                res => {cb(res); fin()},
                err => {cbErr(err); fin()}
            );
        },

        get(
            id, 
            cb=()=>{}, 
            cbErr=()=>{}, 
            fin=()=>{}
        ){
            sendAPI(
                'get',
                `/data/${objetType}/${id}/`,
                null,
                res => {cb(res); fin()},
                err => {cbErr(err); fin()}
            );
        },

        set(
            data, 
            cb=()=>{}, 
            cbErr=()=>{}, 
            fin=()=>{}
        ){
            sendAPI(
                'post',
                `/data/${objetType}/`,
                data,
                res => {cb(res); fin()},
                err => {cbErr(err); fin()}
            );
        },

        edit(
            id,
            data,
            cb=()=>{}, 
            cbErr=()=>{}, 
            fin=()=>{}
        ){
            sendAPI(
                'patch',
                `/data/${objetType}/${id}/`,
                data,
                res => {cb(res); fin()},
                err => {cbErr(err); fin()}
            );
        },

        delete(
            id, 
            cb=()=>{}, 
            cbErr=()=>{}, 
            fin=()=>{}
        ){
            sendAPI(
                'delete',
                `/data/${objetType}/${id}/`,
                null,
                res => {cb(res); fin()},
                err => {cbErr(err); fin()}
            );
        }
    }
}

const project = Object.assign({}, defaultFuncs('projects'), {
    getAllWithDrills(cb, cbErr, fin){
        sendAPI(
            'get',
            `/data/projects/with_drills/`,
            null,
            res => {cb(res); fin()},
            err => {cbErr(err); fin()}
        );
    },
    getWithDrills(id, cb, cbErr, fin){
        sendAPI(
            'get',
            `/data/projects/${id}/with_drills/`,
            null,
            res => {cb(res); fin()},
            err => {cbErr(err); fin()}
        );
    },
    
});

const group = Object.assign({}, defaultFuncs('well_groups'), {
    setFortnight(
        id,
        data,
        cb=()=>{}, 
        cbErr=()=>{}, 
        fin=()=>{}
    ){
        sendAPI(
            'post',
            `/data/well_groups/${id}/set_fortnight_data/`,
            data,
            res => {cb(res); fin()},
            err => {cbErr(err); fin()}
        );
    },
});

const drill = Object.assign({}, defaultFuncs('drills'), {});

const well = Object.assign({}, defaultFuncs('wells'), {});

const comment = (objetType)=>{
    return (
            id,
            text,
            cb=()=>{}, 
            cbErr=()=>{}, 
            fin=()=>{}
        )=>{
            sendAPI(
                'post',
                `/data/${objetType}/${id}/add_comment/`,
                {text},
                res => {cb(res); fin()},
                err => {cbErr(err); fin()}
            );
        }
}


const shiftStages = (objetType)=>{
    return (stagesDates, cb=()=>{}, cbErr=()=>{}, fin=()=>{})=>{
            sendAPI(
                'put',
                `/data/${objetType}/bulk_change_dates/`,
                stagesDates,
                (res)=>{cb(res); fin()},
                (err)=>{cbErr(err); fin()},
            )
        }
}

const stage = {
    drill_stages: Object.assign({}, defaultFuncs('drill_stages'), {comment: comment('drill_stages'), shiftStages: shiftStages('drill_stages')}),
    development_stages: Object.assign({}, defaultFuncs('development_stages'), {comment: comment('development_stages'), shiftStages: shiftStages('development_stages')}),
}


export default {
    project,
    group,
    drill,
    well,
    stage
}