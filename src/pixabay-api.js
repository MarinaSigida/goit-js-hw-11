import axios from 'axios';

const url = 'https://pixabay.com/api/';
const apiKey = '37296987-0578aa7746439ec510be3d7ed';

async function loadPictures(searchQuery, page, perPage) {
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
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export { loadPictures };
