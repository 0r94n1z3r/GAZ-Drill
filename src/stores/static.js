import { defineStore } from 'pinia';
import { ref, computed, reactive, onMounted } from "vue";

import apStatic from "@/script/static.js";

export default defineStore("Static", ()=>{

//organizations
    const organizations = ref([])

    const extOrganizations = ref([]);

//fields
    const fields = ref([]);

    const getField = (id)=>fields.value.find(e => e.id === id);

//license_areas
    const license_areas = ref([]);

    const areasOfBranch = (branchId) => license_areas.value.filter(e => e.organization_branch == branchId);
    
    const getLAFamily = (id)=>{
        let license_area = license_areas.value.find(e => e.id === id);

        let organization = null;
        let organization_branch = null;

        organizations.value.some(org => {
            let isBr = org.branches.some(br => {
                if(br.id == license_area?.organization_branch){
                    organization_branch = br;
                    return true;
                }
                return false;
            })

            if(isBr){
                organization = org;
                return true;
            }
            return false;
        })

        return{
            organization,
            organization_branch,
            license_area,
        }
    }

//startup
    const startup = ()=>{
        apStatic.organizations(res => {
            organizations.value = res;
        })
        
        apStatic.extOrganizations(res => {
            extOrganizations.value = res;
        })

        apStatic.fields(res => {
            fields.value = res;
        });

        apStatic.license_areas(res => {
            license_areas.value = res;
        })
    }
    
//----------------------------------------------------------------
    return {
        startup,

        organizations,
        extOrganizations,

        fields,
        getField,

        license_areas,
        areasOfBranch,
        getLAFamily
    }
})