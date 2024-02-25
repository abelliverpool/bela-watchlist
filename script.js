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
        // Implement your edit functionality here
        // This function should allow the user to edit the watchlist item at the given index
        // You can display a form with the existing data pre-filled, and allow the user to update it
        console.log("Edit functionality to be implemented.");
    }

    addButton.addEventListener("click", function() {
        const title = titleInput.value.trim();
        const type = typeSelect.value;
        const link = linkInput.value.trim();
        const releaseDate = releaseDateInput.value;
        const status = statusSelect.value;
        const genre = Array.from(genreSelect.selectedOptions).map(option => option.value);
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
            genreSelect.selectedIndex = -1; // Reset genre selection
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
    genreFilter.addEventListener("change", renderWatchlist);

    renderWatchlist();
});
document.addEventListener("DOMContentLoaded", function() {
    const genreFilter = document.getElementById("genre-filter");

    genreFilter.addEventListener("click", function() {
        if (genreFilter.getAttribute('data-state') === 'active') {
            genreFilter.setAttribute('data-state', '');
        } else {
            genreFilter.setAttribute('data-state', 'active');
        }
    });
});
document.addEventListener("DOMContentLoaded", function() {
    const genreFilter = document.getElementById("genre-filter");

    genreFilter.addEventListener("click", function() {
        if (window.innerWidth <= 768) { // Adjust the width as needed for your mobile responsiveness
            toggleGenreOptions();
        }
    });

    function toggleGenreOptions() {
        if (genreFilter.getAttribute('data-state') === 'active') {
            genreFilter.setAttribute('data-state', '');
        } else {
            genreFilter.setAttribute('data-state', 'active');
        }
    }
});
document.addEventListener("DOMContentLoaded", function() {
    const typeSelect = document.getElementById("type-select");
    const episodesInput = document.getElementById("episodes-input");
    const seasonsInput = document.getElementById("seasons-input");

    typeSelect.addEventListener("change", function() {
        const selectedType = typeSelect.value;
        if (selectedType === "series" || selectedType === "anime" || selectedType === "kdrama") {
            episodesInput.style.display = "inline-block";
            seasonsInput.style.display = "inline-block";
        } else {
            episodesInput.style.display = "none";
            seasonsInput.style.display = "none";
        }
    });
});
document.addEventListener("DOMContentLoaded", function() {
    const genreFilter = document.getElementById("genre-filter");
    const genreSelect = document.getElementById("type-select");
    const episodesInput = document.getElementById("episodes-input");
    const seasonsInput = document.getElementById("seasons-input");

    genreFilter.addEventListener("click", function() {
        toggleDropdown(genreFilter);
    });

    genreSelect.addEventListener("click", function() {
        toggleDropdown(genreSelect);
    });

    function toggleDropdown(element) {
        if (element.getAttribute('data-state') === 'active') {
            element.setAttribute('data-state', '');
        } else {
            element.setAttribute('data-state', 'active');
        }
    }

    genreSelect.addEventListener("change", function() {
        const selectedType = genreSelect.value;
        if (selectedType === "series" || selectedType === "anime" || selectedType === "kdrama") {
            episodesInput.style.display = "inline-block";
            seasonsInput.style.display = "inline-block";
        } else {
            episodesInput.style.display = "none";
            seasonsInput.style.display = "none";
        }
    });
});
