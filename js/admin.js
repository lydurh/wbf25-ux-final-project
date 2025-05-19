import { BASE_URL } from "./info.js";
import { header } from './api.js';
import { handleAPIError, handleError, showMessage } from './handle-errors.js';
const user_id = sessionStorage.getItem("user_id");
const adminID = '2679';

if (user_id != adminID) {
  document.querySelector('section').remove();
  window.location.href = "login.html"
} else {


// Validate form
const validateForm = (formData, formType) => {
  const errors = [];

  if (formType === 'author') {
    const authorFirstNameInput = document.querySelector('#authorFirstName');
    const authorLastNameInput = document.querySelector('#authorLastName');

    if (formData.authorFirstName.length < 2) {
      errors.push("Author first name must be at least 2 characters");
      authorFirstNameInput.classList.add("inputError");
    } else {
      authorFirstNameInput.classList.remove("inputError");
    }

    if (formData.authorLastName.length < 2) {
      errors.push("Author last name must be at least 2 characters");
      authorLastNameInput.classList.add("inputError");
    } else {
      authorLastNameInput.classList.remove("inputError");
    }
  }

  if (formType === 'publisher') {
    const publisherNameInput = document.querySelector('#publisherName');

    if (formData.publisherName.length < 2) {
      errors.push("Publisher name must be at least 2 characters");
      publisherNameInput.classList.add("inputError");
    } else {
      publisherNameInput.classList.remove("inputError");
    }
  }

  if (formType === 'book') {
    const bookTitleInput = document.querySelector('#bookTitle');
    const authorIdInput = document.querySelector('#authorId');
    const publisherIdInput = document.querySelector('#publisherId');
    const publishingYearInput = document.querySelector('#publishingYear');

    if (formData.bookTitle.length < 2) {
      errors.push("Book title must be at least 2 characters");
      bookTitleInput.classList.add("inputError");
    } else {
      bookTitleInput.classList.remove("inputError");
    }

    if (!formData.authorId) {
      errors.push("Author is required");
      authorIdInput.classList.add("inputError");
    } else {
      authorIdInput.classList.remove("inputError");
    }

    if (!formData.publisherId) {
      errors.push("Publisher is required");
      publisherIdInput.classList.add("inputError");
    } else {
      publisherIdInput.classList.remove("inputError");
    }

    if (!formData.publishingYear || isNaN(formData.publishingYear) || formData.publishingYear < 1000 || formData.publishingYear > 2025) {
      errors.push("Publishing year must be between 1000 and 2025");
      publishingYearInput.classList.add("inputError");
    } else {
      publishingYearInput.classList.remove("inputError");
    }
  }

  return errors;
};


  const showAuthors = async () => {

    const response = await fetch(`${BASE_URL}/authors`);
    const data = await response.json();

    const author = data.author || data.results || data;

    const fragment = document.createDocumentFragment();

    author.forEach(author => {
      const option = document.querySelector('#authorTemplate').content.cloneNode(true);
      option.querySelector('.optionAuthorId').innerText = author.author_name;
      option.querySelector('.optionAuthorId').value = author.author_id;



      fragment.append(option);
    });

    document.querySelector('#authorId').append(fragment);
  };

  showAuthors();

  const showPublishers = async () => {

    const response = await fetch(`${BASE_URL}/publishers`);
    const data = await response.json();

    const publisher = data.publisher || data.results || data;

    const fragment = document.createDocumentFragment();

    publisher.forEach(publisher => {
      const option = document.querySelector('#publisherTemplate').content.cloneNode(true);
      option.querySelector('.optionPublisherId').innerText = publisher.publisher_name;
      option.querySelector('.optionPublisherId').value = publisher.publisher_id;


      fragment.append(option);
    });

    document.querySelector('#publisherId').append(fragment);
  };

  showPublishers();

// Handling book form submission
document.querySelector('#form_book').addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = {
    bookTitle: e.target.bookTitle.value.trim(),
    authorId: e.target.authorId.value.trim(),
    publisherId: e.target.publisherId.value.trim(),
    publishingYear: e.target.publishingYear.value.trim()
  };

  const validationErrors = validateForm(formData, 'book');

  if (validationErrors.length > 0) {
    showMessage(validationErrors[0], "error");
    return;
  }

  const params = new URLSearchParams();
  params.append('title', formData.bookTitle);
  params.append('author_id', formData.authorId);
  params.append('publisher_id', formData.publisherId);
  params.append('publishing_year', formData.publishingYear);

  fetch(`${BASE_URL}/admin/${user_id}/books`, {
    method: "POST",
    body: params,
    headers: header
  }).then(() => {
    e.target.bookTitle.value = "";
    e.target.publishingYear.value = "";
    showMessage("Book submitted successfully", "success");
  });
});

// Handling authors form submission
  document.querySelector('#form_authors').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
      authorFirstName: e.target.authorFirstName.value.trim(),
      authorLastName: e.target.authorLastName.value.trim()
    };
  
    const validationErrors = validateForm(formData, 'author');
  
    if (validationErrors.length > 0) {
      showMessage(validationErrors[0], "error");
      return;
    }
  
    const params = new URLSearchParams();
    params.append('first_name', formData.authorFirstName);
    params.append('last_name', formData.authorLastName);
  
    fetch(`${BASE_URL}/admin/${user_id}/authors`, {
      method: "POST",
      body: params,
      headers: header
    }).then(() => {
      e.target.authorFirstName.value = "";
      e.target.authorLastName.value = "";
      showMessage("Author submitted successfully", "success");
    });
  });

  // Handling publisher form submission
  document.querySelector('#form_publisher').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
      publisherName: e.target.publisherName.value.trim()
    };

    const validationErrors = validateForm(formData, 'publisher');

    if (validationErrors.length > 0) {
      showMessage(validationErrors[0], "error");
      return;
    }

    const params = new URLSearchParams();
    params.append('name', formData.publisherName);

    fetch(`${BASE_URL}/admin/${user_id}/publishers`, {
      method: "POST",
      body: params,
      headers: header
    }).then(() => {
      e.target.publisherName.value = "";
      showMessage("Publisher submitted successfully", "success");
    });
  });
}

