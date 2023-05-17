import express from "express";
import {
  getMentorAppointment,
  updateAppointmentDetails,
  getUserAppointment,
} from "../controllers/dashboardController";
const router = express.Router();
import { authMiddleware } from "../middlewares/authMiddleware";

router.get("/get-appointment-details", authMiddleware, getMentorAppointment);
router.patch(
  "/update-appointment-details",
  authMiddleware,
  updateAppointmentDetails
);
router.get("/get-user-appointment-details", getUserAppointment);

export default router;
