import { GraphQLList, GraphQLString } from "graphql";
import db from "../../database.js";
import CathedraType from "../TypeDefs/CathedraType.js";
import {Op} from "sequelize"

export const GET_ALL_CATHEDRAS = {
  type: new GraphQLList(CathedraType),
  args: {
    name: { type: GraphQLString },
  },
  async resolve(parent, {name}) {
    const arr = name.split(" ");
    arr.map((word, index) => {
      arr[index] = `%${word}%`
    }); 
    const res =  await db.cathedra.findAll({
      where: {
        name: {
          [Op.like]: [arr]
        }
      }
    });
    return res;
  },
};
