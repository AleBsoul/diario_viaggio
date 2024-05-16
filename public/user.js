import { uploadFile, downloadFile} from "./mega.js"
import { openModal, getUser, getSingleViaggio} from "./common.js"


let user = JSON.parse(sessionStorage.getItem("utente"));
let loggato = JSON.parse(sessionStorage.getItem("loggato"));

const travelsTemplateLogged =`
<div class="travel" id="travel-%id">
    <div class="image-space">
    %IMGVIAGGIO
    </div>

    <div class="bottom-travel">
        <p class="nome">%nome</p>
        <div class="utente" id="%id_utente">
            <button type="button" class="del_btn_viaggio" id="%IDViaggioDel"><i class="fi fi-rr-trash"></i></button>
        </div>
    </div>
</div>
`

const travelTemplateLogged = `
<div class="image-space">
    %IMGVIAGGIO
    </div>

    <div class="bottom-travel">
        <p class="nome">%nome</p>
        <div class="utente" id="%id_utente">
            <button type="button" class="del_btn_viaggio" id="%IDViaggioDel"><i class="fi fi-rr-trash"></i></button>
        </div>
</div>
`

const travelsTemplateNot = `
<div class="travel" id="travel-%id">
    <div class="image-space">
    %IMGVIAGGIO
    </div>

    <div class="bottom-travel">
        <p class="nome">%nome</p>
        <div class="utente" id="%id_utente">
        </div>
    </div>
</div>
`

const travelTemplateNot = `
<div class="image-space">
    %IMGVIAGGIO
    </div>

    <div class="bottom-travel">
        <p class="nome">%nome</p>
        <div class="utente" id="%id_utente">
        </div>
</div>
`


const userTemp = `
<div class="profile-picture" id="profile-picture">
    %IMMAGINE
</div>
<div class="profile-details">
    <h2 class="username">%nome %cognome</h2>
    <svg type="button" id="pencilViaggio" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg>
    <p><i>%username</i></p>
    <p class="bio">%bio</p>
    <div class="contact-info">
        <p><i class="fa fa-envelope"></i>%email</p>
    </div>
</div>
`
const travelContentDiv = document.getElementById("travel-content");
const userContentDiv = document.getElementById("user-content");


let travelTemp;
let travelsTemp;

if(user.id===loggato.id){
    travelTemp = travelTemplateLogged;
    travelsTemp = travelsTemplateLogged;
}else{
    travelTemp = travelTemplateNot;
    travelsTemp = travelsTemplateNot;
}


//render delle immagini
const render = async (data,travels) => {
    for(let i=0;i<travels.length;i++){
        const imgViaggio = `<img src="${await downloadFile(data[i].immagine)}">`;
        const imgProfilo = `<img src="${await downloadFile(data[i].fotoProfilo)}" class="user-foto">`;  
        travels[i].innerHTML=travelTemp.replace("%nome", data[i].titolo).replace("%utente", data[i].username).replace("%id_utente", data[i].idUser).replace("%id", data[i].idViaggio).replace("%IMGVIAGGIO",imgViaggio).replace("%IMGPROFILO",imgProfilo).replace("%IDViaggioDel",data[i].idViaggio);
    }
}


//caricamento dei div dei viaggi con la rotella di caricamento
const preRender = async (data) => {
    renderProfilo();
    const loading = `<iframe id='loadingViaggio' src='https://lottie.host/embed/66e70a89-2afc-4021-9865-bd5da9882885/69ZUtWw7XT.json' ></iframe>`
    const loadingProfilo = `<iframe id='loadingProfilo' src='https://lottie.host/embed/66e70a89-2afc-4021-9865-bd5da9882885/69ZUtWw7XT.json' ></iframe>`    
    travelContentDiv.innerHTML = "";

    for (const travel of data) {
        travelContentDiv.innerHTML += travelsTemp.replace("%nome", travel.titolo).replace("%utente", travel.username).replace("%id_utente", travel.idUser).replace("%id", travel.idViaggio).replace("%IMGVIAGGIO",loading).replace("%IMGPROFILO",loadingProfilo).replace("%IDViaggioDel",travel.idViaggio);;
    }

    const travels = document.querySelectorAll(".travel");

    render(data,travels);

    travels.forEach((travel) => {
        travel.addEventListener('click', async function (event) {
            const viaggio = await getSingleViaggio(travel.id.split("-")[1]);
            sessionStorage.setItem("viaggio",JSON.stringify(await viaggio.result));
            window.location.href='viaggio.html';
        });
    });
    const del_btns = document.querySelectorAll(".del_btn_viaggio");
    del_btns.forEach((del_btn)=>{
        del_btn.onclick=async()=>{
            await delViaggio(del_btn.id);
            preRender(await(getViaggi()).result);
        }
    })
}



const renderProfilo=async()=>{
    const loading = `<iframe id='loadingViaggio' src='https://lottie.host/embed/66e70a89-2afc-4021-9865-bd5da9882885/69ZUtWw7XT.json' ></iframe>`
    userContentDiv.innerHTML = userTemp.replace("%IMMAGINE",loading).replace("%nome", user.nome).replace("%cognome",user.cognome).replace("%username",user.username).replace("%bio",user.bio).replace("%email",user.email);
    
    document.getElementById("pencilViaggio").onclick=()=>{
        document.getElementById("formAdd").style.display="none";
        document.getElementById("formUpdate").style.display="block";
        openModal();
    }
    const imgProfilo = `<img src="${await downloadFile(user.foto)}"></img>`;
    userContentDiv.innerHTML = userTemp.replace("%IMMAGINE",imgProfilo).replace("%nome", user.nome).replace("%cognome",user.cognome).replace("%username",user.username).replace("%bio",user.bio).replace("%email",user.email);
    
    document.getElementById("pencilViaggio").onclick=()=>{
        document.getElementById("formAdd").style.display="none";
        document.getElementById("formUpdate").style.display="block";
        openModal();
    }
}


const getViaggi = async () => {
    try{
        const r = await fetch("/getViaggiUser/"+user.id);
        const json = await r.json();
        return json;
    } catch (e) {
        console.log(e);
    }  
}

const delViaggio = async(id) =>{
    try{
        const r = await fetch("/del_viaggio/"+id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const result = await r.json();
        return result;
    } catch (e) {
        console.log(e);
    }
}

const updateUser = (user) => {
    return new Promise((resolve, reject) => {
        fetch("/updateUser", {
            method: 'PUT',
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
  
const update_submit = document.getElementById("saveChanges");
update_submit.onclick=async()=>{
    const file = document.getElementById("imgProfilo");
    const id = JSON.parse(sessionStorage.getItem("loggato")).id;
    const username = document.getElementById("username_sign").value;
    const pass = document.getElementById("password_sign").value;
    const email = document.getElementById("email").value;
    const nome = document.getElementById("nome").value;
    const cognome = document.getElementById("cognome").value;
    const bio = document.getElementById("bio").value;
    let utente = {username: username, password: pass, email:email, nome:nome, cognome:cognome, bio:bio, id: id}
    
    if(file.value){
        const fileImg = await uploadFile(file); //contiente il path e il link
        const link = await fileImg.link;
        utente.foto = await link
    }else{
        utente.foto="";
    }
    await updateUser(utente);
    getUser(id).then((result)=>{
        loggato = result.result;
        user = result.result;
        sessionStorage.setItem("utente",JSON.stringify(user));
        sessionStorage.setItem("loggato",JSON.stringify(loggato));
        renderProfilo();
    });
    document.getElementById("formUpdate").reset();
}

getViaggi().then((result)=>{
    preRender(result.result);
})