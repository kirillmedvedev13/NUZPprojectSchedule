import cors from "cors";
import express from "express";
import db from "./database.js";
import Schema from "./Schema/TypeDefs/app.js";
import { graphqlHTTP } from "express-graphql";
import config from "./config/config.js";
import bodyParser from "body-parser";
import InitRecords from "./InitRecords.js";
import http from "http";
import https from "https";
import fs from "fs"

const main = async () => {
  const privateKey = fs.readFileSync('./config/private.key');
  const certificate = fs.readFileSync('./config/certificate.crt');
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

  let httpServer = http.createServer(app);

  httpServer.listen(config.PORT_HTTP, () => {
    console.log(`Server HTTPS is running at ${config.PORT_HTTPS}`);
  });
};

main().catch((err) => {
  console.log(err);
});
