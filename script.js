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
    const editPanel = document.getElementById("edit-panel");
    const genreSelect = document.getElementById("genre-select"); // New genre select
    const customGenreInput = document.getElementById("custom-genre-input");

    let watchlistData = JSON.parse(localStorage.getItem("watchlistData")) || [];

    function saveWatchlistData() {
        localStorage.setItem("watchlistData", JSON.stringify(watchlistData));
    }

    function renderWatchlist() {
        watchlist.innerHTML = "";
        const selectedFilter = filter.value;
        const selectedType = typeFilter.value;

        watchlistData.forEach((item, index) => {
            if ((selectedFilter === "all" || item.status === selectedFilter) &&
                (selectedType === "all" || item.type === selectedType)) {
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
                    ${item.genre ? `<p>Genre: ${item.genre}</p>` : ''}
                    <p>Status: ${item.status}</p>
                    <button class="edit-button" data-index="${index}">Edit</button>
                    <button class="change-status-button" data-index="${index}">Change Status</button>
                    <button class="remove-button" data-index="${index}">Remove</button>
                `;
                watchlist.appendChild(itemElement);
            }
        });

        // Attach event listeners to dynamically created buttons
        const changeStatusButtons = document.querySelectorAll('.change-status-button');
        const removeButtons = document.querySelectorAll('.remove-button');
        const watchButtons = document.querySelectorAll('.watch-button');
        const editButtons = document.querySelectorAll('.edit-button');

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
            button.addEventListener('click', (event) => editItem(event, button.dataset.index));
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

    function editItem(event, index) {
        editPanel.innerHTML = `
            <div class="edit-panel-content">
                <h2>Edit Item</h2>
                <select id="edit-property-select">
                    <option value="title">Title</option>
                    <option value="image">Image URL</option>
                    <option value="link">Watch Link</option>
                    <option value="episodes">Episodes</option>
                    <option value="seasons">Seasons</option>
                    <option value="releaseDate">Release Date</option>
                    <option value="genre">Genre</option>
                </select>
                <input type="text" id="edit-value-input" placeholder="New Value">
                <button id="edit-save-button">Save</button>
            </div>
        `;

        // Save edited item
        const saveButton = editPanel.querySelector("#edit-save-button");
        saveButton.addEventListener("click", () => {
            const property = document.getElementById("edit-property-select").value;
            const newValue = document.getElementById("edit-value-input").value.trim();
            if (newValue !== "") {
                watchlistData[index][property] = newValue;
                saveWatchlistData(); // Save changes to localStorage
                renderWatchlist();
                editPanel.innerHTML = ""; // Clear edit panel after saving
            } else {
                alert("Please enter a valid value.");
            }
        });
    }

    addButton.addEventListener("click", function() {
        const title = titleInput.value.trim();
        const type = typeSelect.value;
        const link = linkInput.value.trim();
        const releaseDate = releaseDateInput.value;
        const status = statusSelect.value;
        let episodes;
        let seasons;
        let image = imageInput.value.trim();
        let genre = genreSelect.value.trim(); // Get genre select value
        if (type === "anime" || type === "series" || type === "kdrama") {
            episodes = episodesInput.value.trim();
            seasons = seasonsInput.value.trim();
        }
        if (title !== "") {
            if (!genre && customGenreInput.value.trim() !== "") {
                genre = customGenreInput.value.trim();
            }
            watchlistData.push({ title: title, type: type, episodes: episodes, seasons: seasons, image: image, link: link, releaseDate: releaseDate, status: status, genre: genre });
            renderWatchlist();
            saveWatchlistData(); // Save changes to localStorage
            titleInput.value = "";
            episodesInput.value = "";
            seasonsInput.value = "";
            imageInput.value = "";
            linkInput.value = "";
            releaseDateInput.value = "";
            genreSelect.value = "";
            customGenreInput.value = "";
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

function exportWatchlist() {
    const data = JSON.stringify(watchlistData);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "watchlist.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
