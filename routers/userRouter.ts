import express from "express";
import {
  uploadImg,
  createUser,
  updateUser,
  getUser,
  getUsers,
  deleteUser,
} from "../controllers/userController";
const router = express.Router();

router.post("/create", uploadImg, createUser);
router.get("/get-user/:id", getUser);
router.get("/getusers", getUsers);
router.patch("/update-user/:id", uploadImg, updateUser);
router.delete("/delete-user/:id", deleteUser);

export default router;
