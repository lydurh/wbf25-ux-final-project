import { BASE_URL } from "./info.js";
import { handleAPIError, handleError} from './handle-errors.js';
import { header } from './api.js';

  let user_id = sessionStorage.getItem("user_id");
  const adminID = '2679';

  if (user_id != adminID && !user_id) {
  document.querySelector('section').remove();
  window.location.href = "login.html"
  } else if (user_id === adminID) {
  
    document.querySelector('section').remove();
    window.location.href = "admin.html"
  } else {

  const showProfile = async () => {
    let user_id = sessionStorage.getItem("user_id");
    let user_token = sessionStorage.getItem("user_token");
    const adminID = '2679';

    if (user_id != adminID && !user_id) {
    document.querySelector('section').remove();
    document.querySelector('h1').innerText = "You're not allowed on this page"
  }
    

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
   
    document.querySelector('#profile-header').innerText = `Hi ${data.first_name}`;
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

      
      const formData = {
          
        firstName: e.target.firstName.value.trim(),
        lastName: e.target.lastName.value.trim(),
        email: e.target.email.value.trim(),
        address: e.target.address.value.trim(),
        phoneNumber: e.target.phoneNumber.value.trim(),
        dateBirth: e.target.date.value.trim()
      }

        
        const params = new URLSearchParams();
        params.append('email',formData.email);
        params.append('first_name', formData.firstName);
        params.append('last_name', formData.lastName);
        params.append('phone_number', formData.phoneNumber);
        params.append('address', formData.address);
        params.append('birth_date', formData.dateBirth);
      
      
      
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
  
// Delete button Modal
document.querySelector('#deleteOpenModal').addEventListener('click', function (e) {
  e.preventDefault();
  let modal = document.querySelector("#deleteUserModal");
  modal.showModal();

  modal.querySelector('.close').addEventListener('click', (e) => {
    e.preventDefault();
    modal.close();
  });

  modal.querySelector('.closeModal').addEventListener('click', (e) => {
    e.preventDefault();
    modal.close();
  });

  // Delete user when clicking the delete button in the modal
  modal.querySelector('#deleteUserBtn').addEventListener('click', (e) => {
    e.preventDefault();
    deleteUser();
  });
});

// Delete User function
function deleteUser() {
  let user_id = sessionStorage.getItem("user_id");

  if (!user_id) {
    alert("User ID not found. Please log in again.");
    return;
  }

  // Confirm deletion with the modal
  fetch(`${BASE_URL}/users/${user_id}`, {
    method: "DELETE",
    headers: header
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.status === "ok") {
      alert("User deleted");
      sessionStorage.removeItem("user_id");
      window.location = "login.html";
    } else {
      handleAPIError(data.error);
    }
  })
  .catch(handleAPIError);
}

  document.querySelector("#deleteUserBtn").addEventListener("click", deleteUser);
}