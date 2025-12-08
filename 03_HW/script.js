

//--Get HTML DOM Element References 
let isCardView = false;
const form = document.getElementById('songForm');
const list = document.getElementById('songList');
const submitBtn = document.getElementById('submitBtn');
const tableElement = document.getElementById('songsTable');
const cardsContainer = document.getElementById('songsCards');
const toggleBtn = document.getElementById('toggleView');

let viewMode = "table";

// This runs automatically when the page finishes loading
document.addEventListener('DOMContentLoaded', () => {

    //1) Get From Local Storage
    const storedData = localStorage.getItem('songs');
    //02) if exsist
    if (storedData) {
        // If yes, turn the JSON string back into an Array
        songs = JSON.parse(storedData);
    } else {
        // If no, start with an empty array
        songs = [];
    }

    // SHOW the data
    renderSongs(songs);
});


document.getElementById('sort').addEventListener('change', () => {
    renderSongs();
});



//User Click the Add Button
form.addEventListener('submit', (e) => {
    //Dont submit the for to the server yey let me handle it here
    e.preventDefault();

    //Read Forms Data
    const id = document.getElementById('songId').value;
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const rating = document.getElementById('rating').value;

    if (id) {
        songs = songs.map (song => 
            song.id == id ? { ...song, title, url, rating } : song
        );

        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
        submitBtn.classList.replace('btn-warning', 'btn-success');
        document.getElementById('songId').value = '';

    }  else {
        //create JSON OBJ Based on URL title
        const song = {
            id: Date.now(),
            title: title,
            url: url,
            rating: rating,
            dateAdded: Date.now()
        };

        songs.push(song);
    }  

    //TO DO SAVE  AND RERENDER 
    saveAndRender();
    form.reset();
});

//Save to Local storage and  render UI Table
function saveAndRender() {

    localStorage.setItem('songs', JSON.stringify(songs));
    //TODO RELOAD UI 
    renderSongs();
}


//Display Song From Current Updated songs array as tale Rows 
function renderSongs() {
    list.innerHTML = ''; // Clear current list
    cardsContainer.innerHTML = '';

    if (isCardView) {
    tableElement.classList.add('d-none');
    cardsContainer.classList.remove('d-none');
    } else {
        tableElement.classList.remove('d-none');
        cardsContainer.classList.add('d-none');
    }

    const sortMode = document.getElementById('sort').value;

    let sorted = [...songs];

    if (sortMode === "az") {
        sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    else if (sortMode === "rate") {
        sorted.sort((a, b) => b.rating - a.rating);
    }
    else {
        sorted.sort((a, b) => b.dateAdded - a.dateAdded);
    }

    sorted.forEach(song => {
        // Create table row
        const row = document.createElement('tr');

        const videoId = extractYoutubeId(song.url);
        let thumbHtml = '';

        if (videoId) {
            const thumbUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
            thumbHtml = `
                <a href="${song.url}" target="_blank">
                    <img src="${thumbUrl}" alt="${song.title}" style="width: 80px; margin-right: 8px;">
                </a>
            `;
        }

        if (isCardView) {
            const thumbUrl = videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : '';

            cardsContainer.innerHTML += `
                <div class="col-md-4 mb-3">
                    <div class="card bg-secondary border-info">
                        <img src="${thumbUrl}" class="card-img-top" onclick="playSong('${videoId}')">
                        <div class="card-body">
                            <h5 class="card-title">${song.title}</h5>
                            <p>⭐ ${song.rating}/10</p>
                            <button class="btn btn-sm btn-info" onclick="playSong('${videoId}')"><i class="fas fa-play"></i></button>
                            <button class="btn btn-sm btn-warning" onclick="editSong(${song.id})"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                </div>`;
            return;
        }

        row.innerHTML = `
            <td>${song.title}</td>
            <td>${thumbHtml}
                <a href="${song.url}" target="_blank" class="text-info">Watch</a>
            </td>
            <td>${song.rating}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn btn-sm btn-primary me-2" onclick="playSong('${videoId}')">
                    <i class="fas fa-play"></i>
                </button>
            </td>
        `;
        list.appendChild(row);
    });
}

function deleteSong(id) {
    if (confirm('Are you sure?')) {
        // Filter out the song with the matching ID
        songs = songs.filter(song => song.id !== id);
        saveAndRender();
    }
}

function editSong(id) {

    const songToEdit = songs.find(song => song.id === id);


    document.getElementById('title').value = songToEdit.title;
    document.getElementById('url').value = songToEdit.url;
    document.getElementById('songId').value = songToEdit.id; // Set Hidden ID

    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update';
    submitBtn.classList.replace('btn-success', 'btn-warning');
}

function extractYoutubeId(url) {
    const regExp = /(?:v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

function playSong(videoId){
    window.open(
        `https://www.youtube.com/embed/${videoId}?autoplay=1`,
        "ytplayer",
        "width=600,height=400"
    );
}



function toggleView() {
    isCardView = !isCardView;

    if (isCardView) {
        toggleBtn.innerHTML = '<i class="fas fa-list"></i>';
    } else {
        toggleBtn.innerHTML = '<i class="fas fa-th-large"></i>';
    }

    renderSongs();
}

toggleBtn.addEventListener('click', toggleView);