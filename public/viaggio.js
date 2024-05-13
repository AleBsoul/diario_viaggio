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
          body: JSON.stringify(data)
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


newPost.onclick=async()=>{
  const data = String(Date.now());
  const fileImg = await uploadFile(media);
  const imgLink = await fileImg.link;
  const post = {
    titolo: titolo.value,
    descrizione: descrizione.value,
    file: await imgLink,
    posizione: posizione.value,
    id_viaggio: viaggio.id,
    mime: media.files[0].type.split("/")[0],
    data: data
  }
  savePost(post).then(async(result)=>{
    document.getElementById("formAddPost").reset();
    const posts = await get_posts(viaggio.id);
    render(posts.result);
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

const postsContentDiv = document.getElementById("post-content");

const render = async(posts) =>{
  const loadingPost = `<iframe id='loadingPost' src='https://lottie.host/embed/66e70a89-2afc-4021-9865-bd5da9882885/69ZUtWw7XT.json' ></iframe>`;
  let postsContent = "";
  posts.forEach(post => {
    const all_date = new Date(parseInt(post.data));
    const data = all_date.getDay()+"/"+all_date.getMonth()+"/"+all_date.getFullYear()+" - "+all_date.getHours()+":"+all_date.getMinutes()
    postsContent+=postsTemplate.replace("%POSIZIONE",post.posizione).replace("%TITOLO",post.testo).replace("%DATA",data).replace("%MEDIA",loadingPost).replace("%DESCRIZIONE",post.descrizione);
  });
  postsContentDiv.innerHTML=postsContent;
  const postsDivs = document.querySelectorAll(".post-container");
  postsDivs.forEach((postDiv)=>{
    postDiv.addEventListener('click', async function (event) {
      
    });
  })
  postsContent = "";
  for (let i=0; i<posts.length;i++) {
    const all_date = new Date(parseInt(posts[i].data));
    const data = all_date.getDay()+"/"+all_date.getMonth()+"/"+all_date.getFullYear()+" - "+all_date.getHours()+":"+all_date.getMinutes()
    const srcPost = await downloadFile(posts[i].file);
    let media;
    if (posts[i].mime==="image"){
      media = `<img src="${srcPost}" class="post_media" width="320" height="240">`;
    }else if (posts[i].mime==="video"){
      media = `<video class="post_media"width="320" height="240" controls><source src="${srcPost}" type="video/mp4"></video>`;
    }else if (posts[i].mime==="audio"){
      media = `<audio controls class="post_media"><source src="${srcPost}" type="audio/mpeg"></audio>`;
    }else{
      console.log("niente");
    }
    postsContent=postTemplate.replace("%POSIZIONE",posts[i].posizione).replace("%TITOLO",posts[i].testo).replace("%DATA",data).replace("%MEDIA",media).replace("%DESCRIZIONE",posts[i].descrizione);
    postsDivs[i].innerHTML=postsContent;
  }
}

const posts = await get_posts(viaggio.id);
render(posts.result);