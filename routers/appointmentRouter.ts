import express from "express";
import {
  createBookingSession,
  getBookingSession,
  getAllBookingSessions,
  updateBookingSession,
  deleteBookingSession,
  bookMentor,
  createMeeting,
  joinMeeting,
} from "../controllers/appointmentController";
import { authMiddleware } from "../middlewares/authMiddleware";
const router = express.Router();

router.post("/create-session", createBookingSession);
router.get("/get-session/:id", getBookingSession);
router.get("/get-all-sessions", getAllBookingSessions);
router.patch("/update-session/:id", updateBookingSession);
router.delete("/delete-session/:id", deleteBookingSession);

router.post("/book-mentor/:roomId", authMiddleware, bookMentor);

router.get("/", createMeeting);
router.get("/:room", joinMeeting);

export default router;
