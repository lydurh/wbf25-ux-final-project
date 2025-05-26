import { BASE_URL } from "./info.js";

// Fetch the books from the api
const fetchBooks = async (num = null, searchTerm = null) => {
  let url = `${BASE_URL}/books`;
  const params = new URLSearchParams();
  
  // Add search parameter if provided
  if (searchTerm) {
    params.append('s', searchTerm);
  }
  // Add number parameter only if no search term (for random books)
  if (num && !searchTerm) {
    params.append('n', num);
  }
  // Append query parameters to URL if any exist
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

// Fetch detailed information for a single book by ID
const fetchDetailedBook = async (bookId) => {
  const response = await fetch(`${BASE_URL}/books/${bookId}`);
  const data = await response.json();
  return { ...data, book_id: bookId };
};

// Fetches detailed information for multiple books 
const fetchAllDetailedBooks = async (books) => {
  if (!Array.isArray(books)) return [];
  return Promise.all(
    books.map(book => fetchDetailedBook(book.book_id))
  );
};

// Render all the books 
const renderBooks = (detailedBooks) => {
  if (!Array.isArray(detailedBooks)) return;
  const fragment = document.createDocumentFragment();
  detailedBooks.forEach(fullBook => {
    if (!fullBook) return;
    const template = document.querySelector('.book-card');
    if (!template) return;
    const card = template.content.cloneNode(true);
    card.querySelector('h2').innerText = fullBook.title;
    card.querySelector('.author').innerText = fullBook.author;
    card.querySelector('.year').innerText = fullBook.publishing_year;
    card.querySelector('.publisher').innerText = fullBook.publishing_company;
    card.querySelectorAll('img').forEach(image => {
      image.src = fullBook.cover || 'img/bookcover.webp';
      image.alt = fullBook.title;
    });
    card.querySelectorAll('a').forEach(link => {
      link.href = `single-book.html?id=${fullBook.book_id}`;
    });
    fragment.append(card);
  });
  const list = document.querySelector('#book-list');
  list.append(fragment);
};

// Displays random books 
const showRandomBooks = async (append = false) => {
  const NUM_BOOKS = 10;
  const showMoreButton = document.querySelector(".show-more-button");
  const list = document.querySelector('#book-list');
  if (!append && list) {
    list.innerHTML = '';
  }
  if (showMoreButton) showMoreButton.style.display = 'block';
  
  const books = await fetchBooks(NUM_BOOKS);
  const detailedBooks = await fetchAllDetailedBooks(books);
  renderBooks(detailedBooks);
  
};

// Search for books based on user input
const searchBooks = async (searchTerm) => {
  const list = document.querySelector('#book-list');
  const showMoreButton = document.querySelector(".show-more-button");
  
 // If search is empty, show random books instead
    if (!searchTerm.trim()) {
    if (list) list.innerHTML = '';
    await showRandomBooks(false); 
    return;
  }
  
  // Fetch books matching the search term
  const books = await fetchBooks(null, searchTerm);
  const detailedBooks = await fetchAllDetailedBooks(books);

  // Clear current books and render search results
  list.innerHTML = "";
  renderBooks(detailedBooks);
  if (showMoreButton) showMoreButton.style.display = 'none';
  if (detailedBooks.length === 0) {
    list.innerHTML = '<p>No books found matching your search.</p>';
  }
};

document.addEventListener('DOMContentLoaded', () => {

  const searchInput = document.querySelector('#search-input');
  searchInput.value = ""; // Clear any previous  value
  let debounceTimer; // Timer for debouncing search input
  
  if (searchInput) {

    searchInput.addEventListener('input', (event) => {
      const searchTerm = event.target.value;
      
      // Clear previous timer and set new one (debouncing)
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        await searchBooks(searchTerm);
      }, 300); // Wait 300ms after user stops typing
    });
  }
  

  const showMoreButton = document.querySelector(".show-more-button");
  if (showMoreButton) {
    showMoreButton.addEventListener('click', () => showRandomBooks(true));
  }
  

  showRandomBooks(false);
});