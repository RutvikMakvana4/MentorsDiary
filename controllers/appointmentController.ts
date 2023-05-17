import { Request, Response } from "express";
import Appointment from "../models/appointment";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import sendEmail from "../controllers/mailController";

interface IRequest extends Request {
  user?: any;
}

export const createBookingSession = asyncHandler(
  async (req: Request, res: Response) => {
    const appointmentDate = req.body.appointmentDate;
    const appointmentTime = req.body.appointmentTime;
    const status = req.body.status;
    const MentorId = req.body.MentorId;
    const UserId = req.body.UserId;

    Appointment.create({
      appointmentDate,
      appointmentTime,
      status,
      MentorId,
      UserId,
      createdAtIp: req.ip,
    })
      .then((result: any) => {
        const response = {
          id: result.id,
          appointmentDate: result.appointmentDate,
          appointmentTime: result.appointmentTime,
          status: result.status,
          MentorId: result.MentorId,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
          createdAtIp: req.ip,
        };

        res.status(201).json({
          status: 1,
          message: "Session created successfully!",
          session: response,
        });
      })
      .catch((err: any) => {
        res.status(400).json({ status: 0, err: err.message });
      });
  }
);

export const getBookingSession = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    Appointment.findByPk(id)
      .then((session: any) => {
        if (!session) {
          return res
            .status(404)
            .json({ status: 0, message: "session not found!" });
        }
        const response = {
          id: session.id,
          appointmentDate: session.appointmentDate,
          appointmentIime: session.appointmentTime,
          status: session.status,
        };
        res.status(200).json({ status: 1, session: response });
      })
      .catch((err: any) => {
        res.status(400).json({ status: 0, err: err.message });
      });
  }
);

export const getAllBookingSessions = asyncHandler(
  async (req: Request, res: Response) => {
    const limit: any = req.query.limit || 10;
    const page: any = req.query.page || 1;

    const offset = (page - 1) * limit;

    Appointment.findAndCountAll({
      attributes: ["id", "appointmentDate", "appointmentTime", "status"],
      limit: limit,
      offset: offset,
    })
      .then((sessions: any) => {
        const TotalPage = Math.ceil(sessions.count / limit);
        const previousPage = page > 1 ? page - 1 : 0;
        const nextPage = page < TotalPage ? page + 1 : 0;

        res.json({
          TotalPage: TotalPage,
          previousPage: previousPage,
          sessions: sessions,
          nextPage: nextPage,
        });
      })
      .catch((err: any) => {
        res.status(400).json({ status: 0, err: err.message });
      });
  }
);

export const updateBookingSession = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const appointmentDate = req.body.appointmentDate;
    const appointmentTime = req.body.appointmentTime;
    const status = req.body.status;

    Appointment.findByPk(id)
      .then((session: any) => {
        if (!session) {
          return res
            .status(404)
            .json({ status: 0, message: "Mentor not found!" });
        }
        session.id = id;
        session.appointmentDate = appointmentDate;
        session.appointmentTime = appointmentTime;
        session.status = status;
        return session.save();
      })
      .then((result: any) => {
        const response = {
          id: result.id,
          appointmentDate: result.appointmentDate,
          appointmentTime: result.appointmentTime,
          status: result.status,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
          updatedAtIp: req.ip,
        };
        res
          .status(200)
          .json({ status: 1, message: "session updated!", session: response });
      })
      .catch((err: any) => {
        res.status(400).json({ status: 0, err: err.message });
      });
  }
);

export const deleteBookingSession = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    Appointment.findByPk(id)
      .then((session: any) => {
        if (!session) {
          res.status(404).json({ status: 0, message: "Session not found!" });
        }
        return Appointment.destroy({
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
          .json({ status: 1, message: "Session deleted!", Session: response });
      })
      .catch((err: any) => {
        res.status(400).json({ status: 0, err: err.message });
      });
  }
);

export const createMeeting = asyncHandler(
  async (req: Request, res: Response) => {
    res.redirect(`/${uuidV4()}`);
  }
);

export const joinMeeting = asyncHandler(async (req: Request, res: Response) => {
  const roomId = req.params.room;
  res.render("room", { roomId: roomId });
});

const payload = {
  iss: process.env.ZOOM_API_KEY,
  exp: new Date().getTime() + 5000,
};

const token = jwt.sign(payload, `${process.env.ZOOM_API_SECRET}` as string);

export const bookMentor = asyncHandler(async (req: IRequest, res: Response) => {
  const firstname = req.user.firstname;
  const lastname = req.user.lastname;
  const email = req.user.email;
  const category = req.body.category;
  const appointmentDate = req.body.appointmentDate;
  const appointmentTime = req.body.appointmentTime;
  const roomId = req.params.roomId;

  Appointment.create({
    appointmentDate,
    appointmentTime,
  })

    // var options = {
    //   method: "POST",
    //   uri: "https://api.zoom.us/v2/users/" + email + "/meetings",
    //   body: {
    //     topic: "Zoom Meeting Using Node JS",
    //     type: 1,
    //     settings: {
    //       host_video: "true",
    //       participant_video: "true",
    //     },
    //   },
    //   auth: {
    //     bearer: token,
    //   },
    //   user : {
    //     "User-Agent" : "Zoom-api-Jwt-Rwu"
    //   },
    //   headers: {
    //     "User-Agent": "Zoom-api-Jwt-Request",
    //     "content-type": "application/json",
    //   },
    //   json: true,
    // };

    // requestPromise(options)
    .then((response: any) => {
      //   const startLink : string = response["start_url"]

      //   const joinLink : string = response["join_url"]
      //   console.log(startLink)

      //   console.log(joinLink)

      //   res.status(200).json({
      //     "link" : link,
      //   "response": response
      // });

      const joinURL = `<p> Your meeting schedule on given <br> DATE : ${appointmentDate} <br> TIME : ${appointmentTime}</p><br><p>Join Meeting</p><br><p><a href="localhost:5007/${roomId}"</a></p>`;
      const data = {
        to: email,
        text: `hello Mr.+ ${firstname} ${lastname}`,
        subject: `hello Mr. ${firstname} ${lastname} Your Meeting schedule`,
        htm: joinURL,
      };

      sendEmail(data);
      console.log("sent meetimg mail");
      res.render("room", { roomId: roomId });
    })

    .catch((err: any) => {
      res
        .status(400)
        .json({ status: 0, err: "Please select valid date and time" });
      console.log("API call failed, reason ", err);
    });
});

function uuidV4() {
  throw new Error("Function not implemented.");
}
