import { GraphQLList, GraphQLString } from "graphql";
import db from "../../database.js";
import CathedraType from "../TypeDefs/CathedraType.js";
import { Op } from "sequelize"

export const GetAllCathedras = {
  type: new GraphQLList(CathedraType),
  args: {
    name: { type: GraphQLString },
  },
  async resolve(parent, { name }) {
    let isFilters = {}
    if (name) {
      const arr = name.split(" ");
      let str = ""
      arr.map((word, index) => {
        if (index != arr.length - 1) {
          str += `${word}|`
        }
        else {
          str += word
        }
      });
      isFilters = {
        name: {
          [Op.regexp]: str
        }
      }
    }
    const res = await db.cathedra.findAll({
      where: isFilters
    });
    return res;
  },
};
