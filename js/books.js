import { BASE_URL } from "./info.js";

const showRandomBooks = async (replace = true) => {
  const response = await fetch(`${BASE_URL}/books?n=10`);
  const data = await response.json();
  const books = data;
  displayBooks(books, replace);
};

const displayBooks = (books, replace = true) => {
  const bookListContainer = document.querySelector('#book-list');


  if (replace) {
    bookListContainer.innerHTML = '';
  }
  
  const fragment = document.createDocumentFragment();
  
  if (books.length === 0) {
    const noResults = document.createElement('p');
    noResults.classList.add('no-results');
    noResults.innerText = 'No books found matching your search.';
    fragment.append(noResults);
  } else {
    books.forEach(book => {

      const template = document.querySelector('template.book-card, #book-card-template');
      const bookElement = template.content.cloneNode(true);
      
      try {
        bookElement.querySelector('h2').innerText = book.title;
        bookElement.querySelector('.author').innerText = book.author;
        bookElement.querySelector('.year').innerText = book.publishing_year;
        bookElement.querySelector('.publisher').innerText = book.publishing_company;
        
        bookElement.querySelectorAll('a').forEach(link => {
          link.href = `single-book.html?id=${book.book_id}`;
        });
        
        fragment.append(bookElement);
      } catch (error) {
        console.error('error');
      }
    });
  }
  
  bookListContainer.append(fragment);
};

const searchBooks = async (search) => {
  const showMoreButton = document.querySelector(".show-more-button");

  if (!search.trim()) {
    showRandomBooks(true);
    if (showMoreButton) showMoreButton.style.display = 'block';
    return;
  }
  
  try {
    const response = await fetch(`${BASE_URL}/books?s=${search}&limit=1000`); // Adjust limit if needed
    const data = await response.json();
    const books = data.books || data.results || data;
    displayBooks(books, true);


    if (showMoreButton) showMoreButton.style.display = 'none';

  } catch (error) {
    console.error('Error searching books:', error);
  }
};

const initializeSearch = () => {
  const searchInput = document.querySelector('#search-input');
  searchInput.addEventListener('input', (event) => {
    const search = event.target.value;
    searchBooks(search);
  });
};

function showMoreBooks() {
  showRandomBooks(false);
}


document.addEventListener('DOMContentLoaded', () => {

  const searchInput = document.querySelector('#search-input');
  if (searchInput) {
    searchInput.value = '';
  }

  showRandomBooks();
  initializeSearch();
  const showMoreButton = document.querySelector(".show-more-button");
  if (showMoreButton) {
    showMoreButton.addEventListener("click", showMoreBooks);
  }
});
