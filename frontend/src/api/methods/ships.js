import axios from "axios";
import {ShipsApi, PostShipsApi} from "../index";

export const getShips = async () => {
    try {
        return await axios.get(ShipsApi).then(resp => {
            return resp.data
        })
    } catch (error) {
        console.log('cancelled', error);
    }
};

// export const createShip = async (createData) => {
//     const requestData = {
//         method: 'create',
//         data: createData
//     }
//
//     const getURI = `${PostShipsApi}&json=` + encodeURI(JSON.stringify(requestData))
//     try {
//         return await axios.get(`${getURI}`);
//     } catch (error) {
//         console.log('cancelled', error);
//     }
// };
//
// export const updateShip = async (updatedData) => {
//     const requestData = {
//         method: 'update',
//         data: updatedData
//     }
//
//     const getURI = `${PostShipsApi}&json=` + encodeURI(JSON.stringify(requestData))
//     try {
//         return await axios.get(`${getURI}`);
//     } catch (error) {
//         console.log('cancelled', error);
//     }
// };

// export const deleteShip = async (id) => {
//     const requestData = {
//         method: 'delete',
//         data: {
//             id
//         }
//     }
//     const getURI = `${PostShipsApi}&json=` + encodeURI(JSON.stringify(requestData))
//
//     try {
//         return await axios.get(getURI)
//     } catch (error) {
//         console.log('cancelled', error);
//     }
// };
