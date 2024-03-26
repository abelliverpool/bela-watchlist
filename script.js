document.addEventListener("DOMContentLoaded", function() {
    const watchlist = document.getElementById("watchlist");
    const filter = document.getElementById("filter");
    const genreFilter = document.getElementById("genre-filter");
    const statusFilter = document.getElementById("status-filter");
    const sortFilter = document.getElementById("sort-filter");
    const searchInput = document.getElementById("search-input");
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
    const addMovieContainer = document.querySelector(".add-movie-container");
    const submitButton = document.getElementById("submit-button");
    
    let watchlistData = JSON.parse(localStorage.getItem("watchlistData")) || [];

    function saveWatchlistData() {
        localStorage.setItem("watchlistData", JSON.stringify(watchlistData));
    }

    function renderWatchlist() {
        watchlist.innerHTML = "";
        const selectedFilter = filter.value;
        const selectedGenre = genreFilter.value;
        const selectedStatus = statusFilter.value;
        const selectedSort = sortFilter.value;
        const searchTerm = searchInput.value.toLowerCase();

        let filteredData = watchlistData.filter(item => {
            return (selectedFilter === "all" || item.type === selectedFilter) &&
                (selectedGenre === "all" || 
                (selectedGenre !== "all" && item.genres && item.genres.includes(selectedGenre))) &&
                (selectedStatus === "all" || 
                (selectedStatus !== "all" && item.status === selectedStatus)) &&
                (item.title.toLowerCase().includes(searchTerm) || 
                (item.genres && item.genres.some(genre => genre.toLowerCase().includes(searchTerm))));
        });

        if (selectedSort === "recently-added") {
            filteredData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } else if (selectedSort === "alphabetically-asc") {
            filteredData.sort((a, b) => a.title.localeCompare(b.title));
        } else if (selectedSort === "alphabetically-desc") {
            filteredData.sort((a, b) => b.title.localeCompare(a.title));
        }

        filteredData.forEach((item, index) => {
            const itemElement = document.createElement("div");
            itemElement.classList.add("watchlist-item");
            
            itemElement.innerHTML = `
                <h3 class="editable" data-property="title">${item.title}</h3>
                <p>Type: ${item.type}</p>
                ${item.type !== "movie" ? `<p>Episodes: <span class="editable" data-property="episodes">${item.episodes}</span></p>` : ''}
                ${item.type === "series" || item.type === "anime" || item.type === "kdrama" ? `<p>Seasons: <span class="editable" data-property="seasons">${item.seasons}</span></p>` : ''}                    
                ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ''}
                <p>Status: <span class="editable" data-property="status">${item.status}</span></p>
                <p>Genres: <span class="editable" data-property="genres">${item.genres ? item.genres.join(", ") : 'N/A'}</span></p>
                <p>Release Date: <span class="editable" data-property="releaseDate">${item.releaseDate}</span></p>
                <button class="watch-now-button" data-link="${item.link}">Watch Now</button>
                <button class="change-status-button" data-index="${index}">Change Status</button>
                <button class="remove-button" data-index="${index}">Remove</button>
                
            `;
            watchlist.appendChild(itemElement);
        });

        // Attach event listeners to dynamically created buttons
        const changeStatusButtons = document.querySelectorAll('.change-status-button');
        const removeButtons = document.querySelectorAll('.remove-button');
        const editableFields = document.querySelectorAll('.editable');

        changeStatusButtons.forEach(button => {
            button.addEventListener('click', () => changeStatus(button.dataset.index));
        });

        removeButtons.forEach(button => {
            button.addEventListener('click', () => removeItem(button.dataset.index));
        });

        editableFields.forEach(field => {
            field.addEventListener('click', startEditing);
        });

        // Attach event listeners to watch-now buttons
        const watchNowButtons = document.querySelectorAll('.watch-now-button');

        watchNowButtons.forEach(button => {
            button.addEventListener('click', () => {
                const link = button.dataset.link;
                // Open link in a new tab
                window.open(link, '_blank');
            });
        });
    }

    function changeStatus(index) {
        const statusOptions = ["watching", "watched", "plan-to-watch", "completed", "dropped"];
        const currentIndex = statusOptions.indexOf(watchlistData[index].status);
        const newIndex = (currentIndex + 1) % statusOptions.length;
        watchlistData[index].status = statusOptions[newIndex];
        renderWatchlist();
        saveWatchlistData();
    }

    function removeItem(index) {
        const confirmation = confirm("Are you sure you want to remove this item from the watchlist?");
        if (confirmation) {
            watchlistData.splice(index, 1);
            saveWatchlistData();
            renderWatchlist();
        }
    }

    addButton.addEventListener("click", function() {
        addMovieContainer.style.display = "block";
    });

    submitButton.addEventListener("click", function() {
        const title = titleInput.value.trim();
        const type = typeSelect.value;
        const link = linkInput.value.trim();
        const releaseDate = releaseDateInput.value;
        const status = statusSelect.value;
        const genres = [...genreSelect.selectedOptions].map(option => option.value);
        let episodes;
        let seasons;
        let image = imageInput.value.trim();
        if (type === "anime" || type === "series" || type === "kdrama") {
            episodes = episodesInput.value.trim();
            seasons = seasonsInput.value.trim();
        }
        if (title !== "") {
            const timestamp = new Date().toISOString(); // Timestamp for sorting
            watchlistData.push({ title, type, episodes, seasons, image, link, releaseDate, status, genres, timestamp });
            renderWatchlist();
            saveWatchlistData();
            titleInput.value = "";
            episodesInput.value = "";
            seasonsInput.value = "";
            imageInput.value = "";
            linkInput.value = "";
            releaseDateInput.value = "";
            genreSelect.selectedIndex = -1;
            addMovieContainer.style.display = "none";
        } else {
            alert("Please enter a valid movie or series title.");
        }
    });

    typeSelect.addEventListener("change", function() {
        if (typeSelect.value === "movie") {
            episodesInput.style.display = "none";
            seasonsInput.style.display =
