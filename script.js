document.addEventListener("DOMContentLoaded", function() {
    const watchlist = document.getElementById("watchlist");
    const filter = document.getElementById("filter");
    const typeFilter = document.getElementById("type-filter");
    const addButton = document.getElementById("add-button");
    const titleInput = document.getElementById("title-input");
    const typeSelect = document.getElementById("type-select");
    const episodesInput = document.getElementById("episodes-input");
    const seasonsInput = document.getElementById("seasons-input");
    const imageInput = document.getElementById("image-input");
    const linkInput = document.getElementById("link-input");
    const releaseDateInput = document.getElementById("release-date-input");
    const statusSelect = document.getElementById("status-select");
    const genreSelect = document.getElementById("genre-select");
    const customGenreInput = document.getElementById("custom-genre-input");
    const editButton = document.getElementById("edit-button"); // Add the edit button

    let watchlistData = JSON.parse(localStorage.getItem("watchlistData")) || [];
    let isEditMode = false; // Track the edit mode

    function saveWatchlistData() {
        localStorage.setItem("watchlistData", JSON.stringify(watchlistData));
    }

    function renderWatchlist() {
        watchlist.innerHTML = "";
        const selectedFilter = filter.value;
        const selectedType = typeFilter.value;

        watchlistData.forEach((item, index) => {
            const itemElement = document.createElement("div");
            itemElement.classList.add("watchlist-item");
            itemElement.innerHTML = `
                <h3>${item.title}</h3>
                <p>Type: ${item.type}</p>
                ${item.type !== "movie" ? `<p>Episodes: ${item.episodes}</p>` : ''}
                ${item.type === "series" || item.type === "anime" || item.type === "kdrama" ? `<p>Seasons: ${item.seasons}</p>` : ''}
                ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ''}
                ${item.link ? `<button class="watch-button" data-link="${item.link}">Watch Here</button>` : ''}
                ${item.releaseDate ? `<p>Release Date: ${item.releaseDate}</p>` : ''}
                <p>Status: ${item.status}</p>
                ${isEditMode ? `<button class="edit-watchlist-item-button" data-index="${index}">Edit</button>` : ''}
            `;
            watchlist.appendChild(itemElement);
        });

        // Add the "+" button if in edit mode and item is not in watchlist
        if (isEditMode) {
            watchlistData.forEach(item => {
                itemElement.innerHTML += `
                    ${item.title === "" ? `<button class="add-watchlist-item-button">+</button>` : ''}
                `;
            });
        }

        // Attach event listeners to dynamically created buttons
        const changeStatusButtons = document.querySelectorAll('.change-status-button');
        const removeButtons = document.querySelectorAll('.remove-button');
        const watchButtons = document.querySelectorAll('.watch-button');
        const editButtons = document.querySelectorAll('.edit-watchlist-item-button');
        const addButtons = document.querySelectorAll('.add-watchlist-item-button');

        changeStatusButtons.forEach(button => {
            button.addEventListener('click', () => changeStatus(button.dataset.index));
        });

        removeButtons.forEach(button => {
            button.addEventListener('click', () => removeItem(button.dataset.index));
        });

        watchButtons.forEach(button => {
            button.addEventListener('click', () => watchMovie(button.dataset.link));
        });

        editButtons.forEach(button => {
            button.addEventListener('click', () => editWatchlistItem(button.dataset.index));
        });

        addButtons.forEach(button => {
            button.addEventListener('click', () => addWatchlistItem());
        });
    }

    function watchMovie(link) {
        window.open(link, '_blank');
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

    function editWatchlistItem(index) {
        // Implement logic to edit watchlist item
        // For simplicity, let's assume you have a modal or form for editing
        console.log("Edit item:", watchlistData[index]);
    }

    function addWatchlistItem() {
        // Implement logic to add new watchlist item
        // For simplicity, let's assume you have a modal or form for adding
        console.log("Add new item");
    }

    addButton.addEventListener("click", function() {
        const title = titleInput.value.trim();
        const type = typeSelect.value;
        const link = linkInput.value.trim();
        const releaseDate = releaseDateInput.value;
        const status = statusSelect.value;
        const genre = genreSelect.value || customGenreInput.value.trim(); // Select from existing or custom genre
        let episodes;
        let seasons;
        let image = imageInput.value.trim();
        if (type === "anime" || type === "series" || type === "kdrama") {
            episodes = episodesInput.value.trim();
            seasons = seasonsInput.value.trim();
        }
        if (title !== "") {
            watchlistData.push({ title: title, type: type, episodes: episodes, seasons: seasons, image: image, link: link, releaseDate: releaseDate, status: status, genre: genre });
            renderWatchlist();
            saveWatchlistData(); // Save changes to localStorage
            titleInput.value = "";
            episodesInput.value = "";
            seasonsInput.value = "";
            imageInput.value = "";
            linkInput.value = "";
            releaseDateInput.value = "";
            customGenreInput.value = ""; // Clear custom genre input
        } else {
            alert("Please enter a valid movie or series title.");
        }
    });

    typeSelect.addEventListener("change", function() {
        if (typeSelect.value === "anime" || typeSelect.value === "series" || typeSelect.value === "kdrama") {
            episodesInput.style.display = "inline-block";
            seasonsInput.style.display = "inline-block";
        } else {
            episodesInput.style.display = "none";
            seasonsInput.style.display = "none";
        }
    });

    filter.addEventListener("change", renderWatchlist);
    typeFilter.addEventListener("change", renderWatchlist);

    // Toggle edit mode
    editButton.addEventListener("click", function() {
        isEditMode = !isEditMode;
        renderWatchlist();
    });

    renderWatchlist();
});

// Export button
const exportButton = document.getElementById("export-button");
exportButton.addEventListener("click", exportWatchlist);

// Import watchlist function
function importWatchlist(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        const importedData = JSON.parse(event.target.result);
        if (Array.isArray(importedData)) {
            watchlistData = importedData;
            renderWatchlist();
            saveWatchlistData();
        } else {
            alert("Invalid watchlist file.");
        }
    };
    reader.readAsText(file);
}
