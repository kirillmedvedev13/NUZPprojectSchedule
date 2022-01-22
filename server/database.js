import Sequelize from "sequelize";
import config from "./config/config.js";
import fs from "fs";
import Teacher from "./Models/Teacher.js";
import Cathedra from "./Models/Cathedra.js";
import Audience from "./Models/Audience.js";
import Assigned_audience from "./Models/Assigned_audience.js";
import Specialty from "./Models/Specialty.js";
import Day_week from "./Models/Day_week.js";
import Pair_type from "./Models/Pair_type.js";
import Type_class from "./Models/Type_class.js";
import Group from "./Models/Group.js";
import Discipline from "./Models/Discipline.js";
import Assigned_discipline from "./Models/Assigned_discipline.js";
import Class from "./Models/Class.js";
import Recommended_audience from "./Models/Recommended_audience.js";
import Assigned_teacher from "./Models/Assigned_teacher.js";
import Schedule from "./Models/Schedule.js";
import User from "./Models/User.js";
import Assigned_group from "./Models/Assigned_group.js";

const db = {};

const models = [
  Teacher,
  Cathedra,
  Audience,
  Assigned_audience,
  Specialty,
  Day_week,
  Pair_type,
  Type_class,
  Group,
  Discipline,
  Assigned_discipline,
  Class,
  Recommended_audience,
  Assigned_teacher,
  Schedule,
  Assigned_group,
  User,
];

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
