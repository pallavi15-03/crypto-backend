const mongoose = require("mongoose");

const investigationSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },

    walletAddress: {
      type: String,
      required: true,
      trim: true,
    },

    riskScore: {
      type: Number,
      default: 0,
    },

    riskLevel: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },

    suspiciousPatterns: [
      {
        type: String,
      },
    ],

    transactionsAnalyzed: {
      type: Number,
      default: 0,
    },

    investigationStatus: {
      type: String,
      enum: ["pending", "running", "completed", "failed"],
      default: "pending",
    },

    findings: {
      type: String,
      trim: true,
    },

    aiReport: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Investigation", investigationSchema);