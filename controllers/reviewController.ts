import { Request, Response } from "express";
import Review from "../models/review";
import asyncHandler from "express-async-handler";

export const createReview = asyncHandler(
  async (req: Request, res: Response) => {
    const rating = req.body.rating;
    const comment = req.body.comment;

    Review.create({
      rating,
      comment,
      createdAtIp: req.ip,
    })
      .then((result: any) => {
        const response = {
          id: result.id,
          rating: result.rating,
          comment: result.comment,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
          createdAtIp: req.ip,
        };
        res.json({
          status: 1,
          message: "review created successfully!",
          review: response,
        });
      })
      .catch((err: any) => {
        res.status(400).json({ status: 0, err: err.message });
      });
  }
);

export const getReview = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  Review.findByPk(id)
    .then((review: any) => {
      if (!review) {
        return res
          .status(404)
          .json({ status: 0, message: "review not found!" });
      }
      const response = {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
      };
      res.status(200).json({ status: 1, review: response });
    })
    .catch((err: any) => {
      res.status(400).json({ status: 0, err: err.message });
    });
});

export const getAllReviews = asyncHandler(
  async (req: Request, res: Response) => {
    const limit: any = req.query.limit || 10;
    const page: any = req.query.page || 1;

    const offset = (page - 1) * limit;

    Review.findAndCountAll({
      attributes: ["id", "rating", "comment"],
      limit: limit,
      offset: offset,
    })
      .then((reviews: any) => {
        const TotalPage = Math.ceil(reviews.count / limit);
        const previousPage = page > 1 ? page - 1 : 0;
        const nextPage = page < TotalPage ? page + 1 : 0;

        res.json({
          TotalPage: TotalPage,
          previousPage: previousPage,
          reviews: reviews,
          nextPage: nextPage,
        });
      })
      .catch((err: any) => {
        res.status(400).json({ status: 0, err: err.message });
      });
  }
);

export const updateReview = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const rating = req.body.rating;
    const comment = req.body.comment;

    Review.findByPk(id)
      .then((review: any) => {
        if (!review) {
          return res
            .status(404)
            .json({ status: 0, message: "Review not found!" });
        }
        review.id = id;
        review.rating = rating;
        review.comment = comment;
        review.updatedAtIp = req.ip;

        return review.save();
      })
      .then((result: any) => {
        const response = {
          id: result.id,
          rating: result.rating,
          comment: result.comment,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
          updatedAtIp: req.ip,
        };

        res
          .status(200)
          .json({ status: 1, message: "review updated!", Review: response });
      })
      .catch((err: any) => {
        res.status(400).json({ status: 0, err: err.message });
      });
  }
);

export const deleteReview = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    Review.findByPk(id)
      .then((review: any) => {
        if (!review) {
          res.status(404).json({ status: 0, message: "Review not found!" });
        }
        Review.destroy({
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
          .json({ status: 1, message: "Review deleted!", Session: response });
      })
      .catch((err: any) => {
        res.status(400).json({ status: 0, err: err.message });
      });
  }
);
