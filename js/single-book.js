import { BASE_URL } from './info.js';
import { handleError } from './handle-errors.js'

let BOOK_ID = new URLSearchParams(window.location.search);
BOOK_ID = BOOK_ID.get('id');

const showBook = async () => {
  try {
    // Fetching the book data
    const response = await fetch(`${BASE_URL}/books/${BOOK_ID}`);
    const data = await response.json();

    // Fetching the author data
    const authorsResponse = await fetch(`${BASE_URL}/authors`);
    const authorsData = await authorsResponse.json();

    // Finding the specific author by ID from the authors list
    const author = authorsData.find(author => author.author_name === data.author);

    // Updating the breadcrumb and other elements
    document.querySelector('title').innerText = data.title;
    document.querySelector('#breadcrumb_author').innerText = data.author;
    document.querySelector('#breadcrumb_book').innerText = data.title;
    document.querySelector('h2').innerText = data.title;
    document.querySelector('.author').innerText = data.author;
    document.querySelector('.year').innerText = data.publishing_year;
    document.querySelector('.publisher').innerText = data.publishing_company;
    document.querySelector('#breadcrumb_author').href = `authors-books.html?a=${author.author_id}`;

    const img = document.querySelector('#cover');
    img.setAttribute('src', data.cover ? data.cover : 'img/bookcover.webp');
    img.setAttribute('alt', `${data.title}`);
    console.log(author)
    console.log(data)
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
showBook();

// Loan book func

document.querySelector('#loan-book').addEventListener('click', function (e) {
  e.preventDefault();

  const markAsLoaned = this.innerText === 'Loaned';
  let user_id = sessionStorage.getItem("user_id");
  let user_token = sessionStorage.getItem("user_token");
  let modal = document.querySelector("#loaned-book-modal")



  const params = new URLSearchParams();
  params.append('book_id', BOOK_ID);

  //Fetching the book id when you're a user, so you need to be logged in
  if (user_id){
  fetch(`${BASE_URL}/users/${user_id}/books/${BOOK_ID}`,
    {
      method: markAsLoaned ? 'POST' : 'DELETE',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Token': user_token
      },
      body: params
    }
  )
    .then(response => response.json())
    .then(data => {
      this.innerText = markAsLoaned ? 'Loan' : 'Loaned';
      this.classList.toggle("loaned", !markAsLoaned);
      sessionStorage.setItem(`book_${BOOK_ID}_loaned`, !markAsLoaned);

    })
  
  const list = document.querySelector('main');
  modal.showModal();

  modal.querySelector('.close').addEventListener('click', (e) => {
    e.preventDefault();
    modal.close();
  });
  }
  else {
    window.location.href = "login.html"
  }
  // .catch(handleError); TODO
});


// adds the class "Loaned" to a single book button if the book is loaned, even after refreshing
document.addEventListener("DOMContentLoaded", function () {
  const loanButton = document.querySelector('#loan-book');
  const isLoaned = sessionStorage.getItem(`book_${BOOK_ID}_loaned`) === 'true';

  if (isLoaned) {
    loanButton.classList.add("loaned");
    loanButton.innerText = 'Loaned';
  } else {
    loanButton.classList.remove("loaned");
    loanButton.innerText = 'Loan';
  }
});

// Admin
const LoanHistory = async () => {

  let user_id = sessionStorage.getItem("user_id");
  let user_token = sessionStorage.getItem("user_token");
  const response = await fetch(`${BASE_URL}/admin/${user_id}/books/${BOOK_ID}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Session-Token': user_token
    }
  });
  const data = await response.json();
  console.log(data)
  const loans = data.loans.reverse();

  const fragment = document.createDocumentFragment();

  loans.forEach(loan => {
    const card = document.querySelector("#loan-history").content.cloneNode(true);
    card.querySelector(".loan-date").innerText = loan.loan_date;

    fragment.append(card);
  });
  document.querySelector("#loan-history-table").append(fragment);
};

const checkUserLogged = async () => {

  const adminID = '2679'

  let user_id = sessionStorage.getItem("user_id");
  if (user_id !== adminID || !user_id) {
    document.querySelector('#loan-history-section').classList.add('hidden');

  } else {
    LoanHistory();
  }
}
checkUserLogged();


