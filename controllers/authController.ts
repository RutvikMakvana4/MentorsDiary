import { Request, NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import asyncHandler from "express-async-handler";
import { genSalt, hash, compare } from "bcrypt";
import dotenv from "dotenv";
import sendEmail from "./mailController";
dotenv.config();

interface IRequest extends Request {
  token?: any;
  user?: any;
  id?: any;
}

//register
export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { firstname, lastname, email, password } = req.body;
    const data = {
      firstname,
      lastname,
      email,
      password: await hash(password, 10),
      createdAtIp: req.ip,
    };
    //saving the user
    const user: any = User.create(data)
      .then((result: any) => {
        const response = {
          id: result.id,
          firstname: result.firstname,
          lastname: result.lastname,
          email: result.email,
          password: result.password,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
          createdAtIp: result.createdAtIp,
        };

        res.status(201).json({
          status: 1,
          message: "Registration successfully!",
          user: response,
        });
      })
      .catch((error: any) => {
        res.send({ status: 0, message: "Email id is already used" });
      });
  }
);

//login :
export const login = asyncHandler(
  async (req: IRequest, res: Response): Promise<void> => {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const user: any = await User.findOne({
        where: {
          email: email,
        },
      });

      if (user) {
        const isSame = await compare(password, user.password);

        if (isSame) {
          let token: any = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET as string,
            {
              expiresIn: "1d",
            }
          );

          res.status(201).json({
            status: 1,
            message: "Login Successfully",
            token: token,
          });
        } else {
          res.status(401).json({
            status: 0,
            message: "Authentication failed",
          });
        }
      } else {
        res.status(401).json({
          status: 0,
          message: "Authentication failed",
        });
      }
    } catch (error : any) {
      res.send({
         status: 0, 
         message: "Error" + error.message,
         });
    }
  }
);

// To add minutes to the current time
function AddMinutesToDate(date: any, minutes: any) {
  return new Date(date.getTime() + minutes * 60000);
}

const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
const now = new Date();
const otpExpire = AddMinutesToDate(now, 10);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, data: any) => {
    try {
      const email = req.body.email;

      const user = await User.findOne({
        attributes: ["email"],
        where: {
          email: email,
        },
      });
      if (!user) {
        res.json({
          status: 0,
          message: "User not found with this email",
        });
      } else {
        const resetURL = `<p> <a><b>${otp}</b><a> is your OTP to access MentorsDiary. OTP is confidential and valid for 10 minutes. For security reasons, DO NOT share this OTP with anyone.</p>`;
        const data = {
          to: req.body.email,
          text: "hey user",
          subject: "Forgot your password",
          htm: resetURL,
        };
        sendEmail(data);
      }
      const otp_data = {
        otp,
        otpExpire,
      };

      const abc = await User.update(otp_data, {
        where: {
          email: req.body.email,
        },
      });

      res.json({
        status: 1,
        message: "Verification otp email sent",
        otp_data,
      });
    } catch (error: any) {
      res.json({
        status: 0,
        message: "Error" + error.message,
      });
    }
  }
);

export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  try {
    const otp = req.body.otp;

    await User.findOne({
      attributes: ["otp"],
    });

    if (otp === otp) {
      res.json({
        status: 1,
        success: true,
        message: "otp verify",
      });
    } else {
      res.json({
        status: 0,
        success: false,
        message: "Plases enter coreect OTP",
      });
    }
  } catch (error: any) {
    res.json({
      status: 0,
      message: error.message,
    });
  }
});

export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password, confirmPassword } = req.body;

    const user = await User.findOne({
      attributes: ["otp"],
    });
    try {
      if (password && confirmPassword) {
        if (password !== confirmPassword) {
          res.json({
            status: 0,
            message: "Password and Confirm Password doesn't match",
          });
        } else {
          const salt = await genSalt(10);
          const newHashPassword = await hash(password, salt);

          const payload = {
            password: newHashPassword,
          };

          await User.update(payload, {
            where: { otp: otp },
          });
          res.send({
            status: 1,
            message: "Password Reset Successfully",
          });
        }
      } else {
        res.send({ status: 0, message: "All Fields are Required" });
      }
    } catch (error) {
      res.send({ status: 0, message: "Invalid Token" });
    }
  }
);

export const logOut = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {}
);

export const getdata = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const id = req.user.id;
    const firstname = req.user.firstname;
    const lastname = req.user.lastname;
    const email = req.user.email;

    const user = await User.findByPk(id);
    if (user) {
      res.json({
        id: id,
        firstname: firstname,
        lastname: lastname,
        email: email,
      });
    } else {
      res.status(404).json({
        sucess: 0,
        message: "user not found",
      });
    }
  }
);
