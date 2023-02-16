import Sequelize from "sequelize";
import config from "./config/config.js";
import fs from "fs";
import Teacher from "./Models/Teacher.js";
import Cathedra from "./Models/Cathedra.js";
import Audience from "./Models/Audience.js";
import Assigned_audience from "./Models/Assigned_audience.js";
import Specialty from "./Models/Specialty.js";
import Type_class from "./Models/Type_class.js";
import Group from "./Models/Group.js";
import Discipline from "./Models/Discipline.js";
import Assigned_discipline from "./Models/Assigned_discipline.js";
import Class from "./Models/Class.js";
import Recommended_audience from "./Models/Recommended_audience.js";
import Recommended_schedule from "./Models/Recommended_schedule.js";
import Assigned_teacher from "./Models/Assigned_teacher.js";
import Schedule from "./Models/Schedule.js";
import User from "./Models/User.js";
import Algorithm from "./Models/Algorithm.js";
import Assigned_group from "./Models/Assigned_group.js";
import Info from "./Models/Info.js";
import Results_algorithm from "./Models/Results_algorithm.js";

const db = {};

const models = [
  Teacher,
  Cathedra,
  Audience,
  Assigned_audience,
  Specialty,
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
  Info,
  Recommended_schedule,
  Algorithm,
  Results_algorithm,
];
let Connection;
try {
  Connection = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASS, {
    dialect: "mysql",
    host: config.HOST,
    define: { timestamps: false },
  });
  await Connection.sync({});
} catch {
  Connection = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASS, {
    dialect: "mysql",
    host: config.RESHOST,
    define: { timestamps: false },
  });

  console.log("Using db on REHOST");
}

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
