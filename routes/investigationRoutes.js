const express = require("express");

const {
  createInvestigation,
  getInvestigationById,
  updateInvestigation,
} = require("../controllers/investigationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create investigation
router.post("/", protect, createInvestigation);

// Get investigation by ID
router.get("/:id", protect, getInvestigationById);

// Update investigation
router.put("/:id", protect, updateInvestigation);

module.exports = router;