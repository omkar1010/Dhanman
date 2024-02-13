import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import MS_CustomerModel from "./MS_CustomerModel.js";
import MS_Product from "./MS_Product.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const MS_Rejection = db.define(
  "ms_rejection",
  {
    PK_RejectonID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    Rejection_Type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    Sub_Type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },

    last_updated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  
  },
  {
    freezeTableName: true,
  }
);


export default MS_Rejection;
