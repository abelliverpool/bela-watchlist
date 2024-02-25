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

    let watchlistData = JSON.parse(localStorage.getItem("watchlistData")) || [];

    function saveWatchlistData() {
        localStorage.setItem("watchlistData", JSON.stringify(watchlistData));
    }

   function renderWatchlist() {
    watchlist.innerHTML = "";
    const selectedFilter = filter.value;
    const selectedType = typeFilter.value;
    const selectedGenre = genreFilter.value.toLowerCase(); // Convert selected genre to lowercase for case-insensitive comparison

    watchlistData.forEach((item, index) => {
        const genres = item.genre ? item.genre.map(genre => genre.toLowerCase()) : []; // Convert item's genres to lowercase for case-insensitive comparison
        const hasMatchingGenre = genres.includes(selectedGenre); // Check if selected genre matches any of the item's genres

        if ((selectedFilter === "all" || item.status === selectedFilter) &&
            (selectedType === "all" || item.type === selectedType) &&
            (selectedGenre === "all" || hasMatchingGenre)) { // Use hasMatchingGenre flag
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
        button.addEventListener('click', () => editItem(button.dataset.index));
    });
}


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
            button.addEventListener('click', () => editItem(button.dataset.index));
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

    function editItem(index) {
        const item = watchlistData[index];
        const newTitle = prompt("Enter the new title:", item.title);
        const newType = prompt("Enter the new type:", item.type);
        const newEpisodes = prompt("Enter the new number of episodes:", item.episodes);
        const newSeasons = prompt("Enter the new number of seasons:", item.seasons);
        const newImage = prompt("Enter the new image URL:", item.image);
        const newLink = prompt("Enter the new watch link:", item.link);
        const newReleaseDate = prompt("Enter the new release date:", item.releaseDate);
        const newStatus = prompt("Enter the new status:", item.status);
        const newGenres = prompt("Enter the new genres (comma-separated):", item.genre ? item.genre.join(", ") : "");

        watchlistData[index] = {
            title: newTitle || item.title,
            type: newType || item.type,
            episodes: newEpisodes || item.episodes,
            seasons: newSeasons || item.seasons,
            image: newImage || item.image,
            link: newLink || item.link,
            releaseDate: newReleaseDate || item.releaseDate,
            status: newStatus || item.status,
            genre: newGenres ? newGenres.split(", ") : (item.genre || [])
        };

        saveWatchlistData(); // Save changes to localStorage
        renderWatchlist();
    }

    function toggleEpisodesAndSeasonsInputs() {
        if (typeSelect.value === "anime" || typeSelect.value === "series" || typeSelect.value === "kdrama") {
            episodesInput.style.display = "block";
            seasonsInput.style.display = "block";
        } else {
            episodesInput.style.display = "none";
            seasonsInput.style.display = "none";
        }
    }

    typeSelect.addEventListener("change", toggleEpisodesAndSeasonsInputs);

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
