import axios from "axios";
import { PointsApi} from "../index";

export const getPoints = async () => {
    try {
        return await axios.get(PointsApi).then(resp => {
            return resp.data
        })
    } catch (error) {
        console.log('cancelled', error);
    }
}
