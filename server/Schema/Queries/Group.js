import { GraphQLList, GraphQLInt, GraphQLString } from "graphql";
import db from "../../database.js";
import GroupType from "../TypeDefs/GroupType.js";
import { Op } from "sequelize";
export const GET_ALL_GROUPS = {
  type: new GraphQLList(GroupType),
  args: {
    name: { type: GraphQLString },
    id_specialty: { type: GraphQLInt },
  },
  async resolve(parent, { name, id_specialty }) {
    let FilterName = {};
    let FilterSpecialty = {};
    let str = "";
    if (name) {
      const arr = name.split(" ");
      arr.map((word, index) => {
        if (index != arr.length - 1) {
          str += `${word}|`;
        } else {
          str += word;
        }
      });
      FilterName = {
        name: {
          [Op.regexp]: str,
        },
      };
    }
    if (id_specialty) {
      FilterSpecialty = {
        id_specialty: {
          [Op.eq]: id_specialty,
        },
      };
    }
    const res = await db.group.findAll({
      include: {
        model: db.specialty,
        include: {
          model: db.cathedra,
        },
        required: true,
      },
      where: {
        [Op.and]: [FilterName, FilterSpecialty],
      },
    });
    return res;
  },
};
