import axios from "axios";
import {ConditionsApi, PostConditionsApi, ResetTableApi} from "../index";

export const getConditions = async () => {
    try {
        return await axios.get(ConditionsApi).then(resp => {
            return resp.data
        })
    } catch (error) {
        console.log('cancelled', error);
    }
};

export const updateConditions = async (updatedData) => {
    const requestData = {
        method: 'update',
        data: updatedData
    }

    const getURI = `${PostConditionsApi}&json=` + encodeURI(JSON.stringify(requestData))
    try {
        return await axios.get(`${getURI}`);
    } catch (error) {
        console.log('cancelled', error);
    }
};

export const resetConditions = async () => {
    const getURI = `${ResetTableApi}&tab=constant`
    try {
        return await axios.get(`${getURI}`);
    } catch (error) {
        console.log('cancelled', error);
    }
};
