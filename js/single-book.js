import { BASE_URL } from './info.js';
import { handleError} from './handle-errors.js'

let BOOK_ID = new URLSearchParams(window.location.search);
BOOK_ID = BOOK_ID.get('id');



const showBook = async () => {
  
  const response = await fetch(`${BASE_URL}/books/${BOOK_ID}`);
  const data = await response.json();
  const book = document.createDocumentFragment();
  const img = document.querySelector('#cover')

  document.querySelector('title').innerText = data.title;
  document.querySelector('#breadcrumb_author').innerText = data.author;
  document.querySelector('#breadcrumb_book').innerText = data.title;
  document.querySelector('h2').innerText = data.title;
  document.querySelector('.author').innerText = data.author;
  document.querySelector('.year').innerText = data.publishing_year;
  document.querySelector('.publisher').innerText = data.publishing_company;
  
  img.setAttribute('src', data.cover ? data.cover : 'img/bookcover.webp');
  img.setAttribute('alt', `${data.title}`)

  document.querySelector('#book').append(book);
};
console.log(showBook());
showBook();

// Loan book func
document.querySelector('#loan-book').addEventListener('click', function(e) {
    e.preventDefault();

    const markAsLoaned = this.innerText === 'Loaned';
    let user_id = sessionStorage.getItem("user_id");
    let user_token = sessionStorage.getItem("user_token");

    const params = new URLSearchParams();
    params.append('book_id', BOOK_ID);

    //Fetching the book id when you're a user, so you need to be logged in
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
        console.log(data);
        this.innerText = markAsLoaned ? 'Loan' : 'Loaned';
        this.classList.toggle("loaned", !markAsLoaned);
        sessionStorage.setItem(`book_${BOOK_ID}_loaned`, !markAsLoaned);

    })
    .catch(handleError);
});


// adds the class "Loaned" to a single book button if the book is loaned, even after refreshing
document.addEventListener("DOMContentLoaded", function() {
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
  
  if (user_id !== '2679') {
    document.querySelector('#loan-history-section').classList.add('hidden');
    return;
  }
    const fragment = document.createDocumentFragment();

    loans.forEach(loan => {
      const card = document.querySelector("#loan-history").content.cloneNode(true);
      card.querySelector(".loan-date").innerText = loan.loan_date;

      fragment.append(card);
    });
    document.querySelector("#loan-history-table").append(fragment);
  };

LoanHistory()

