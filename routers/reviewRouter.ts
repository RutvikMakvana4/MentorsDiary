import express from "express";
import {
  createReview,
  getReview,
  getAllReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController";
const router = express.Router();
import { authMiddleware } from "../middlewares/authMiddleware";

router.post("/create", createReview);
router.get("/get-review/:id", getReview);
router.get("/get-all-reviews", getAllReviews);
router.patch("/update-review/:id", updateReview);
router.delete("/delete-review/:id", deleteReview);

export default router;
