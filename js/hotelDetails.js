import { getHotels } from "./service/hotelService.js";
import { getRoomsByHotelId } from "./service/roomService.js";

const hotelDetails = document.getElementById("hotel-details");
const roomContainer = document.getElementById("room-container");

const hotelId = new URLSearchParams(window.location.search).get("id");

const displayHotel = (hotel) => {
    hotelDetails.innerHTML = `
        <div class="hotel-details-card">

            <div class="hotel-details-image">
                <img
                    src="../assets/images/${hotel.image}"
                    alt="${hotel.name}"
                    onerror="this.style.display='none'"
                >
            </div>

            <div class="hotel-details-content">

                <div class="hotel-details-title">
                    <div>
                        <h2>${hotel.name}</h2>
                        <p class="location">
                            📍 ${hotel.location}
                        </p>
                    </div>

                    <span class="rating">
                        ⭐ ${hotel.rating}
                    </span>
                </div>

                <div class="hotel-price">
                    <small>Starting from</small>
                    <strong>₹${hotel.price}</strong>
                    <span>/ night</span>
                </div>

                <div class="hotel-amenities">
                    <h3>Amenities</h3>

                    <div class="amenities">
                        ${hotel.amenities
                            .map(
                                (amenity) =>
                                    `<span>${amenity}</span>`
                            )
                            .join("")}
                    </div>
                </div>

            </div>

        </div>
    `;
};

const displayRooms = (rooms) => {
    roomContainer.innerHTML = "";

    if (rooms.length === 0) {
        roomContainer.innerHTML = `
            <p class="no-rooms">
                No rooms are currently available.
            </p>
        `;
        return;
    }

    rooms.forEach((room) => {
        const roomCard = document.createElement("div");

        roomCard.className = "room-card";

        roomCard.innerHTML = `
            <div class="room-icon">
                🛏️
            </div>

            <div class="room-info">
                <h3>${room.roomType}</h3>

                <p>
                    Room Number:
                    <strong>${room.roomNumber}</strong>
                </p>

                <span class="room-status ${
                    room.status === "Available"
                        ? "available"
                        : "unavailable"
                }">
                    ${
                        room.status === "Available"
                            ? "● Available"
                            : "● Not Available"
                    }
                </span>
            </div>

            <div class="room-booking">

                <div class="room-price">
                    <strong>₹${room.price}</strong>
                    <span>/ night</span>
                </div>

                <button
                    class="book-room-btn"
                    data-room-id="${room.id}"
                    ${room.status !== "Available" ? "disabled" : ""}
                >
                    ${
                        room.status === "Available"
                            ? "Book Room"
                            : "Not Available"
                    }
                </button>

            </div>
        `;

        roomContainer.appendChild(roomCard);
    });

    const bookButtons =
        document.querySelectorAll(".book-room-btn");

    bookButtons.forEach((button) => {
        button.addEventListener("click", () => {

            const roomId = button.dataset.roomId;

            window.location.href =
                `booking.html?hotelId=${hotelId}&roomId=${roomId}`;
        });
    });
};

const loadHotelDetails = async () => {
    try {
        const hotels = await getHotels();

        const hotel = hotels.find(
            (hotel) => String(hotel.id) === String(hotelId)
        );

        if (!hotel) {
            hotelDetails.innerHTML = "<p>Hotel not found.</p>";
            return;
        }

        displayHotel(hotel);

        const rooms = await getRoomsByHotelId(hotel.id);

        displayRooms(rooms);

    } catch (error) {
        console.error("Failed to load hotel details:", error);
    }
};

loadHotelDetails();