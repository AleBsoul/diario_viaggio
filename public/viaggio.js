import { uploadFile, downloadFile} from "./mega.js"

const user = JSON.parse(sessionStorage.getItem("utente"));
const loggato = JSON.parse(sessionStorage.getItem("loggato"));
const viaggio = JSON.parse(sessionStorage.getItem("viaggio"));
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
const close_btn = document.getElementById("close_btn_1");

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

newPost.onclick=async()=>{
  const fileImg = await uploadFile(immagine);
  const imgLink = await fileImg.link
  const fileAudio = await uploadFile(audio);
  const audioLink = await fileAudio.link
  const fileVideo = await uploadFile(audio);
  const viadeoLink = await fileVideo.link
  savePost({
    titolo: titolo.value,
    descrizione: descrizione.value,
    immagine: await imgLink,
    video: await viadeoLink,
    audio:await audioLink,
    posizione: "ciao",
    id_viaggio: viaggio.id
  }).then((result)=>{
    document.getElementById("formAddPost").reset();
    console.log(result);
  })
}

const get_posts = async(id)=>{
  try{
    console.log(id);
    const r = await fetch("/get_post/"+id);
    const json = await r.json();
    return json;
} catch (e) {
    console.log(e);
} 
}


const postTemplate = `


`
// const preRender = async(posts)=>{
//   let postsContent=""
//   const postsContentDiv = document.getElementById("travel-container");
//   const loadingPost = `<iframe class='post-loading' src='https://lottie.host/embed/66e70a89-2afc-4021-9865-bd5da9882885/69ZUtWw7XT.json' >`;
//   const loadingViaggio = `<iframe id="travel-image" src='https://lottie.host/embed/66e70a89-2afc-4021-9865-bd5da9882885/69ZUtWw7XT.json' >`;
//   postsTemplate = postsTemplate.replace("%NOMEVIAGGIO",viaggio.titolo).replace("%DESCRIZIONE",viaggio.descrizione).replace("%NOMEUTENTE",user.username).replace("%SRCVIAGGIO",loadingViaggio);
//   posts.forEach((post) => {
//     postsContent+=postTemplate.replace("%POST",loadingPost);
//   });
//   postsTemplate = postsTemplate.replace("%POSTS",postsContent);
//   postsContentDiv.innerHTML=postsTemplate;
// }


const postsContentDiv = document.getElementById("travel-container");

const render = async(posts) =>{
  /*postsContentDiv.innerHTML="";
  
  const srcViaggio = `<img id="travel-image" class="post-image" src="${await downloadFile(viaggio.immagine)}">`;
  postsTemplate = postsTemplate.replace("%NOMEVIAGGIO",viaggio.titolo).replace("%DESCRIZIONE",viaggio.descrizione).replace("%NOMEUTENTE",user.username).replace("%SRCVIAGGIO", srcViaggio);
  for (const post of posts) {
    const srcPost = `<img class="post-image" src="${await downloadFile(post.immagine)}">`;
    postsContentDiv.innerHTML+=postTemplate.replace("%POST", srcPost);
  };
  postsTemplate = postsTemplate.replace("%POSTS", postsContent);
  console.log(postsTemplate);
  postsContentDiv.innerHTML = postsTemplate;*/
}


const posts = await get_posts(viaggio.id);
render(posts.result);
