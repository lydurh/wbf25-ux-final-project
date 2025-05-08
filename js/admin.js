import { BASE_URL } from "./info.js";
import { header } from './api.js';


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

document.querySelector('#form_book').addEventListener('submit',(e)=> {
    e.preventDefault();


    let user_id = sessionStorage.getItem("user_id");
    const bookTitle = e.target.bookTitle.value.trim();
    const authorId = e.target.authorId.value.trim();
    const publisherId = e.target.publisherId.value.trim();
    const publishingYear = e.target.publishingYear.value.trim();

    const params = new URLSearchParams();
    params.append('title', bookTitle);
    params.append('author_id', authorId);
    params.append('publisher_id', publisherId);
    params.append('publishing_year', publishingYear);


    fetch(`${BASE_URL}/admin/${user_id}/books`, {
    method: "POST",
    body: params,
    headers: header
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      
});

})