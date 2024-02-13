import MS_Grade from "../models/MS_Grade.js";

export const getGrades = async (req, res) => {
  try {
    const grades = await MS_Grade.findAll();
    res.json(grades);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getGradeById = async (req, res) => {
  const { id } = req.params;
  try {
    const grade = await MS_Grade.findByPk(id);
    if (!grade) {
      return res.status(404).json({ message: "Grade not found" });
    }
    res.json(grade);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createGrade = async (req, res) => {
  const { Grade_Name, userId } = req.body;
  try {
    const grade = await MS_Grade.create({ Grade_Name, userId });
    res.status(201).json(grade);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateGrade = async (req, res) => {
  const { id } = req.params;
  const { Grade_Name, userId } = req.body;
  try {
    const grade = await MS_Grade.findByPk(id);
    if (!grade) {
      return res.status(404).json({ message: "Grade not found" });
    }
    grade.Grade_Name = Grade_Name;
    grade.userId = userId;
    await grade.save();
    res.json(grade);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteGrade = async (req, res) => {
  const { id } = req.params;
  try {
    const grade = await MS_Grade.findByPk(id);
    if (!grade) {
      return res.status(404).json({ message: "Grade not found" });
    }
    await grade.destroy();
    res.json({ message: "Grade deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getGrades,
  getGradeById,
  createGrade,
  updateGrade,
  deleteGrade,
};
