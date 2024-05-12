import { uploadFile, downloadFile} from "./mega.js"

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


//check user logged
const user = JSON.parse(sessionStorage.getItem("loggato"));

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
  modal.classList.remove("is-open");
};



openModal_btn.onclick=()=>{
    openModal();
}
close_btn.onclick=()=>{
    closeModal();
}

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

const travelsTemplate = `
<div class="travel" id="travel-%id">
    <div class="image-space">
    %IMGVIAGGIO
    </div>

    <div class="bottom-travel">
        <p class="nome">%nome</p>
        <div class="utente" id="%id_utente">
            %IMGPROFILO
            <p>%utente</p>
        </div>
    </div>
</div>
`
const travelTemplate =
`
<div class="image-space">
    %IMGVIAGGIO
    </div>

    <div class="bottom-travel">
        <p class="nome">%nome</p>
        <div class="utente" id="%id_utente">
            %IMGPROFILO
            <p>%utente</p>
        </div>
</div>
`
const render = async (viaggi,travels) => {
    for(let i=0;i<travels.length;i++){
        const imgViaggio = `<img src="${await downloadFile(viaggi[i].immagine)}">`;
        const imgProfilo = `<img src="${await downloadFile(viaggi[i].fotoProfilo)}" class="user-foto">`;  
        travels[i].innerHTML=travelTemplate.replace("%nome", viaggi[i].titolo).replace("%utente", viaggi[i].username).replace("%id_utente", viaggi[i].idUser).replace("%id", viaggi[i].idViaggio).replace("%IMGVIAGGIO",imgViaggio).replace("%IMGPROFILO",imgProfilo);
        
    }
}
const preRender=async(viaggi)=>{
    const loadingViaggio = `<iframe id='loadingViaggio' src='https://lottie.host/embed/66e70a89-2afc-4021-9865-bd5da9882885/69ZUtWw7XT.json' ></iframe>`
    const loadingProfilo = `<iframe id='loadingProfilo' src='https://lottie.host/embed/66e70a89-2afc-4021-9865-bd5da9882885/69ZUtWw7XT.json' ></iframe>`

    travelContentDiv.innerHTML = "";

    for (const travel of viaggi.result) {
        
        travelContentDiv.innerHTML += travelsTemplate.replace("%nome", travel.titolo).replace("%utente", travel.username).replace("%id_utente", travel.idUser).replace("%id", travel.idViaggio).replace("%IMGVIAGGIO",loadingViaggio).replace("%IMGPROFILO",loadingProfilo);
    }
    const travels = document.querySelectorAll(".travel");
    await render(viaggi.result,travels);

    travels.forEach((travel) => {
        travel.addEventListener('click', function (event) {
        });
    });
    const users = document.querySelectorAll(".utente");
    users.forEach((user) => {
        user.addEventListener('click', async function (event) {
            const utente = await getUser(user.id)
            sessionStorage.setItem("utente",JSON.stringify(await utente.result));
            // window.location.href='user.html';
        });
    });
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

const getViaggi = async () => {
    try{
        const r = await fetch("/getViaggi");
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
    const fileImg = await uploadFile(immInput); //contiente il path e il link
    const link = fileImg.link;
  
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
            immagine: link,
            id_utente: id_utente
        }
    
        saveViaggio(viaggio).then(async()=>{
            formAdd.reset();
            const viaggi = await getViaggi();
            preRender(viaggi);
        })
    }
}



// const viaggi = await getViaggi();
preRender(await getViaggi());