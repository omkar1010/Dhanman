import TR_Heats from "../models/TR_Heats.js";
import { Op } from "sequelize";


export const getHeats = async (req, res) => {
    try {
      let response;
      if (req.role === "admin") {
        response = await TR_Heats.findAll({
          attributes: ["id", "Heat_date", "No_of_Heates", "last_updated"],
          include: [
            {
              model: User,
              attributes: ["name", "email"]
            }
          ]
        });
      } else {
        response = await TR_Heats.findAll({
          attributes: ["id", "Heat_date", "No_of_Heates", "last_updated"],
          where: {
            userId: req.userId
          },
          include: [
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
  
  export const getHeatById = async (req, res) => {
    try {
      const heat = await TR_Heats.findOne({
        where: {
          id: req.params.id
        }
      });
      if (!heat) return res.status(404).json({ msg: "Data not found" });
      let response;
      if (req.role === "admin") {
        response = await TR_Heats.findOne({
          attributes: ["id", "Heat_date", "No_of_Heates", "last_updated"],
          where: {
            id: heat.id
          },
          include: [
            {
              model: User,
              attributes: ["name", "email"]
            }
          ]
        });
      } else {
        response = await TR_Heats.findOne({
          attributes: ["id", "Heat_date", "No_of_Heates", "last_updated"],
          where: {
            [Op.and]: [{ id: heat.id }, { userId: req.userId }]
          },
          include: [
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
  
  export const createHeat = async (req, res) => {
    const { Heat_date, No_of_Heates } = req.body;
    try {
      await TR_Heats.create({
        Heat_date,
        No_of_Heates,
        userId: req.userId
      });
      res.status(201).json({ msg: "Heat Created Successfully" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };
  
  export const updateHeat = async (req, res) => {
    try {
      const heat = await TR_Heats.findOne({
        where: {
          id: req.params.id
        }
      });
      if (!heat) return res.status(404).json({ msg: "Data not found" });
      const { Heat_date, No_of_Heates } = req.body;
      if (req.role === "admin") {
        await TR_Heats.update(
          {
            Heat_date,
            No_of_Heates
          },
          {
            where: {
              id: heat.id
            }
          }
        );
      } else {
        if (req.userId !== heat.userId)
          return res.status(403).json({ msg: "Access forbidden" });
        await TR_Heats.update(
          {
            Heat_date,
            No_of_Heates
          },
          {
            where: {
              [Op.and]: [{ id: heat.id }, { userId: req.userId }]
            }
          }
        );
      }
      res.status(200).json({ msg: "Heat Updated Successfully" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };
  
  export const deleteHeat = async (req, res) => {
    try {
      const heat = await TR_Heats.findOne({
        where: {
          id: req.params.id
        }
      });
      if (!heat) return res.status(404).json({ msg: "Data not found" });
      if (req.role === "admin") {
        await TR_Heats.destroy({
          where: {
            id: heat.id
          }
        });
      } else {
        if (req.userId !== heat.userId)
          return res.status(403).json({ msg: "Access forbidden" });
        await TR_Heats.destroy({
          where: {
            [Op.and]: [{ id: heat.id }, { userId: req.userId }]
          }
        });
      }
      res.status(200).json({ msg: "Heat Deleted Successfully" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };
  