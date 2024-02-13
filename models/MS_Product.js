// import { Sequelize, DataTypes } from "sequelize";
// import db from "../config/Database.js";
// import Users from "./UserModel.js";
// import TR_Product_Registration from "./TR_Product_Registration.js";

// const { Model } = Sequelize;

// class MS_Product extends Model {
//   static associate() {
//     MS_Product.hasMany(TR_Product_Registration, { foreignKey: "prodId" });
//     MS_Product.hasMany(Users, { foreignKey: "userId" });
//   }
// }

// MS_Product.init(
//   {
//     PK_ProductID: {
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
//     prod_name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//         len: [3, 100],
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
//     modelName: "MS_Product",
//     freezeTableName: true,
//   }
// );

// export default MS_Product;


// import { Sequelize, DataTypes } from "sequelize";
// import db from "../config/Database.js";
// import MS_CustomerModel from "./MS_CustomerModel.js";

// const MS_Product = db.define(
//   "MS_Product",
//   {
//     PK_ProductID: {
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
//     prod_name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//         len: [3, 100],
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
//     freezeTableName: true,
//   }
// );

// MS_Product.belongsTo(MS_CustomerModel, { foreignKey: "userId" });
// MS_Product.belongsTo(MS_CustomerModel, { foreignKey: "compId", as: "customer" }); // Add 'as: "customer"'



// export default MS_Product;


import { Sequelize, DataTypes } from "sequelize";
import db from "../config/Database.js";
import MS_CustomerModel from "./MS_CustomerModel.js";

const MS_Product = db.define(
  "MS_Product",
  {
    PK_ProductID: {
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
    prod_name: {
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

MS_Product.belongsTo(MS_CustomerModel, { foreignKey: "userId" });
MS_Product.belongsTo(MS_CustomerModel, { foreignKey: "compId", as: "customer" }); // Add 'as: "customer"'



export default MS_Product;