import {
    getBookingsByUserId,
    cancelBooking,
    deleteBooking
} from "./service/bookingService.js";

import { getHotels } from "./service/hotelService.js";

import { getRoomsByHotelId } from "./service/roomService.js";


const bookingContainer =
    document.getElementById("booking-container");

const currentUserId = 1;


/* ================================
   DISPLAY BOOKINGS
================================ */

const displayBookings = (bookings, hotels, rooms) => {

    bookingContainer.innerHTML = "";


    if (bookings.length === 0) {

        bookingContainer.innerHTML = `
            <div class="empty-bookings">
                <h3>No bookings yet</h3>
                <p>
                    Your confirmed bookings will
                    appear here.
                </p>

                <a href="index.html">
                    Browse Hotels
                </a>
            </div>
        `;

        return;
    }


    bookings.forEach((booking) => {

        const bookingCard =
            document.createElement("div");

        bookingCard.className =
            "booking-card";


        /* Find hotel */

        const hotel =
            hotels.find(
                (hotel) =>
                    Number(hotel.id) ===
                    Number(booking.hotelId)
            );


        /* Find room */

        const hotelRooms =
            rooms[booking.hotelId] || [];

        const room =
            hotelRooms.find(
                (room) =>
                    Number(room.id) ===
                    Number(booking.roomId)
            );


        const hotelName =
            hotel
                ? hotel.name
                : "Hotel information unavailable";


        const roomName =
            room
                ? room.roomType
                : "Room information unavailable";


        bookingCard.innerHTML = `

            <div class="booking-card-header">

                <div>
                    <h3>
                        ${hotelName}
                    </h3>

                    <p class="booking-room">
                        🛏️ ${roomName}
                    </p>
                </div>

                <span class="
                    booking-status
                    ${
                        booking.status === "Cancelled"
                            ? "cancelled"
                            : "confirmed"
                    }
                ">
                    ${booking.status}
                </span>

            </div>


            <div class="booking-details">

                <div>
                    <span>Booking ID</span>
                    <strong>
                        #${booking.id}
                    </strong>
                </div>

                <div>
                    <span>Check-in</span>
                    <strong>
                        ${booking.checkIn}
                    </strong>
                </div>

                <div>
                    <span>Check-out</span>
                    <strong>
                        ${booking.checkOut}
                    </strong>
                </div>

                <div>
                    <span>Guests</span>
                    <strong>
                        ${booking.guests}
                    </strong>
                </div>

                <div>
                    <span>Total Amount</span>
                    <strong>
                        ₹${booking.totalAmount}
                    </strong>
                </div>

            </div>


            <div class="booking-actions">

        ${
            booking.status !== "Cancelled"
                ? `
                    <button
                        class="cancel-booking-btn"
                        data-id="${booking.id}"
                    >
                        Cancel Booking
                    </button>
                `
                : ""
        }

        <button
            class="delete-booking-btn"
            data-id="${booking.id}"
        >
            Delete
        </button>

    </div>

        `;


        bookingContainer.appendChild(
            bookingCard
        );
    });


    /* ================================
       CANCEL BUTTONS
    ================================ */

    const cancelButtons =
        document.querySelectorAll(
            ".cancel-booking-btn"
        );


        cancelButtons.forEach((button) => {

        button.addEventListener(
            "click",
            async () => {

                const bookingId =
                    button.dataset.id;

                const confirmCancel =
                    confirm(
                        "Are you sure you want to cancel this booking?"
                    );

                if (!confirmCancel) {
                    return;
                }

                try {

                    await cancelBooking(
                        bookingId
                    );

                    await loadBookings();

                } catch (error) {

                    console.error(
                        "Failed to cancel booking:",
                        error
                    );

                }
            }
        );
    });


    /* ================================
       DELETE BUTTONS
    ================================ */

    const deleteButtons =
        document.querySelectorAll(
            ".delete-booking-btn"
        );


    deleteButtons.forEach((button) => {

        button.addEventListener(
            "click",
            async () => {

                const bookingId =
                    button.dataset.id;


                const confirmDelete =
                    confirm(
                        "Are you sure you want to permanently delete this booking?"
                    );


                if (!confirmDelete) {
                    return;
                }


                try {

                    await deleteBooking(
                        bookingId
                    );

                    await loadBookings();

                } catch (error) {

                    console.error(
                        "Failed to delete booking:",
                        error
                    );

                    alert(
                        "Unable to delete booking. Please try again."
                    );
                }
            }
        );
    });

};

/* ================================
   LOAD BOOKINGS
================================ */

const loadBookings = async () => {

    try {

        const bookings =
            await getBookingsByUserId(
                currentUserId
            );


        const hotels =
            await getHotels();


        /* Get rooms for required hotels */

        const uniqueHotelIds =
            [
                ...new Set(
                    bookings.map(
                        (booking) =>
                            Number(booking.hotelId)
                    )
                )
            ];


        const roomResults =
            await Promise.all(
                uniqueHotelIds.map(
                    async (hotelId) => {

                        const rooms =
                            await getRoomsByHotelId(
                                hotelId
                            );

                        return {
                            hotelId,
                            rooms
                        };
                    }
                )
            );


        const rooms = {};


        roomResults.forEach(
            ({ hotelId, rooms: hotelRooms }) => {

                rooms[hotelId] =
                    hotelRooms;

            }
        );


        displayBookings(
            bookings,
            hotels,
            rooms
        );


    } catch (error) {

        console.error(
            "Failed to load bookings:",
            error
        );

        bookingContainer.innerHTML = `
            <p>
                Unable to load your bookings.
                Please try again.
            </p>
        `;
    }
};


loadBookings();