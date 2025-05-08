import { BASE_URL } from "./info.js";
import { APIerrorResponse} from './handle-errors.js';
import {header} from './api.js';

const showProfile = async () => {
  let user_id = sessionStorage.getItem("user_id");
  let user_token = sessionStorage.getItem("user_token");

  console.log('User ID:', user_id);
  console.log('Token:', user_token);

  const response = await fetch(`${BASE_URL}/users/${user_id}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Session-Token': user_token
    }
  });

  if (!response.ok) {
    console.error(`Error ${response.status}: Unable to fetch profile`);
    return;
  }

  const data = await response.json();
  const profile = document.createDocumentFragment();
  console.log(data);
  document.querySelector('#membershipDate').innerText = data.membership_date;
  document.querySelector('#firstName').value = data.first_name;
  document.querySelector('#lastName').value = data.last_name;
  document.querySelector('#email').value = data.email;
  document.querySelector('#date').value = data.birth_date;
  document.querySelector('#address').value = data.address;
  document.querySelector('#phoneNumber').value = data.phone_number;
  document.querySelector('#form-profile').append(profile);
};
document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById("form-profile");
  const formInputs = form.querySelectorAll('input');
  formInputs.forEach(input => {
    input.disabled = true;
  })
})

showProfile();

const editProfile = () => {
let user_id = sessionStorage.getItem("user_id");
let user_token = sessionStorage.getItem("user_token");
const form = document.getElementById("form-profile");
const editBtn = document.getElementById("updateUserBtn");
const saveBtn = document.getElementById("saveUserBtn");
const formInputs = form.querySelectorAll('input');

editBtn.addEventListener('click', (e)=> {
  e.preventDefault();
  formInputs.forEach(input => {
    input.disabled = false;
  })
  editBtn.classList.add("hidden")
  saveBtn.classList.remove("hidden");
})
form.addEventListener('submit', (e)=> {
  e.preventDefault();
  fetch(`${BASE_URL}/users/${user_id}`,{
    method: "PUT",
    body: URLSearchParams,
    headers : header
  })
  .then((response) => response.json())
  .then((data) => {
      if (data.status === "ok") {
          showSuccessMessage("Changes saved!", "success", "main");
          form(false); // disable form after successfull submit
      } else {
      }
  })
  .catch(APIerrorResponse);

  formInputs.forEach(input => {
    input.disabled = true;
  })
  saveBtn.classList.add("hidden")
  editBtn.classList.remove("hidden");
})
};
editProfile();