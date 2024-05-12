console.log(JSON.parse(sessionStorage.getItem("viaggio")));

const user = JSON.parse(sessionStorage.getItem("utente"));
const loggato = JSON.parse(sessionStorage.getItem("loggato"));

const addPostDiv = document.getElementById("addPostDiv");

if(user.id===loggato.id){
    addPostDiv.classList.remove("invisible");
}else{
    addPostDiv.classList.add("invisible");
}
