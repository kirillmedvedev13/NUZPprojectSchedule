import Sequelize from "sequelize";
import { DB_URL as HOST } from "./config/config.js";

const db = {};

const Connection = new Sequelize("nuzp_admin", "nuzp_admin", "Morality351973", {
  dialect: "mysql",
  host: HOST,
  define: { timestamps: false },
});

const models = [];

models.forEach((model) => {
  const seqModel = model(Connection, Sequelize);
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
