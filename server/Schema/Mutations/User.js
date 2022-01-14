import { GraphQLList, GraphQLString } from "graphql";
import db from "../../database.js";
import UserType from "../TypeDefs/UserType.js";
import validator from "email-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config/config.js";
import MessageType from "../TypeDefs/MessageType.js";

export const LOGIN_USER = {
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
      accessToken: "",
      isAuth: {
        successful: false,
        message: "Password or email are not correct",
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
        accessToken: "",
        isAuth: {
          successful: false,
          message: "User doesn't exist. Please sign up",
        },
      };
    let user = res.dataValues;
    //let checkPass = bcrypt.compare(password, user.password);
    let checkPass = password === user.password ? true : false;
    if (!checkPass) return incorrect;
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtAccessSecret,
      {
        expiresIn: "2h",
      }
    );
    db.user.update({ accessToken }, { where: { id: user.id } });

    return {
      id: user.id,
      email: user.email,
      accessToken,
      isAuth: {
        successful: true,
        message: "You're logged in",
      },
    };
  },
};
export const LOGOUT_USER = {
  type: MessageType,
  args: {
    email: { type: GraphQLString },
  },
  async resolve(parent, { email }) {
    let res = await db.user.update({ accessToken: null }, { where: { email } });
    return res
      ? { successful: true, message: "Log out" }
      : { successful: true, message: "Some error" };
  },
};

export const RELOGIN_USER = {
  type: UserType,
  args: {
    accessToken: { type: GraphQLString },
  },
  async resolve(parent, { accessToken }) {
    const incorrect = {
      id: null,
      email: null,
      accessToken: "",
      isAuth: {
        successful: false,
        message: "Please log in",
      },
    };

    if (!accessToken) return incorrect;
    try {
      const isValid = jwt.verify(accessToken, config.jwtAccessSecret);

      const isExist = await db.user.findOne({ where: { accessToken } });
      if (!isExist || !isValid) return incorrect;

      let user = isExist.dataValues;
      return {
        id: user.id,
        email: user.email,
        accessToken,
        isAuth: {
          successful: true,
          message: "You're logged in",
        },
      };
    } catch (error) {
      return incorrect;
    }
  },
};
