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
    const username_value = document.getElementById("username_log").value;
    const password_value = document.getElementById("password_log").value;
    const user = {username:username_value, password:password_value};

    if(!username_value){
      document.getElementById("log_username_error").classList.remove("invisible");
      setTimeout(()=>{
        document.getElementById("log_username_error").classList.add("invisible");
      },time)
  }
  if(!password_value){
    document.getElementById("log_password_error").classList.remove("invisible");
      setTimeout(()=>{
        document.getElementById("log_password_error").classList.add("invisible");
      },time)
  };
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
  const username = document.getElementById("username_sign").value;
  const pass = document.getElementById("password_sign").value;
  const email = document.getElementById("email").value;
  const nome = document.getElementById("nome").value;
  const cognome = document.getElementById("cognome").value;
  const bio = document.getElementById("bio").value;
  const popup = document.getElementById('popup');

  if(!file.value){
      document.getElementById("profilo_error").classList.remove("invisible");
      setTimeout(()=>{
          document.getElementById("profilo_error").classList.add("invisible");
      },time)
  }

  if(!username){
      document.getElementById("sign_username_error").classList.remove("invisible");
      setTimeout(()=>{
        document.getElementById("sign_username_error").classList.add("invisible");
      },time)
  }

  if(!pass){
    document.getElementById("sign_password_error").classList.remove("invisible");
      setTimeout(()=>{
        document.getElementById("sign_password_error").classList.add("invisible");
      },time)
  };
  if(!email){
    document.getElementById("email_error").classList.remove("invisible");
    setTimeout(()=>{
      document.getElementById("email_error").classList.add("invisible");
    },time)
  }

  if(!nome){
    document.getElementById("nome_error").classList.remove("invisible");
    setTimeout(()=>{
      document.getElementById("nome_error").classList.add("invisible");
    },time)
  }

  if(!cognome){
    document.getElementById("cognome_error").classList.remove("invisible");
    setTimeout(()=>{
      document.getElementById("cognome_error").classList.add("invisible");
    },time)
  };
  if(!bio){
    document.getElementById("bio_error").classList.remove("invisible");
    setTimeout(()=>{
      document.getElementById("bio_error").classList.add("invisible");
    },time)
  }

  if(file.value && username && pass && email && nome && cognome && bio){
  // aggiunta dell'immagine
  const fileImg = await uploadFile(file); //contiente il path e il link
  const link = fileImg.link;
  const user = {username: username, password: pass, email:email, nome:nome, cognome:cognome, bio:bio, foto:link}
  addUser(user).then((result)=>{
    // manda la mail di verifica 
    mail(email).then((result)=>{
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
  });

  document.getElementById("signUp_form").reset();
  }

}
const mail=async(mail)=>{
  try{
    const r = await fetch("/mail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({mail: mail})
    });
    const result = await r.json();
    return result;
} catch (e) {
    console.log(e);
}
}
