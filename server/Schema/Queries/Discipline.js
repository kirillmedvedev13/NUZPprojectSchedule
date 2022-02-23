import { GraphQLList, GraphQLInt, GraphQLString } from "graphql";
import db from "../../database.js";
import { DisciplineType } from "../TypeDefs/DisciplineType.js";
import { Op } from "sequelize";

export const GET_ALL_DISCIPLINES = {
  type: new GraphQLList(DisciplineType),
  args: {
    name: { type: GraphQLString },
    id_specialty: { type: GraphQLInt },
  },
  async resolve(parent, { name, id_specialty }) {
    let array = [];
    let isFilters = {};
    let isFilters1 = {};
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
      isFilters = {
        name: {
          [Op.regexp]: str,
        },
      };
    }
    if (id_specialty) {
      isFilters1 = {
        id_specialty: {
          [Op.eq]: id_specialty,
        },
      };
      const res1 = await db.discipline.findAll({
        include: {
          model: db.assigned_discipline,
          where: isFilters1,
          include: {
            model: db.specialty,
          },
        },
      });
      res1.map((disc) => {
        array.push(disc.dataValues.id);
      });
    }
    console.log(isFilters);
    let isFilterID = {};
    if (array.length) {
      isFilterID = {
        id: array,
      };
    }
    let res = await db.discipline.findAll({
      where: {
        [Op.and]: [isFilters, isFilterID],
      },
      include: {
        model: db.assigned_discipline,
        include: {
          model: db.specialty,
          include: {
            model: db.cathedra,
          },
        },
      },
    });

    return res;
  },
};
