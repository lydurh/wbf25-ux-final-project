import { BASE_URL } from "./info.js";

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

  document.querySelector('#firstName').value = data.first_name;
  document.querySelector('#form-profile').append(profile);
};

showProfile();