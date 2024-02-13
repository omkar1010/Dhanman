import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import MS_Product from "./MS_Product.js";
import MS_CustomerModel from "./MS_CustomerModel.js";
import MS_Rejection from "./MS_Rejection.js"

const { DataTypes } = Sequelize;

const TR_Rejection = db.define(
  "r1tr_rejection",
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
    rejec_Id: {
      type: DataTypes.INTEGER,
      allowNull: false, // Allow null for foreign key
    },

    Production_Quantity: {
      type: DataTypes.INTEGER,
   
      validate: {
        notEmpty: true,
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
     
      validate: {
        notEmpty: true,
        isInt: true,
       
        validatePositive(value) {
         
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


TR_Rejection.belongsTo(MS_Product,{ foreignKey: "prodId", as: "product" })
TR_Rejection.belongsTo(MS_CustomerModel, { foreignKey: "compId", as: "customer" }); 
Users.hasMany(TR_Rejection, { foreignKey: "userId" });
TR_Rejection.belongsTo(Users, { foreignKey: "userId" });
TR_Rejection.belongsTo(MS_Rejection, { foreignKey: "rejec_Id", as: "rejection" });


export default TR_Rejection;
