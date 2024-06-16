import axios from "axios";
import {InitPlacementsApi, PostInitPlacementsApi, ResetTableApi} from "../index";

export const getInitPlacements = async () => {
    try {
        return await axios.get(InitPlacementsApi).then(resp => {
            return resp.data
        })
    } catch (error) {
        console.log('cancelled', error);
    }
};

export const createInitPlacement = async (createData) => {
    const requestData = {
        method: 'create',
        data: createData
    }

    const getURI = `${PostInitPlacementsApi}&json=` + encodeURI(JSON.stringify(requestData))
    try {
        return await axios.get(`${getURI}`);
    } catch (error) {
        console.log('cancelled', error);
    }
};

export const updateInitPlacement = async (updatedData) => {
    const requestData = {
        method: 'update',
        data: updatedData
    }

    const getURI = `${PostInitPlacementsApi}&json=` + encodeURI(JSON.stringify(requestData))
    try {
        return await axios.get(`${getURI}`);
    } catch (error) {
        console.log('cancelled', error);
    }
};

export const deleteInitPlacement = async (id) => {
    const requestData = {
        method: 'delete',
        data: {
            id
        }
    }
    const getURI = `${PostInitPlacementsApi}&json=` + encodeURI(JSON.stringify(requestData))

    try {
        return await axios.get(getURI)
    } catch (error) {
        console.log('cancelled', error);
    }
};

export const resetInitPlacements = async () => {
    const URI = `${ResetTableApi}&tab=placement_init`
    try {
        return await axios.get(`${URI}`);
    } catch (error) {
        console.log('cancelled', error);
    }
};
