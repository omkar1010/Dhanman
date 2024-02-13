import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import MS_Product from "./MS_Product.js";
import MS_CustomerModel from "./MS_CustomerModel.js";
import TR_Product_Registration from "./TR_Product_Registration.js";

const { DataTypes } = Sequelize;

const TR_Production = db.define(
  "tr_production",
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
    Production_Date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true,
        isDate: true,
      },
    },
    Moulds_Poured: {
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
    Prodction_Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isInt: true,
        min: 0,
        max: 999999,
        validatePositive(value) {
          if (value < 0) {
            throw new Error(
              "Total quantity must be entered in positive numbers only."
            );
          }
        },
      },
    },
    Production_Weight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notEmpty: true,
        isDecimal: true,
        min: 0,
        max: 999999.99,
        validatePositive(value) {
          if (value < 0) {
            throw new Error("Weight must be entered in positive numbers only.");
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

TR_Production.belongsTo(Users, { foreignKey: "userId" });  // Each production belongs to a user
Users.hasMany(TR_Production, { foreignKey: "userId" });   // Each user can have multiple productions

TR_Production.belongsTo(MS_Product, { foreignKey: "prodId" });  // Each production belongs to a product
MS_Product.hasMany(TR_Production, { foreignKey: "prodId" });   // Each product can have multiple productions

TR_Production.belongsTo(MS_CustomerModel, { foreignKey: "compId" });  // Each production belongs to a company
MS_CustomerModel.hasMany(TR_Production, { foreignKey: "compId" });   // Each company can have multiple productions

TR_Production.belongsTo(TR_Product_Registration, { foreignKey: "prodId" });  // Each production belongs to a product registration
TR_Product_Registration.hasMany(TR_Production, { foreignKey: "prodId" });   // Each product registration can have multiple productions

export default TR_Production;