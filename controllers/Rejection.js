import MS_Rejection from "../models/MS_Rejection.js";
import TR_Rejection from "../models/TR_Rejection.js";
import MS_Product from "../models/MS_Product.js";
import TR_Product_Registration from "../models/TR_Product_Registration.js";
import { Op } from "sequelize";

export const getRejectionById = async (req, res) => {
  const rejectionId = req.params.id; // Assuming you're passing the rejection ID in the URL

  try {
    const rejection = await TR_Rejection.findByPk(rejectionId);

    if (!rejection) {
      return res.status(404).json({ msg: "Rejection not found" });
    }

    res.status(200).json(rejection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};


export const getRejections = async (req, res) => {
  try {
    const rejections = await TR_Rejection.findAll({
      order: [["id", "ASC"]], // Order the rejections by id in ascending order
    });

    res.status(200).json(rejections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const createRejection = async (req, res) => {
  const {
    compId,
    prodId,
    rejec_Id,
    Rejection_Date,
    Production_Quantity,
    Rejection_Quantity,
  } = req.body;

  try {
    if (rejec_Id.length !== Rejection_Quantity.length) {
      return res.status(400).json({
        msg: "Length of rejec_Id and Rejection_Quantity arrays must be the same",
      });
    }

    const existingRejections = await TR_Rejection.findAll({
      where: {
        compId,
        prodId,
      },
      order: [["id", "ASC"]],
    });

    let cumulativeRejectionQty = 0;

    if (existingRejections.length > 0) {
      const lastRejection = existingRejections[existingRejections.length - 1];
      cumulativeRejectionQty = lastRejection.Stock_Balance;
    }

    const createdRejections = [];

    for (let i = 0; i < rejec_Id.length; i++) {
      const rejecId = rejec_Id[i];
      const rejectionQuantity = Rejection_Quantity[i];

      cumulativeRejectionQty += rejectionQuantity;

      const TRrejection = await TR_Rejection.create({
        compId,
        prodId,
        rejec_Id: rejecId, // Use the individual value from the array
        Reject_date: Rejection_Date,
        Rejection_Quantity: rejectionQuantity,
        Production_Quantity: Production_Quantity,
        Stock_Balance: cumulativeRejectionQty,
        userId: req.user.id,
      });

      createdRejections.push(TRrejection);
    }

    res.status(201).json({ msg: "Rejections created successfully", createdRejections });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const updateRejectionById = async (req, res) => {
  const rejectionId = req.params.id;
  console.log("rejectionId");
  const { Rejection_Quantity, Production_Quantity, Rejection_Date } = req.body;

  try {
    const rejection = await TR_Rejection.findByPk(rejectionId);

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
    const subsequentRejections = await TR_Rejection.findAll({
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

export const deleteRejectionById = async (req, res) => {
  const rejectionId = req.params.id; // Assuming you're passing the rejection ID in the URL

  try {
    const rejection = await TR_Rejection.findByPk(rejectionId);

    if (!rejection) {
      return res.status(404).json({ msg: "Rejection not found" });
    }

    const deletedRejectionQuantity = rejection.Rejection_Quantity;

    // Delete the rejection entry
    await rejection.destroy();

    // Update Stock_Balance for subsequent rejections
    const subsequentRejections = await TR_Rejection.findAll({
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
