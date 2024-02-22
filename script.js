document.addEventListener("DOMContentLoaded", function() {
    const watchlist = document.getElementById("watchlist");
    const filter = document.getElementById("filter");
    const typeFilter = document.getElementById("type-filter");
    const addButton = document.getElementById("add-button"); // Assuming you have an add button
    const titleInput = document.getElementById("title-input"); // Assuming you have an input for title
    const typeSelect = document.getElementById("type-select"); // Assuming you have an input for type
    const episodesInput = document.getElementById("episodes-input"); // Assuming you have an input for episodes
    const seasonsInput = document.getElementById("seasons-input"); // Assuming you have an input for seasons
    const imageInput = document.getElementById("image-input"); // Assuming you have an input for image
    const linkInput = document.getElementById("link-input"); // New
    const releaseDateInput = document.getElementById("release-date-input"); // New
    const statusSelect = document.getElementById("status-select"); // New

    let watchlistData = JSON.parse(localStorage.getItem("watchlistData"))  [];

    function saveWatchlistData() {
        localStorage.setItem("watchlistData", JSON.stringify(watchlistData));
    }

    function renderWatchlist() {
        watchlist.innerHTML = "";
        const selectedFilter = filter.value;
        const selectedType = typeFilter.value;

        watchlistData.forEach((item, index) => {
            if ((selectedFilter === "all"  item.status === selectedFilter) &&
                (selectedType === "all"  item.type === selectedType)) {
                const itemElement = document.createElement("div");
                itemElement.classList.add("watchlist-item");
                itemElement.innerHTML = `
                    <h3>${item.title}</h3>
                    <p>Type: ${item.type}</p>
                    ${item.type !== "movie" ? `<p>Episodes: ${item.episodes}</p>` : ''}
                    ${item.type === "series"  item.type === "anime" || item.type === "kdrama" ? <p>Seasons: ${item.seasons}</p> : ''}
                    <p>Status: ${item.status}</p>
                    <button class="change-status-button" data-index="${index}">Change Status</button>
                    <button class="remove-button" data-index="${index}">Remove</button>
                `;
                watchlist.appendChild(itemElement);
            }
        });

        // Attach event listeners to dynamically created buttons
        const changeStatusButtons = document.querySelectorAll('.change-status-button');
        const removeButtons = document.querySelectorAll('.remove-button');

        changeStatusButtons.forEach(button => {
            button.addEventListener('click', () => changeStatus(button.dataset.index));
        });

        removeButtons.forEach(button => {
            button.addEventListener('click', () => removeItem(button.dataset.index));
        });
    }

    function changeStatus(index) {
        const statusOptions = ["watching", "watched", "plan-to-watch", "completed", "dropped"];
        const currentIndex = statusOptions.indexOf(watchlistData[index].status);
        const newIndex = (currentIndex + 1) % statusOptions.length;
        watchlistData[index].status = statusOptions[newIndex];
        renderWatchlist();
        saveWatchlistData(); // Save changes to localStorage
    }

    function removeItem(index) {
        const confirmation = confirm("Are you sure you want to remove this item from the watchlist?");
        if (confirmation) {
            watchlistData.splice(index, 1);
            saveWatchlistData(); // Save changes to localStorage
            renderWatchlist();
        }
    }

    // Assuming you have an event listener for adding new items

    // Assuming you have a function isValidDate for date validation

    filter.addEventListener("change", renderWatchlist);
    typeFilter.addEventListener("change", renderWatchlist);

    renderWatchlist();
});
