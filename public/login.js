const modal = document.getElementById("modal");
const modalButton = document.querySelector(".modal-button");
const closeButton = document.querySelector(".close-button");
const openModal_btn = document.getElementById("openModal");
const close_btn = document.getElementById("close_btn");

const loginForm = document.getElementById("login_form");
const signUp_form = document.getElementById("signUp_form");
const signUpNow = document.getElementById("signUpNow");
const loginNow = document.getElementById("logIn");

const sign_submit = document.getElementById("sign_submit");
const log_submit = document.getElementById("log_submit");



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

log_submit.onclick=()=>{
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

const addUser = (user) => {
  return new Promise((resolve, reject) => {
      fetch("/add_user", {
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

log_submit.onclick=()=>{
  const username_value = document.getElementById("username_log").value;
  const password_value = document.getElementById("password_log").value;
  const user = {username:username_value, password:password_value};
  login(user).then((result)=>{
    if(result.result){
      window.location.href="home.html";
    }
  });
  loginForm.reset();

}

signUpNow.onclick=()=>{
  loginForm.style.display = "none";
  document.getElementById("modal-right").style.display = "none"; //tolgo l'immagine
  signUp_form.style.display = "block"
}

loginNow.onclick=()=>{
  loginForm.style.display = "block";
  document.getElementById("modal-right").style.display = "block"; //tolgo l'immagine
  signUp_form.style.display = "none"
}

sign_submit.onclick=()=>{
  const username = document.getElementById("username_sign").value;
  const pass = document.getElementById("password_sign").value;
  const email = document.getElementById("email").value;
  const nome = document.getElementById("nome").value;
  const cognome = document.getElementById("cognome").value;
  const bio = document.getElementById("bio").value;

  const user = {username: username, password: pass, email:email, nome:nome, cognome:cognome, bio:bio}
  addUser(user);
}