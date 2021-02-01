const randomUserAPI = 'https://randomuser.me/api/?results=12'
const galleryDiv = document.getElementById('gallery');


fetch(randomUserAPI)
    .then(response => response.json())
    .then(response => console.log(response.results));





 /**
 * Dynamically adds the search bar to the page
 */   
function createSearch() {
    const searchParent = document.getElementsByClassName('search-container')[0];
    const searchHTML = `                        
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`;
    searchParent.insertAdjacentHTML('beforeend', searchHTML);
}


 /**
 * Creates the HTML for the user item on the page 
 * @param data - obj from the API providing the user details 
 */   
function buildUserHTML(data) {

    const userHTML = data.map(item => `                
    <div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${data.picture.thumbnail}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${data.name.first} ${data.name.last}</h3>
            <p class="card-text">${data.email}</p>
            <p class="card-text cap">${data.location.city}, ${data.location.state}</p>
        </div>
    </div>`).join('');
    return userHTML;
}

createSearch();