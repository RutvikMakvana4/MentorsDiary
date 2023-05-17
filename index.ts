import express, { Request, Response } from "express";
import authRouter from "./routers/authRouter";
import userRouter from "./routers/userRouter";
import mentorRouter from "./routers/mentorRouter";
import appointmentRouter from "./routers/appointmentRouter";
import reviewRouter from "./routers/reviewRouter";
import dashboardRouter from "./routers/dashboardRouter";
import cors from "cors";
import { Server, createServer } from "http";
import { ExpressPeerServer } from "peer";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;

const server = createServer(app);
const io = new Server(server);

// Access-Control-Allow-Origin
app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use("/public/uploads", express.static("./public/uploads"));

app.use("/api/user", authRouter, userRouter);
app.use("/api/mentor", mentorRouter);
app.use("/api/session", appointmentRouter);
app.use("/", appointmentRouter);
app.use("/api/review", reviewRouter);
app.use("/api/dashboard", dashboardRouter);

app.get("/", (req: Request, res: Response) => {
  res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req: Request, res: Response) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket: any) => {
  socket.on("join-room", (roomId: any, userId: any) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
    // messages
    socket.on("message", (message: string) => {
      //send message to the same room
      io.listen(roomId).emit("createMessage", message);
    });

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});

function uuidV4() {
  throw new Error("Function not implemented.");
}
