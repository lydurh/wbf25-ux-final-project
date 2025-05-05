import { BASE_URL } from "./info.js";

let AUTHOR_ID = new URLSearchParams(window.location.search);
AUTHOR_ID = AUTHOR_ID.get('a');



const showAuthorBooks = async () => {


  const response = await fetch(`${BASE_URL}/books?a=${AUTHOR_ID}`);
  const data = await response.json();

  const books = data.books || data.results || data;

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
    const card = document.querySelector('.book-card').content.cloneNode(true);
    card.firstElementChild.classList.add('book-card-element'); // Applies the card animation

    document.querySelector('title').innerText = fullBook.author;
    document.querySelector('.author').innerText = fullBook.author;
    document.querySelector('#breadcrumb_author').innerText = fullBook.author;

    card.querySelector('h2').innerText = fullBook.title;
    card.querySelector('.author').innerText = fullBook.author
    card.querySelector('.year').innerText = fullBook.publishing_year
    card.querySelector('.publisher').innerText = fullBook.publishing_company
    card.querySelector('img').src = fullBook.cover || 'img/bookcover.webp'; // fallback image
    card.querySelector('img').alt = fullBook.title;

    // Makes a link for each book, which takes to user to the right single book page
    card.querySelectorAll('a').forEach(link => {
      link.href = `single-book.html?id=${fullBook.book_id}`;
    });

    fragment.append(card);
  });

  document.querySelector('#book-list').append(fragment);
};

showAuthorBooks();
