import db from "../../database.js";
import AlgorithmType from "../TypeDefs/AlgorithmType.js";
import { GraphQLList } from "graphql";

export const GetAllAlgorithm = {
  type: new GraphQLList(AlgorithmType),
  async resolve(parent) {
    const res = await db.algorithm.findAll({
      include: { model: db.results_algorithm },
    });
    return res;
  },
};
