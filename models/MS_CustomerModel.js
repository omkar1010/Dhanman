import { Sequelize, DataTypes } from "sequelize";
import db from "../config/Database.js";

const { Model } = Sequelize;

class MS_CustomerModel extends Model {
  static associate(models) {
    MS_CustomerModel.belongsTo(models.Users, { foreignKey: "userId" });
    MS_CustomerModel.hasMany(models.TR_Product_Registration, { foreignKey: "compId" });
    MS_CustomerModel.hasMany(models.MS_Product, { foreignKey: "compId" }); // Add alias for MS_Product model association

  }
}

MS_CustomerModel.init(
  {
    PK_CompanyID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    comp_name: {
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
    modelName: "MS_CustomerModel",
    freezeTableName: true,
  }
);

export default MS_CustomerModel;
