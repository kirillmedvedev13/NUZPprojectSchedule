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
    let ids_disc = [];
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
      const disciplines = await db.discipline.findAll({
        include: {
          model: db.assigned_discipline,
          where: FilterSpecialty,
          include: {
            model: db.specialty,
          },
        },
      });
      ids_disc = disciplines.map((disc) => {
        return disc.dataValues.id;
      });
      FilterSpecialty = { id: ids_disc };
    }
    let res = await db.discipline.findAll({
      order: [
        ["name", "ASC"]
      ],
      where: {
        [Op.and]: [FilterName, FilterSpecialty],
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
