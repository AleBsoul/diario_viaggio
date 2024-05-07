//navbar
const rightNavContent = document.getElementById("right-nav-content");
const bar = document.getElementById("bar");
const barBtn = document.getElementById("bar-btn");
const check_size = () =>{
    if(window.innerWidth<850){
        bar.classList.remove("invisible");
        rightNavContent.classList.add("invisible");
        barBtn.onclick=()=>{
            if(rightNavContent.classList.contains("invisible")){
                rightNavContent.classList.remove("invisible");
                rightNavContent.classList.add("collapsed")
            }else{
                rightNavContent.classList.remove("collapsed");
                rightNavContent.classList.add("invisible");
            }
        }
    }else{
        bar.classList.add("invisible");
        rightNavContent.classList.remove("invisible");
        rightNavContent.classList.remove("collapsed")
    }
}
window.addEventListener("resize", function(){
    check_size();
})
check_size();


const loadTravels = async () => {
    try {
        const r = await fetch("/get_viaggi");
        const json = await r.json();
        return json
    } catch (e) {
        console.log(e)
    }
}

const travelTemplate = `
`;

const divTravelContent = document.getElementById("travel-content");

loadTravels().then((result)=>{
    /*divTravelContent.innerHTML = "";
    console.log(result)
    result.result.forEach((travel)=>{
        divTravelContent.innerHTML+=travelTemplate.replace("%nome",travel.titolo);
    })*/
})


  