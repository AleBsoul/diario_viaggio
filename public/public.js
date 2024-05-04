
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
            resolve(json); // risposta del server all'aggiunta
        })
        .catch((error) => {
            reject(error);
        });
    });
}


const get_users = async (user) => {
    return new Promise((resolve, reject) => {
        fetch("/get_users", {
            method: 'GET',
            headers: {
            "Content-Type": "application/json"
            }
        })
        .then((response) => response.json())
        .then((json) => {
            console.log("\n",json,"\n")
            resolve(json); // risposta del server all'aggiunta
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
const user = {username : "prova", password : "prova"};
add_user(user);

const users = await get_users();

deleteUser(users.result[0].id);