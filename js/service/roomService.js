import axios from "https://cdn.jsdelivr.net/npm/axios@1.13.2/+esm";
import API_BASE_URL from "./apiConfig.js";
import { handleApiError } from "../../exception/apiException.js";

export const getRoomsByHotelId = async (hotelId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/rooms?hotelId=${hotelId}`
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};