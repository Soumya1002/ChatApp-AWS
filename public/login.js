const baseUrl = `http://54.179.235.16`;

const loginForm = document.getElementById("loginForm");
const msg = document.getElementById("message");
const token = localStorage.getItem("token");

// If already logged in
if (token) {
  window.location.href = "./chat/chat.html";
}

// Function to handle the error and success messages
const messageHandler = (message, type) => {
  msg.innerText = message;
  msg.className = type;
  setTimeout(() => {
    msg.innerText = "";
    msg.className = "";
  }, 5000);
};

// Handles the login api
const loginHandler = async (e) => {
  e.preventDefault();
  const email = e.target.email;
  const password = e.target.password;
  if (email.value === "" || password.value === "") {
    messageHandler("Please Enter all the fields", "error");
  } else {
    let userDetails = {
      email: email.value,
      password: password.value,
    };
    try {
      const response = await axios.post(`${baseUrl}/user/login`, userDetails);
      const data = response.data;
      messageHandler(data.message, "success");
      console.log(data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("messages", JSON.stringify({}));
      window.location.href = "./chat/chat.html";
    } catch (err) {
      if (err.response.status === 401) {
        messageHandler("Password do not match. Try again", "error");
      } else if (err.response.status === 404) {
        messageHandler("User does not exist!", "error");
      } else {
        messageHandler("Something went wrong", "error");
      }
    }
  }
};

loginForm.addEventListener("submit", loginHandler);
