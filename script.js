document.addEventListener("DOMContentLoaded", function() {
    const watchlist = document.getElementById("watchlist");
    const filter = document.getElementById("filter");
    const genreFilter = document.getElementById("genre-filter");
    const statusFilter = document.getElementById("status-filter");
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
        const searchTerm = searchInput.value.toLowerCase();

        watchlistData.forEach((item, index) => {
            if ((selectedFilter === "all" || item.type === selectedFilter) &&
                ((selectedGenre === "all") || 
                (selectedGenre !== "all" && item.genres && item.genres.includes(selectedGenre))) &&
                ((selectedStatus === "all") || 
                (selectedStatus !== "all" && item.status === selectedStatus)) &&
                (item.title.toLowerCase().includes(searchTerm) || 
                (item.genres && item.genres.some(genre => genre.toLowerCase().includes(searchTerm))))) {
                const itemElement = document.createElement("div");
                itemElement.classList.add("watchlist-item");
                itemElement.style.backgroundImage = item.image ? `url('${item.image}')` : '';
                itemElement.innerHTML = `
                    <h3 class="editable" data-property="title">${item.title}</h3>
                    <p>Type: ${item.type}</p>
                    ${item.type !== "movie" ? `<p>Episodes: <span class="editable" data-property="episodes">${item.episodes}</span></p>` : ''}
                    ${item.type === "series" || item.type === "anime" || item.type === "kdrama" ? `<p>Seasons: <span class="editable" data-property="seasons">${item.seasons}</span></p>` : ''}                    
                    <p>Status: <span class="editable" data-property="status">${item.status}</span></p>
                    <p>Genres: <span class="editable" data-property="genres">${item.genres ? item.genres.join(", ") : 'N/A'}</span></p>
                    <p>Release Date: <span class="editable" data-property="releaseDate">${item.releaseDate}</span></p>
                    <button class="change-status-button" data-index="${index}">Change Status</button>
                    <button class="remove-button" data-index="${index}">Remove</button>
                     ${item.link ? `<button class="watch-now-button" data-link="${item.link}">Watch Now</button>` : ''}
                `;
                watchlist.appendChild(itemElement);
            }
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
            watchlistData.push({ title: title, type: type, episodes: episodes, seasons: seasons, image: image, link: link, releaseDate: releaseDate, status: status, genres: genres });
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
            seasonsInput.style.display = "none";
        } else {
            episodesInput.style.display = "inline-block";
            seasonsInput.style.display = "inline-block";
        }
    });

    function startEditing(event) {
        const element = event.target;
        const property = element.dataset.property;
        const value = element.textContent;

        const input = document.createElement('input');
        input.value = value;

        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                saveChanges(input, property);
            }
        });
        element.replaceWith(input);
        input.select();
        input.focus();

        input.addEventListener('blur', function() {
            saveChanges(input, property);
        });
    }

    function saveChanges(input, property) {
        const newValue = input.value;
        const span = document.createElement('span');
        span.textContent = newValue;
        span.classList.add('editable');
        span.dataset.property = property;
    
        input.replaceWith(span);
    
        span.addEventListener('click', startEditing);
    
        // Update watchlistData with the new value
        const index = parseInt(span.parentNode.querySelector('.change-status-button').dataset.index);
        if (property === 'title') {
            watchlistData[index].title = newValue;
        } else if (property === 'status') {
            watchlistData[index].status = newValue;
        } else if (property === 'genres') {
            watchlistData[index].genres = newValue.split(',').map(genre => genre.trim());
        } else if (property === 'episodes') {
            watchlistData[index].episodes = newValue;
        } else if (property === 'seasons') {
            watchlistData[index].seasons = newValue;
        } else if (property === 'releaseDate') {
            watchlistData[index].releaseDate = newValue;
        }
    
        // Save the updated watchlistData
        saveWatchlistData();
    
        console.log(`Updated ${property} to ${newValue}`);
    }
    

    filter.addEventListener("change", renderWatchlist);
    genreFilter.addEventListener("change", renderWatchlist);
    statusFilter.addEventListener("change", renderWatchlist);
    searchInput.addEventListener("input", renderWatchlist);

    renderWatchlist();
});
