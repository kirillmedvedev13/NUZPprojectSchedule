import { GraphQLInt, GraphQLList, GraphQLString } from "graphql";
import db from "../../database.js";
import AudienceType from "../TypeDefs/AudienceType.js";
import sequelize, { Op } from "sequelize"

export const GET_ALL_AUDIENCES = {
  type: new GraphQLList(AudienceType),
  args: {
    name: { type: GraphQLString },
    id_cathedra: { type: GraphQLInt },
  },
  async resolve(parent, { name, id_cathedra }) {
    let FilterName = {}
    let FilterCathedra = {}
    let FilterIDsAudiences = {}
    let arrIDsAudiences = []
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
      FilterName = {
        name: {
          [Op.regexp]: str
        }
      }
    }
    if (id_cathedra) {
      FilterCathedra = {
        id_cathedra: {
          [Op.eq]: id_cathedra
        }

      }
      const res = await db.audience.findAll({
        include: {
          model: db.assigned_audience,
          where: FilterCathedra
        },
      });
      res.map((aud) => {
        arrIDsAudiences.push(aud.dataValues.id)
      })
    }
    if (arrIDsAudiences.length) {
      FilterIDsAudiences = {
        id: arrIDsAudiences
      }
    }
    const res = await db.audience.findAll({
      order: [
        ["name", "ASC"]
      ],
      where: {
        [Op.and]: [FilterName, FilterIDsAudiences]
      },
      include: [
        {
          model: db.type_class
        },
        {
          model: db.assigned_audience,
          include: {
            model: db.cathedra
          }
        }
      ]
    });
    return res;
  },
};
