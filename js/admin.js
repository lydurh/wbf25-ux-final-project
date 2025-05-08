import { BASE_URL } from "./info.js";


const showAuthors = async () => {

    const response = await fetch(`${BASE_URL}/authors`);
    const data = await response.json();
    
    const author = data.author || data.results || data; 
    
    const fragment = document.createDocumentFragment();
    
    author.forEach(author => {
      const option = document.querySelector('#authorTemplate').content.cloneNode(true);
      option.querySelector('.optionAuthorId').innerText = author.author_name;
      option.querySelector('.optionAuthorId').value = author.author_name;
      
  

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
      option.querySelector('.optionPublisherId').value = publisher.publisher_name;
  

    fragment.append(option);
    });
    
    document.querySelector('#publisherId').append(fragment);
};

showPublishers();
/*
publishingYearInput.addEventListener("input", function () {
const min = parseInt(this.min, 10);
const value = parseInt(this.value, 10);

if (value < min) {
    this.value = min;
}
});
*/