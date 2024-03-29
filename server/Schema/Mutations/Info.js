import { GraphQLString } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const UpdateInfo = {
  type: MessageType,
  args: {
    data: { type: GraphQLString },
  },
  async resolve(parent, { data }) {
    const info = JSON.parse(data);
    let obj = {};

    for (const { key, value } of info) {
      obj[key] = value;
    }
    let res = await db.info.update(obj, {
      where: {
        id: 1,
      },
    });
    return res[0]
      ? {
          successful: true,
          message: "Запис успішно оновлено",
        }
      : {
          successful: false,
          message: "Помилка при оновленні запису",
        };
  },
};
