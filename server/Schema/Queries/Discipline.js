import { GraphQLList } from "graphql";
import db from "../../database.js";
import { DisciplineType } from "../TypeDefs/DisciplineType.js";

export const GET_ALL_DISCIPLINES = {
  type: new GraphQLList(DisciplineType),
  async resolve() {
    let disciplines =  await db.discipline.findAll();
    for(let disc of disciplines){
      disc.specialties = await disc.getSpecialties();
      console.log(disc.specialties);
    }
      return disciplines;
  },
};
