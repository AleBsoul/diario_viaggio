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
const media = document.getElementById("media_post_input");
const posizione = document.getElementById("posizione_post_input");

function getFileType(file) {
  if (file.type.match(/^image\//))
    return 'image';

  if (file.type.match(/^video\//))
    return 'video';

  if (file.type.match(/^audio\//))
    return 'audio';

  // Aggiungi altri tipi di file se necessario...

  return 'other';
}

newPost.onclick=async()=>{
  console.log(media.files[0].type.split("/")[0]);
  const fileImg = await uploadFile(media);
  const imgLink = await fileImg.link;
  const post = {
    titolo: titolo.value,
    descrizione: descrizione.value,
    file: await imgLink,
    posizione: posizione.value,
    id_viaggio: viaggio.id,
    mime: media.files[0].type.split("/")[0]
  }
  savePost(post).then((result)=>{
    document.getElementById("formAddPost").reset();
    console.log(result);
  })
}

const get_posts = async(id)=>{
  try{
    const r = await fetch("/get_post/"+id);
    const json = await r.json();
    return json;
} catch (e) {
    console.log(e);
} 
}


const postsTemplate = `
<div class="post-container">
  <div class="top-post">
    <p class="titolo-post">%TITOLO</p>
    <div class="posizione-post">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
      <p>%POSIZIONE</p>
    </div>
    <div class="data-div">
      %DATA
    </div>
  </div>
  <div class="middle-post">
    %MEDIA
  </div>
  <div class="bottom-post">
    <p class="descrizione-post">%DESCRIZIONE</p>
  </div>
</div>
`


const postTemplate = `
  <div class="top-post">
    <p class="titolo-post">%TITOLO</p>
    <div class="posizione-post">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
      <p>%POSIZIONE</p>
    </div>
    <div class="data-div">
      %DATA
    </div>
  </div>
  <div class="middle-post">
    %MEDIA
  </div>
  <div class="bottom-post">
    <p class="descrizione-post">%DESCRIZIONE</p>
  </div>
`
const videoTemplate = `
<video class="post_media"width="320" height="240" controls>
  <source src="%SRC" type="video/mp4">
</video>`;

const imgTemplate = `
<img src="%SRC" alt="">`;
const audioTemplate = `
<audio controls>
  <source src="%SRC" type="audio/mpeg">
</audio>`;

// const render = async(posts)=>{
//   let postsContent=""
//   const postsContentDiv = document.getElementById("post-content");
//   const loadingPost = `<iframe class='post-loading' src='https://lottie.host/embed/66e70a89-2afc-4021-9865-bd5da9882885/69ZUtWw7XT.json' >`;
//   posts.forEach((post) => {
//     postsContent+=postTemplate.replace("%POST",loadingPost);
//   });
//   postsTemplate = postsTemplate.replace("%POSTS",postsContent);
//   postsContentDiv.innerHTML=postsTemplate;
// }


const postsContentDiv = document.getElementById("post-content");

const render = async(posts) =>{
  const loadingPost = `<iframe id='loadingPost' src='https://lottie.host/embed/66e70a89-2afc-4021-9865-bd5da9882885/69ZUtWw7XT.json' ></iframe>`;
  let postsContent = "";
  posts.forEach(post => {
    console.log(post);
    postsContent+=postsTemplate.replace("%POSIZIONE",post.posizione).replace("%TITOLO",post.testo).replace("%MEDIA",loadingPost).replace("%DESCRIZIONE",post.descrizione);
  });
  const postsDiv = document.querySelectorAll(".post-container")
  postsContentDiv.innerHTML=postsContent;
  // postsContent = "";
  // for (const post of posts) {
  //   const srcPost = await downloadFile(post.file);
  //   if (post.mime==="image"){
  //     // postsContent+=postsTemplate.replace("%POSIZIONE",post.posizione).replace("%TITOLO",post.testo).replace("%MEDIA",imgTemplate.replace("%SRC"), srcPost).replace("%DESCRIZIONE",post.descrizione);
  //   }else if (post.mime==="video"){

  //   }else if (post.mime==="audio"){
      
  //   }else{

  //   }
  //   postsDiv[i].innerHTML=postTemplate;
  // }


  /*postsTemplate = postsTemplate.replace("%NOMEVIAGGIO",viaggio.titolo).replace("%DESCRIZIONE",viaggio.descrizione).replace("%NOMEUTENTE",user.username).replace("%SRCVIAGGIO", srcViaggio);
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