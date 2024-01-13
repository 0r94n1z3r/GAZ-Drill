import { sendAPI } from "@/script/api.js";

const get = (route, cb)=>{
    sendAPI(
        'get',
        route,
        null,
        cb
    )
}

export default {
    organizations(cb){get(`/organizations/organizations/`, cb)},
    extOrganizations(cb){get(`/organizations/external_organizations/`, cb)},
    fields(cb){get(`/data/fields/`, cb)},
    license_areas(cb){get(`/data/license_areas/`, cb)},
}
