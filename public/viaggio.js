import { uploadFile, downloadFile} from "./mega.js"
import { newViaggioClick, getSingleViaggio, checkNull } from "./common.js"


const user = JSON.parse(sessionStorage.getItem("utente"));
const loggato = JSON.parse(sessionStorage.getItem("loggato"));
let viaggio = JSON.parse(sessionStorage.getItem("viaggio"));
const addPostDiv = document.getElementById("addPostDiv");
const updatePost_btn = document.getElementById("updatePost_btn");

const updateTravelForm =document.getElementById("formPut");
const updateTravelBtn =document.getElementById("putViaggio_btn");

let postsTemplate;
let postTemplate;

const travel_div = document.querySelector(".travel_div");
let travel_temp;

const exportTravel=async()=>{
  document.getElementById("map_posts").style.display="none";
  //tolgo tutti gli elementi che non vanno esportati: nav, bottoni, ecc...
  const noExportElements = document.querySelectorAll(".no_export");

  noExportElements.forEach(el => el.classList.add("invisible"));

  window.print();

  //tutto come prima dopo aver stampato
  document.getElementById("map_posts").style.display="block";
  noExportElements.forEach(el => el.classList.remove("invisible"));
  // noBorderElements.forEach(el => el.classList.remove("no-border"));
  travel_div.classList.remove("no-border");
}


const newViaggio = document.getElementById("newViaggio_btn");
newViaggio.onclick=()=>{
    newViaggioClick();
}

const print_btn = document.getElementById("print-post");
print_btn.onclick=()=>{
  exportTravel();
}

let place;

//api maps
function initializeAutocomplete(id) {
  var element = document.getElementById(id);
  if (element) {
      const autocomplete = new google.maps.places.Autocomplete(element, { types: ['geocode'] });
      google.maps.event.addListener(autocomplete, 'place_changed', onPlaceChanged);  
    }
}

function onPlaceChanged() {
  place = this.getPlace();

  // console.log(place);  // Uncomment this line to view the full object returned by Google API.

  for (var i in place.address_components) {
    let component = place.address_components[i];
    for (var j in component.types) {  // Some types are ["country", "political"]
      //var type_element = document.getElementById(component.types[j]);
      //if (type_element) {
        //type_element.value = component.long_name;
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            "address": component.long_name
        }, function(results) {
          //console.log("latittudine: ",results[0].geometry.location.lat()); 
          //console.log("longitudine:",results[0].geometry.location.lng()); 
        });
    }
  }
}

google.maps.event.addDomListener(window, 'load', function() {
  initializeAutocomplete('posizione_post_input');
  initializeAutocomplete('put_posizione_post_input');
});

//map
let map;
const myMap = (lat, lng) => {
  const mapProp = {
    center: new google.maps.LatLng(lat, lng),
    zoom: 1
  };
  map = new google.maps.Map(document.getElementById("map_posts"),mapProp);
}





if(user.id===loggato.id){
    addPostDiv.classList.remove("invisible");
    travel_temp = `
    <h2 id="viaggio-title">%TITLE</h2>
    <p id="viaggio-desc">%DESC</p>
    <div class="button-travel no_export">
          <button type="button" id="pencilTravel">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg>
          </button>
    </div>
    <div id="viaggio-image">
      %IMAGE
    </div>
    
    `
  
postsTemplate = `
<div class="post-container" id="%id">
  <div class="top-post">
    <p class="titolo-post">%TITOLO</p>
    <div class="posizione-post">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
      <p>%POSIZIONE</p>
    </div>
    <div class="buttons-post">
      
      <button type="button">
        <svg id="%put_btn_id" class="pencilPost no_export" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg>
      </button>

      <button type="button" class="del_btn_post no_export" id="%del_btn_id">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
      </button>
      
    </div>
    
    
      
    
    <div class="data-div">
      %DATA<br/>
      %MODIFICA
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

postTemplate = `
  <div class="top-post">
    <p class="titolo-post">%TITOLO</p>
    <div class="posizione-post">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
      <p>%POSIZIONE</p>
    </div>
    <div class="buttons-post">
      <button type="button">
        <svg id="%put_btn_id" class="pencilPost no_export" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg>
      </button>
      <button type="button" class="del_btn_post no_export" id="%del_btn_id">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
      </button>
      
    </div>
    <div class="data-div">
      %DATA<br/>
      %MODIFICA
      
    </div>
  </div>
  <div class="middle-post">
    %MEDIA
  </div>
  <div class="bottom-post">
    <p class="descrizione-post">%DESCRIZIONE</p>
  </div>
`
}else{
  
  travel_temp = `
  <h2 id="viaggio-title">%TITLE</h2>
  <p id="viaggio-desc">%DESC</p>
  <div id="viaggio-image">
    %IMAGE
  </div>
  
  `
postsTemplate = `
<div class="post-container" id="%id">
  <div class="top-post">
    <p class="titolo-post">%TITOLO</p>
    <div class="posizione-post">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
      <p>%POSIZIONE</p>
    </div>
    <div class="data-div">
      %DATA<br/>
      %MODIFICA
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

postTemplate = `
  <div class="top-post">
    <p class="titolo-post">%TITOLO</p>
    <div class="posizione-post">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
      <p>%POSIZIONE</p>
    </div>
    <div class="data-div">
      %DATA<br/>
      %MODIFICA
    </div>
  </div>
  <div class="middle-post">
    %MEDIA
  </div>
  <div class="bottom-post">
    <p class="descrizione-post">%DESCRIZIONE</p>
  </div>
`


  addPostDiv.classList.add("invisible");
}

// modal travel
const travelModal = document.getElementById("modal");


//modal post
const postModal = document.getElementById("modalPost");
const closeButton = document.querySelector(".close-button");
const addPost_btn = document.getElementById("add-post");
let postId;
const close_btn = document.getElementById("close_btn_1");

let isOpened = false;



const openModal = (modal) => {
  modal.classList.add("is-open");
};

const closeModal = () => {
  postModal.classList.remove("is-open");
};


updatePost_btn.onclick=async()=>{
  print_btn.disabled = true;
  const titolo = document.getElementById("put_titolo_post_input");
  const descrizione = document.getElementById("put_descrizione_post_input");
  const media = document.getElementById("put_media_post_input");
  let position
  if(place){
    position = {
      nome: place.formatted_address,
      latitudine: place.geometry.location.lat(),
      longitudine: place.geometry.location.lng()
    }
  }else{
    position = null
  }
  if(titolo.value.replaceAll("'", " ") || descrizione.value.replaceAll("'", " ") || position || media.value.replaceAll("'", " ")){
    document.getElementById("loading-put-post").style.opacity=1;

    const data = String(Date.now());
  let post = {
    id:postId,
    titolo: titolo.value.replaceAll("'", " "),
    descrizione: descrizione.value.replaceAll("'", " "),
    posizione: position,
    id_viaggio: viaggio.id,
    ultima_modifica: data
  }
  if(media.value.replaceAll("'", " ")){
    const fileImg = await uploadFile(media); //contiente il path e il link
    const link = await fileImg.link;
    post.file = await link;
    post.mime = media.files[0].type.split("/")[0];
  }else{
      post.file="";
      post.mime = "";
  }  
  updatePost(post).then(async(result)=>{
    document.getElementById("formUpdatePost").reset();
    document.getElementById("loading-put-post").style.opacity=0;
    const posts = await get_posts(viaggio.id);
    await render(posts.result);
    print_btn.disabled = false;
  });
  }
  
}

addPost_btn.onclick=()=>{
    document.getElementById("formUpdatePost").style.display="none";
    document.getElementById("formAddPost").style.display="block";
    openModal(postModal);
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
}

const savePosition = async (data) => {
  try{
    const r = await fetch("/addPosition", {
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
}

const newPost = document.getElementById("newPost_btn");
newPost.onclick=async()=>{
  print_btn.disabled = true;
  const titolo = document.getElementById("titolo_post_input");
  const descrizione = document.getElementById("descrizione_post_input");
  const media = document.getElementById("media_post_input");
  const posizione = document.getElementById("posizione_post_input");
  const data = String(Date.now());
  
  checkNull(titolo);
  checkNull(descrizione);
  checkNull(media);
  checkNull(posizione);

  if(titolo.value && descrizione.value && media.value && posizione.value){
    document.getElementById("loading-add-post").style.opacity=1;
    const position = {
        nome: place.formatted_address,
        latitudine: place.geometry.location.lat(),
        longitudine: place.geometry.location.lng()
    };
    
    
    const fileImg = await uploadFile(media);
    const imgLink = await fileImg.link;
    const post = {
      titolo: titolo.value.replaceAll("'", " "),
      descrizione: descrizione.value.replaceAll("'", " "),
      file: await imgLink,
      posizione: position,
      id_viaggio: viaggio.id,
      mime: media.files[0].type.split("/")[0],
      data: data
    }
    
    savePost(post).then(async(result)=>{
      document.getElementById("formAddPost").reset();
      document.getElementById("loading-add-post").style.opacity=0;
      const posts = await get_posts(viaggio.id);
      await render(posts.result);
      print_btn.disabled = false;
    })
  }
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

const updatePost=(post)=>{
  return new Promise((resolve, reject) => {
    fetch("/modificaPost", {
        method: 'PUT',
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(post)
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

const delPost= async(id)=>{
  try{
    const r = await fetch("/del_post/"+id,{
      method: "DELETE",
      headers: {
          "Content-Type": "application/json",
      }
  });
    const json = await r.json();
    return json;
} catch (e) {
    console.log(e);
} 
}

const update_btn_event=(posts)=>{
  const put_btns = document.querySelectorAll(".pencilPost");
  put_btns.forEach((put_btn)=>{
    put_btn.onclick=()=>{
      postId=put_btn.id;
      document.getElementById("formUpdatePost").style.display="block";
      document.getElementById("formAddPost").style.display="none";
      openModal(postModal);
      posts.forEach((post)=>{
        if(post.id==put_btn.id){
          document.getElementById("put_titolo_post_input").value=post.testo;
          document.getElementById("put_descrizione_post_input").value=post.descrizione;
          document.getElementById("put_posizione_post_input").value=post.nome;
        }
      })
    }
  })
}

const del_btn_event = () =>{
  const del_btns = document.querySelectorAll(".del_btn_post");
  del_btns.forEach((del_btn)=>{
    del_btn.onclick=async()=>{
      print_btn.disabled = true;
      delPost(del_btn.id);
      const posts = await get_posts(viaggio.id);
      await render(await posts.result);
      print_btn.disabled = false;
    }
  })
}

const updateTravel=(cambiamenti)=>{
  return new Promise((resolve, reject) => {
    fetch("/modificaViaggio", {
        method: 'PUT',
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(cambiamenti)
    })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
        resolve(json); //risposta server
    })
    .catch((error) => {
        reject(error);
    });
});
}

const updateTravelEvent =()=>{
  const titoloInput = document.getElementById("put_titolo_viaggio_input");
  const descrInput = document.getElementById("put_descrizione_viaggio_input");
  const immInput = document.getElementById("put_immagine_viaggio_input");
  titoloInput.value=viaggio.titolo;
  descrInput.value=viaggio.descrizione;
  document.getElementById("formUpdatePost").style.display="none";
  document.getElementById("formAddPost").style.display="none";
  document.getElementById("formAdd").style.display="none";
  updateTravelForm.style.display="block";
  openModal(travelModal);
}

updateTravelBtn.onclick=async()=>{
  const titoloInput = document.getElementById("put_titolo_viaggio_input");
  const descrInput = document.getElementById("put_descrizione_viaggio_input");
  const immInput = document.getElementById("put_immagine_viaggio_input");
  let cambiamenti = { id:viaggio.id,titolo: null, descrizione:null, immagine: null };
  if(titoloInput.value.replaceAll("'", " ")!==viaggio.titolo || descrInput.value.replaceAll("'", " ")!==viaggio.descrizione || immInput.value.replaceAll("'", " ")){
    document.getElementById("loading-put-travel").style.opacity=1;

    if(immInput.value.replaceAll("'", " ")){
      const fileImg = await uploadFile(immInput); //contiente il path e il link
      const link = await fileImg.link;
      cambiamenti.immagine = await link;
    }
    if(titoloInput.value.replaceAll("'", " ")!==viaggio.titolo){
      cambiamenti.titolo = titoloInput.value.replaceAll("'", " ");
    }
    if(descrInput.value.replaceAll("'", " ")!==viaggio.descrizione){
      cambiamenti.descrizione = descrInput.value.replaceAll("'", " ");
    }
    await updateTravel(cambiamenti);
    document.getElementById("loading-put-travel").style.opacity=0;
    viaggio = await getSingleViaggio(viaggio.id);
    viaggio = await viaggio.result;
    sessionStorage.setItem("viaggio",JSON.stringify(await viaggio));
    renderTravel();
  }
}

const postsContentDiv = document.getElementById("post-content");

const renderTravel=async()=>{
  const loading_travel_img =`<iframe class='loadingTravel' src='https://lottie.host/embed/66e70a89-2afc-4021-9865-bd5da9882885/69ZUtWw7XT.json' ></iframe>`;
  travel_div.innerHTML = travel_temp.replace("%TITLE",viaggio.titolo).replace("%DESC",viaggio.descrizione).replace("%IMAGE",loading_travel_img);
  if(user.id===loggato.id){
    document.getElementById("pencilTravel").onclick=()=>{
      updateTravelEvent();
    };
  }
  const travel_img = `<img src="${await downloadFile(viaggio.immagine)}" class="post_media" width="320" height="240">`;
  travel_div.innerHTML = travel_temp.replace("%TITLE",viaggio.titolo).replace("%DESC",viaggio.descrizione).replace("%IMAGE", travel_img);
  if(user.id===loggato.id){
    document.getElementById("pencilTravel").onclick=()=>{
      updateTravelEvent();
    };
  }
}

const render = async(posts) =>{
  // travel
  //map
  if(posts.length){ 
    myMap(posts[0].latitudine, posts[0].longitudine);
    posts.forEach((post)=>{
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(post.latitudine, post.longitudine),
        map: map,
        id: post.id
      })
      google.maps.event.addDomListener(marker, 'click', function() {
        document.getElementById(marker.id).scrollIntoView({behavior: "smooth"});
    });
    })
    document.getElementById("map_posts").style.display="block"
  }else{
    document.getElementById("map_posts").style.display="none"
  }
  const loadingPost = `<iframe class='loadingPost' src='https://lottie.host/embed/66e70a89-2afc-4021-9865-bd5da9882885/69ZUtWw7XT.json' ></iframe>`;
  let postsContent = "";
  //caricamento dei div dei post con la rotella di caricamento
  posts.forEach(post => {
    const all_date = new Date(parseInt(post.data));
    let mins = String(all_date.getMinutes());
    if(mins.length===1){
      mins="0"+mins
    }
    const data = all_date.getDay()+"/"+all_date.getMonth()+"/"+all_date.getFullYear()+" - "+all_date.getHours()+":"+mins
    
    if(post.ultima_modifica){
      const all_modifica_date = new Date(parseInt(post.ultima_modifica));
      let mins_modifica = String(all_modifica_date.getMinutes());
      if(mins_modifica.length===1){
        mins_modifica="0"+mins_modifica;
      }
      const modifica_data = all_modifica_date.getDay()+"/"+all_modifica_date.getMonth()+"/"+all_modifica_date.getFullYear()+" - "+all_modifica_date.getHours()+":"+mins_modifica;
      postsContent+=postsTemplate.replace("%POSIZIONE",post.nome).replace("%TITOLO",post.testo).replace("%DATA",data).replace("%MODIFICA","modificato: "+modifica_data).replace("%MEDIA",loadingPost).replace("%DESCRIZIONE",post.descrizione).replace("%del_btn_id",post.id).replace("%put_btn_id", post.id).replace("%id",post.id);
    }else{
      postsContent+=postsTemplate.replace("%POSIZIONE",post.nome).replace("%TITOLO",post.testo).replace("%DATA",data).replace("%MODIFICA","").replace("%MEDIA",loadingPost).replace("%DESCRIZIONE",post.descrizione).replace("%del_btn_id",post.id).replace("%put_btn_id", post.id).replace("%id",post.id);
    }
  });
  postsContentDiv.innerHTML=postsContent;
  del_btn_event();
  update_btn_event(posts);
  const postsDivs = document.querySelectorAll(".post-container");
  postsDivs.forEach((postDiv)=>{
    postDiv.addEventListener('click', async function (event) {
    });
  })
  //render delle immagini
  postsContent = "";
  for (let i=0; i<posts.length;i++) {
    const all_date = new Date(parseInt(posts[i].data));
    let mins = String(all_date.getMinutes());
    if(mins.length===1){
      mins="0"+mins
    }
    const data = all_date.getDay()+"/"+all_date.getMonth()+"/"+all_date.getFullYear()+" - "+all_date.getHours()+":"+mins
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
    if(posts[i].ultima_modifica){
      
      const all_modifica_date = new Date(parseInt(posts[i].ultima_modifica));
      let minsModifica = String(all_modifica_date.getMinutes());
      if(minsModifica.length===1){
        minsModifica="0"+minsModifica;
      }
      const modifica_data = all_modifica_date.getDay()+"/"+all_modifica_date.getMonth()+"/"+all_modifica_date.getFullYear()+" - "+all_modifica_date.getHours()+":"+minsModifica;
      postsContent=postTemplate.replace("%POSIZIONE",posts[i].nome).replace("%TITOLO",posts[i].testo).replace("%DATA",data).replace("%MODIFICA","modificato: "+modifica_data).replace("%MEDIA",media).replace("%DESCRIZIONE",posts[i].descrizione).replace("%del_btn_id",posts[i].id).replace("%put_btn_id", posts[i].id).replace("%id",posts[i].id);
    }else{
      postsContent=postTemplate.replace("%POSIZIONE",posts[i].nome).replace("%TITOLO",posts[i].testo).replace("%DATA",data).replace("%MODIFICA","").replace("%MEDIA",media).replace("%DESCRIZIONE",posts[i].descrizione).replace("%del_btn_id",posts[i].id).replace("%put_btn_id", posts[i].id).replace("%id",posts[i].id);
    }
    postsDivs[i].innerHTML=postsContent;
    del_btn_event();
    update_btn_event(posts);
  };
}

const posts = await get_posts(viaggio.id);
renderTravel();
await render(await posts.result);
print_btn.disabled = false;