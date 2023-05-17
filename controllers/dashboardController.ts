import { Request, Response } from "express";
import Mentor from "../models/mentor";
import User from "../models/user";
import Appointment from "../models/appointment";

import asyncHandler from "express-async-handler";

export const getMentorAppointment = asyncHandler(
  async (req: Request, res: Response) => {
    Appointment.findAll({
      attributes: ["appointmentDate", "appointmentTime", "status"],
      include: [
        {
          model: User,
          attributes: ["firstname", "lastname", "fullname"],
        },
      ],
    })
      .then((mentor: any) => {
        if (!mentor) {
          return res.json({ status: 0, message: "mentor not found! " });
        }
        res.status(200).json({
          status: 1,
          Mentor: mentor,
        });
      })
      .catch((err: any) => {
        res.status(400).json({ status: 0, Error: err.message });
      });
  }
);

export const updateAppointmentDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const firstname = req.body.firstname;
    const lastname = req.body.lastName;
    const appointmentDate = req.body.appointmentDate;
    const appointmentTime = req.body.appointmentTime;
    const status = req.body.status;

    Appointment.findByPk(id)
      .then((appointment: any) => {
        if (!appointment) {
          return res
            .status(404)
            .json({ status: 0, message: "appointment not found!" });
        }
        appointment.id = id;
        appointment.firstname = firstname;
        appointment.lastname = lastname;
        appointment.appointmentDate = appointmentDate;
        appointment.appointmentTime = appointmentTime;
        appointment.status = status;
        appointment.updatedAtIp = req.ip;
        return appointment.save();
      })
      .then((result: any) => {
        const response = {
          id: result.id,
          firstname: result.firstname,
          lastname: result.lastname,
          appointmentDate: result.appointmentDate,
          appointmentTime: result.appointmentTime,
          status: result.status,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
          updatedAtIp: req.ip,
        };
        res
          .status(200)
          .json({
            status: 1,
            message: "dashboad details updated!",
            Mentor: response,
          });
      })
      .catch((err: any) => {
        res.status(400).json({ status: 0, Error: err.message });
      });
  }
);

export const getUserAppointment = asyncHandler(
  async (req: Request, res: Response) => {
    Appointment.findAll({
      attributes: ["appointmentDate", "appointmentTime"],
      include: [
        {
          model: User,
          attributes: ["firstname", "lastname", "fullname"],
          where: {
            isMentor: true,
          },
        },
      ],
    })
      .then((mentor: any) => {
        if (!mentor) {
          return res.json({
            status: 0,
            message: "mentor and appointment not found! ",
          });
        }
        res.status(200).json({
          status: 1,
          Mentor: mentor,
        });
      })
      .catch((err: any) => {
        res.status(400).json({ status: 0, Error: err.message });
      });
  }
);
