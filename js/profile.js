import { BASE_URL } from "./info.js";
import { APIerrorResponse, handleError} from './handle-errors.js';
import { header } from './api.js';

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

    
      // Form submission
      const firstName = e.target.firstName.value.trim();
      const lastName = e.target.lastName.value.trim();
      const email = e.target.email.value.trim();
      const address = e.target.address.value.trim();
      const phoneNumber = e.target.phoneNumber.value.trim();
      const dateBirth = e.target.date.value.trim();

      
      const params = new URLSearchParams();
      params.append('email', email);
      params.append('first_name', firstName);
      params.append('last_name', lastName);
      params.append('phone_number', phoneNumber);
      params.append('address', address);
      params.append('birth_date', dateBirth);
    
    fetch(`${BASE_URL}/users/${user_id}`, {
      method: 'PUT',
      headers: header,
      body: params,

    })
    .then((response) => response.json())
    .catch(handleError);

    formInputs.forEach(input => {
      input.disabled = true;
    })
    saveBtn.classList.add("hidden")
    editBtn.classList.remove("hidden");
  })
};
editProfile();


function deleteUser() {
  let user_id = sessionStorage.getItem("user_id");

  console.log(`delete user with id ${user_id}`);
  if (!user_id) {
      alert("User ID not found. Please log in again.");
      return;
  };
  if (confirm("Are you sure you want to delete your account?")) {
      fetch(`${BASE_URL}/users/${user_id}`, {
      method: "DELETE",
      headers: header

      })
      .then((response) => response.json())
      .then((data) => {
          if (data.status === "ok") {
              alert("User deleted");
              sessionStorage.removeItem("user_id");
              window.location = "index.html"
          } else {
            APIerrorResponse(data.error);
          }
      })
      .catch(APIerrorResponse);
  }
};

document.querySelector("#deleteUserBtn").addEventListener("click", deleteUser);