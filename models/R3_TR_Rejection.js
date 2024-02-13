import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import MS_Product from "./MS_Product.js";
import MS_CustomerModel from "./MS_CustomerModel.js";
import MS_Rejection from "./MS_Rejection.js"

const { DataTypes } = Sequelize;

const TR3_Rejection = db.define(
  "r3tr_rejection",
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

    Reject_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true,
        isDate: true,
      },
    },
   
    
    
    Rejection_Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isInt: true,
        min: 0,
        validatePositive(value) {
          if (value < 0) {
            throw new Error(
              "Quantity must be entered in positive numbers only."
            );
          }
        },
      },
    },


    Stock_Balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isInt: true,
        min: 0,
       
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


TR3_Rejection.belongsTo(MS_Product,{ foreignKey: "prodId", as: "product" })
TR3_Rejection.belongsTo(MS_CustomerModel, { foreignKey: "compId", as: "customer" }); 
// Users.hasMany(TR3_Rejection, { foreignKey: "userId" });
TR3_Rejection.belongsTo(Users, { foreignKey: "userId" });


export default TR3_Rejection;