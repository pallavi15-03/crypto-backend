const express = require("express");

const {
  createCase,
  getCases,
  getCaseById,
  updateCase,
  deleteCase,
} = require("../controllers/caseController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new case
router.post("/", protect, createCase);

// Get all cases of logged-in user
router.get("/", protect, getCases);

// Get single case
router.get("/:id", protect, getCaseById);
router.put("/:id", protect, updateCase);
router.delete("/:id", protect, deleteCase);

module.exports = router;