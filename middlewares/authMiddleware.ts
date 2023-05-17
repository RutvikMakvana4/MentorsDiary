import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
import User from "../models/user";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
require("dotenv").config();

export const authMiddleware = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    let token;

    if (req?.headers?.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      try {
        if (token) {
          const decoded: any = jwt.verify(
            token,
            `${process.env.JWT_SECRET}` as string
          );
          const user = await User.findByPk(decoded?.id);
          req.user = user;
          req.token = token;
          next();
        }
      } catch (error) {
        throw new Error("Not Authorized token expired, please Login again");
      }
    } else {
      throw new Error("There is no token attached to header");
    }
  }
);
