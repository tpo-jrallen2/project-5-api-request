const randomUserAPI = 'https://randomuser.me/api/?results=12&nat=us';
const galleryDiv = document.getElementById('gallery');
const body = document.getElementsByTagName('body')[0];
let userInfoArray;
let clickedUser;

function initializeApp () {
  fetchUserData(randomUserAPI);
  createSearch();
}

function fetchUserData (url) {
  galleryDiv.innerHTML = 'Loading directory data....';
  fetch(url)
    .then(checkStatus)
    .then(response => response.json())
    .then(response => {
      userInfoArray = response.results;
      buildUserHTML(response.results);
    })
    .catch(err => {
      galleryDiv.innerHTML = 'Error loading directory data.';
      console.error('Error fetching data:', err);
    });
}
/**
 * Checks status of the response
 */
function checkStatus (response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}
/**
 * Dynamically adds the search bar to the page
 */
function createSearch () {
  const searchParent = document.getElementsByClassName('search-container')[0];
  const searchHTML = `                        
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`;
  searchParent.insertAdjacentHTML('beforeend', searchHTML);
  document.getElementById('search-input').addEventListener('input', (e) => {
    if (e.target.value.length === 0) {
      buildUserHTML(userInfoArray);
    } else {
      executeSearch(e.target.value);
    }
  });
}
/**
 * Creates the HTML for the user item on the page
 * @param data - obj from the API providing the user details
 */
function buildUserHTML (data) {
  // reset gallery div html
  galleryDiv.innerHTML = '';
  const userHTML = data.map(user => `                
    <div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${user.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="card-text">${user.email}</p>
            <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
        </div>
    </div>`).join('');
    // inject recently created html
  galleryDiv.insertAdjacentHTML('beforeend', userHTML);
  addCardListeners();
}
/**
 * Adds event listeners to all the card elements on the page
 * Passes the index of the clicked card to, and calls, the buildModal function
 */
function addCardListeners () {
  const cards = document.getElementsByClassName('card');
  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', () => {
      // slice.call code found on stack overflow
      // https://stackoverflow.com/questions/11761881/javascript-dom-find-element-index-in-container
      const cardsArray = Array.prototype.slice.call(document.getElementsByClassName('card'));
      clickedUser = cardsArray.indexOf(cards[i]);
      buildModal();
    });
  }
}
/**
 * Creates the HTML for the modal
 * Called when the card is clicked
 * @param personIndex - index of the clicked card which corresponds to the user object kept in
 * the global userInfoArray variable. Returned from the click event.
 */
function buildModal () {
  /**
     * Adds event listener to remove the modal when user clicks the close button
     */
  function closeBtnHandler () {
    document.getElementById('modal-close-btn').addEventListener('click', () => {
      body.removeChild(body.lastElementChild);
    });
  }
  /**
     * Changes the global clickedUser variable when buttons are clicked
     * Calls buildModal which uses that variable to determine who to show
     */
  function nextPrevBtnHandler () {
    document.getElementsByClassName('modal-btn-container')[0].addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        body.removeChild(body.lastElementChild);
        if (e.target.textContent === 'Next') {
          clickedUser++;
        } else {
          clickedUser--;
        }
        buildModal();
      }
    });
  }
  /**
     * Enables and disables next and prev buttons if there are no previous or no further users to show
     */
  function enableDisableButtons () {
    const nextButton = document.getElementById('modal-next');
    const prevButton = document.getElementById('modal-prev');
    clickedUser === 0 ? prevButton.disabled = true : prevButton.disabled = false;
    clickedUser === (userInfoArray.length - 1) ? nextButton.disabled = true : nextButton.disabled = false;
  }
  /**
     * Selects the appropriate user and builds html for them
     */
  const clickedPerson = userInfoArray[clickedUser];
  const modal = `
    <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${clickedPerson.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${clickedPerson.name.first} ${clickedPerson.name.last}</h3>
                <p class="modal-text">${clickedPerson.email}</p>
                <p class="modal-text cap">${clickedPerson.location.city}</p>
                <hr>
                <p class="modal-text">${prettyPhone(clickedPerson.cell)}</p>
                <p class="modal-text">${clickedPerson.location.street.number} ${clickedPerson.location.street.name}, ${clickedPerson.location.city}, ${clickedPerson.location.state} ${clickedPerson.location.postcode}</p>
                <p class="modal-text">Birthday: ${prettyDate(clickedPerson.dob.date)}</p>
            </div>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>`;
    /**
     * Inject the html and call the handler functions
     */
  body.insertAdjacentHTML('beforeend', modal);
  closeBtnHandler();
  nextPrevBtnHandler();
  enableDisableButtons();
}
/**
 * Formats date string in requested fashion
 * @param uglyDateString - date in string as provided from api
 */
function prettyDate (uglyDateString) {
  const dateRegex = /(\d{4})-(\d{2})-(\d{2})\S+/;
  const dateMatches = uglyDateString.match(dateRegex);
  return `${dateMatches[2]}/${dateMatches[3]}/${dateMatches[1]}`;
}
/**
 * Formats cell phone string in requested fashion
 * @param uglyPhoneString - cell in string as provided from api
 */
function prettyPhone (uglyPhoneString) {
  const phoneRegex = /(\(\d{3}\))-(\d{3}-\d{4})/;
  const phoneMatches = uglyPhoneString.match(phoneRegex);
  return `${phoneMatches[1]} ${phoneMatches[2]}`;
}
/**
 * Takes global userInfoArray variable and filters it into a new array
 * Containing only items that match the provided text string
 * Filters by comparing name fields only
 * @param text - search text from the search field
 */
function executeSearch (text) {
  const resultsArray = userInfoArray.filter(user => {
    const objValues = Object.values(user.name).map(string => string.toLowerCase());
    // return if the joined value for all obj values contains the
    return objValues.join('').includes(text.toLowerCase());
  });
  buildUserHTML(resultsArray);
}

initializeApp();
