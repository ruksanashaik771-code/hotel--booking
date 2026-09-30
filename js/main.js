import { getHotels } from "./service/hotelService.js";

const hotelContainer = document.getElementById("hotel-container");
const searchInput = document.getElementById("search-input");
const locationFilter = document.getElementById("location-filter");
const priceFilter = document.getElementById("price-filter");
const clearFilters = document.getElementById("clear-filters");

let allHotels = [];

const displayHotels = (hotels) => {
    hotelContainer.innerHTML = "";

    hotels.forEach((hotel) => {
        const hotelCard = document.createElement("div");

        hotelCard.className = "hotel-card";

        hotelCard.innerHTML = `
            <div class="hotel-image">
                <img
                    src="./assets/images/${hotel.image}"
                    alt="${hotel.name}"
                    onerror="this.style.display='none'"
                >
            </div>

            <div class="hotel-content">

                <div class="hotel-title-row">
                    <h3>${hotel.name}</h3>
                    <span class="rating">
                        ⭐ ${hotel.rating}
                    </span>
                </div>

                <p class="location">
                    📍 ${hotel.location}
                </p>

                <div class="amenities">
                    ${hotel.amenities
                        .slice(0, 3)
                        .map(
                            (amenity) =>
                                `<span>${amenity}</span>`
                        )
                        .join("")}
                </div>

                <div class="hotel-footer">

                    <div>
                        <small>Starting from</small>
                        <strong>₹${hotel.price}</strong>
                        <small>/night</small>
                    </div>

                    <button
                        class="view-rooms-btn"
                        data-id="${hotel.id}"
                    >
                        View Rooms
                    </button>

                </div>

            </div>
        `;

        hotelContainer.appendChild(hotelCard);
    });

    const viewButtons =
        document.querySelectorAll(".view-rooms-btn");

    viewButtons.forEach((button) => {
        button.addEventListener("click", () => {

            const hotelId = button.dataset.id;

            window.location.href =
                `./views/hotel-details.html?id=${hotelId}`;
        });
    });
};

const loadHotels = async () => {
    try {
        const hotels = await getHotels();

        allHotels = hotels;

        displayHotels(allHotels);

    } catch (error) {
        console.error(
            "Failed to load hotels:",
            error
        );
    }
};

const applyFilters = () => {
    const searchText =
        searchInput.value.toLowerCase().trim();

    const selectedLocation =
        locationFilter.value;

    const maxPrice =
        priceFilter.value;

    const filteredHotels = allHotels.filter((hotel) => {

        const matchesSearch =
            hotel.name
                .toLowerCase()
                .includes(searchText);

        const matchesLocation =
            selectedLocation === "" ||
            hotel.location === selectedLocation;

        const matchesPrice =
            maxPrice === "" ||
            hotel.price <= Number(maxPrice);

        return (
            matchesSearch &&
            matchesLocation &&
            matchesPrice
        );
    });

    displayHotels(filteredHotels);
};
searchInput.addEventListener(
    "input",
    applyFilters
);

locationFilter.addEventListener(
    "change",
    applyFilters
);

priceFilter.addEventListener(
    "change",
    applyFilters
);

clearFilters.addEventListener(
    "click",
    () => {

        searchInput.value = "";
        locationFilter.value = "";
        priceFilter.value = "";

        displayHotels(allHotels);
    }
);

loadHotels();