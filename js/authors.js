import { BASE_URL } from "./info.js";

const showAuthors = async () => {

  const response = await fetch(`${BASE_URL}/authors`);
  const data = await response.json();
  
  const books = data.author || data.results || data; 
  
  const fragment = document.createDocumentFragment();
  
  books.forEach(author => {
    const card = document.querySelector('.author-card').content.cloneNode(true);
    card.querySelector('h2').innerText = author.author_name;
    fragment.append(card);
  });
  
  document.querySelector('#author-list').append(fragment);
};

showAuthors();
