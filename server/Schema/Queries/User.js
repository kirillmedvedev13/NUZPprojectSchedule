import { GraphQLList, GraphQLString } from "graphql";
import db from "../../database.js";
import UserType from "../TypeDefs/UserType.js";
import validator from "email-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config/config.js";

export const GET_USER = {
  type: UserType,
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(parent, { email, password }) {
    let check = validator.validate(email);
    const incorrect = {
      id: null,
      email: email,
      jwtToken: "",
      isAuth: {
        successful: false,
        message: "Password or email are not correct.",
      },
    };
    if (!check) return incorrect;

    let res = await db.user.findOne({
      where: {
        email,
      },
    });
    if (!res)
      return {
        id: null,
        email: email,
        jwtToken: "",
        isAuth: {
          successful: false,
          message: "User doesn't exist. Please sign up",
        },
      };
    let user = res.dataValues;
    //let checkPass = bcrypt.compare(password, user.password);
    let checkPass = password === user.password ? true : false;
    if (!checkPass) return incorrect;
    const token = jwt.sign({ id: user.id }, config.jwtSecret, {
      expiresIn: "1h",
    });
    db.user.update({ jwtToken: token }, { where: { id: user.id } });
    user.jwtToken = token;
    return {
      id: user.id,
      email: user.email,
      jwtToken: user.jwtToken,
      isAuth: {
        successful: true,
        message: "You're logged in",
      },
    };
  },
};
