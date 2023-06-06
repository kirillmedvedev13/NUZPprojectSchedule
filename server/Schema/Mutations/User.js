import { GraphQLList, GraphQLString } from "graphql";
import db from "../../database.js";
import UserType from "../TypeDefs/UserType.js";
import validator from "email-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config/config.js";
import MessageType from "../TypeDefs/MessageType.js";

export const LoginUser = {
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
        message: "Почта або пароль некоректні",
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
          message: "Користувача не знайдено",
        },
      };
    let user = res.dataValues;
    let checkPass = password === user.password ? true : false;
    if (!checkPass) return incorrect;
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtAccessSecret,
      {
        expiresIn: "30d",
      }
    );
    db.user.update({ accessToken }, { where: { id: user.id } });

    return {
      id: user.id,
      email: user.email,
      accessToken,
      isAuth: {
        successful: true,
        message: "Вхід успішний",
      },
    };
  },
};

export const LogoutUser = {
  type: MessageType,
  args: {
    email: { type: GraphQLString },
  },
  async resolve(parent, { email }) {
    let res = await db.user.update({ accessToken: null }, { where: { email } });
    return res
      ? { successful: true, message: "Успішний вихід" }
      : { successful: true, message: "Помилка при виході" };
  },
};

export const ReloginUser = {
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
        message: "Увійдіть до облікового запису",
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
          message: "Вхід успішний",
        },
      };
    } catch (error) {
      return incorrect;
    }
  },
};
