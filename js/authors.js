import { BASE_URL } from "./info.js";

const showAuthors = async () => {

  const response = await fetch(`${BASE_URL}/authors`);
  const data = await response.json();
  
  const books = data.author || data.results || data; 
  
  const fragment = document.createDocumentFragment();
  
  books.forEach(author => {
    const card = document.querySelector('.author-card').content.cloneNode(true);
    card.querySelector('a').innerText = author.author_name;

    card.querySelectorAll('a').forEach(link => {
      link.href = `authors-books.html?a=${author.author_id}`;
    });

    fragment.append(card);
  });
  
  document.querySelector('#author-list').append(fragment);
};

showAuthors();
