import axios from "https://cdn.jsdelivr.net/npm/axios@1.13.2/+esm";
import API_BASE_URL from "./apiConfig.js";
import { handleApiError } from "../../exception/apiException.js";

export const createBooking = async (bookingData) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/bookings`,
            bookingData
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

export const getBookingsByUserId = async (userId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/bookings?userId=${userId}`
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

export const cancelBooking = async (bookingId) => {
    try {
        const response = await axios.patch(
            `${API_BASE_URL}/bookings/${bookingId}`,
            {
                status: "Cancelled"
            }
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

export const deleteBooking = async (bookingId) => {
    try {
        await axios.delete(
            `${API_BASE_URL}/bookings/${bookingId}`
        );
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};