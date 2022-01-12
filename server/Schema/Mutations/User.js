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
      refreshToken: "",
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
        refreshToken: "",
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
        expiresIn: "1h",
      }
    );
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtRefreshSecret,
      {
        expiresIn: "30d",
      }
    );
    db.user.update({ refreshToken }, { where: { id: user.id } });

    return {
      id: user.id,
      email: user.email,
      accessToken,
      refreshToken,
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
    let res = await db.user.update(
      { refreshToken: null },
      { where: { email } }
    );
    return res
      ? { successful: true, message: "Log out" }
      : { successful: true, message: "Some error" };
  },
};

export const RELOGIN_USER = {
  type: UserType,
  args: {
    email: { type: GraphQLString },
    refreshToken: { type: GraphQLString },
  },
  async resolve(parent, { email, refreshToken }) {
    const incorrect = {
      id: null,
      email: email,
      refreshToken: "",
      accessToken: "",
      isAuth: {
        successful: false,
        message: "Please log in",
      },
    };

    if (!refreshToken) return incorrect;

    const isValid = jwt.verify(refreshToken, config.jwtRefreshSecret);
    const isExist = await db.user.findOne({ where: { refreshToken } });
    if (!isExist || !isValid) return incorrect;
    const accessToken = jwt.sign(
      { id: isValid.id, email: isValid.email },
      config.jwtAccessSecret,
      {
        expiresIn: "1h",
      }
    );
    refreshToken = jwt.sign(
      { id: isValid.id, email: isValid.email },
      config.jwtRefreshSecret,
      {
        expiresIn: "30d",
      }
    );
    db.user.update({ refreshToken }, { where: { id: isValid.id } });

    let user = isExist.dataValues;
    return {
      id: user.id,
      email: user.email,
      accessToken,
      refreshToken,
      isAuth: {
        successful: true,
        message: "You're logged in",
      },
    };
  },
};
