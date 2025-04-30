import { BASE_URL } from './info.js';

let BOOK_ID = new URLSearchParams(window.location.search);
BOOK_ID = BOOK_ID.get('id');



const showBook = async () => {
  
  const response = await fetch(`${BASE_URL}/books/${BOOK_ID}`);
  const data = await response.json();
  const book = document.createDocumentFragment();
  
  
  document.querySelector('h2').innerText = data.title;

  
  document.querySelector('#book').append(book);
};

showBook();



// fetch(`${BASE_URL}/books/${BOOK_ID}`)
// .then(response => response.json())
// .then(data => {
  
//     data = data.book[0];
//     console.log(data);

//     document.querySelector('h2').innerText = data.title;

//     const book = document.createDocumentFragment();


//     document.querySelector('#book').append(book);
// })