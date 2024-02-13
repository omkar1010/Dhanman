// import { Sequelize, DataTypes } from "sequelize";
// import db from "../config/Database.js";
// import Users from "./UserModel.js";
// import TR_Product_Registration from "./TR_Product_Registration.js";

// const { Model } = Sequelize;

// class MS_Grade extends Model {
//   static associate(models) {
//     MS_Grade.belongsTo(models.Users, { foreignKey: "userId" });
//     MS_Grade.hasMany(models.TR_Product_Registration, { foreignKey: "gradeId" });
//   }
// }

// MS_Grade.init(
//   {
//     PK_GradeId: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//       allowNull: false,
//     },
//     Grade_Name: {
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
//     modelName: "MS_Grade",
//     freezeTableName: true,
//   }
// );

// export default MS_Grade;


import { Sequelize, DataTypes, Model } from "sequelize";
import db from "../config/Database.js";

class MS_Grade extends Model {
  static associate(models) {
    MS_Grade.hasMany(models.TR_Product_Registration, { foreignKey: "gradeId" });
  }
}

MS_Grade.init(
  {
    PK_GradeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Grade_Name: {
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
    sequelize: db,
    modelName: "MS_Grade",
    freezeTableName: true,
  }
);

export default MS_Grade;


