import axios from "https://cdn.jsdelivr.net/npm/axios@1.13.2/+esm";
import API_BASE_URL from "./apiConfig.js";
import { handleApiError } from "../../exception/apiException.js";

export const getHotels = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/hotels`);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};