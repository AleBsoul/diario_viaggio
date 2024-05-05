
const add_viaggio = (id_utente) => {
    return new Promise((resolve, reject) => {
        fetch("/addviaggio/"+id_utente, {
            method: 'POST',
            headers: {
            "Content-Type": "application/json"
            }
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

const deletePost= (id) => {
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

// add_viaggio(users.result[0].id);
// const viaggi = await get_viaggi();

// const id_viaggio = viaggi.result[0].id;

// const post = {immagine:"prova",testo: "prova", video:"prova",audio:"prova",descrizione:"prova",posizione:"prova",id_viaggio: id_viaggio}
// add_post(post);
// const posts = await get_post();

// deleteViaggio(viaggi.result[0].id);
// deleteUser(users.result[0].id);
// deletePost(posts.result[0].id)