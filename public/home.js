import { uploadFile, downloadFile} from "./mega.js"
import { getUser, getSingleViaggio} from "./common.js"


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

//render delle immagini
const render = async (viaggi,travels) => {
    for(let i=0;i<travels.length;i++){
        const imgViaggio = `<img src="${await downloadFile(viaggi[i].immagine)}">`;
        const imgProfilo = `<img src="${await downloadFile(viaggi[i].fotoProfilo)}" class="user-foto">`;  
        travels[i].innerHTML=travelTemplate.replace("%nome", viaggi[i].titolo).replace("%utente", viaggi[i].username).replace("%id_utente", viaggi[i].idUser).replace("%id", viaggi[i].idViaggio).replace("%IMGVIAGGIO",imgViaggio).replace("%IMGPROFILO",imgProfilo);
    }
}

//caricamento dei div dei viaggi con la rotella di caricamento
const preRender=async(viaggi)=>{
    const loadingViaggio = `<iframe id='loadingViaggio' src='https://lottie.host/embed/66e70a89-2afc-4021-9865-bd5da9882885/69ZUtWw7XT.json' ></iframe>`
    const loadingProfilo = `<iframe id='loadingProfilo' src='https://lottie.host/embed/66e70a89-2afc-4021-9865-bd5da9882885/69ZUtWw7XT.json' ></iframe>`

    travelContentDiv.innerHTML = "";

    for (const travel of viaggi.result) {
        travelContentDiv.innerHTML += travelsTemplate.replace("%nome", travel.titolo).replace("%utente", travel.username).replace("%id_utente", travel.idUser).replace("%id", travel.idViaggio).replace("%IMGVIAGGIO",loadingViaggio).replace("%IMGPROFILO",loadingProfilo);
    }
    const travels = document.querySelectorAll(".travel");
    render(viaggi.result,travels);

    travels.forEach(async(travel) => {
        travel.addEventListener('click', async function (event) {
            // const utente = await getUser(user.id)
            const viaggio = await getSingleViaggio(travel.id.split("-")[1]);
            const utente = await getUser(viaggio.result.id_utente)
            sessionStorage.setItem("utente",JSON.stringify(await utente.result));
            sessionStorage.setItem("viaggio",JSON.stringify(await viaggio.result));
            window.location.href='viaggio.html';
        });
    });
    const users = document.querySelectorAll(".utente");
    users.forEach((user) => {
        user.addEventListener('click', async function (event) {
            const utente = await getUser(user.id)
            sessionStorage.setItem("utente",JSON.stringify(await utente.result));
            window.location.href='user.html';
        });
    });
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

// const viaggi = await getViaggi();
preRender(await getViaggi());