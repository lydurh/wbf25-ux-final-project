import { BASE_URL } from "./info.js";

const showAuthors = async (searchTerm = '') => {
  const response = await fetch(`${BASE_URL}/authors`);
  const data = await response.json();
  
  const books = data.author || data.results || data; 
  
  const fragment = document.createDocumentFragment();
  
  books
    .filter(author => author.author_name.toLowerCase().includes(searchTerm.toLowerCase())) // Filter authors based on search term
    .forEach(author => {
      const card = document.querySelector('.author-card').content.cloneNode(true);
      card.querySelector('a').innerText = author.author_name;

      card.querySelectorAll('a').forEach(link => {
        link.href = `authors-books.html?a=${author.author_id}`;
      });

      fragment.append(card);
    });
  
  document.querySelector('#author-list').innerHTML = ''; // Clear previous list before appending
  document.querySelector('#author-list').append(fragment);
};


document.getElementById('author-search').addEventListener('input', (event) => {
  const searchTerm = event.target.value;
  showAuthors(searchTerm);
});


showAuthors();
