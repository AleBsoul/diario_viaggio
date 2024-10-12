let arrow = document.querySelectorAll(".arrow");
for (var i = 0; i < arrow.length; i++) {
    arrow[i].addEventListener("click", (e)=>{
        let arrowParent = e.target.parentElement.parentElement;//selecting main parent of arrow
        arrowParent.classList.toggle("showMenu");
    });
}
let sidebar = document.querySelector(".sidebar");

// per aprire o chiudere il menu (il bottone è stato tolto quindi se si vuole farlo funzionare, aggiungerlo)

// let sidebarBtn = document.querySelector(".bx-menu");
// sidebarBtn.addEventListener("click", ()=>{
//     sidebar.classList.toggle("close");
// });