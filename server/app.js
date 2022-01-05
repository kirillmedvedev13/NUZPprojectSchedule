import cors from "cors";
import express from "express";
import db from "./database.js";
import { graphqlHTTP } from "express-graphql";
import { PORT } from "./config/config.js";

const main = async () => {
  const app = express();

  await db.Connection.sync()
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
  app.use(cors());
  app.use(express.json());
  app.use(
    "/graphql",
    graphqlHTTP({
      graphiql: true,
    })
  );
  app.listen(PORT, () => {
    console.log("Server is running");
  });
};

main().catch((err) => {
  console.log(err);
});
