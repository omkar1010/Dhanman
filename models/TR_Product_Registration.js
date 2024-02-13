// import { Sequelize, DataTypes } from "sequelize";
// import db from "../config/Database.js";


// const { Model } = Sequelize;

// class TR_Product_Registration extends Model {
//   static associate(models) {
//     TR_Product_Registration.belongsTo(models.MS_CustomerModel, {
//       foreignKey: "compId",
//     });
//     TR_Product_Registration.belongsTo(models.MS_Product, {
//       foreignKey: "prodId",
//     });
//     TR_Product_Registration.belongsTo(models.MS_Grade, {
//       foreignKey: "gradeId",
//     });
//   }
// }

// TR_Product_Registration.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//       allowNull: false,
//     },
//     compId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },
//     prodId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },
//     gradeId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },
//     No_of_casting_in_mould: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },
//     Casting_Weight: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },
//     last_updated: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
//     },
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },
//   },
//   {
//     sequelize: db,
//     modelName: "TR_Product_Registration",
//     freezeTableName: true,
//   }
// );

// export default TR_Product_Registration;


import { Sequelize, DataTypes } from "sequelize";
import db from "../config/Database.js";
import MS_Product from "./MS_Product.js";
import MS_Grade from "./MS_Grade.js";
import MS_CustomerModel from "./MS_CustomerModel.js";
import Users from "./UserModel.js";

const TR_Product_Registration = db.define(
  "TR_Product_Registration",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
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
    gradeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    No_of_casting_in_mould: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    Casting_Weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
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

// Associations
TR_Product_Registration.belongsTo(MS_Product, { foreignKey: "prodId", as: "product" }); // Add 'as: "product"'
TR_Product_Registration.belongsTo(MS_CustomerModel, { foreignKey: "compId", as: "customer" }); // Add 'as: "customer"'
TR_Product_Registration.belongsTo(MS_Grade, { foreignKey: "gradeId" });
Users.hasMany(TR_Product_Registration, { foreignKey: "userId" });
TR_Product_Registration.belongsTo(Users, { foreignKey: "userId" });

export default TR_Product_Registration;