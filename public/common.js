import { uploadFile } from "./mega.js"

//check user logged

const user = JSON.parse(sessionStorage.getItem("loggato"));
if(!user){
    window.location.href="login.html";
}

const checkNull = (element) => {
    element.parentElement.classList.remove("null")
    if(!element.value.replace("'", " ")){
      element.parentElement.classList.add("null");
    }
}
  
//navbar
const rightNavContent = document.getElementById("right-nav-content");
const bar = document.getElementById("bar");
const barBtn = document.getElementById("bar-btn");
const check_size = () =>{
    if(window.innerWidth<850){
        bar.classList.remove("invisible");
        rightNavContent.classList.add("invisible");
        barBtn.onclick=()=>{
            if(rightNavContent.classList.contains("invisible")){
                rightNavContent.classList.remove("invisible");
                rightNavContent.classList.add("collapsed")
            }else{
                rightNavContent.classList.remove("collapsed");
                rightNavContent.classList.add("invisible");
            }
        }
    }else{
        bar.classList.add("invisible");
        rightNavContent.classList.remove("invisible");
        rightNavContent.classList.remove("collapsed")
    }
}
window.addEventListener("resize", function(){
    check_size();
})
check_size();

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
    
    if(titoloInput.value.replace("'", " ") && descrInput.value.replace("'", " ") && immInput.value.replace("'", " ")){
        document.getElementById("loading-add-travel").style.opacity=1;
    // aggiunta dell'immagine
        const fileImg = await uploadFile(immInput); //contiente il path e il link
        const link = fileImg.link;
  
        const id_utente = user.id;
        const viaggio = {
            titolo: titoloInput.value.replace("'", " "),
            descrizione: descrInput.value.replace("'", " "),
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


const homeBtn = document.getElementById("nav-home");
homeBtn.onclick=()=>{
    window.location.href='home.html';
}


const userBtn = document.getElementById("nav-user");
userBtn.onclick=()=>{
    sessionStorage.setItem("utente",JSON.stringify(user));
    window.location.href='user.html';
}


const logoutBtn = document.getElementById("nav-logout");
logoutBtn.onclick=()=>{
    sessionStorage.setItem("loggato",null);
    window.location.href="login.html";
}





//modal new viaggio
const modal = document.getElementById("modal");
const closeButton = document.querySelector(".close-button");
const openModal_btn = document.getElementById("openModal");
const close_btn = document.getElementById("close_btn");

let isOpened = false;

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



openModal_btn.onclick=()=>{
    const forms = document.getElementsByTagName("form");
    for(let i=0; i<forms.length; i++){
        forms[i].style.display="none";
    }
    formAdd.style.display="block";
    openModal();
}
close_btn.onclick=()=>{
    closeModal();
}

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