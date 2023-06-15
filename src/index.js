import axios from 'axios';
import Notiflix from 'notiflix';

const url = 'https://pixabay.com/api/';
const apiKey = '37296987-0578aa7746439ec510be3d7ed';

const refs = {
  searchForm: document.querySelector('.search-form'),
  searchQuery: document.querySelector('input[name="searchQuery"]'),
  gallery: document.querySelector('.gallery'),
  error: document.querySelector('p.error'),
};

refs.error.classList.add('hidden');


refs.searchForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  let data = {
    key: apiKey,
    q: refs.searchQuery.value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };
  try {
    const response = await axios.get(
      url + '?' + new URLSearchParams(data).toString()
    );
    renderGallery(response.data.hits);
  } catch (error) {
    console.error(error);
  }
});

function renderGallery(pictures) {
  if (pictures.length === 0) {
    Notiflix.Notify.failure(refs.error.innerHTML);
  }
  let pictureInfo = pictures.map(
    picture =>
      `
      <div class="photo-card">
      <img src="${picture.webformatURL}" alt="${picture.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          <p>"${picture.likes}"</p>
        </p>
        <p class="info-item">
          <b>Views</b>
          <p>"${picture.views}"</p>
        </p>
        <p class="info-item">
          <b>Comments</b>
          <p>"${picture.comments}"</p>
        </p>
        <p class="info-item">
          <b>Downloads</b>
          <p>"${picture.downloads}"</p>
        </p>
      </div>
    </div>
            `
  );
  refs.gallery.innerHTML = pictureInfo.join('');
}
