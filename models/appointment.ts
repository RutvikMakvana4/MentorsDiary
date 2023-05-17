import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import Mentor from "../models/mentor";
import User from "../models/user";
import Review from "./review";

const Appointment = sequelize.define(
  "Appointment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    price: {
      type: DataTypes.STRING,
    },
    appointmentDate: {
      type: DataTypes.DATEONLY,
    },
    appointmentTime: {
      type: DataTypes.TIME,
    },
    status: {
      type: DataTypes.ENUM("Accepted", "Rejected", "Pending"),
      defaultValue: "Pending",
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
    createdAtIp: {
      type: DataTypes.STRING,
    },
    updatedAtIp: {
      type: DataTypes.STRING,
    },
    deletedAtIp: {
      type: DataTypes.STRING,
    },
  },
  {
    paranoid: true,
    tableName: "Appointment",
  }
);

Review.belongsTo(Appointment);

export default Appointment;
