document.addEventListener("DOMContentLoaded", function() {
    const watchlist = document.getElementById("watchlist");
    const filter = document.getElementById("filter");
    const typeFilter = document.getElementById("type-filter");
    const genreFilter = document.getElementById("genre-filter");
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
    const editModal = document.getElementById("editModal");

    let watchlistData = JSON.parse(localStorage.getItem("watchlistData")) || [];

    function saveWatchlistData() {
        localStorage.setItem("watchlistData", JSON.stringify(watchlistData));
    }

    function renderWatchlist() {
        watchlist.innerHTML = "";
        const selectedFilter = filter.value;
        const selectedType = typeFilter.value;
        const selectedGenre = genreFilter.value;

        watchlistData.forEach((item, index) => {
            if ((selectedFilter === "all" || item.status === selectedFilter) &&
                (selectedType === "all" || item.type === selectedType) &&
                (selectedGenre === "all" || (item.genre && item.genre.includes(selectedGenre)))) {
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
                    ${item.genre ? `<p>Genre: ${item.genre.join(", ")}</p>` : ''}
                    <button class="change-status-button" data-index="${index}">Change Status</button>
                    <button class="remove-button" data-index="${index}">Remove</button>
                    <button class="edit-button" data-index="${index}">Edit</button>
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
            button.addEventListener('click', () => openEditModal(button.dataset.index));
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

    function openEditModal(index) {
        const item = watchlistData[index];
        const editTypeSelect = document.getElementById("edit-type");
        const editFieldsContainer = document.getElementById("edit-fields");
        editFieldsContainer.innerHTML = ""; // Clear previous fields
        
        // Populate fields based on selected data type
        editTypeSelect.onchange = function() {
            const selectedType = editTypeSelect.value;
            editFieldsContainer.innerHTML = ""; // Clear previous fields
            switch(selectedType) {
                case "title":
                    editFieldsContainer.innerHTML = `<label for="new-title">New Title:</label><input type="text" id="new-title" value="${item.title}">`;
                    break;
                case "type":
                    editFieldsContainer.innerHTML = `<label for="new-type">New Type:</label><input type="text" id="new-type" value="${item.type}">`;
                    break;
                case "episodes":
                    editFieldsContainer.innerHTML = `<label for="new-episodes">New Episodes:</label><input type="text" id="new-episodes" value="${item.episodes}">`;
                    break;
                case "seasons":
                    editFieldsContainer.innerHTML = `<label for="new-seasons">New Seasons:</label><input type="text" id="new-seasons" value="${item.seasons}">`;
                    break;
                case "image":
                    editFieldsContainer.innerHTML = `<label for="new-image">New Image URL:</label><input type="text" id="new-image" value="${item.image}">`;
                    break;
                case "link":
                    editFieldsContainer.innerHTML = `<label for="new-link">New Watch Link:</label><input type="text" id="new-link" value="${item.link}">`;
                    break;
                case "releaseDate":
                    editFieldsContainer.innerHTML = `<label for="new-release-date">New Release Date:</label><input type="text" id="new-release-date" value="${item.releaseDate}">`;
                    break;
                case "status":
                    editFieldsContainer.innerHTML = `
                        <label for="new-status">New Status:</label>
                        <select id="new-status">
                            <option value="watching">Watching</option>
                            <option value="watched">Watched</option>
                            <option value="plan-to-watch">Plan to Watch</option>
                            <option value="completed">Completed</option>
                            <option value="dropped">Dropped</option>
                        </select>
                    `;
                    document.getElementById("new-status").value = item.status;
                    break;
                case "genre":
                    editFieldsContainer.innerHTML = `<label for="new-genre">New Genre (comma-separated):</label><input type="text" id="new-genre" value="${item.genre ? item.genre.join(", ") : ""}">`;
                    break;
            }
        };

        // Submit edited data
        const editSubmitButton = document.getElementById("edit-submit");
        editSubmitButton.onclick = function() {
            const selectedType = editTypeSelect.value;
            let newValue;
            if (selectedType === "status") {
                newValue = document.getElementById("new-status").value;
            } else {
                newValue = document.getElementById(`new-${selectedType}`).value;
            }
            // Update watchlist data
            watchlistData[index][selectedType] = newValue;
            saveWatchlistData();
            renderWatchlist();
            // Close modal
            editModal.style.display = "none";
        };

        // Display the modal
        editModal.style.display = "block";
    }

    addButton.addEventListener("click", function() {
        const title = titleInput.value.trim();
        const type = typeSelect.value;
        const link = linkInput.value.trim();
        const releaseDate = releaseDateInput.value;
        const status = statusSelect.value;
        const genre = Array.from(genreSelect.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);
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
            typeSelect.value = "movie";
            episodesInput.value = "";
            seasonsInput.value = "";
            imageInput.value = "";
            linkInput.value = "";
            releaseDateInput.value = "YYYY-MM-DD";
            statusSelect.value = "watching";
            genreSelect.value = "all";
        } else {
            alert("Title can't be empty!");
        }
    });

    filter.addEventListener("change", renderWatchlist);
    typeFilter.addEventListener("change", renderWatchlist);
    genreFilter.addEventListener("change", renderWatchlist);

    renderWatchlist(); // Initial rendering
});
