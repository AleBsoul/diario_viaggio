const viaggio = JSON.parse(sessionStorage.getItem("viaggio"));

const user = JSON.parse(sessionStorage.getItem("utente"));
const loggato = JSON.parse(sessionStorage.getItem("loggato"));

const addPostDiv = document.getElementById("addPostDiv");

if(user.id===loggato.id){
    addPostDiv.classList.remove("invisible");
}else{
    addPostDiv.classList.add("invisible");
}



//modal new viaggio
const modal = document.getElementById("modalPost");
const closeButton = document.querySelector(".close-button");
const openModal_btn = document.getElementById("add-post");
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


const savePost = async (data) => {
  try{
      const r = await fetch("/addpost", {
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

const newPost = document.getElementById("newPost_btn");
const titolo = document.getElementById("titolo_post_input");
const descrizione = document.getElementById("descrizione_post_input");
const immagine = document.getElementById("immagine_post_input");
const video = document.getElementById("video_post_input");
const audio = document.getElementById("audio_post_input");
const posizione = document.getElementById("posizione_post_input");
newPost.onclick=()=>{
  savePost({
    titolo: titolo.value,
    descrizione: descrizione.value,
    immagine: "ciao",
    video: "ciao",
    audio:"ciao",
    posizione: "ciao",
    id_viaggio: viaggio.id
  }).then((result)=>{
    document.getElementById("formAddPost").reset();
    console.log(result)
  })
}









