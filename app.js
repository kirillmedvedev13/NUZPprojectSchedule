const express = require("express")
const config = require("config")
const mysql = require("mysql")

const PORT = config.get('port') || 5000

const app = express()

const connection = mysql.createConnection({
    host     : 'nuzp-shedule.mysql.database.azure.com',
    user     : 'nuzp_admin',
    password : 'Morality351973',
    database : 'shedule',
    port: 3306
  })
   
connection.connect(function(err) {
    if (err) {
      console.error('error connecting to mysql: ' + err.stack);
      process.exit(1);
    }
})
   

app.listen(PORT, () => console.log(`App has been started on PORT ${PORT}`))