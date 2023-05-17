import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import Appointment from "./appointment";
import Mentor from "./mentor";
import Review from "./review";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING,
    },
    lastname: {
      type: DataTypes.STRING,
    },
    fullname: {
      type: DataTypes.VIRTUAL,
      get(this : any) {
        return `${this.firstname} ${this.lastname}`;
      },
      set(value) {
        throw new Error('Do not try to set the `fullName` value!');
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "email",
        msg: "Email already in use",
      },
      validate: {
        isEmail: { msg: "You must enter a valid email" },
      },
      set: function (val: string) {
        val = val.toLowerCase().trim();
        this.setDataValue("email", val);
      },
    },
    password: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    otp: {
      type: DataTypes.STRING,
    },
    otpExpire: {
      type: DataTypes.DATE,
    },
    isMentor: {
      type: DataTypes.BOOLEAN,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue : true
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
    paranoid:true,
    tableName: "User",
  },
  
);

User.hasOne(Mentor, {
  foreignKey: 'UserId'
});
Mentor.belongsTo(User);
Appointment.belongsTo(User)
Review.belongsTo(User)




export default User;
