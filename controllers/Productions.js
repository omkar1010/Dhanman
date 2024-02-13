// import TR_Production from "../models/TR_Production.js";
// import MS_Product from "../models/MS_Product.js";
// import { Op } from "sequelize";

// export const getProductions = async (req, res) => {
//   try {
//     let response;
//     if (req.role === "admin") {
//       response = await TR_Production.findAll({
//         attributes: [
//           "id",
//           "compId",
//           "prodId",
//           "Production_Date",
//           "Moulds_Poured",
//           "Prodction_Quantity",
//           "Production_Weight",
//           "last_updated",
//         ],
//         include: [
//           {
//             model: MS_Product,
//             attributes: ["PK_ProductID", "ProductName"],
//           },
//           {
//             model: User,
//             attributes: ["name", "email"],
//           },
//         ],
//       });
//     } else {
//       response = await TR_Production.findAll({
//         attributes: [
//           "id",
//           "compId",
//           "prodId",
//           "Production_Date",
//           "Moulds_Poured",
//           "Prodction_Quantity",
//           "Production_Weight",
//           "last_updated",
//         ],
//         where: {
//           userId: req.userId,
//         },
//         include: [
//           {
//             model: MS_Product,
//             attributes: ["PK_ProductID", "ProductName"],
//           },
//           {
//             model: User,
//             attributes: ["name", "email"],
//           },
//         ],
//       });
//     }
//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// export const getProductionById = async (req, res) => {
//   try {
//     const production = await TR_Production.findOne({
//       where: {
//         id: req.params.id,
//       },
//     });
//     if (!production) return res.status(404).json({ msg: "Data not found" });
//     let response;
//     if (req.role === "admin") {
//       response = await TR_Production.findOne({
//         attributes: [
//           "id",
//           "compId",
//           "prodId",
//           "Production_Date",
//           "Moulds_Poured",
//           "Prodction_Quantity",
//           "Production_Weight",
//           "last_updated",
//         ],
//         where: {
//           id: production.id,
//         },
//         include: [
//           {
//             model: MS_Product,
//             attributes: ["PK_ProductID", "ProductName"],
//           },
//           {
//             model: User,
//             attributes: ["name", "email"],
//           },
//         ],
//       });
//     } else {
//       response = await TR_Production.findOne({
//         attributes: [
//           "id",
//           "compId",
//           "prodId",
//           "Production_Date",
//           "Moulds_Poured",
//           "Prodction_Quantity",
//           "Production_Weight",
//           "last_updated",
//         ],
//         where: {
//           [Op.and]: [{ id: production.id }, { userId: req.userId }],
//         },
//         include: [
//           {
//             model: MS_Product,
//             attributes: ["PK_ProductID", "ProductName"],
//           },
//           {
//             model: User,
//             attributes: ["name", "email"],
//           },
//         ],
//       });
//     }
//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// export const createProduction = async (req, res) => {
//   const {
//     compId,
//     prodId,
//     Production_Date,
//     Moulds_Poured,
//     Prodction_Quantity,
//     Production_Weight,
//   } = req.body;
//   try {
//     await TR_Production.create({
//       compId,
//       prodId,
//       Production_Date,
//       Moulds_Poured,
//       Prodction_Quantity,
//       Production_Weight,
//       userId: req.userId,
//     });
//     res.status(201).json({ msg: "Production Created Successfully" });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// export const updateProduction = async (req, res) => {
//   try {
//     const production = await TR_Production.findOne({
//       where: {
//         id: req.params.id,
//       },
//     });
//     if (!production) return res.status(404).json({ msg: "Data not found" });
//     const {
//       compId,
//       prodId,
//       Production_Date,
//       Moulds_Poured,
//       Prodction_Quantity,
//       Production_Weight,
//     } = req.body;
//     if (req.role === "admin") {
//       await TR_Production.update(
//         {
//           compId,
//           prodId,
//           Production_Date,
//           Moulds_Poured,
//           Prodction_Quantity,
//           Production_Weight,
//         },
//         {
//           where: {
//             id: production.id,
//           },
//         }
//       );
//     } else {
//       if (req.userId !== production.userId)
//         return res.status(403).json({ msg: "Access forbidden" });
//       await TR_Production.update(
//         {
//           compId,
//           prodId,
//           Production_Date,
//           Moulds_Poured,
//           Prodction_Quantity,
//           Production_Weight,
//         },
//         {
//           where: {
//             [Op.and]: [{ id: production.id }, { userId: req.userId }],
//           },
//         }
//       );
//     }
//     res.status(200).json({ msg: "Production Updated Successfully" });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// export const deleteProduction = async (req, res) => {
//   try {
//     const production = await TR_Production.findOne({
//       where: {
//         id: req.params.id,
//       },
//     });
//     if (!production) return res.status(404).json({ msg: "Data not found" });
//     if (req.role === "admin") {
//       await TR_Production.destroy({
//         where: {
//           id: production.id,
//         },
//       });
//     } else {
//       if (req.userId !== production.userId)
//         return res.status(403).json({ msg: "Access forbidden" });
//       await TR_Production.destroy({
//         where: {
//           [Op.and]: [{ id: production.id }, { userId: req.userId }],
//         },
//       });
//     }
//     res.status(200).json({ msg: "Production Deleted Successfully" });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };












// productionController.js

import TR_Production from "../models/TR_Production.js";
import TR_Product_Registration from "../models/TR_Product_Registration.js";
import MS_Product from "../models/MS_Product.js";
import MS_CustomerModel from "../models/MS_CustomerModel.js";

export const getProductions = async (req, res) => {
  try {
    const productions = await TR_Production.findAll({
      attributes: [
        "id",
        "compId",
        "comp_name",
        "prod_name",
        "prodId",
        "Production_Date",
        "Moulds_Poured",
        "Prodction_Quantity",
        "Production_Weight",
        "userId",
      ],
      include: [
        {
          model: TR_Product_Registration,
          attributes: [],
          include: [
            {
              model: MS_Product,
              attributes: ["PK_ProductID", "No_of_casting_in_mould", "Casting_Weight"],
           
            },
          ],
        },
        {
          model: MS_CustomerModel,
          attributes: ["comp_name"],
        },
      ],
    });

    // Calculate Total Quantity and Total Weight for each production record
    const productionsWithTotals = productions.map((production) => {
      const { No_of_casting_in_mould, Casting_Weight } = production.TR_Product_Registration.MS_Product;
      const Total_Quantity = No_of_casting_in_mould * production.Moulds_Poured;
      const Total_Weight = Total_Quantity * Casting_Weight;
      return {
        ...production.toJSON(),
        Total_Quantity,
        Total_Weight,
      };
    });

    res.status(200).json(productionsWithTotals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};


export const getProductionById = async (req, res) => {
  const { id } = req.params;
  try {
    const production = await TR_Production.findOne({
      where: { id },
      attributes: [
        "id",
        "compId",
        "comp_name",
        "prod_name",
        "prodId",
        "Production_Date",
        "Moulds_Poured",
        "Prodction_Quantity",
        "Production_Weight",
        "userId",
      ],
      include: [
        {
          model: TR_Product_Registration,
          attributes: [],
          include: [
            {
              model: MS_Product,
              as: 'MS_Product',
              attributes: ["PK_ProductID", "No_of_casting_in_mould", "Casting_Weight"],
            },
          ],
        },
        {
          model: MS_CustomerModel,
          attributes: ["comp_name"],
        },
      ],
    });

    if (!production) {
      return res.status(404).json({ msg: "Production not found" });
    }

    // Calculate Total Quantity and Total Weight for the production record
    const { No_of_casting_in_mould, Casting_Weight } = production.TR_Product_Registration.MS_Product;
 
    const Total_Quantity = No_of_casting_in_mould * production.Moulds_Poured;
    const Total_Weight = Total_Quantity * Casting_Weight;

    const productionWithTotals = {
      ...production.toJSON(),
      Total_Quantity,
      Total_Weight,
    };

    res.status(200).json(productionWithTotals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const createProduction = async (req, res) => {
  const {
    comp_name,
    prod_name,
    Production_Date,
    Moulds_Poured,
  } = req.body;

  try {
    // Check if the provided comp_name and prod_name exist in the MS_CustomerModel and MS_Product tables.
    const company = await MS_CustomerModel.findOne({
      where: { comp_name },
      attributes: ["PK_CompanyID"],
    });

    const product = await MS_Product.findOne({
      where: { prod_name },
      attributes: ["PK_ProductID"],
    });

    if (!company || !product) {
      return res.status(404).json({
        msg: "Company or Product not found with the given comp_name and prod_name",
      });
    }

    // Calculate Total Quantity by fetching No_of_casting_in_mould from products
    const productRegistration = await TR_Product_Registration.findOne({
      where: { compId: company.PK_CompanyID, prodId: product.PK_ProductID },
    });

    if (!productRegistration) {
      return res.status(404).json({
        msg: "Product registration not found for the given company and product",
      });
    }

    const { No_of_casting_in_mould, Casting_Weight } = productRegistration;
    const Total_Quantity = No_of_casting_in_mould * Moulds_Poured;

    // Calculate Total Weight
    const Total_Weight = Total_Quantity * Casting_Weight;

    // Access the userId from the request object (assuming it's set by authentication middleware)
    const userId = req.user.id; // Modify this line based on how userId is stored in the request

    const production = await TR_Production.create({
      compId: company.PK_CompanyID,
      prodId: product.PK_ProductID,
      Production_Date,
      Moulds_Poured,
      Prodction_Quantity: Total_Quantity,
      Production_Weight: Total_Weight,
      userId: userId, // Set the userId based on the authenticated user's role
    });
    console.log(product)

    res.status(201).json({
      msg: "Production created successfully",
      production,
      Total_Quantity,
      Total_Weight,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const updateProduction = async (req, res) => {
  const {
    comp_name,
    prod_name,
    Production_Date,
    Moulds_Poured,
  } = req.body;

  try {
    const production = await TR_Production.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: TR_Product_Registration,
          include: [
            {
              model: MS_Product,
              attributes: ["PK_ProductID", "No_of_casting_in_mould", "Casting_Weight"],
            },
          ],
        },
      ],
    });

    if (!production) {
      return res.status(404).json({ msg: "Production not found" });
    }

    // Fetch the corresponding compId and prodId from the respective models based on comp_name and prod_name
    const company = await MS_CustomerModel.findOne({
      where: { comp_name },
      attributes: ["PK_CompanyID"],
    });

    const product = await MS_Product.findOne({
      where: { prod_name },
      attributes: ["PK_ProductID"],
    });

    if (!company || !product) {
      return res.status(404).json({
        msg: "Company or Product not found with the given comp_name and prod_name",
      });
    }

    // Update the production record
    await production.update({
      compId: company.PK_CompanyID,
      prodId: product.PK_ProductID,
      Production_Date,
      Moulds_Poured,
    });

    // Calculate Total Quantity and Total Weight for the updated production record
    const { No_of_casting_in_mould, Casting_Weight } = production.TR_Product_Registration.MS_Product;
    const Total_Quantity = No_of_casting_in_mould * Moulds_Poured;
    const Total_Weight = Total_Quantity * Casting_Weight;

    // Update the Total Quantity and Total Weight in the production record
    await production.update({
      Prodction_Quantity: Total_Quantity,
      Production_Weight: Total_Weight,
    });

    res.status(200).json({ msg: "Production updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const deleteProduction = async (req, res) => {
  try {
    const production = await TR_Production.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!production)
      return res.status(404).json({ msg: "Production not found" });

    await TR_Production.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({ msg: "Production deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};