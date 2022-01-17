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
    let FilterName = ""
    let FilterCathedra = ""
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
      FilterName = `Where audiences.name REGEXP '${str}'`
    }
    if (id_cathedra) {
      FilterCathedra = `    
      join assigned_audiences au2 on au2.id_audience = audiences.id
      join cathedras c2 on au2.id_cathedra = c2.id and c2.id = ${id_cathedra} 
      `
    }
    
    db.Connection.query(`
    select audiences.id, audiences.name, audiences.capacity, audiences.id_type_class, type_classes.name as name_type_class, 
    group_concat(c1.name separator '||') as "listCathedras", 
    group_concat(au1.id separator '||') as "listIdsAU" 
    from audiences
    join assigned_audiences au1 on au1.id_audience = audiences.id
    join cathedras c1 on au1.id_cathedra = c1.id
    join type_classes on audiences.id_type_class = type_classes.id
    ${FilterCathedra}
    ${FilterName}
    group by audiences.id
    `).then(([res, meta]) => {
      console.log(res)
      return res;
    })
  },
};
