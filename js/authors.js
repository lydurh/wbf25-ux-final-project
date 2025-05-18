import { BASE_URL } from "./info.js";

// Settings for lazy loading when scrolling
const observerOptions = {
  root: null,        // Use the viewport (screen area)
  rootMargin: "0px", // No extra space around the viewport
  threshold: 0.1     // Trigger when 10% of an element is visible
};

// Variables to track the loaded authors
let loadedAuthors = 0;             // Number of authors already shown
const AUTHORS_PER_BATCH = 10;      // How many authors to load each time
let allAuthors = [];               // List of all authors from the API

// Setting up a scroll observer to load more authors as needed
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      showMoreAuthors(); // Load more authors when we reach the end
    }
  });
}, observerOptions);

// Function to get all authors from the API
const loadAuthors = async () => {
  const response = await fetch(`${BASE_URL}/authors`);
  const data = await response.json();
  allAuthors = data.author || data.results || data;
  showMoreAuthors(); // Show the first number of authors
};

// Function to show authors in batches
const showMoreAuthors = () => {
  const fragment = document.createDocumentFragment();

  // Get the next group of authors
  const slice = allAuthors.slice(loadedAuthors, loadedAuthors + AUTHORS_PER_BATCH);
  loadedAuthors += slice.length;

  // Create author card for each author
  slice.forEach(author => {
    const card = document.querySelector('.author-card').content.cloneNode(true);
    card.querySelector('a').innerText = author.author_name;
    card.firstElementChild.classList.add('book-card-element');
    card.querySelectorAll('a').forEach(link => {
      link.href = `authors-books.html?a=${author.author_id}`;
    });
    fragment.append(card);
  });

  // Add the new authors to the list in the DOM
  document.querySelector('#author-list').append(fragment);

  // Keep observing to load more authors when scrolling
  if (loadedAuthors < allAuthors.length) {
    observer.observe(document.querySelector('#author-list').lastElementChild);
  }
};

// Search functionality for authors
document.getElementById('author-search').addEventListener('input', (event) => {
  const searchTerm = event.target.value.toLowerCase();

  // Filter authors based on the search term
  const filteredAuthors = allAuthors.filter(author =>
    author.author_name.toLowerCase().includes(searchTerm)
  );

  // Show only the filtered authors
  document.querySelector('#author-list').innerHTML = '';
  filteredAuthors.slice(0, AUTHORS_PER_BATCH).forEach(author => {
    const card = document.querySelector('.author-card').content.cloneNode(true);
    card.querySelector('a').innerText = author.author_name;
    card.querySelectorAll('a').forEach(link => {
      link.href = `authors-books.html?a=${author.author_id}`;
    });
    document.querySelector('#author-list').append(card);
  });

  loadedAuthors = filteredAuthors.length;
});

loadAuthors();