export const handleAPIError = function(response) {
    if (response.ok) {
        return response.json();
    }
    showMessage(response, "System under maintenance")
}


export const handleError = (error = 'Generic error') => {
  showMessage(error, 'error');
}



export const showMessage = function(message, type = "success") {
  const messageCon = document.querySelector(`#messageCon`);
    messageCon.textContent = message;
    messageCon.className = ""; 
    messageCon.classList.add(type === "error" ? "error" : "success");
    messageCon.classList.remove("hidden");
}