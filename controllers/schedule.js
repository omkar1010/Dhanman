import TR_Schedule from "../models/TR_Schedule.js";
import TR_Product_Registration from "../models/TR_Product_Registration.js";

export const getSchedules = async (req, res) => {
  try {
    const schedules = await TR_Schedule.findAll({
      attributes: ["id", "compId", "prodId", "Schedule_Date", "Shedule_Quantity", "userId"],
      include: [
        {
          model: TR_Product_Registration,
          attributes: [],
        },
      ],
    });
    res.status(200).json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const getScheduleById = async (req, res) => {
  const { id } = req.params;
  try {
    const schedule = await TR_Schedule.findOne({
      where: { id },
      attributes: ["id", "compId", "prodId", "Schedule_Date", "Shedule_Quantity", "userId"],
      include: [
        {
          model: TR_Product_Registration,
          attributes: [],
        },
      ],
    });
    if (!schedule) return res.status(404).json({ msg: "Schedule not found" });
    res.status(200).json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const createSchedule = async (req, res) => {
  const { compId, prodId, Schedule_Date, Shedule_Quantity } = req.body;

  try {
    const productRegistration = await TR_Product_Registration.findOne({
      where: {
        compId: compId,
        prodId: prodId,
      },
    });

    if (!productRegistration) {
      return res.status(404).json({ msg: "Product Registration not found with the given compId and prodId" });
    }

    // Access the userId from the request object (assuming it's set by authentication middleware)
    const userId = req.user.id; // Modify this line based on how userId is stored in the request

    const schedule = await TR_Schedule.create({
      compId: compId,
      prodId: prodId,
      Schedule_Date,
      Shedule_Quantity,
      userId: userId, // Set the userId based on the authenticated user's role
    });

    res.status(201).json({ msg: "Schedule created successfully", schedule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const updateSchedule = async (req, res) => {
  const { compId, prodId, Schedule_Date, Shedule_Quantity } = req.body;
  try {
    const schedule = await TR_Schedule.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!schedule) return res.status(404).json({ msg: "Schedule not found" });

    // If you want to check if the selected compId and prodId exist in TR_Product_Registration table,
    // you can add that validation here before updating.

    // Access the userId from the request object (assuming it's set by authentication middleware)
    const userId = req.user.id; // Modify this line based on how userId is stored in the request

    await TR_Schedule.update(
      {
        compId: compId,
        prodId: prodId,
        Schedule_Date: Schedule_Date,
        Shedule_Quantity: Shedule_Quantity,
        userId: userId, // Set the userId based on the authenticated user's role
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({ msg: "Schedule updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const schedule = await TR_Schedule.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!schedule) return res.status(404).json({ msg: "Schedule not found" });

    await TR_Schedule.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({ msg: "Schedule deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};