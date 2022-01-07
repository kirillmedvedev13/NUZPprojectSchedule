import Sequelize from "sequelize";
import config from "./config/config.js";
import fs from "fs";
import Teacher from "./Models/Teacher.js";
import Cathedra from "./Models/Cathedra.js";
import Audience from "./Models/Audience.js";
import Assigned_audience from "./Models/Assigned_audience.js";
import Specialty from "./Models/Specialty.js";

const db = {};

const models = [Teacher, Cathedra, Audience, Assigned_audience, Specialty, Assigned_audience];

const Connection = new Sequelize(
  config.DB_NAME,
  config.DB_USER,
  config.DB_PASS,
  {
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        key: fs.readFile(
          "./config/DigiCertGlobalRootCA.crt.pem",
          "utf8",
          function (err, contents) {
            console.log("Sertificate connected");
          }
        ),
      },
    },
    host: config.HOST,
    define: { timestamps: false },
  }
);

models.forEach((model) => {
  const seqModel = model(Connection, Sequelize);
  console.log(seqModel.name);
  db[seqModel.name] = seqModel;
});

Object.keys(db).forEach((key) => {
  if ("associate" in db[key]) {
    db[key].associate(db);
  }
});

db.Connection = Connection;
db.Sequelize = Sequelize;
export default db;
