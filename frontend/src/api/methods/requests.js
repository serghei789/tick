import axios from "axios";
import {PostRequestsApi, RequestsApi, ResetTableApi} from "../index";

export const getRequests = async () => {
    try {
        return await axios.get(RequestsApi).then(resp => {
            return resp.data.map(request => ({
                id: request.id,
                imo: request.imo,
                ship: request.ship,
                maxSpeed: request.speed,
                pointA: request.point_a,
                pointB: request.point_b,
                startDate: request.datetime_start,
                endDate: request.datetime_end,
                iceClass: request.iceclass,
            }))
        })
    } catch (error) {
        console.log('cancelled', error);
    }
};

export const createRequest = async (createData) => {
    const requestData = {
        method: 'create',
        data: {
            id: createData.id,
            imo: createData.imo,
            ship: createData.ship,
            speed: createData.maxSpeed,
            point_a: createData.pointA,
            point_b: createData.pointB,
            datetime_start: createData.startDate,
            datetime_end: createData.endDate,
            iceclass: createData.iceClass,
        }
    }

    const getURI = `${PostRequestsApi}&json=` + encodeURI(JSON.stringify(requestData))
    try {
        return await axios.get(`${getURI}`);
    } catch (error) {
        console.log('cancelled', error);
    }
};

export const updateRequest = async (updatedData) => {
    const requestData = {
        method: 'update',
        data: {
            id: updatedData.id,
            imo: updatedData.imo,
            ship: updatedData.ship,
            speed: updatedData.maxSpeed,
            point_a: updatedData.pointA,
            point_b: updatedData.pointB,
            datetime_start: updatedData.startDate,
            datetime_end: updatedData.endDate,
            iceclass: updatedData.iceClass,
        }
    }

    const getURI = `${PostRequestsApi}&json=` + encodeURI(JSON.stringify(requestData))
    try {
        return await axios.get(`${getURI}`);
    } catch (error) {
        console.log('cancelled', error);
    }
};

export const deleteRequest = async (id) => {
    const requestData = {
        method: 'delete',
        data: {
            id
        }
    }
    const getURI = `${PostRequestsApi}&json=` + encodeURI(JSON.stringify(requestData))

    try {
        return await axios.get(getURI)
    } catch (error) {
        console.log('cancelled', error);
    }
};



export const resetRequests = async () => {
    const URI = `${ResetTableApi}&tab=y_schedule`
    try {
        return await axios.get(`${URI}`);
    } catch (error) {
        console.log('cancelled', error);
    }
};
