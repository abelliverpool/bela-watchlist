document.addEventListener("DOMContentLoaded", function () {
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
        // Populate modal fields with current values
        document.getElementById("edit-title").value = item.title;
        document.getElementById("edit-type").value = item.type;
        document.getElementById("edit-episodes").value = item.episodes;
        document.getElementById("edit-seasons").value = item.seasons;
        document.getElementById("edit-image").value = item.image;
        document.getElementById("edit-link").value = item.link;
        document.getElementById("edit-release-date").value = item.releaseDate;
        document.getElementById("edit-status").value = item.status;
        document.getElementById("edit-genre").value = item.genre ? item.genre.join(", ") : "";

        // Show modal
        document.getElementById("edit-modal").style.display = "block";
    }

    function closeEditModal() {
        // Hide modal
        document.getElementById("edit-modal").style.display = "none";
    }

    function saveChanges(index) {
        // Update item with new values from modal
        watchlistData[index] = {
            title: document.getElementById("edit-title").value,
            type: document.getElementById("edit-type").value,
            episodes: document.getElementById("edit-episodes").value,
            seasons: document.getElementById("edit-seasons").value,
            image: document.getElementById("edit-image").value,
            link: document.getElementById("edit-link").value,
            releaseDate: document.getElementById("edit-release-date").value,
            status: document.getElementById("edit-status").value,
            genre: document.getElementById("edit-genre").value.split(", ")
        };

        saveWatchlistData();
        renderWatchlist();
        closeEditModal();
    }

    addButton.addEventListener("click", function () {
        // Add item to watchlist
        // ...
        renderWatchlist();
    });

    // Add event listener to save changes button in modal
    document.getElementById("save-changes-btn").addEventListener("click", function () {
        const selectedIndex = document.getElementById("edit-modal").getAttribute("data-index");
        saveChanges(selectedIndex);
    });

    // Add event listener to close modal button
    document.getElementById("close-edit-modal-btn").addEventListener("click", closeEditModal);

    filter.addEventListener("change", renderWatchlist);
    typeFilter.addEventListener("change", renderWatchlist);
    genreFilter.addEventListener("change", renderWatchlist);

    renderWatchlist(); // Initial rendering
});
