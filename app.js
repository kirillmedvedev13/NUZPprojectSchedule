const express = require("express")
const fs = require("fs")
const config = require("config")
const mysql = require("mysql")

const PORT = config.get('port') || 5000
const HOST= config.get('DB_URL');

const app = express()

const connection = mysql.createConnection({
    host     : HOST,
    user     : 'nuzp_admin',
    password : 'Morality351973',
    database : 'shedule',
    port: 3306,
    ssl: {ca:fs.readFileSync("config/DigiCertGlobalRootCA.crt.pem")}
  })
   
connection.connect(function(err) {
    if (err) {
      console.error('error connecting to mysql: ' + err.stack);
      process.exit(1);
    }
})
   

app.listen(PORT, () => console.log(`App has been started on PORT ${PORT}`))