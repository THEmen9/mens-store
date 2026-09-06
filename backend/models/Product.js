import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Basic product information
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 5000,  
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
      min: 0.01,
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
    images: {
      type: [
      {
        url: {
          type: String,
          required: true,
          trim: true,
        },

        publicId: {
          type: String,
          trim: true,
        },

        alt: {
          type: String,
          required: true,
          trim: true,
          maxlength: 150,
        },

        position: {
          type: Number,
          required: true,
          min: 0,
          validate: {
          validator: Number.isInteger,
          message: "Position must be a whole number",
        },
        },
      },
    ],
     required: true,
     validate: {
        validator: (images) => images.length > 0,
        message: "At least one product image is required",
      },
    },

    // Product variants and inventory
    variants: {
      type: [
      {
        sku: {
          type: String,
          required: true,
          trim: true,
          uppercase: true,
          unique: true,
          index: true,
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
     required: true,
     validate: {
      validator: (variants) => variants.length > 0,
      message: "At least one product variant is required",
    },
},

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
        maxlength: 60,
      },

      description: {
        type: String,
        trim: true,
        maxlength: 160,
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