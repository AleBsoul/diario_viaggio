import { uploadFile } from "./mega.js"

//check user logged

const user = JSON.parse(sessionStorage.getItem("loggato"));
if(!user){
    window.location.href="login.html";
}

const checkNull = (element) => {
    element.parentElement.classList.remove("null")
    if(!element.value.replaceAll("'", " ")){
      element.parentElement.classList.add("null");
    }
}



const getUserViaggi = async (id) => {
    try{
        const r = await fetch("/getViaggiUser/"+id);
        const json = await r.json();
        return json;
    } catch (e) {
        console.log(e);
    }  
}


const saveViaggio = async (data) => {
    try{
        const r = await fetch("/addViaggio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({data})
        });
        const result = await r.json();
        return result;
    } catch (e) {
        console.log(e);
    }
};

const newViaggio = document.getElementById("newViaggio_btn");
//add viaggio
const titoloInput = document.getElementById("titolo_viaggio_input");
const descrInput = document.getElementById("descrizione_viaggio_input");
const immInput = document.getElementById("immagine_viaggio_input");


const formAdd = document.getElementById("formAdd");

const newViaggioClick=async()=>{
    
    checkNull(titoloInput);
    checkNull(descrInput);
    checkNull(immInput);
    
    if(titoloInput.value.replaceAll("'", " ") && descrInput.value.replaceAll("'", " ") && immInput.value.replaceAll("'", " ")){
        document.getElementById("loading-add-travel").style.opacity=1;
    // aggiunta dell'immagine
        const fileImg = await uploadFile(immInput); //contiente il path e il link
        const link = fileImg.link;
  
        const id_utente = user.id;
        const viaggio = {
            titolo: titoloInput.value.replaceAll("'", " "),
            descrizione: descrInput.value.replaceAll("'", " "),
            immagine: link,
            id_utente: id_utente
        }
    
        await saveViaggio(viaggio);
        document.getElementById("loading-add-travel").style.opacity=0;
        formAdd.reset();
        return true
    }else{
        return false;
    }
}


const homeBtns = document.querySelectorAll("#nav-home");
homeBtns.forEach((homeBtn)=>{
    homeBtn.onclick=()=>{
        window.location.href='index.html';
    }    
})


const userBtns = document.querySelectorAll("#nav-user");
userBtns.forEach((userBtn)=>{
    userBtn.onclick=()=>{
        sessionStorage.setItem("utente",JSON.stringify(user));
        window.location.href='user.html';
    }    
})


const logoutBtns = document.querySelectorAll("#nav-logout");
logoutBtns.forEach((logoutBtn)=>{
    logoutBtn.onclick=()=>{
        sessionStorage.setItem("loggato",null);
        window.location.href="login.html";
    }    
})





//modal new viaggio
const modal = document.getElementById("modal");
const closeButton = document.querySelector(".close-button");
const openModal_btns = document.querySelectorAll("#openModal");
const close_btn = document.getElementById("close_btn");

let isOpened = false;

openModal_btns.forEach((openModal_btn) => {
    openModal_btn.onclick = () => {
        const forms = document.getElementsByTagName("form");
        for (let i = 0; i < forms.length; i++) {
            forms[i].style.display = "none";
        }
        formAdd.style.display = "block";
        openModal();
    };
});
close_btn.onclick=()=>{
    closeModal();
}

const openModal = () => {
    modal.classList.add("is-open");
};

const closeModal = () => {
  const forms = document.getElementsByTagName("form");
  for(let i=0; i<forms.length; i++){
    forms[i].style.display="none";
  }
  formAdd.style.display="block";
  modal.classList.remove("is-open");
};





const getUser = async (id) => {
    try{
        const r = await fetch("/get_singleUser/"+id);
        const json = await r.json();
        return json;
    } catch (e) {
        console.log(e);
    } 
}

const getViaggi=async()=>{
    try{
        const r = await fetch("/getViaggi");
        const json = await r.json();
        return json;
    } catch (e) {
        console.log(e);
    } 
}

const getSingleViaggio = async (id) => {
    try{
        const r = await fetch("/getSingleViaggio/"+id);
        const json = await r.json();
        return json;
    } catch (e) {
        console.log(e);
    } 
}


export { openModal, getUser, getSingleViaggio, getUserViaggi, getViaggi, newViaggioClick, checkNull};