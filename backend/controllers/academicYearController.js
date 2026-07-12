const AcademicYear = require("../models/AcademicYear");

const getAcademicYears = async (req, res, next) => {
  try {
    const academicYears = await AcademicYear.find().sort({
      startDate: -1,
    });

    res.status(200).json({
      academicYears,
    });
  } catch (error) {
    next(error);
  }
};

const createAcademicYear = async (req, res, next) => {
  try {
    const { name, startDate, endDate, active = false } = req.body;

    if (!name || !startDate || !endDate) {
      res.status(400);
      throw new Error("Missing required fields.");
    }

    if (active) {
      await AcademicYear.updateMany(
        {
          active: true,
        },
        {
          $set: {
            active: false,
          },
        }
      );
    }

    const academicYear = await AcademicYear.create({
      name,
      startDate,
      endDate,
      active,
    });

    res.status(201).json({
      message: "Academic year created successfully.",
      academicYear,
    });
  } catch (error) {
    next(error);
  }
};

const updateAcademicYear = async (req, res, next) => {
  try {
    const academicYear = await AcademicYear.findById(req.params.id);

    if (!academicYear) {
      res.status(404);
      throw new Error("Academic year not found.");
    }

    const { name, startDate, endDate, active } = req.body;

    if (name !== undefined) {
      academicYear.name = name;
    }

    if (startDate !== undefined) {
      academicYear.startDate = startDate;
    }

    if (endDate !== undefined) {
      academicYear.endDate = endDate;
    }

    if (active !== undefined) {
      academicYear.active = active;
    }

    if (active) {
      await AcademicYear.updateMany(
        {
          _id: {
            $ne: academicYear._id,
          },
        },
        {
          $set: {
            active: false,
          },
        }
      );
    }

    await academicYear.save();

    res.status(200).json({
      message: "Academic year updated successfully.",
      academicYear,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAcademicYear = async (req, res, next) => {
  try {
    const academicYear = await AcademicYear.findById(req.params.id);

    if (!academicYear) {
      res.status(404);
      throw new Error("Academic year not found.");
    }

    await academicYear.deleteOne();

    res.status(200).json({
      message: "Academic year deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const setActiveAcademicYear = async (req, res, next) => {
  try {
    const academicYear = await AcademicYear.findById(req.params.id);

    if (!academicYear) {
      res.status(404);
      throw new Error("Academic year not found.");
    }

    await AcademicYear.updateMany(
      {
        _id: {
          $ne: academicYear._id,
        },
      },
      {
        $set: {
          active: false,
        },
      }
    );

    academicYear.active = true;
    await academicYear.save();

    res.status(200).json({
      message: "Academic year activated successfully.",
      academicYear,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
  setActiveAcademicYear,
};
