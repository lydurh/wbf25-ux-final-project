import { BASE_URL } from "./info.js";

export const fetchBooks = async (num = null, query = '') => {
  const url = query ? `${BASE_URL}/books?s=${query}` : num ? `${BASE_URL}/books?n=${num}` : `${BASE_URL}/books`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};


export const fetchDetailedBook = async (bookId) => {
  try {
    const response = await fetch(`${BASE_URL}/books/${bookId}`);
    const data = await response.json();
    return { ...data, book_id: bookId };
  } catch  {

    return;
  }
};


export const fetchAllDetailedBooks = async (books) => {
  if (!Array.isArray(books)) {
    return [];
  }
  return Promise.all(
    books.map(book => fetchDetailedBook(book.book_id))
  );
};

export const renderBooks = (detailedBooks, searchTerm = ' ') => {

  if (!Array.isArray(detailedBooks)) {
    return;
  }

  const fragment = document.createDocumentFragment();

  detailedBooks.forEach(fullBook => {
    if (!fullBook) return;

    const template = document.querySelector('.book-card');
    if (!template) {
      console.error("Book card template not found");
      return;
    }

    const card = template.content.cloneNode(true);
    card.firstElementChild.classList.add('book-card-element');

    card.querySelector('h2').innerText = fullBook.title;
    card.querySelector('.author').innerText = fullBook.author;
    card.querySelector('.year').innerText = fullBook.publishing_year;
    card.querySelector('.publisher').innerText = fullBook.publishing_company;
    card.querySelector('img').src = fullBook.cover || 'img/bookcover.webp';
    card.querySelector('img').alt = fullBook.title;

    card.querySelectorAll('a').forEach(link => {
      link.href = `single-book.html?id=${fullBook.book_id}`;
    });

    fragment.append(card);
  });

  const list = document.querySelector('#book-list');


  list.append(fragment);
};

export const showRandomBooks = async () => {
  const NUM_BOOKS = 10;
  try {
    const books = await fetchBooks(NUM_BOOKS);
    const detailedBooks = await fetchAllDetailedBooks(books);
    renderBooks(detailedBooks);
  } catch {

  }
};


export const searchBooks = async (searchTerm) => {
  const showMoreButton = document.querySelector(".show-more-button");
  const list = document.querySelector('#book-list');
  

  if (list) list.innerHTML = '';

  if (!searchTerm.trim()) {

    showRandomBooks();
    if (showMoreButton) showMoreButton.style.display = 'block';
    return;
  }

  try {


    const books = await fetchBooks(null, searchTerm);


    if (!books || books.length === 0) {

      list.innerHTML = '<p>No books found matching your search.</p>';
      if (showMoreButton) showMoreButton.style.display = 'none';
      return;
    }


    const detailedBooks = await fetchAllDetailedBooks(books);

    

    renderBooks(detailedBooks);
    

    if (showMoreButton) showMoreButton.style.display = 'none';
  } catch  {

  }
};

const initializeSearch = () => {
  const searchInput = document.querySelector('#search-input');
  if (!searchInput) {
    return;
  }

    searchInput.value = '';


  searchInput.addEventListener('input', (event) => {
  const searchTerm = event.target.value;
  searchBooks(searchTerm);
});
  
};


const initializeApp = () => {

  

  initializeSearch();
  

  const showMoreButton = document.querySelector(".show-more-button");
  if (showMoreButton) {
    showMoreButton.addEventListener('click', showRandomBooks);

  } 
  

  showRandomBooks();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {

  initializeApp();
}
