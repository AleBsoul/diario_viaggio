import { uploadFile, downloadFile} from "./mega.js"


const user = JSON.parse(sessionStorage.getItem("utente"));
console.log(user)

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

const travelTemplate = `
<div class="travel" id="travel-%id">
    <div class="image-space">
        <img src="%link">
    </div>

    <div class="bottom-travel">
        <p class="nome user_nome">%nome</p>
    </div>
</div>
`
const render = (data) => {
    console.log(data);
    travelContentDiv.innerHTML="";
    data.result.forEach(async (travel)=>{
        const srcViaggio = await downloadFile(travel.immagine);
        travelContentDiv.innerHTML+=travelTemplate.replace("%nome",travel.titolo).replace("%utente",travel.username).replace("%link", srcViaggio);
    })

    const travels = document.querySelectorAll(".travel");
    travels.forEach((travel)=>{
        travel.onclick=()=>{

        }
    })
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
                render(result);
            })
        })
    }
}

getViaggi().then((result)=>{
    render(result);
})


  