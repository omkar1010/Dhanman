import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import TR_Product_Registration from "./TR_Product_Registration.js";
import MS_Product from "./MS_Product.js";

const { DataTypes } = Sequelize;

const TR_Schedule = db.define(
  "tr_schedule",
  {
    compId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    prodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    Schedule_Date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true,
        isDate: true,
      },
    },
    Shedule_Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isInt: true,
        min: 0,
        max: 9999,
        validatePositive(value) {
          if (value < 0) {
            throw new Error(
              "Quantity must be entered in positive numbers only."
            );
          }
        },
      },
    },
    last_updated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
  }
);

TR_Schedule.belongsTo(TR_Product_Registration, { foreignKey: "prodId"});
TR_Schedule.belongsTo(MS_Product, { foreignKey: "compId"});
TR_Schedule.belongsTo(Users, { foreignKey: "userId" });


export default TR_Schedule;