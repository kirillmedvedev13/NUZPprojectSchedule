import cors from "cors";
import express from "express";
import db from "./database.js";
import Schema from "./Schema/TypeDefs/app.js";
import { graphqlHTTP } from "express-graphql";
import config from "./config/config.js";
import bodyParser from "body-parser";

const main = async () => {
  const app = express();

  await db.Connection.sync({ force: true })
    .then((result) => console.log("Connected to DB"))
    .catch((err) => console.log(err));

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());

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
