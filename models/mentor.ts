import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import Appointment from "../models/appointment";
import User from "../models/user";
import Review from "./review";

const Mentor = sequelize.define(
  "Mentor",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    category: {
      type: DataTypes.STRING,
    },
    bio: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    language: {
      type: DataTypes.STRING,
    },
    rating: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.STRING,
      defaultValue: true,
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
    tableName: "Mentor",
  }
);

Mentor.hasOne(Appointment, {
  foreignKey: {
    name: "MentorId",
  },
});
Appointment.belongsTo(Mentor);

export default Mentor;
