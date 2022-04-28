import db from "../../database.js";
import InfoType from "../TypeDefs/InfoType.js"

export const GET_INFO = {
  type: InfoType,
  async resolve(parent, ) {
    const res = await db.info.findOne();
    return res;
  },
};
