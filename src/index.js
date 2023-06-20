import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const url = 'https://pixabay.com/api/';
const apiKey = '37296987-0578aa7746439ec510be3d7ed';

const refs = {
  searchForm: document.querySelector('.search-form'),
  searchQuery: document.querySelector('input[name="searchQuery"]'),
  gallery: document.querySelector('.gallery'),
  error: document.querySelector('p.error'),
  loadMoreBtn: document.querySelector('button[type="button"]'),
  endOfSearchMessage: document.querySelector(
    '[data-message="end-of-search-results"]'
  ),
};

let page;
let lightbox;

refs.error.classList.add('hidden');
refs.endOfSearchMessage.classList.add('hidden');
refs.loadMoreBtn.classList.add('hidden');

refs.searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  refs.loadMoreBtn.classList.add('hidden');
  refs.gallery.innerHTML = '';
  loadPictures(refs.searchQuery.value, (page = 1));
});

async function loadPictures(searchQuery, page, perPage = 40) {
  let data = {
    key: apiKey,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    per_page: perPage,
    page: page,
    safesearch: true,
  };
  try {
    const response = await axios.get(
      url + '?' + new URLSearchParams(data).toString()
    );
    renderGallery(response.data.hits);
    if (page === 1) {
      Notiflix.Notify.info(
        `Hooray! We found ${response.data.totalHits} images.`
      );
    }
    if (response.data.totalHits <= perPage * page) {
      Notiflix.Notify.info(refs.endOfSearchMessage.innerHTML);
      refs.loadMoreBtn.classList.add('hidden');
    }
  } catch (error) {
    console.error(error);
  }
}

refs.loadMoreBtn.addEventListener('click', function (event) {
  loadPictures(refs.searchQuery.value, ++page);
});

function renderGallery(pictures) {
  if (pictures.length === 0) {
    Notiflix.Notify.failure(refs.error.innerHTML);
  }
  let pictureInfo = pictures.map(
    picture =>
      `
      <div class="photo-card">
      <a class="gallery-link" href=${picture.largeImageURL} >
      <img src="${picture.webformatURL}" alt="${picture.tags}" loading="lazy" />
      </a>
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
  refs.gallery.innerHTML += pictureInfo.join('');

  if (page > 1) {
    const { height: cardHeight } =
      refs.gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * (page-1)*40,
      behavior: 'smooth',
    });
  }

  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionsDelay: 250,
  });

  lightbox.refresh();

  refs.loadMoreBtn.classList.remove('hidden');
}
