const add_viaggio = (viaggio) => {
    return new Promise((resolve, reject) => {
        fetch("/addviaggio/", {
            method: 'POST',
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(viaggio)
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
const modifica_viaggio = (viaggio) =>{
    return new Promise((resolve, reject) => {
        fetch("/modificaViaggio", {
            method: 'PUT',
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(viaggio)
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

const get_viaggi = async() => {
    return new Promise((resolve, reject) => {
        fetch("/get_viaggi", {
            method: 'GET',
            headers: {
            "Content-Type": "application/json"
            }
        })
        .then((response) => response.json())
        .then((json) => {
            console.log("viaggi", json);
            resolve(json); //risposta server
        })
        .catch((error) => {
            reject(error);
        });
    });
}


const deleteViaggio = (id) => {
    return new Promise((resolve, reject) => {
        fetch("/del_viaggio/"+id, {
            method: 'DELETE',
            headers: {
            "Content-Type": "application/json"
            },
        })
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
            resolve(json);
        })
    })
}



const add_post = (post) => {
    return new Promise((resolve, reject) => {
        fetch("/addpost", {
            method: 'POST',
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(post)
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


const get_post = async() => {
    return new Promise((resolve, reject) => {
        fetch("/get_post", {
            method: 'GET',
            headers: {
            "Content-Type": "application/json"
            }
        })
        .then((response) => response.json())
        .then((json) => {
            console.log("posts", json);
            resolve(json); //risposta server
        })
        .catch((error) => {
            reject(error);
        });
    });
}

const modifica_post = (post) =>{
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
            console.log(json);
            resolve(json); //risposta server
        })
        .catch((error) => {
            reject(error);
        });
    });
}

const deletePost = (id) => {
    return new Promise((resolve, reject) => {
        fetch("/del_post/"+id, {
            method: 'DELETE',
            headers: {
            "Content-Type": "application/json"
            },
        })
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
            resolve(json);
        })
    })
}




const add_user = (user) => {
    return new Promise((resolve, reject) => {
      fetch("/add_user", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
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


const get_users = async () => {
    return new Promise((resolve, reject) => {
        fetch("/get_users", {
            method: 'GET',
            headers: {
            "Content-Type": "application/json"
            }
        })
        .then((response) => response.json())
        .then((json) => {
            console.log("users", json)
            resolve(json); //risposta server
        })
        .catch((error) => {
            reject(error);
        });
    });
}

const deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        fetch("/del_user/"+id, {
            method: 'DELETE',
            headers: {
            "Content-Type": "application/json"
            },
        })
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
            resolve(json);
        })
    })
}


// esempio funzionamento servizi

// const user = {username : "prova", password : "prova"};

// add_user(user);
// const users = await get_users();

// const viaggio = {id_utente: users.result[0].id, titolo:"prova",descrizione: "prova"};
// add_viaggio(viaggio);
// const viaggi = await get_viaggi();

// const id_viaggio = viaggi.result[0].id;

// const viaggioModificato = {titolo:"prova modifica",descrizione:"prova modifica",id:id_viaggio};
// modifica_viaggio(viaggioModificato);

// const post = {immagine:"prova",testo: "prova", video:"prova",audio:"prova",descrizione:"prova",posizione:"prova",id_viaggio: id_viaggio};
// add_post(post);
// const posts = await get_post();
// const id_post = posts.result[0].id;
// const postModificato = {immagine:"prova modifica",testo: "prova modifica", video:"prova modifica",audio:"prova modifica ",descrizione:"prova modifica",posizione:"prova modifica", id:id_post};
// modifica_post(postModificato);

// deleteViaggio(viaggi.result[0].id);
// deleteUser(users.result[0].id);
// deletePost(posts.result[0].id);