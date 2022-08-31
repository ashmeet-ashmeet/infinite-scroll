const imgContainer = document.querySelector('#img-container');
const loader = document.querySelector('#loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// Unsplash API 
let initialCount = 5;
let isInitialLoad = true;
const apiKey = 'iziSBxkUMsQo4ONlWuxTz6S-COl3Cdy_bhkGfL32aZg';
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}`;

// Check if all images were loaded
function imageLoaded() {
    imagesLoaded++;
    if(imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
    }
}

function updateApiUrlWithNewCount(imageCount) {
    apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${imageCount}`;
}

//  Helper function
function setAttributes(element, attributes) {
    for(const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// Create elements for links and photos, and add to DOM
function displayPhotos() {
    totalImages = photosArray.length;
    imagesLoaded = 0;
    // Run function for each object in photsArray
    photosArray.forEach((photo) => {
        //  Create <a> to link to Unsplash
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank'
        });
        // Create <img>
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description
        });

        // Event Listener, check when each is finished loading
        img.addEventListener('load', imageLoaded);

        // Put <img> inside <a>, then put both inside img-container
        item.appendChild(img);
        imgContainer.appendChild(item);
    });
}

// Get photos from Unsplash API
async function getPhotos() {
    try {
        const response = await fetch(apiUrl);
        photosArray = await response.json();
        displayPhotos();
        if(isInitialLoad) {
            updateApiUrlWithNewCount(30);
            isInitialLoad = false;
        }
    } catch(error) {
        // Catch error here
    }
}

// Check to see if scrolling near bottom of page, Load more Photos
window.addEventListener('scroll', () => {
    if((innerHeight + scrollY >= document.body.offsetHeight - 1000) && ready) {
        ready = false;
        getPhotos();
    }
});


// On Load
getPhotos();