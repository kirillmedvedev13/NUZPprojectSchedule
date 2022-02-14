import { GraphQLString } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const SET_CLASSES = {
    type: MessageType,
    args: {
        data: { type: GraphQLString },
    },
    async resolve(parent, { data }) {
        const dat = JSON.parse(data);
        console.log(dat)
        const res = true;
        return res
            ? { successful: true, message: "Данi завантаженi успiшно" }
            : { successful: false, message: "Помилка при завантаженi даних" };
    }
};