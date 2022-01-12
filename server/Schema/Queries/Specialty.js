import { GraphQLList, GraphQLInt, GraphQLString } from "graphql";
import db from "../../database.js";
import { SpecialtyType } from "../TypeDefs/SpecialtyType.js";
import { Op } from "sequelize"

export const GET_ALL_SPECIALTY = {
  type: new GraphQLList(SpecialtyType),
  args: {
    name: { type: GraphQLString },
    id_cathedra: { type: GraphQLInt },
  },
  async resolve(parent, { name, id_cathedra }) {
    let isFilters = {}
    let str = "";
    if (name) {
      const arr = name.split(" ");
      arr.map((word, index) => {
        if (index != arr.length - 1) {
          str += `${word}|`
        }
        else {
          str += word
        }
      });
      console.log("name")
      console.log(name)
      console.log("id_cathedra")
      console.log(id_cathedra)
      isFilters = id_cathedra ?
        {
          [Op.and]: {
            name: {
              [Op.regexp]: str
            },
            id_cathedra: {
              [Op.eq]: id_cathedra
            }
          }
        }
        :
        {
          name: {
            [Op.regexp]: str
          }
        }
    }
    else {
      isFilters = id_cathedra ? {
        id_cathedra: {
          [Op.eq]: id_cathedra
        }
      }
        :
        {}
    }
    console.log(isFilters)
    const res = await db.specialty.findAll({
      include: {
        model: db.cathedra,
      },
      where: isFilters,
    })
    return res;

  },
};
