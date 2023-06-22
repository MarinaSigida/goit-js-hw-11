import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { loadPictures } from './pixabay-api';

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
let perPage = 40;
let lightbox;

refs.error.classList.add('hidden');
refs.endOfSearchMessage.classList.add('hidden');
refs.loadMoreBtn.classList.add('hidden');

refs.searchForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  refs.loadMoreBtn.classList.add('hidden');
  refs.gallery.innerHTML = '';
  if (refs.searchQuery.value.trim() !== '') {
    renderGallery(
      await loadPictures(refs.searchQuery.value.trim(), (page = 1), perPage)
    );
  }
});

refs.loadMoreBtn.addEventListener('click', async function (event) {
  renderGallery(await loadPictures(refs.searchQuery.value, ++page, perPage));

  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
});

function renderGallery(data) {
  const { hits: pictures, totalHits } = data;
  if (pictures.length === 0) {
    Notiflix.Notify.failure(refs.error.innerHTML);
    refs.loadMoreBtn.classList.add('hidden');
  }
  let pictureInfo = pictures.map(
    picture =>
      `
      <div class="photo-card">
      <div class="photo-thumb">
      <a class="gallery-link" href=${picture.largeImageURL} >
      <img src="${picture.webformatURL}" alt="${picture.tags}" loading="lazy" />
      </a>
      </div>
      <div class="info">
        <div class="info-item">
          <b>Likes</b>
          <p>${picture.likes}</p>
        </div>
        <div class="info-item">
          <b>Views</b>
          <p>${picture.views}</p>
        </div>
        <div class="info-item">
          <b>Comments</b>
          <p>${picture.comments}</p>
        </div>
        <div class="info-item">
          <b>Downloads</b>
          <p>${picture.downloads}</p>
        </div>
      </div>
    </div>
            `
  );

  refs.gallery.innerHTML += pictureInfo.join('');

  if (page === 1 && totalHits > 0) {
    Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
  }
  if (totalHits <= perPage * page && totalHits > 0) {
    Notiflix.Notify.info(refs.endOfSearchMessage.innerHTML);
    refs.loadMoreBtn.classList.add('hidden');
  } else if (pictures.length !== 0) {
    refs.loadMoreBtn.classList.remove('hidden');
  }

  lightbox = new SimpleLightbox('.gallery a', {});

  lightbox.refresh();
}
