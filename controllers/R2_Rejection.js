import MS_Rejection from "../models/MS_Rejection.js";

import TR2_Rejection from "../models/R2_TR_Rejection.js";
import MS_Product from "../models/MS_Product.js";
import TR_Product_Registration from "../models/TR_Product_Registration.js"
import { Op } from "sequelize";


export const getRejections2 = async (req, res) => {
  try {
    const rejections = await TR2_Rejection.findAll({
      order: [['id', 'ASC']], // Order the rejections by id in ascending order
    });

    res.status(200).json(rejections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
  
  export const getRejectionById = async (req, res) => {
    const rejecId = req.params.rejecId; // Assuming the rejecId is passed as a route parameter
  
    try {
      const rejection = await TR2_Rejection.findOne({
        where: {
          rejecId: rejecId
        }
      });
  
      if (!rejection) {
        return res.status(404).json({ msg: "Rejection not found with the given rejecId" });
      }
  
      res.status(200).json(rejection);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Internal server error" });
    }
  };
  


// new create rejection fro ms table and the tr table 
// export const createRejection = async (req, res) => {
//   const {
//     compId,
//     prodId,
//     rejecIds,
//     Rejection_Date,
//     Rejection_Quantity
//   } = req.body;

//   try {
//     const productRegistration = await TR_Product_Registration.findOne({
//       where: {
//         compId: compId,
//         prodId: prodId,
//       },
//     });

//     if (!productRegistration) {
//       return res.status(404).json({ msg: "Product Registration not found with the given compId and prodId" });
//     }

//     const userId = req.user.id;

//     const createdRejections = [];

//     for (const rejecId of rejecIds) {
//       const TR2rejection = await TR2_Rejection.create({
//         compId,
//         prodId,
//         rejecId,
//         Reject_date: Rejection_Date,
//         Rejection_Quantity,
//         userId: userId
//       });
//       createdRejections.push(TR2rejection);
//     }

//     res.status(201).json({ msg: "Rejections created successfully", createdRejections });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Internal server error" });
//   }
// }

export const createRejection2 = async (req, res) => {
  const {
    compId,
    prodId,
    rejecIds,
    Rejection_Date,
    Production_Quantity,
    Rejection_Quantity
  } = req.body;

  try {
    if (rejecIds.length !== Rejection_Quantity.length) {
      return res.status(400).json({ msg: "Length of rejecIds and Rejection_Quantity arrays must be the same" });
    }

    const existingRejections = await TR2_Rejection.findAll({
      where: {
        compId,
        prodId,
      },
      order: [['id', 'ASC']],
    });

    let cumulativeRejectionQty = 0;

    if (existingRejections.length > 0) {
      const lastRejection = existingRejections[existingRejections.length - 1];
      cumulativeRejectionQty = lastRejection.Stock_Balance;
    }

    const createdRejections = [];

    for (let i = 0; i < rejecIds.length; i++) {
      const rejecId = rejecIds[i];
      const rejectionQuantity = Rejection_Quantity[i];

      cumulativeRejectionQty += rejectionQuantity;

      const TR2Rejection = await TR2_Rejection.create({
        compId,
        prodId,
        rejecId,
        Reject_date: Rejection_Date,
        Rejection_Quantity: rejectionQuantity,
        Production_Quantity: Production_Quantity,
        Stock_Balance: cumulativeRejectionQty,
        userId: req.user.id
      });

      createdRejections.push(TR2Rejection);
    }

    res.status(201).json({ msg: "Rejections created successfully", createdRejections });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
}



  
// export const updateRejectionById = async (req, res) => {
//   const rejecId = req.params.rejecId; // Assuming the rejecId is passed as a route parameter
//   const { Rejection_Date, Rejection_Quantity } = req.body;

//   try {
//     const rejection = await TR2_Rejection.findOne({
//       where: {
//         rejecId: rejecId
//       }
//     });

//     if (!rejection) {
//       return res.status(404).json({ msg: "Rejection not found with the given rejecId" });
//     }

//     // Update the fields if provided in the request
//     if (Rejection_Date) {
//       rejection.Reject_date = Rejection_Date;
//     }
//     if (Rejection_Quantity) {
//       rejection.Rejection_Quantity = Rejection_Quantity;
//     }

//     await rejection.save();

//     res.status(200).json({ msg: "Rejection updated successfully", updatedRejection: rejection });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Internal server error" });
//   }
// };

export const updateRejectionById = async (req, res) => {
  const rejectionId = req.params.id; // Assuming you're passing the rejection ID in the URL
  const { Rejection_Quantity } = req.body;

  try {
    const rejection = await TR2_Rejection.findByPk(rejectionId);

    if (!rejection) {
      return res.status(404).json({ msg: "Rejection not found" });
    }

    const oldRejectionQuantity = rejection.Rejection_Quantity;
    const newRejectionQuantity = Rejection_Quantity;

    // Update Stock_Balance for the same entry
    const differenceInQuantity = newRejectionQuantity - oldRejectionQuantity;
    rejection.Stock_Balance += differenceInQuantity;

    // Update the rejection entry
    rejection.Rejection_Quantity = newRejectionQuantity;
    await rejection.save();

    // Update Stock_Balance for subsequent rejections
    const subsequentRejections = await TR2_Rejection.findAll({
      where: {
        compId: rejection.compId,
        prodId: rejection.prodId,
        id: { [Op.gt]: rejection.id } // Select subsequent entries
      }
    });

    for (const subsequentRejection of subsequentRejections) {
      subsequentRejection.Stock_Balance += differenceInQuantity;
      await subsequentRejection.save();
    }

    res.status(200).json({ msg: "Rejection updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

  
export const deleteRejectionById = async (req, res) => {
  const rejectionId = req.params.id; // Assuming you're passing the rejection ID in the URL

  try {
    const rejection = await TR2_Rejection.findByPk(rejectionId);

    if (!rejection) {
      return res.status(404).json({ msg: "Rejection not found" });
    }

    const deletedRejectionQuantity = rejection.Rejection_Quantity;

    // Delete the rejection entry
    await rejection.destroy();

    // Update Stock_Balance for subsequent rejections
    const subsequentRejections = await TR2_Rejection.findAll({
      where: {
        compId: rejection.compId,
        prodId: rejection.prodId,
        id: { [Op.gt]: rejection.id } // Select subsequent entries
      }
    });

    for (const subsequentRejection of subsequentRejections) {
      subsequentRejection.Stock_Balance -= deletedRejectionQuantity;
      await subsequentRejection.save();
    }

    res.status(200).json({ msg: "Rejection deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

