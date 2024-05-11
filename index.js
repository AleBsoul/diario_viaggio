import {createRequire} from "module";
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import { conf } from "./conf.js";
import {megaFunction} from "./server/mega.js";
import multer from 'multer';
const require = createRequire(import.meta.url);

const express = require("express");
const fs = require("fs");
const http = require("http");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use("/", express.static(path.join(__dirname, "public")));

// Utilizza il middleware express.json() per analizzare le richieste JSON
app.use(express.json());

const server = http.createServer(app);
server.listen(80, () => {
  console.log("- server running");
});

const mysql = require("mysql2");

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
  SELECT viaggio.id as idViaggio, viaggio.titolo, viaggio.descrizione, viaggio.immagine, utente.username, utente.id AS idUser, utente.foto AS fotoProfilo
  FROM utente, viaggio
  WHERE utente.id = viaggio.id_utente
  `)
} 

const select_utenti = () =>{
  return executeQuery(`
  SELECT * FROM utente
  `)
}; 

app.post("/addViaggio", (req,res)=>{
  const data = req.body.data;
  const id_utente = data.id_utente;
  const titolo = data.titolo;
  const descrizione = data.descrizione;
  const immagine = data.immagine;
  const sql = `
    INSERT INTO viaggio (id_utente, titolo, descrizione, immagine)
    VALUES ('${id_utente}', '${titolo}','${descrizione}', '${immagine}')
    `
  executeQuery(sql).then((result)=>{
    res.json({result: "viaggio inserito"});
  });
      
});
 
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

app.get("/getViaggi",(req, res)=>{
  select_viaggi().then((result)=>{
    res.json({result: result});
  })
})

const select_viaggi_user=(id_user)=>{
  return executeQuery(`
  SELECT viaggio.titolo, viaggio.descrizione, viaggio.immagine, utente.username, utente.id AS idUser, viaggio.id AS idViaggio, utente.foto AS fotoProfilo
  FROM utente, viaggio
  WHERE utente.id = '${id_user}'
  AND utente.id = viaggio.id_utente
  `)
}

app.get("/getViaggiUser/:id", (req,res) => {
  select_viaggi_user(req.params.id).then((result)=>{
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
  const email = req.body.email;
  const nome = req.body.nome;
  const cognome = req.body.cognome;
  const bio = req.body.bio;
  const foto = req.body.foto
  const sql = `
  INSERT INTO utente (username, password, email, nome, cognome, bio, foto)
  VALUES('${username}', '${password}', '${email}', '${nome}', '${cognome}', '${bio}', '${foto}')
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

app.get("/get_singleUser/:id",(req, res)=>{
  const id = req.params.id 
  const sql = `
SELECT * FROM utente 
WHERE utente.id = '${id}'
  `;
  executeQuery(sql).then((result)=>{
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

app.post("/login",(req,res)=>{
  const username = req.body.username;
  const password = req.body.password;
  let trovato = false;
  let messaggio = "utente non loggato";
  let user;
  select_utenti().then((utenti)=>{
    utenti.forEach((utente)=>{
      if(utente.username === username){
        if(utente.password === password){
          trovato = true;
          user = utente;
        }
      }
    })
    res.json({result: trovato, utente: user});
  })
  
})

// ===========mega=========== //

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
      fileSize: 500 * 1024 * 1024, // limita la dimensione del file a 5MB
  },
  allowUploadBuffering: true, // abilita il buffering del file
});
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
      const file = req.file; // Accedi al file caricato
      const fileName = path.basename(file.originalname); // Estrai solo il nome del file
      const link = await megaFunction.uploadFileToStorage(fileName, file.buffer); // Carica il file su Mega
      console.log('File caricato con successo. Path: ', fileName);
      res.status(200).json({"Result": fileName, "link": link}); // Restituisci solo il nome del file e il link
  } catch (error) {
      console.error(error);
      res.status(500).send('Errore del server');
  }
});

app.post('/download', async (req, res) => {
  const link = req.body.mega;
  const name = req.body.name;
  try {
      const {stream, fileName} = await megaFunction.downloadFileFromLink(link); // Scarica il file da Mega
      res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
      stream.pipe(res); // Invia il flusso di dati al client
  } catch (error) {
      console.error(error);
      res.status(500).send('Errore del server');
  }
});
