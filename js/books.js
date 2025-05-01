import { BASE_URL } from "./info.js";

const showRandomBooks = async () => {

  const response = await fetch(`${BASE_URL}/books?n=10`);
  const data = await response.json();

  const books = data.books || data.results || data;

  const fragment = document.createDocumentFragment();

  books.forEach(book => {
    const card = document.querySelector('.book-card').content.cloneNode(true);


    card.querySelector('h2').innerText = book.title;

    card.querySelector('.author').innerText = book.author
    card.querySelector('.year').innerText = book.publishing_year
    card.querySelector('.publisher').innerText = book.publishing_company
    // Makes a link for each book, which takes to user to the right single book page
    card.querySelectorAll('a').forEach(link => {
      link.href = `single-book.html?id=${book.book_id}`;
    });

    fragment.append(card);
  });

  document.querySelector('#book-list').append(fragment);
};

showRandomBooks();

