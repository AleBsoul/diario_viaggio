import { uploadFile, downloadFile} from "./mega.js"

let travelsTemplate;
let travelTemplate;

const user = JSON.parse(sessionStorage.getItem("utente"));
const loggato = JSON.parse(sessionStorage.getItem("loggato"));

const travelsTemplateLogged =`
<div class="travel" id="travel-%id">
    <div class="image-space">
    %IMGVIAGGIO
    </div>

    <div class="bottom-travel">
        <p class="nome">%nome</p>
        <div class="utente" id="%id_utente">
            <button type="button" class="del_btn" id="%IDViaggioDel"><i class="fi fi-rr-trash"></i></button>

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
            <button type="button" class="del_btn" id="%IDViaggioDel"><i class="fi fi-rr-trash"></i></button>
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
<div class="profile-picture">
    %IMMAGINE
</div>
<div class="profile-details">
    <h2 class="username">%nome %cognome</h2>
    <p><i>%username</i></p>
    <p class="bio">%bio</p>
    <div class="contact-info">
        <p><i class="fa fa-envelope"></i>%email</p>
    </div>
</div>
`
//add viaggio
const newViaggio = document.getElementById("newViaggio_btn");
const titoloInput = document.getElementById("titolo_viaggio_input");
const descrInput = document.getElementById("descrizione_viaggio_input");
const immInput = document.getElementById("immagine_viaggio_input");

const titoloErr = document.getElementById("titolo_error");
const descrErr = document.getElementById("descrizione_error");
const immErr = document.getElementById("immagine_error");

const time = 3000;

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

const render = async (viaggi,travels) => {

    const imgProfilo = `<img src="${await downloadFile(user.foto)}"></img>`;
    userContentDiv.innerHTML = userTemp.replace("%IMMAGINE",imgProfilo).replace("%nome", user.nome).replace("%cognome",user.cognome).replace("%username",user.username).replace("%bio",user.bio).replace("%email",user.email);


    for(let i=0;i<travels.length;i++){
        const imgViaggio = `<img src="${await downloadFile(viaggi[i].immagine)}">`;
        const imgProfilo = `<img src="${await downloadFile(viaggi[i].fotoProfilo)}" class="user-foto">`;  
        travels[i].innerHTML=travelTemp.replace("%nome", viaggi[i].titolo).replace("%utente", viaggi[i].username).replace("%id_utente", viaggi[i].idUser).replace("%id", viaggi[i].idViaggio).replace("%IMGVIAGGIO",imgViaggio).replace("%IMGPROFILO",imgProfilo).replace("%IDViaggioDel",viaggi[i].idViaggio);
        
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

const preRender = async (viaggi) => {
    const loading = `<iframe id='loadingViaggio' src='https://lottie.host/embed/66e70a89-2afc-4021-9865-bd5da9882885/69ZUtWw7XT.json' ></iframe>`
    const loadingProfilo = `<iframe id='loadingProfilo' src='https://lottie.host/embed/66e70a89-2afc-4021-9865-bd5da9882885/69ZUtWw7XT.json' ></iframe>`

    userContentDiv.innerHTML = userTemp.replace("%IMMAGINE",loading).replace("%nome", user.nome).replace("%cognome",user.cognome).replace("%username",user.username).replace("%bio",user.bio).replace("%email",user.email);
    
    travelContentDiv.innerHTML = "";

    for (const travel of viaggi.result) {
        travelContentDiv.innerHTML += travelsTemp.replace("%nome", travel.titolo).replace("%utente", travel.username).replace("%id_utente", travel.idUser).replace("%id", travel.idViaggio).replace("%IMGVIAGGIO",loading).replace("%IMGPROFILO",loadingProfilo).replace("%IDViaggioDel",travel.idViaggio);;
    }
    const travels = document.querySelectorAll(".travel");
    await render(viaggi.result,travels);

    travels.forEach((travel) => {
        travel.addEventListener('click', async function (event) {
            const viaggio = await getSingleViaggio(travel.id.split("-")[1]);
            sessionStorage.setItem("viaggio",JSON.stringify(await viaggio.result));
            window.location.href='viaggio.html';
        });
    });
    const del_btns = document.querySelectorAll(".del_btn");
    del_btns.forEach((del_btn)=>{
        del_btn.onclick=async()=>{
            await delViaggio(del_btn.id);
            preRender(await(getViaggi()));
        }
    })
}

// const render = async(data) => {
//     const scrProfilo = await downloadFile(user.foto)
//     userContentDiv.innerHTML = userTemplate.replace("%SRC",scrProfilo).replace("%nome", user.nome).replace("%cognome",user.cognome).replace("%username",user.username).replace("%bio",user.bio).replace("%email",user.email);
//     travelContentDiv.innerHTML="";
//     for (const travel of data.result) {
//         const srcViaggio = await downloadFile(travel.immagine);
//         travelContentDiv.innerHTML+=travelsTemplate.replace("%nome",travel.titolo).replace("%utente",travel.username).replace("%link", srcViaggio).replace("%idViaggioDel",travel.idViaggio);
//     }
//     const travels = document.querySelectorAll(".travel");
//     travels.forEach((travel)=>{
//         travel.onclick=()=>{

//         }
//     })
//     const del_btns = document.querySelectorAll(".del_btn");
//     del_btns.forEach((del_btn)=>{
//         del_btn.onclick=async()=>{
//             await delViaggio(del_btn.id);
//             preRender(await(getViaggi()));
//         }
//     })
// }

// const preRender = async(data)=>{
//     render(data);
// }

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

const formAdd = document.getElementById("formAdd");

newViaggio.onclick= async()=>{
    const titolo = titoloInput.value;

    if(!titolo){
        titoloErr.classList.remove("invisible");
        setTimeout(()=>{
            titoloErr.classList.add("invisible");
        },time)
    }

    const descrizione = descrInput.value;
    if(!descrizione){
        descrErr.classList.remove("invisible");
        setTimeout(()=>{
            descrErr.classList.add("invisible");
        },time)
    }

    const immagine = immInput.value;
    // aggiunta dell'immagine
    const link = await uploadFile(immInput); //contiente il path e il link
    if(!immagine){
        immErr.classList.remove("invisible");
        setTimeout(()=>{
            immErr.classList.add("invisible");
        },time)
    };
    
    if(titolo && descrizione && immagine){
        const id_utente = user.id;
        const viaggio = {
            titolo: titolo,
            descrizione: descrizione,
            immagine: link.link,
            id_utente: id_utente
        }
    
        saveViaggio(viaggio).then(()=>{
            formAdd.reset();
            getViaggi().then((result)=>{
                preRender(result);
            })
        })
    }
}

getViaggi().then((result)=>{
    preRender(result);
})