import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector('.search'),
  input: document.querySelector('.searchTerm'),
  API_KEY: '33728720-baaaf621421e045403ddcb3ff',
  galery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
  URL: 'https://pixabay.com/api/',
  page: 1,

}

refs.form.addEventListener('submit', onCliclBtn);
refs.loadMore.addEventListener('click', loadMoreImg);


function onCliclBtn(e) {
  refs.loadMore.style.display = 'none';
  e.preventDefault();
  refs.galery.innerHTML = '';
  refs.page = 1;
  getData()
}

function loadMoreImg() {
  refs.page += 1;
  getData();
}

async function getData() {
  const { input, API_KEY, URL, page } = refs;

  const params = new URLSearchParams({
    key: API_KEY,
    q: input.value.trim().replaceAll(' ', '+'),
    per_page: 40,
    page: page,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });


  const response = await axios.get(`${URL}?${params}`)

  if (response.data.total === 0) {
    Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    refs.loadMore.style.display = 'none';
    return
  }
  refs.loadMore.style.display = 'block';
  if (response.data.hits.length < 40) {
    Notify.failure("We're sorry, but you've reached the end of search results.")
    refs.loadMore.style.display = 'none';
  }
  if (refs.input.value === '') {
    Notify.failure("You have not entered anything ");
    refs.loadMore.style.display = 'none';
    return
  }

  markUpImg(response.data.hits);
}


function markUpImg(arryImg) {
  const markUp = arryImg.map((el) => {
    const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = el;
    return `
        <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes </b>
            <span>${likes}</span>

          </p>
          <p class="info-item">
            <b>Views</b>
            <span>${views}</span>
          </p>
          <p class="info-item">
            <b>Comments</b>
            <span>${comments}</span>
          </p>
          <p class="info-item">
            <b>Downloads </b>
            <span>${downloads}</span>
          </p>
        </div>
      </div>`
  }).join(" ");
  refs.galery.insertAdjacentHTML("beforeend", markUp);
}