import { Request, Response } from "express";
import User from "../models/user";
import asyncHandler from "express-async-handler";
import multer from "multer";

export interface MulterFile {
  key: string;
  path: string;
  mimetype: string;
  originalname: string;
  size: number;
}

const storage = multer.diskStorage({
  destination: function (req: Request, file: any, cb: any) {
    cb(null, "./public/uploads");
  },
  filename: function (req: Request, file: any, cb: any) {
    cb(null, file.originalname);
  },
});

export const uploadImg = multer({ storage: storage }).single("image");

interface MulterRequest extends Request {
  file: any;
}

export const createUser = asyncHandler(async (req: any, res: Response) => {
  const url = req.protocol + "://" + req.get("host");

  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;
  const image = url + "/public/uploads/" + req.file.originalname;
  const phone = req.body.phone;
  const isMentor = req.body.isMentor;
  const isActive = req.body.isActive;

  User.create({
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: password,
    image: image,
    phone: phone,
    isMentor: isMentor,
    isActive: isActive,
    createdAtIp: req.ip,
  })
    .then((result: any) => {
      const response = {
        id: result.id,
        firstname: result.firstname,
        lastname: result.lastname,
        email: result.email,
        image: result.image,
        phone: result.phone,
        isMentor: result.isMentor,
        isActive: result.isActive,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      };
      res.status(201).json({
        status: 1,
        message: "User created successfully!",
        user: response,
      });
    })
    .catch((err: any) => {
      res.status(400).json({ status: 0, err: err.message });
    });
});

export const updateUser = asyncHandler(async (req: any, res: Response) => {
  const url = req.protocol + "://" + req.get("host");

  const id = req.params.id;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const image = url + "/public/uploads/" + req.file.originalname;
  const phone = req.body.phone;
  const isMentor = req.body.isMentor;
  const isActive = req.body.isActive;

  User.findByPk(id)
    .then((user: any) => {
      if (!user) {
        return res.status(404).json({ status: 0, message: "User not found!" });
      }
      user.firstname = firstname;
      user.lastname = lastname;
      user.email = email;
      user.image = image;
      user.phone = phone;
      user.isMentor = isMentor;
      user.isActive = isActive;
      user.updatedAtIp = req.ip;
      return user.save();
    })
    .then((result: any) => {
      const response = {
        id: result.id,
        firstname: result.firstname,
        lastname: result.lastname,
        email: result.email,
        image: result.image,
        phone: result.phone,
        isMentor: result.isMentor,
        isActive: result.isActive,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        updatedAtIp: req.ip,
      };
      res
        .status(200)
        .json({ status: 1, message: "User updated!", user: response });
    })
    .catch((err: any) => {
      res.status(400).json({ status: 0, err: err.message });
    });
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const limit: any = req.query.limit || 10;
  const page: any = req.query.page || 1;

  const offset = (page - 1) * limit;

  User.findAndCountAll({
    attributes: [
      "id",
      "firstname",
      "lastname",
      "fullname",
      "email",
      "image",
      "isMentor",
      "isActive",
    ],
    limit: limit,
    offset: offset,
  })
    .then((users: any) => {
      const TotalPage = Math.ceil(users.count / limit);
      const previousPage = page > 1 ? page - 1 : 0;
      const nextPage = page < TotalPage ? page + 1 : 0;

      res.json({
        TotalPage: TotalPage,
        previousPage: previousPage,
        mentors: users,
        nextPage: nextPage,
      });
    })
    .catch((err: any) => {
      res.status(400).json({ status: 0, err: err.message });
    });
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  User.findByPk(id)
    .then((user: any) => {
      if (!user) {
        return res.status(404).json({ status: 0, message: "User not found!" });
      }
      const response = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        image: user.image,
        isMentor: user.isMentor,
        isActive: user.isActive,
      };
      res.status(200).json({ status: 1, user: response });
    })
    .catch((err: any) => {
      res.status(400).json({ status: 0, err: err.message });
    });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  User.findByPk(id)
    .then((user: any) => {
      if (!user) {
        res.status(404).json({ status: 0, message: "User not found!" });
      }
      User.destroy({
        where: {
          id: id,
        },
      });
    })
    .then((result: any) => {
      const response = {
        deletedAt: result.deletedAt,
        deletedAtIp: req.ip,
      };

      res
        .status(200)
        .json({ status: 1, message: "User deleted!", Mentor: response });
    })
    .catch((err: any) => {
      res.status(400).json({ status: 0, err: err.message });
    });
});
