import { GraphQLList, GraphQLString, GraphQLInt } from "graphql";
import db from "../../database.js";
import TeacherType from "../TypeDefs/TeacherType.js";
import { Op } from "sequelize";

export const GetAllTeachers = {
  type: new GraphQLList(TeacherType),
  args: {
    surname: { type: GraphQLString },
    id_cathedra: { type: GraphQLInt },
  },
  async resolve(parent, { surname, id_cathedra }) {
    let FilterSurname = {};
    let FilterCathedra = id_cathedra
      ? { id_cathedra }
      : {};
    let str = "";
    if (surname) {
      const arr = surname.split(" ");
      arr.map((word, index) => {
        if (index != arr.length - 1) {
          str += `${word}|`;
        } else {
          str += word;
        }
      });
      FilterSurname = {
        surname: {
          [Op.regexp]: str,
        },
      };
    }

    let res = await db.teacher.findAll({
      order: [
        ["surname", "ASC"],
        ["name", "ASC"],
        ["patronymic", "ASC"]
      ],
      where: [FilterSurname, FilterCathedra],
      include: {
        model: db.cathedra,
      },
    });
    return res;
  },
};
