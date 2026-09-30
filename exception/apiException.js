export const handleApiError = (error) => {
    if (error.response) {
        console.error(
            `API Error: ${error.response.status} - ${error.response.statusText}`
        );
    } else if (error.request) {
        console.error("Network Error: Unable to reach the server.");
    } else {
        console.error(`Request Error: ${error.message}`);
    }
};