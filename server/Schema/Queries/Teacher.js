import { GraphQLList, GraphQLString } from "graphql";
import db from "../../database.js";
import TeacherType from "../TypeDefs/TeacherType.js";
import { Op } from "sequelize";

export const GET_ALL_TEACHERS = {
  type: new GraphQLList(TeacherType),
  args: {
    surname: { type: GraphQLString },
  },
  async resolve(parent, { surname }) {
    let FilterSurname = {};
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
      where: FilterSurname,
    });
    return res;
  },
};
