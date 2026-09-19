const Case = require("../models/Case");

// Create Case
const createCase = async (req, res) => {
  try {
    const { title, description, walletAddress, priority } = req.body;

    if (!title || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: "Title and wallet address are required",
      });
    }

    const newCase = await Case.create({
      title,
      description,
      walletAddress,
      priority,
      createdBy: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Case created successfully",
      case: newCase,
    });
  } catch (error) {
    console.error("Create case error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create case",
    });
  }
};

// Get All Cases
const getCases = async (req, res) => {
  try {
    const cases = await Case.find({
      createdBy: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: cases.length,
      cases,
    });
  } catch (error) {
    console.error("Get cases error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cases",
    });
  }
};

// Get Single Case
const getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findOne({
      _id: req.params.id,
      createdBy: req.user.userId,
    });

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    res.json({
      success: true,
      case: caseData,
    });
  } catch (error) {
    console.error("Get case error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch case",
    });
  }
};

// Update Case
const updateCase = async (req, res) => {
  try {
    const { title, description, walletAddress, status, priority } = req.body;

    const updatedCase = await Case.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user.userId,
      },
      {
        title,
        description,
        walletAddress,
        status,
        priority,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCase) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    res.json({
      success: true,
      message: "Case updated successfully",
      case: updatedCase,
    });
  } catch (error) {
    console.error("Update case error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update case",
    });
  }
};

// Delete Case
const deleteCase = async (req, res) => {
  try {
    const deletedCase = await Case.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.userId,
    });

    if (!deletedCase) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    res.json({
      success: true,
      message: "Case deleted successfully",
    });
  } catch (error) {
    console.error("Delete case error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete case",
    });
  }
};

module.exports = {
  createCase,
  getCases,
  getCaseById,
  updateCase,
  deleteCase,
};