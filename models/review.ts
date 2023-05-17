import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import Appointment from "../models/appointment";
import Mentor from "../models/mentor";
import User from "../models/user";

const Review = sequelize.define(
  "Review",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    rating: {
      type: DataTypes.STRING,
    },
    comment: {
      type: DataTypes.STRING,
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
    tableName: "Review",
  }
);

// Review.belongsTo(User)

export default Review;
