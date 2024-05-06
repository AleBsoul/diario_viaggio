const modal = document.getElementById("modal");
const modalButton = document.querySelector(".modal-button");
const closeButton = document.querySelector(".close-button");
const log_btn = document.getElementById("log_btn");
const openModal_btn = document.getElementById("openModal");
const close_btn = document.getElementById("close_btn");

let isOpened = false;

const openModal = () => {
  modal.classList.add("is-open");
};

const closeModal = () => {
  modal.classList.remove("is-open");
};

setTimeout(openModal,500);

openModal_btn.onclick=()=>{
    openModal();
}
close_btn.onclick=()=>{
    closeModal();
}

log_btn.onclick=()=>{
  window.location.href = "home.html";

}
