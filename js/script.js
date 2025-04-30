import { baseUrl } from "./info.js";

const showRandomBooks = async () => {

  const response = await fetch(`${baseUrl}/books?n=10`);
  const data = await response.json();
  
  const books = data.books || data.results || data; 
  
  const fragment = document.createDocumentFragment();
  
  books.forEach(book => {
    const card = document.querySelector('.book-card').content.cloneNode(true);
    card.querySelector('h2').innerText = book.title;
    fragment.append(card);
  });
  
  document.querySelector('#book-list').append(fragment);
};

showRandomBooks();

