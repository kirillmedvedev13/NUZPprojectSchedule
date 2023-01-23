import db from "../../database.js";
import AlgorithmType from "../TypeDefs/AlgorithmType.js";

export const GET_ALL_ALGORITHM = {
  type: AlgorithmType,
  async resolve(parent) {
    const res = await db.algorithm.findOne();
    return res;
  },
};
