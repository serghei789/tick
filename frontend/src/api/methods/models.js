import axios from "axios";
import {ModelsApi, PostModelsApi, ResetTableApi} from "../index";

export const getModels = async () => {
    try {
        return await axios.get(ModelsApi).then(resp => {
            return resp.data
        })
    } catch (error) {
        console.log('cancelled', error);
    }
};

export const createModel = async (createData) => {
    const requestData = {
        method: 'create',
        data: createData
    }

    const getURI = `${PostModelsApi}&json=` + encodeURI(JSON.stringify(requestData))
    try {
        return await axios.get(`${getURI}`);
    } catch (error) {
        console.log('cancelled', error);
    }
};

export const updateModel = async (updatedData) => {
    const requestData = {
        method: 'update',
        data: updatedData
    }

    const getURI = `${PostModelsApi}&json=` + encodeURI(JSON.stringify(requestData))
    try {
        return await axios.get(`${getURI}`);
    } catch (error) {
        console.log('cancelled', error);
    }
};

export const deleteModel = async (id) => {
    const requestData = {
        method: 'delete',
        data: {
            id
        }
    }
    const getURI = `${PostModelsApi}&json=` + encodeURI(JSON.stringify(requestData))

    try {
        return await axios.get(getURI)
    } catch (error) {
        console.log('cancelled', error);
    }
};

export const resetModels = async () => {
    const URI = `${ResetTableApi}&tab=models`
    try {
        return await axios.get(`${URI}`);
    } catch (error) {
        console.log('cancelled', error);
    }
};
