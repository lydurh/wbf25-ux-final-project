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
  } catch (error) {
    console.error(`Failed to fetch book with ID ${bookId}`, error);
    return null;
  }
};


export const fetchAllDetailedBooks = async (books) => {
  if (!Array.isArray(books)) {
    console.error("Expected books to be an array, got:", books);
    return [];
  }
  return Promise.all(
    books.map(book => fetchDetailedBook(book.book_id))
  );
};

export const renderBooks = (detailedBooks, searchTerm = ' ') => {

  if (!Array.isArray(detailedBooks)) {
    console.error("detailedBooks is not an array:", detailedBooks);
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
  } catch (error) {
    console.error("Error fetching random books:", error);
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
    console.log(`Searching for: "${searchTerm}"`);

    const books = await fetchBooks(null, searchTerm);
    console.log("Search results:", books);

    if (!books || books.length === 0) {

      list.innerHTML = '<p>No books found matching your search.</p>';
      if (showMoreButton) showMoreButton.style.display = 'none';
      return;
    }


    const detailedBooks = await fetchAllDetailedBooks(books);
    console.log("Detailed search results:", detailedBooks);
    

    renderBooks(detailedBooks);
    

    if (showMoreButton) showMoreButton.style.display = 'none';
  } catch (error) {
    console.error('Error searching books:', error);
    list.innerHTML = '<p>An error occurred while searching. Please try again.</p>';
  }
};

const initializeSearch = () => {
  const searchInput = document.querySelector('#search-input');
  if (!searchInput) {
    console.error("Search input element not found");
    return;
  }

    searchInput.value = '';



  let debounceTimer;
  searchInput.addEventListener('input', (event) => {

    clearTimeout(debounceTimer);
    

    debounceTimer = setTimeout(() => {
      const searchTerm = event.target.value;
      searchBooks(searchTerm);
    }, 300); // Wait 300ms after typing stops
  });
  
  console.log("Search initialized");
};


const initializeApp = () => {
  console.log("Initializing app");
  

  initializeSearch();
  

  const showMoreButton = document.querySelector(".show-more-button");
  if (showMoreButton) {
    showMoreButton.addEventListener('click', showRandomBooks);
    console.log("Show more button initialized");
  } else {
    console.warn("Show more button not found");
  }
  

  showRandomBooks();
};


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {

  initializeApp();
}





