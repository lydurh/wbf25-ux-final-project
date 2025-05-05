import { BASE_URL } from "./info.js";

const showProfile = async () => {
  
  let user_id = sessionStorage.getItem("user_id");
  console.log(user_token)
  const response = await fetch(`${BASE_URL}/users/${user_id}`);
  const data = await response.json();
  const profile = document.createDocumentFragment();
  

  document.querySelector('#firstName').value = data.first_name

  



  document.querySelector('#form-profile').append(profile);
};
console.log(showProfile());
showProfile();
