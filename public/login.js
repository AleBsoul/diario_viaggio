const modal = document.getElementById("modal");
const modalButton = document.querySelector(".modal-button");
const closeButton = document.querySelector(".close-button");
const openModal_btn = document.getElementById("openModal");
const close_btn = document.getElementById("close_btn");

const username = document.getElementById("username");
const password = document.getElementById("password");
const log_btn = document.getElementById("log_btn");

const loginForm = document.getElementById("login_form");
const signUp_form = document.getElementById("signUp_form");
const signUp = document.getElementById("signUp");

let isOpened = false;

const openModal = () => {
  modal.classList.add("is-open");
};

const closeModal = () => {
  modal.classList.remove("is-open");
};

setTimeout(openModal,500);

openModal_btn.onclick=()=>{
    openModal();
}
close_btn.onclick=()=>{
    closeModal();
}

log_btn.onclick=()=>{
}


const user = {}
const login = (user) => {
  return new Promise((resolve, reject) => {
      fetch("/login", {
          method: 'POST',
          headers: {
          "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
      })
      .then((response) => response.json())
      .then((json) => {
          resolve(json); //risposta server
      })
      .catch((error) => {
          reject(error);
      });
  });
}

log_btn.onclick=()=>{
  const username_value = username.value;
  const password_value = password.value;
  const user = {username:username_value, password:password_value};
  login(user).then((result)=>{
    console.log(result);
  });
  loginForm.reset();
}

signUp.onclick=()=>{
  console.log("signup");
  loginForm.style.display = "none";
  document.getElementById("modal-right").style.display = "none"; //tolgo l'immagine
  signUp_form.style.display = "block"
}