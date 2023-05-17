import express from "express";
import {
  createMentor,
  getMentor,
  getMentors,
  search,
  filter,
  pagination,
  sort,
  updateMentor,
  deleteMentor,
  uploadImg,
  becomeMentor,
} from "../controllers/mentorController";
const router = express.Router();
import { authMiddleware } from "../middlewares/authMiddleware";

router.post("/create", createMentor);
router.get("/get-mentor/:id", getMentor);
router.get("/getmentors", getMentors);
router.patch("/update-mentor/:id", updateMentor);
router.delete("/delete-mentor/:id", deleteMentor);

router.get("/search", authMiddleware, search);
router.get("/filter", authMiddleware, filter);
router.get("/pagination", authMiddleware, pagination);
router.get("/sort", authMiddleware, sort);

router.post("/become-mentor", authMiddleware, uploadImg, becomeMentor);

export default router;
