
// API ACCESS KEY
const apiKey = '?api_key=live_4e0RzfI0rPdKoJy4HIC9m6MSzhjCt6h0GK1hL0Rx21kBWj89uRKGrvDGfiKlOgkD';

async function initialLoad(){
  const urlList = 'https://api.thecatapi.com/v1/breeds?limit=20&page=0';
  const urlImage = 'https://api.thecatapi.com/v1/images/';

  try {
    const response = await fetch(`${urlList}${apiKey}`);
    const data = await response.json();

    // Fetch images in parallel
    const imageRequests = data
      .filter(item => item.reference_image_id)
      .map(item => fetch(`${urlImage}${item.reference_image_id}${apiKey}`).then(res => res.json()));
    
    const imageResponses = await Promise.all(imageRequests);
    const allCatData = data.filter((item, index) => item.reference_image_id && imageResponses[index]);

    // Render all cards at once
    const cardsHTML = allCatData.map(item => render({
      ...item,
      ...imageResponses.find(imgData => imgData.id === item.reference_image_id) // assuming id property in image data
    })).join('');

    document.getElementById("option-2-enhanced-results").innerHTML = cardsHTML;
  } catch (err) {
    console.error(err);
  }
}

async function searchbarEventHandler() {
  let input = document.getElementById("searchbar").value;
  input = input.toLowerCase();
  clearResults();
  let searchUrl = `https://api.thecatapi.com/v1/breeds/search?q=${input}&attach_image=1`;
  const urlImage = 'https://api.thecatapi.com/v1/images/';
  try {
    const response = await fetch(`${searchUrl}${apiKey}`);
    const data = await response.json();

    // Fetch images in parallel
    const imageRequests = data
      .filter(item => item.reference_image_id)
      .map(item => fetch(`${urlImage}${item.reference_image_id}${apiKey}`).then(res => res.json()));
    const imageResponses = await Promise.all(imageRequests);

    const allCatData = data.filter((item, index) => item.reference_image_id && imageResponses[index]);

    // Render all cards at once
    const cardsHTML = allCatData.map(item => render({
      ...item,
      ...imageResponses.find(imgData => imgData.id === item.reference_image_id) // assuming id property in image data
    })).join('');

    document.getElementById("option-2-enhanced-results").innerHTML = cardsHTML;

  } catch (err) {
    console.error(err);
  }
}

function clearResults(){
  document.getElementById("option-2-enhanced-results").innerHTML = '';
}

function render(data) {
  return `
    <li class="card">
      <img src="${data.url}" alt="">
      <div class="card-content">
        <h3 class="header">${data.name}</h3>
      </div>
    </li>`;
}

initialLoad();

const searchbar = document.getElementById("searchbar");
searchbar.addEventListener("keyup", searchbarEventHandler);