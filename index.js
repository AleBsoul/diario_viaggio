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

executeQuery(`
CREATE TABLE utenti (
  id INT PRIMARY KEY AUTO_INCREMENT ,
  username varchar(255),
  password varchar(255)
)`)

