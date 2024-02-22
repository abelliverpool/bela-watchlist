document.addEventListener("DOMContentLoaded", function() {
    const watchlist = document.getElementById("watchlist");
    const filter = document.getElementById("filter");
    const addButton = document.getElementById("add-button");
    const titleInput = document.getElementById("title-input");
    const typeSelect = document.getElementById("type-select");
    const episodesInput = document.getElementById("episodes-input");
    const seasonsInput = document.getElementById("seasons-input");
    const imageInput = document.getElementById("image-input");
    const linkInput = document.getElementById("link-input"); // New
    const releaseDateInput = document.getElementById("release-date-input"); // New
    const statusSelect = document.getElementById("status-select"); // New

    let watchlistData = JSON.parse(localStorage.getItem("watchlistData")) || [];

    function saveWatchlistData() {
        localStorage.setItem("watchlistData", JSON.stringify(watchlistData));
    }

    function renderWatchlist() {
        watchlist.innerHTML = "";
        const selectedFilter = filter.value;

        watchlistData.forEach((item, index) => {
            if (selectedFilter === "all" || item.status === selectedFilter) {
                const itemElement = document.createElement("div");
                itemElement.classList.add("watchlist-item");
                itemElement.innerHTML = `
                    <h3>${item.title}</h3>
                    <p>Type: ${item.type}</p>
                    ${item.type !== "movie" ? `<p>Episodes: ${item.episodes}</p>` : ''}
                    ${item.type === "series" || item.type === "anime" || item.type === "kdrama" ? `<p>Seasons: ${item.seasons}</p>` : ''}
                    ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ''}
                    ${item.link ? `<p><a href="${item.link}" target="_blank">Watch Now</a></p>` : ''}
                    ${item.releaseDate ? `<p>Release Date: ${item.releaseDate}</p>` : ''}
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

    addButton.addEventListener("click", function() {
        const title = titleInput.value.trim();
        const type = typeSelect.value;
        const link = linkInput.value.trim(); // New
        const releaseDate = releaseDateInput.value; // New
        const status = statusSelect.value; // New
        let episodes;
        let seasons;
        let image = imageInput.value.trim();
        if (type === "anime" || type === "series" || type === "kdrama") {
            episodes = episodesInput.value.trim();
            seasons = seasonsInput.value.trim();
        }
        if (title !== "") {
            watchlistData.push({ title: title, type: type, episodes: episodes, seasons: seasons, image: image, link: link, releaseDate: releaseDate, status: status });
            renderWatchlist();
            saveWatchlistData(); // Save changes to localStorage
            titleInput.value = "";
            episodesInput.value = "";
            seasonsInput.value = "";
            imageInput.value = "";
            linkInput.value = ""; // New
            releaseDateInput.value = ""; // New
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

    renderWatchlist();
});
function renderWatchlist() {
    watchlist.innerHTML = "";
    const selectedFilter = filter.value;

    watchlistData.forEach((item, index) => {
        if (selectedFilter === "all" || item.status === selectedFilter) {
            const itemElement = document.createElement("div");
            itemElement.classList.add("watchlist-item");
            itemElement.style.backgroundImage = `url('${item.image}')`; // Set background image
            itemElement.innerHTML = `
                <h3>${item.title}</h3>
                <p>Type: ${item.type}</p>
                ${item.type !== "movie" ? `<p>Episodes: ${item.episodes}</p>` : ''}
                ${item.type === "series" || item.type === "anime" || item.type === "kdrama" ? `<p>Seasons: ${item.seasons}</p>` : ''}
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
const releaseDateInput = document.getElementById("release-date-input");

releaseDateInput.addEventListener("input", function() {
    // Check if the input value is valid
    if (isValidDate(this.value)) {
        // If valid, set border color to green
        this.style.borderColor = "green";
    } else {
        // If not valid, set border color to red
        this.style.borderColor = "red";
    }
});

function isValidDate(dateString) {
    // Regular expression to match date format (YYYY-MM-DD)
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    // Check if the input matches the regular expression
    return regex.test(dateString);
}

  
    
