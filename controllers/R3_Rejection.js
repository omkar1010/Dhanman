import MS_Rejection from "../models/MS_Rejection.js";
// import R3_TR_Rejection from "../models/R3_TR_Rejection.js";
import TR3_Rejection from "../models/R3_TR_Rejection.js"
import MS_Product from "../models/MS_Product.js";
import TR_Product_Registration from "../models/TR_Product_Registration.js";
import { Op } from "sequelize";

export const getR3RejectionById = async (req, res) => {
 
};



export const updateR3ejectionById = async (req, res) => {
  const rejectionId = req.params.id;
  const { Rejection_Quantity, Production_Quantity, Rejection_Date } = req.body;

  try {
    const rejection = await TR3_Rejection.findByPk(rejectionId);

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
    rejection.Production_Quantity = Production_Quantity;
    rejection.Reject_date = Rejection_Date; // Update the date field
    await rejection.save();

    // Update Stock_Balance for subsequent rejections
    const subsequentRejections = await TR3_Rejection.findAll({
      where: {
        compId: rejection.compId,
        prodId: rejection.prodId,
        id: { [Op.gt]: rejection.id }, // Select subsequent entries
      },
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




export const deleteR3ejectionById = async (req, res) => {
  const rejectionId = req.params.id;

  try {
    const rejection = await TR3_Rejection.findByPk(rejectionId);

    if (!rejection) {
      return res.status(404).json({ msg: "Rejection not found" });
    }


    // if (req.user.role === "dispatch" && customer.userId !== req.user.id) {
    //   return res.status(403).json({ message: "Access denied" });
    // }

    // const currentTime = new Date();
    // const createdAt = new Date(rejection.createdAt);
    // const timeDifference = currentTime - createdAt;
    // const twoDaysInMillis = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

    // if (req.user.role === "dispatch" && timeDifference > twoDaysInMillis) {
    //   return res.status(403).json({ message: "Access denied: Time window exceeded" });
    // }


    // Get the quantity of the rejection to be deleted
    const deletedRejectionQuantity = rejection.Rejection_Quantity;

    // Delete the rejection entry
    await rejection.destroy();

    // Update Stock_Balance for subsequent rejections
    const subsequentRejections = await TR3_Rejection.findAll({
      where: {
        compId: rejection.compId,
        prodId: rejection.prodId,
        id: { [Op.gt]: rejection.id }, // Select subsequent entries
      },
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




// export const createR3Rejection = async (req, res) => {
//   const {
//     compId,
//     prodId,
//     rejec_Id, // Now it's a single value
//     Rejection_Date,
//     Production_Quantity,
//     Rejection_Quantity, // Now it's a single value
//   } = req.body;

//   try {
//  //   Check if rejec_Id and Rejection_Quantity are valid numbers
//     if (isNaN(rejec_Id) || isNaN(Rejection_Quantity)) {
//       return res.status(400).json({
//         msg: "rejec_Id and Rejection_Quantity must be valid numbers",
//       });
//     }

//     const existingRejections = await TR3_Rejection.findAll({
//       where: {
//         compId,
//         prodId,
//       },
//       order: [["id", "ASC"]],
//     });

//     let cumulativeRejectionQty = 0;

//     if (existingRejections.length > 0) {
//       const lastRejection = existingRejections[existingRejections.length - 1];
//       cumulativeRejectionQty = lastRejection.Stock_Balance;
//     }

//     // Now we use the single values directly instead of iterating over arrays
//     const rejecId = rejec_Id;
//     const rejectionQuantity = Rejection_Quantity;

//     cumulativeRejectionQty += rejectionQuantity;

//     // Modify the creation of TR_Rejection to include the updated Stock_Balance
//     const R3TRRejection = await TR3_Rejection.create({
//       compId,
//       prodId,
//       rejecId: rejecId,
//       Reject_date: Rejection_Date,
//       Rejection_Quantity: rejectionQuantity,
//       Production_Quantity: Production_Quantity,
//       Stock_Balance: cumulativeRejectionQty, // Update Stock_Balance here
//       userId: req.user.id,
//     });

//     res.status(201).json({ msg: "Rejection created successfully", R3TRRejection });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Internal server error" });
//   }
// };

export const createR3Rejection = async (req, res) => {
  const {
    compId,
    prodId,
    Rejection_Date,
    Production_Quantity,
    Rejection_Quantity,
  } = req.body;

  try {
    // Check if Rejection_Quantity is a valid number
    if (isNaN(Rejection_Quantity)) {
      return res.status(400).json({
        msg: "Rejection_Quantity must be a valid number",
      });
    }

    // Calculate the cumulative Rejection_Quantity without considering rejecId
    const existingRejections = await TR3_Rejection.findAll({
      where: {
        compId,
        prodId,
      },
      order: [["id", "ASC"]],
    });

    let cumulativeRejectionQty = 0;

    if (existingRejections.length > 0) {
      cumulativeRejectionQty = existingRejections.reduce(
        (total, rejection) => total + rejection.Rejection_Quantity,
        0
      );
    }

    // Now we use the single values directly instead of iterating over arrays
    const rejectionQuantity = Rejection_Quantity;

    cumulativeRejectionQty += rejectionQuantity;

    // Modify the creation of TR_Rejection to include the updated Stock_Balance
    const R3TRRejection = await TR3_Rejection.create({
      compId,
      prodId,
      Reject_date: Rejection_Date,
      Rejection_Quantity: rejectionQuantity,
      Production_Quantity: Production_Quantity,
      Stock_Balance: cumulativeRejectionQty, // Update Stock_Balance here
      userId: req.user.id,
    });

    res.status(201).json({
      msg: "Rejection created successfully",
      R3TRRejection,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};



export const getAllR3ejections = async (req, res) => {
  try {
    const rejections = await TR3_Rejection.findAll({
      order: [["id", "ASC"]],
    });

    res.status(200).json({ rejections });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};




































export const updateR3RejectionById = async (req, res) => {
 
};

export const deleteR3RejectionById = async (req, res) => {
  
};


export const getMsRejection = async(req, res) => {
  try {
    const MsRejecton = await MS_Rejection.findAll({
      // include: [{ model: MS_CustomerModel }],
    });
    
    res.json(MsRejecton);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
