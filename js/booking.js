import { getRoomsByHotelId } from "./service/roomService.js";
import { createBooking } from "./service/bookingService.js";

const params = new URLSearchParams(window.location.search);

const hotelId = params.get("hotelId");
const roomId = params.get("roomId");

const selectedRoom = document.getElementById("selected-room");
const bookingForm = document.getElementById("booking-form");
const bookingMessage =
    document.getElementById("booking-message");

const checkInInput =
    document.getElementById("check-in");

const checkOutInput =
    document.getElementById("check-out");

const pricePerNightElement =
    document.getElementById("price-per-night");

const numberOfNightsElement =
    document.getElementById("number-of-nights");

const totalAmountElement =
    document.getElementById("total-amount");

let selectedRoomData = null;


/* ================================
   LOAD SELECTED ROOM
================================ */

const loadSelectedRoom = async () => {

    try {

        const rooms =
            await getRoomsByHotelId(hotelId);

        const room = rooms.find(
            (room) =>
                String(room.id) === String(roomId)
        );

        if (!room) {

            selectedRoom.innerHTML =
                "<p>Room not found.</p>";

            return;
        }

        selectedRoomData = room;

        selectedRoom.innerHTML = `
            <h3>${room.roomType}</h3>

            <p>
                Room Number:
                ${room.roomNumber}
            </p>

            <p>
                Price:
                ₹${room.price} per night
            </p>

            <p>
                Status:
                ${room.status}
            </p>
        `;

        updateBookingSummary();

    } catch (error) {

        console.error(
            "Failed to load room:",
            error
        );

        selectedRoom.innerHTML =
            "<p>Unable to load room information.</p>";
    }
};


/* ================================
   UPDATE PRICE SUMMARY
================================ */

const updateBookingSummary = () => {

    if (!selectedRoomData) {
        return;
    }

    const checkIn =
        checkInInput.value;

    const checkOut =
        checkOutInput.value;


    /* Price per night */

    pricePerNightElement.textContent =
        `₹${selectedRoomData.price}`;


    /* No dates selected */

    if (!checkIn || !checkOut) {

        numberOfNightsElement.textContent =
            "0";

        totalAmountElement.textContent =
            "₹0";

        return;
    }


    const checkInDate =
        new Date(checkIn);

    const checkOutDate =
        new Date(checkOut);


    /* Invalid date range */

    if (checkOutDate <= checkInDate) {

        numberOfNightsElement.textContent =
            "0";

        totalAmountElement.textContent =
            "₹0";

        return;
    }


    const millisecondsPerDay =
        1000 * 60 * 60 * 24;


    const numberOfNights =
        Math.ceil(
            (checkOutDate - checkInDate) /
            millisecondsPerDay
        );


    const totalAmount =
        selectedRoomData.price *
        numberOfNights;


    numberOfNightsElement.textContent =
        numberOfNights;

    totalAmountElement.textContent =
        `₹${totalAmount}`;
};


/* ================================
   DATE CHANGE EVENTS
================================ */

checkInInput.addEventListener(
    "change",
    updateBookingSummary
);

checkOutInput.addEventListener(
    "change",
    updateBookingSummary
);


/* ================================
   BOOKING SUBMIT
================================ */

bookingForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const checkIn =
            checkInInput.value;

        const checkOut =
            checkOutInput.value;

        const guests =
            Number(
                document.getElementById("guests").value
            );


        const checkInDate =
            new Date(checkIn);

        const checkOutDate =
            new Date(checkOut);


        /* Validation */

        if (!checkIn || !checkOut) {

            bookingMessage.textContent =
                "Please select both check-in and check-out dates.";

            return;
        }


        if (checkOutDate <= checkInDate) {

            bookingMessage.textContent =
                "Check-out date must be after check-in date.";

            return;
        }


        if (guests < 1) {

            bookingMessage.textContent =
                "Number of guests must be at least 1.";

            return;
        }


        if (!selectedRoomData) {

            bookingMessage.textContent =
                "Room information is unavailable.";

            return;
        }


        if (selectedRoomData.status !== "Available") {

            bookingMessage.textContent =
                "Sorry, this room is no longer available.";

            return;
        }


        /* Calculate nights */

        const millisecondsPerDay =
            1000 * 60 * 60 * 24;

        const numberOfNights =
            Math.ceil(
                (checkOutDate - checkInDate) /
                millisecondsPerDay
            );


        /* Calculate total */

        const totalAmount =
            selectedRoomData.price *
            numberOfNights;


        /* Booking object */

        const bookingData = {

            userId: 1,

            hotelId: Number(hotelId),

            roomId: Number(roomId),

            checkIn: checkIn,

            checkOut: checkOut,

            guests: guests,

            totalAmount: totalAmount,

            status: "Confirmed"
        };


        try {

            const booking =
                await createBooking(bookingData);


            /* Success message */

            bookingMessage.innerHTML = `
                <div class="booking-success">

                    <div class="success-icon">
                        ✓
                    </div>

                    <h3>
                        Booking Confirmed!
                    </h3>

                    <p>
                        Your room has been
                        successfully booked.
                    </p>

                    <p>
                        Booking ID:
                        <strong>
                            #${booking.id}
                        </strong>
                    </p>

                    <p>
                        Total Amount:
                        <strong>
                            ₹${totalAmount}
                        </strong>
                    </p>

                </div>
            `;

            
            bookingForm.reset();


            /* Reset summary */

            pricePerNightElement.textContent =
                "₹0";

            numberOfNightsElement.textContent =
                "0";

            totalAmountElement.textContent =
                "₹0";


        } catch (error) {

            console.error(
                "Booking failed:",
                error
            );

            bookingMessage.textContent =
                "Booking failed. Please try again.";
        }
    }
);


/* ================================
   INITIAL LOAD
================================ */

loadSelectedRoom();