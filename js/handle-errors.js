export const APIerrorResponse = (error = 'Generic error') => {
  showMessage(error, 'error');
}

export const handleError = (error) => {
  document.querySelector('#errorText').innerText = error;
  // document.querySelector('#error').classList.remove('hidden');
};



export const showMessage = function(message, type = "success", target = "main", duration = 2000,) {
  const messageContainer = document.querySelector(
        `#messageContainer-${target}`
    );

    messageContainer.textContent = message;
    messageContainer.className = ""; 
    messageContainer.classList.add(type === "error" ? "error" : "success");
    messageContainer.classList.remove("hidden");
    messageContainer.style.opacity = "1";

    // Only timeout for success messages
    if (type === "success") {
        setTimeout(() => {
            messageContainer.style.opacity = "0"; // Fade out
            setTimeout(() => {
                messageContainer.classList.add("hidden");
            }, 500);
        }, duration);
    }
}