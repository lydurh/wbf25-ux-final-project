import { BASE_URL } from "./info.js";


export const fetchBooks = async (num = null, query = '') => {
  const url = query ? `${BASE_URL}/books?s=${query}` : num ? `${BASE_URL}/books?n=${num}` : `${BASE_URL}/books`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

// Fetch detailed info for a single book
export const fetchDetailedBook = async (bookId) => {
  try {
    const response = await fetch(`${BASE_URL}/books/${bookId}`);
    const data = await response.json();
    return { ...data, book_id: bookId };
  } catch (error) {
    console.error(`Failed to fetch book with ID ${bookId}`, error);
    return null;
  }
};

// Fetch detailed info for an array of books
export const fetchAllDetailedBooks = async (books) => {
  return Promise.all(
    books.map(book => fetchDetailedBook(book.book_id))
  );
};


export const renderBooks = (detailedBooks) => {
  const fragment = document.createDocumentFragment();

  detailedBooks.forEach(fullBook => {
    if (!fullBook) return;

    const card = document.querySelector('.book-card').content.cloneNode(true);
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
  const books = await fetchBooks(NUM_BOOKS);
  const detailedBooks = await fetchAllDetailedBooks(books);
  renderBooks(detailedBooks);
};

const searchBooks = async (search) => {
  const showMoreButton = document.querySelector(".show-more-button");

  if (!search.trim()) {
    showRandomBooks();
    if (showMoreButton) showMoreButton.style.display = 'block';
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/books?s=${search}&limit=1000`); // Adjust limit if needed
    if (!response.ok) {
      console.error('Failed to fetch books:', response.statusText);
      return;
    }
    const data = await response.json();
    const books = data.books || data.results || data;
    renderBooks(books); 

    if (showMoreButton) showMoreButton.style.display = 'none';

  } catch (error) {
    console.error('Error searching books:', error);
  }
};

const initializeSearch = () => {
  const searchInput = document.querySelector('#search-input');
  if (!searchInput) {
    console.error('Search input element not found');
    return;
  }

  searchInput.addEventListener('input', (event) => {
    const search = event.target.value;
    searchBooks(search);
  });
};


showRandomBooks();
initializeSearch();


const showMoreButton = document.querySelector(".show-more-button");
if (showMoreButton) {
  showMoreButton.addEventListener('click', showRandomBooks);
}
