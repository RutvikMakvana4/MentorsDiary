import Mentor from "../models/mentor";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
import User from "../models/user";

export const createMentor = asyncHandler(
  async (req: Request, res: Response) => {
    const category = req.body.category;
    const language = req.body.language;
    const rating = req.body.rating;
    const UserId = req.body.UserId;

    Mentor.create({
      category: category,
      language: language,
      rating: rating,
      UserId: UserId,
      createdAtIp: req.ip,
    })
      .then((result: any) => {
        const response = {
          id: result.id,
          category: result.category,
          language: result.language,
          rating: result.rating,
          UserId: result.UserId,
        };
        res.status(201).json({
          status: 1,
          message: "Mentor created successfully!",
          mentor: response,
        });
      })
      .catch((err: any) => {
        res.status(400).json({ status: 0, err: err.message });
      });
  }
);

export const search = asyncHandler(async (req: Request, res: Response) => {
  let { category } = req.query;

  Mentor.findAll({
    attributes: ["category", "language", "rating"],
    include: [
      {
        model: User,
        attributes: ["fullname", "image"],
      },
    ],
    where: {
      category: category,
    },
  })
    .then((results: any) => {
      res.status(200).json({
        status: 1,
        mentors: results,
      });
    })
    .catch((error: any) => {
      res.status(500).json({
        status: 0,
        message: error.message,
      });
    });
});

export const pagination = asyncHandler(async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  const offset = (page - 1) * limit;

  const mentors = Mentor.findAndCountAll({
    attributes: ["category", "language", "rating"],
    include: [
      {
        model: User,
        attributes: ["fullname", "image"],
      },
    ],
    limit: limit,
    offset: offset,
  })
    .then((mentors: any) => {
      const TotalPage = Math.ceil(mentors.count / limit);
      const previousPage = page > 1 ? page - 1 : 0;
      const nextPage = page < TotalPage ? page + 1 : 0;

      res.json({
        TotalPage: TotalPage,
        previousPage: previousPage,
        mentors: mentors,
        nextPage: nextPage,
      });
    })
    .catch((err: any) => {
      res.status(400).json({ status: 0, err: err.message });
    });
});

export const filter = asyncHandler(async (req: Request, res: Response) => {
  try {
    const filteredResult = await Mentor.findAll({
      attributes: ["category", "language", "rating"],
      include: [
        {
          model: User,
          attributes: ["fullname", "image"],
        },
      ],
      where: req.query,
    });
    if (filteredResult.length === 0) {
      res.json({
        status: 0,
        message:
          "There are no mentors records for this query. Please unselect some items.",
      });
    }
    res.status(200);
    res.json({
      status: 1,
      message: "Mentor query records retrieved.",
      data: filteredResult,
    });
  } catch (err) {
    res.status(500).json({
      status: 0,
      message: "There is an error retrieving filter query records!",
      err,
    });
  }
});

export const sort = asyncHandler(async (req: Request, res: Response) => {
  try {
    const sortedResult = await Mentor.findAll({
      attributes: ["category", "language", "rating"],
      include: [
        {
          model: User,
          attributes: ["fullname", "image"],
        },
      ],
      where: req.query,
      order: [["createdAt", "ASC"] || ["rating", "DESC"]],
    });
    if (sortedResult.length === 0) {
      res.json({
        status: 0,
        message:
          "There are no mentors records for this query. Please unselect some items.",
      });
    }
    res.status(200);
    res.json({
      status: 1,
      message: "Mentor query records retrieved.",
      data: sortedResult,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "There is an error retrieving filter query records!",
    });
  }
});

export const updateMentor = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const category = req.body.category;
    const bio = req.body.bio;
    const description = req.body.description;
    const language = req.body.language;
    const rating = req.body.rating;

    Mentor.findByPk(id)
      .then((mentor: any) => {
        if (!mentor) {
          return res
            .status(404)
            .json({ status: 0, message: "Mentor not found!" });
        }
        mentor.id = id;
        mentor.category = category;
        mentor.bio = bio;
        mentor.description = description;
        mentor.language = language;
        mentor.rating = rating;
        mentor.updatedAtIp = req.ip;
        return mentor.save();
      })
      .then((result: any) => {
        const response = {
          id: result.id,
          category: result.caategory,
          bio: result.bio,
          description: result.description,
          language: result.language,
          rating: result.rating,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
          updatedAtIp: req.ip,
        };
        res
          .status(200)
          .json({ status: 1, message: "Mentor updated!", Mentor: response });
      })
      .catch((err: any) => {
        res.status(400).json({ status: 0, err: err.message });
      });
  }
);

export const getMentors = asyncHandler(async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  const offset = (page - 1) * limit;

  const mentors = Mentor.findAndCountAll({
    attributes: ["id", "category", "language", "rating"],
    include: [
      {
        model: User,
        attributes: ["firstname", "lastname", "fullname", "image"],
      },
    ],
    limit: limit,
    offset: offset,
  })
    .then((mentors: any) => {
      const TotalPage = Math.ceil(mentors.count / limit);
      const previousPage = page > 1 ? page - 1 : 0;
      const nextPage = page < TotalPage ? page + 1 : 0;

      res.json({
        TotalPage: TotalPage,
        previousPage: previousPage,
        mentors: mentors,
        nextPage: nextPage,
      });
    })
    .catch((err: any) => {
      res.status(400).json({ status: 0, err: err.message });
    });
});

export const getMentor = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  Mentor.findByPk(id, {
    attributes: ["id", "category", "language", "rating"],
    include: [
      {
        model: User,
        attributes: ["firstname", "lastname", "fullname", "image"],
      },
    ],
  })
    .then((mentor: any) => {
      if (!mentor) {
        return res
          .status(404)
          .json({ status: 0, message: "Mentor not found!" });
      }
      res.status(200).json({ status: 1, mentor: mentor });
    })
    .catch((err: any) => {
      res.status(400).json({ status: 0, err: err.message });
    });
});

export const deleteMentor = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    Mentor.findByPk(id)
      .then((user: any) => {
        if (!user) {
          res.status(404).json({ status: 0, message: "Mentor not found!" });
        }
        Mentor.destroy({
          where: {
            id: id,
          },
        });
      })
      .then((result: any) => {
        const response = {
          deletedAtIp: req.ip,
        };

        res
          .status(200)
          .json({ status: 1, message: "Mentor deleted!", Mentor: response });
      })
      .catch((err: any) => {
        res.status(400).json({ status: 0, err: err.message });
      });
  }
);

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

export const becomeMentor = asyncHandler(async (req: any, res: Response) => {
  const url = req.protocol + "://" + req.get("host");

  const firstname = req.user.firstname;
  const lastname = req.user.lastname;
  const email = req.user.email;
  const phone = req.body.phone;
  const category = req.body.category;
  const bio = req.body.bio;
  const language = req.body.language;
  const image = url + "/public/uploads/" + req.file?.originalname;

  const data = Promise.all([
    User.update(
      { phone: phone, image: image, updatedAtIp: req.ip },
      {
        where: { email: email },
      }
    ),

    Mentor.create({
      category: category,
      bio: bio,
      language: language,
      createdAtIp: req.ip,
    }),
  ])
    .then((ress: any) => {
      const response = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone,
        image: image,
        category: category,
        bio: bio,
        language: language,
        createdAt: ress.createdAt,
        updatedAt: ress.updatedAt,
      };
      res.json({
        status: 1,
        message: " mentor become successfully!",
        list: response,
      });
    })
    .catch((err: any) => {
      res.status(400).json({ status: 0, err: err.message });
    });
});
