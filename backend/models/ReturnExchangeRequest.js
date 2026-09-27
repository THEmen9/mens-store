import mongoose from "mongoose"

const proofSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
  },
  {
    _id: false,
  }
)

const returnExchangeRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    orderItem: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    type: {
      type: String,
      enum: ["return", "exchange"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be a whole number",
      },
    },

    reason: {
      type: String,
      enum: [
        "size_issue",
        "wrong_product",
        "damaged_product",
        "quality_issue",
        "changed_mind",
        "other",
      ],
      required: true,
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    proof: {
      type: [proofSchema],
      default: [],
    },

    exchangeVariant: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "requested",
        "approved",
        "rejected",
        "pickup_pending",
        "picked_up",
        "received",
        "completed",
      ],
      default: "requested",
      index: true,
    },

    adminNote: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },

    approvedAt: {
      type: Date,
    },

    rejectedAt: {
      type: Date,
    },

    pickedUpAt: {
      type: Date,
    },

    receivedAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model(
  "ReturnExchangeRequest",
  returnExchangeRequestSchema
)