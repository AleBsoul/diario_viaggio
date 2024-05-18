import { uploadFile, downloadFile } from "./mega.js"

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

const checkNull = (element) => {
  element.parentElement.classList.remove("null")
  if(!element.value){
    element.parentElement.classList.add("null");
  }
}

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
          console.log(json);
          resolve(json); //risposta server
      })
      .catch((error) => {
          reject(error);
      });
  });
}



loginForm.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    log_submit.click();
  }
});

  log_submit.onclick=()=>{
    const time = 3000;
    const username_input = document.getElementById("username_log");
    const password_input = document.getElementById("password_log");

    checkNull(username_input);
    checkNull(password_input);

    const username_value = username_input.value;
    const password_value = password_input.value;
    const user = {username:username_value, password:password_value};
    if(username_value && password_value){
      login(user).then((result)=>{
        if(result.result){
          window.location.href="home.html";
          sessionStorage.setItem("loggato", JSON.stringify(result.utente));
        }
      });
      loginForm.reset();
    }
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
sign_submit.onclick=async()=>{
  const time = 3000;
  const file = document.getElementById("imgProfilo");
  const username_input = document.getElementById("username_sign");
  const pass_input = document.getElementById("password_sign");
  const email_input = document.getElementById("email");
  const nome_input = document.getElementById("nome");
  const cognome_input = document.getElementById("cognome");
  const bio_input = document.getElementById("bio");
  
  checkNull(username_input);
  checkNull(pass_input);
  checkNull(email_input);
  checkNull(nome_input);
  checkNull(cognome_input);
  checkNull(bio_input);
  checkNull(file);


  const username = username_input.value;
  const pass = pass_input.value;
  const email = email_input.value;
  const nome = nome_input.value;
  const cognome = cognome_input.value;
  const bio = bio_input.value;
  const popup = document.getElementById('popup');

  const userr = {username: username, password: pass, email:email, nome:nome, cognome:cognome, bio:bio, foto:"link"}
  addUser(userr)
  let mail_request={email:email}

  if(file.value && username && pass && email && nome && cognome && bio){
  // aggiunta dell'immagine
  const fileImg = await uploadFile(file); //contiente il path e il link
  const link = fileImg.link;
  const user = {username: username, password: pass, email:email, nome:nome, cognome:cognome, bio:bio, foto:link}
  addUser(user).then((result)=>{
    console.log(result);
    if(!result){//controllo che non esista lo username
      username_input.parentElement.classList.remove("null")
      username_input.parentElement.classList.add("null");
    }else{
      document.getElementById("signUp_form").reset();
      mail_request.token = result; //assegno il token
      // manda la mail di verifica 
      sendmail(mail_request).then((result)=>{
        // compare il pop-up di controllare la mail
        popup.classList.add('drop');
        setTimeout(() => {
          popup.classList.add('expand');
        }, 1200);
  
        setTimeout(() => {
          popup.classList.remove('expand');
          setTimeout(() => {
            popup.classList.remove('drop');
            }, 2000);
          }, 3200); 
        });
    }
  });
}
}
const sendmail=async(mail_request)=>{
  try{
    const r = await fetch("/mail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(mail_request)
    });
    const result = await r.json();
    return result;
} catch (e) {
    console.log(e);
}
}
