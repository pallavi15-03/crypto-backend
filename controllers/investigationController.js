const Investigation = require("../models/Investigation");
const Case = require("../models/Case");

// Create Investigation
const createInvestigation = async (req, res) => {
  try {
    const {
      caseId,
      walletAddress,
    } = req.body;

    if (!caseId || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: "Case ID and wallet address are required",
      });
    }

    const caseData = await Case.findOne({
      _id: caseId,
      createdBy: req.user.userId,
    });

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    const investigation = await Investigation.create({
      caseId,
      walletAddress,
    });

    res.status(201).json({
      success: true,
      message: "Investigation created successfully",
      investigation,
    });
  } catch (error) {
    console.error("Create investigation error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create investigation",
    });
  }
};

// Get Investigation by ID
const getInvestigationById = async (req, res) => {
  try {
    const investigation = await Investigation.findById(
      req.params.id
    ).populate("caseId");

    if (!investigation) {
      return res.status(404).json({
        success: false,
        message: "Investigation not found",
      });
    }

    const caseData = await Case.findOne({
      _id: investigation.caseId._id,
      createdBy: req.user.userId,
    });

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: "Investigation not found",
      });
    }

    res.json({
      success: true,
      investigation,
    });
  } catch (error) {
    console.error("Get investigation error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch investigation",
    });
  }
};

// Update Investigation
const updateInvestigation = async (req, res) => {
  try {
    const {
      riskScore,
      riskLevel,
      suspiciousPatterns,
      transactionsAnalyzed,
      investigationStatus,
      findings,
      aiReport,
    } = req.body;

    const investigation = await Investigation.findById(
      req.params.id
    );

    if (!investigation) {
      return res.status(404).json({
        success: false,
        message: "Investigation not found",
      });
    }

    const caseData = await Case.findOne({
      _id: investigation.caseId,
      createdBy: req.user.userId,
    });

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: "Investigation not found",
      });
    }

    const updatedInvestigation = await Investigation.findByIdAndUpdate(
      req.params.id,
      {
        riskScore,
        riskLevel,
        suspiciousPatterns,
        transactionsAnalyzed,
        investigationStatus,
        findings,
        aiReport,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      message: "Investigation updated successfully",
      investigation: updatedInvestigation,
    });
  } catch (error) {
    console.error("Update investigation error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update investigation",
    });
  }
};

module.exports = {
  createInvestigation,
  getInvestigationById,
  updateInvestigation,
};