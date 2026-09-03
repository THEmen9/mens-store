import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Basic product information
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    subcategory: {
      type: String,
      trim: true,
    },

    // Pricing
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    compareAtPrice: {
      type: Number,
      min: 0,
      validate: {
        validator: function (value) {
            return value === undefined || value >= this.price;
        },
        message: "compareAtPrice must be greater than or equal to price",
      },
    },

    // Product images
    images: [
      {
        url: {
          type: String,
          required: true,
          trim: true,
        },

        publicId: {
          type: String,
          required: true,
          trim: true,
        },

        alt: {
          type: String,
          trim: true,
          maxlength: 150,
        },

        position: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    // Product variants and inventory
    variants: [
      {
        sku: {
          type: String,
          required: true,
          trim: true,
          uppercase: true,
        },

        color: {
          type: String,
          required: true,
          trim: true,
        },

        size: {
          type: String,
          required: true,
          trim: true,
        },

        stock: {
          type: Number,
          required: true,
          min: 0,
          default: 0,
          validate: {
            validator: Number.isInteger,
            message: "Stock must be a whole number",
            },
        },
      },
    ],

    // Product lifecycle and storefront visibility
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "draft",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    // SEO metadata and product URL
    seo: {
      title: {
        type: String,
        trim: true,
        maxlength: 160,
      },

      description: {
        type: String,
        trim: true,
        maxlength: 320,
      },

      slug: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);