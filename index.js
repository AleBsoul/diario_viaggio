const express = require("express");
const fs = require("fs");
const http = require("http");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use("/", express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
server.listen(80, () => {
  console.log("- server running");
});

const mysql = require("mysql2");
const conf = require("./conf.js")
const connection = mysql.createConnection(conf);

const executeQuery = (sql) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, function (err, result) {
      if (err) {
        console.log(err);
        reject();
      }
      resolve(result);
    });
  });
};

const select_viaggi = () =>{
  return executeQuery(`
  SELECT * FROM viaggio
  `)
} 

const select_utenti = () =>{
  return executeQuery(`
  SELECT * FROM utente
  `)
} 

app.post("/addviaggio", (req,res)=>{

  const id_utente = req.body.id_utente;
  const titolo = req.body.titolo;
  const descrizione = req.body.descrizione;
  select_utenti().then((result_users)=>{
      //controllo se esiste l'utente
      let utente_find = false;
      result_users.forEach((row)=>{
        if(parseInt(row.id)===parseInt(id_utente)){
          utente_find = true;
        }
      });
      if(utente_find){
        const sql = `
          INSERT INTO viaggio (id_utente, titolo, descrizione)
          VALUES ('${id_utente}', '${titolo}','${descrizione}')
          `
        executeQuery(sql).then((result)=>{
          res.json({result: "viaggio inserito"});
        })
      }else{
        res.json({result: "utente non ancora creato"})
      }
    })
})
 
app.put("/modificaViaggio",(req, res)=>{
  const id = req.body.id;
  const titolo = req.body.titolo;
  const descrizione = req.body.descrizione
  const sql = `
  UPDATE viaggio
  SET titolo = '${titolo}', descrizione = '${descrizione}'
  WHERE id = '${id}'`;
  executeQuery(sql).then((result)=>{
    res.json({result: "viaggio modificato"});
  })
})


app.get("/get_viaggi",(req, res)=>{
  select_viaggi().then((result)=>{
    res.json({result: result});
  })
})

app.delete("/del_viaggio/:id",(req,res)=>{
  const id = req.params.id 
  const sql = `
  DELETE FROM viaggio WHERE id = '${id}'
  `;
  executeQuery(sql).then((result)=>{
    res.json({result: "viaggio eliminato"});
  })
})


app.post("/addpost", (req, res)=>{
  const immagine = req.body.immagine;
  const testo = req.body.testo;
  const video = req.body.video;
  const audio = req.body.audio;
  const descrizione = req.body.descrizione;
  const posizione = req.body.posizione;
  const id_viaggio = req.body.id_viaggio;

  select_viaggi().then((result_viaggi)=>{
    //controllo se esiste l'utente
    let find_viaggio = false;
    result_viaggi.forEach((row)=>{
      if(parseInt(row.id)===parseInt(id_viaggio)){
        find_viaggio = true;
      }
    });
    if(find_viaggio){
      const sql = `
        INSERT INTO post (immagine, testo, video, audio, descrizione, posizione, id_viaggio)
        VALUES('${immagine}', '${testo}', '${video}', '${audio}', '${descrizione}', '${posizione}', '${id_viaggio}')
        `
  
      executeQuery(sql).then((result)=>{
        res.json({result: "post aggiunto"});
      })
    }else{
      res.json({result: "viaggio non ancora creato"})
    }
  })

})

app.put("/modificaPost",(req, res)=>{
  const id =req.body.id;
  const immagine = req.body.immagine;
  const testo = req.body.testo;
  const video = req.body.video;
  const audio = req.body.audio;
  const descrizione = req.body.descrizione;
  const posizione = req.body.posizione;
  const sql = `
  UPDATE post
  SET immagine = '${immagine}', testo = '${testo}', video = '${video}', audio = '${audio}', descrizione = '${descrizione}', posizione = '${posizione}'
  WHERE id = '${id}'`;
  executeQuery(sql).then((result)=>{
    res.json({result: "post modificato"});
  })

})

app.get("/get_post",(req, res)=>{
  const sql = `
  SELECT * FROM post
  `;
  executeQuery(sql).then((result)=>{
    res.json({result: result});
  })
})

app.delete("/del_post/:id",(req,res)=>{
  const id = req.params.id 
  const sql = `
  DELETE FROM post WHERE id = '${id}'
  `;
  executeQuery(sql).then((result)=>{
    res.json({result: "post eliminato"});
  })
})

app.post("/add_user",(req, res)=>{
  const username = req.body.username;
  const password = req.body.password;
  const sql = `
  INSERT INTO utente (username, password)
  VALUES('${username}', '${password}')
  `
  executeQuery(sql).then((result)=>{
    res.json({result: "user aggiunto"});
  })
})


app.get("/get_users",(req, res)=>{
  select_utenti().then((result)=>{
    res.json({result: result});
  })
})

app.delete("/del_user/:id",(req,res)=>{
  const id = req.params.id 
  const sql = `
  DELETE FROM utente WHERE id = '${id}'
  `;
  executeQuery(sql).then((result)=>{
    res.json({result: "utente eliminato"});
  })
})

