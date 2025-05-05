import { BASE_URL } from "./info.js";

const showRandomBooks = async (replace = true) => {
  const NUM_BOOKS = 10;
  const response = await fetch(`${BASE_URL}/books?n=${NUM_BOOKS}`);
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

  // Fetch full book info for each book to get the image
  const detailedBooks = await Promise.all(
    books.map(book =>
      fetch(`${BASE_URL}/books/${book.book_id}`)
        .then(res => res.json())
        .then(fullBook => ({ ...fullBook, book_id: book.book_id })) // merge the original book_id
        .catch(() => null)
    )
  );

  detailedBooks.forEach(fullBook => {
    if (!fullBook) return; // skip if fetch failed

    const card = document.querySelector('.book-card').content.cloneNode(true);
    card.firstElementChild.classList.add('book-card-element'); // Applies the card animation

    card.querySelector('h2').innerText = fullBook.title;
    card.querySelector('.author').innerText = fullBook.author;
    card.querySelector('.year').innerText = fullBook.publishing_year;
    card.querySelector('.publisher').innerText = fullBook.publishing_company;
    card.querySelector('img').src = fullBook.cover || 'img/bookcover.webp'; // fallback image
    card.querySelector('img').alt = fullBook.title;

    card.querySelectorAll('a').forEach(link => {
      link.href = `single-book.html?id=${fullBook.book_id}`;
    });

    fragment.append(card);
  });

  document.querySelector('#book-list').append(fragment);
};

  showRandomBooks();
  initializeSearch();
  const showMoreButton = document.querySelector(".show-more-button");
  if (showMoreButton) {
    showMoreButton.addEventListener("click", showMoreBooks);
  }
});
