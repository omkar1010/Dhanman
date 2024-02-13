import TR_Dispatch from "../models/TR_Dispatch.js";
import MS_Product from "../models/MS_Product.js";
import { Op } from "sequelize";

export const getDispatches = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await TR_Dispatch.findAll({
        attributes: [
          "id",
          "compId",
          "prodId",
          "Dispatch_Date",
          "Dispatch_Quantity",
          "Rejection3_quantity",
          "last_updated"
        ],
        include: [
          {
            model: MS_Product,
            attributes: ["PK_ProductID", "ProductName"]
          },
          {
            model: User,
            attributes: ["name", "email"]
          }
        ]
      });
    } else {
      response = await TR_Dispatch.findAll({
        attributes: [
          "id",
          "compId",
          "prodId",
          "Dispatch_Date",
          "Dispatch_Quantity",
          "Rejection3_quantity",
          "last_updated"
        ],
        where: {
          userId: req.userId
        },
        include: [
          {
            model: MS_Product,
            attributes: ["PK_ProductID", "ProductName"]
          },
          {
            model: User,
            attributes: ["name", "email"]
          }
        ]
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getDispatchById = async (req, res) => {
  try {
    const dispatch = await TR_Dispatch.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!dispatch) return res.status(404).json({ msg: "Data not found" });
    let response;
    if (req.role === "admin") {
      response = await TR_Dispatch.findOne({
        attributes: [
          "id",
          "compId",
          "prodId",
          "Dispatch_Date",
          "Dispatch_Quantity",
          "Rejection3_quantity",
          "last_updated"
        ],
        where: {
          id: dispatch.id
        },
        include: [
          {
            model: MS_Product,
            attributes: ["PK_ProductID", "ProductName"]
          },
          {
            model: User,
            attributes: ["name", "email"]
          }
        ]
      });
    } else {
      response = await TR_Dispatch.findOne({
        attributes: [
          "id",
          "compId",
          "prodId",
          "Dispatch_Date",
          "Dispatch_Quantity",
          "Rejection3_quantity",
          "last_updated"
        ],
        where: {
          [Op.and]: [{ id: dispatch.id }, { userId: req.userId }]
        },
        include: [
          {
            model: MS_Product,
            attributes: ["PK_ProductID", "ProductName"]
          },
          {
            model: User,
            attributes: ["name", "email"]
          }
        ]
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createDispatch = async (req, res) => {
  const {
    compId,
    prodId,
    Dispatch_Date,
    Dispatch_Quantity,
    Rejection3_quantity
  } = req.body;
  try {
    await TR_Dispatch.create({
      compId,
      prodId,
      Dispatch_Date,
      Dispatch_Quantity,
      Rejection3_quantity,
      userId: req.userId
    });
    res.status(201).json({ msg: "Dispatch Created Successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateDispatch = async (req, res) => {
  try {
    const dispatch = await TR_Dispatch.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!dispatch) return res.status(404).json({ msg: "Data not found" });
    const {
      compId,
      prodId,
      Dispatch_Date,
      Dispatch_Quantity,
      Rejection3_quantity
    } = req.body;
    if (req.role === "admin") {
      await TR_Dispatch.update(
        {
          compId,
          prodId,
          Dispatch_Date,
          Dispatch_Quantity,
          Rejection3_quantity
        },
        {
          where: {
            id: dispatch.id
          }
        }
      );
    } else {
      if (req.userId !== dispatch.userId)
        return res.status(403).json({ msg: "Access forbidden" });
      await TR_Dispatch.update(
        {
          compId,
          prodId,
          Dispatch_Date,
          Dispatch_Quantity,
          Rejection3_quantity
        },
        {
          where: {
            [Op.and]: [{ id: dispatch.id }, { userId: req.userId }]
          }
        }
      );
    }
    res.status(200).json({ msg: "Dispatch Updated Successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteDispatch = async (req, res) => {
  try {
    const dispatch = await TR_Dispatch.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!dispatch) return res.status(404).json({ msg: "Data not found" });
    if (req.role === "admin") {
      await TR_Dispatch.destroy({
        where: {
          id: dispatch.id
        }
      });
    } else {
      if (req.userId !== dispatch.userId)
        return res.status(403).json({ msg: "Access forbidden" });
      await TR_Dispatch.destroy({
        where: {
          [Op.and]: [{ id: dispatch.id }, { userId: req.userId }]
        }
      });
    }
    res.status(200).json({ msg: "Dispatch Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
