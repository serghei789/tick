import axios from "axios";
import {SailingSectionsApi, PostSailingSectionsApi, ResetTableApi} from "../index";

export const getSailingSections = async () => {
    try {
        return await axios.get(SailingSectionsApi).then(resp => {
            return resp.data
        })
    } catch (error) {
        console.log('cancelled', error);
    }
};

export const createSailingSection = async (createData) => {
    const requestData = {
        method: 'create',
        data: createData
    }

    const getURI = `${PostSailingSectionsApi}&json=` + encodeURI(JSON.stringify(requestData))
    try {
        return await axios.get(`${getURI}`);
    } catch (error) {
        console.log('cancelled', error);
    }
};

export const updateSailingSection = async (updatedData) => {
    const requestData = {
        method: 'update',
        data: updatedData
    }

    const getURI = `${PostSailingSectionsApi}&json=` + encodeURI(JSON.stringify(requestData))
    try {
        return await axios.get(`${getURI}`);
    } catch (error) {
        console.log('cancelled', error);
    }
};

export const deleteSailingSection = async (id) => {
    const requestData = {
        method: 'delete',
        data: {
            id
        }
    }
    const getURI = `${PostSailingSectionsApi}&json=` + encodeURI(JSON.stringify(requestData))

    try {
        return await axios.get(getURI)
    } catch (error) {
        console.log('cancelled', error);
    }
};

export const resetSailingSections = async () => {
    const URI = `${ResetTableApi}&tab=sailing_section`
    try {
        return await axios.get(`${URI}`);
    } catch (error) {
        console.log('cancelled', error);
    }
};
