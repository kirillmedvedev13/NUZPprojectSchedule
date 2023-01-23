import cors from "cors";
import express from "express";
import db from "./database.js";
import Schema from "./Schema/TypeDefs/app.js";
import { graphqlHTTP } from "express-graphql";
import config from "./config/config.js";
import bodyParser from "body-parser";
import InitRecords from "./InitRecords.js";

const main = async () => {
  const app = express();

  let corsOptions = {
    origin: "*",
    credentials: true,
  };
  app.use(cors(corsOptions));

  await db.Connection.sync({})
    .then(async (result) => {
      await InitRecords(db);
      console.log("Connected to DB");
    })
    .catch((err) => console.log(err));

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(
    "/graphql",
    graphqlHTTP({
      schema: Schema,
      graphiql: true,
    })
  );

  app.listen(config.PORT, () => {
    console.log("Server is running");
  });
};

main().catch((err) => {
  console.log(err);
});
