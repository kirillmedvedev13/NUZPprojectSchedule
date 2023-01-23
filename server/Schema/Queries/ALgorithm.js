import db from "../../database.js";
import AlgorithmType from "../TypeDefs/AlgorithmType.js";
import { GraphQLList } from "graphql";

export const GET_ALL_ALGORITHM = {
  type: new GraphQLList(AlgorithmType),
  async resolve(parent) {
    const res = await db.algorithm.findAll();
    return res;
  },
};
