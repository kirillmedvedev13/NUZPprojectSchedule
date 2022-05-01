import { GraphQLList, GraphQLInt, GraphQLString } from "graphql";
import db from "../../database.js";
import { SpecialtyType } from "../TypeDefs/SpecialtyType.js";
import { Op } from "sequelize";

export const GET_ALL_SPECIALTY = {
  type: new GraphQLList(SpecialtyType),
  args: {
    name: { type: GraphQLString },
    id_cathedra: { type: GraphQLInt },
  },
  async resolve(parent, { name, id_cathedra }) {
    let FilterCathedra = {};
    let FilterName = {};
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
          [Op.regexp]: str
        }
      }
    }
    if (id_cathedra) {
      FilterCathedra: {
        id_cathedra
      }
    }

    const res = await db.specialty.findAll({
      order: [
        ["name", "ASC"]
      ],
      include: {
        model: db.cathedra,
      },
      where: [FilterCathedra, FilterName],
    });
    return res;
  },
};
