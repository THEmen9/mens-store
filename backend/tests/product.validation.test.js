import { describe, test, expect } from "vitest"
import Product from "../models/Product.js"

const validProduct = {
  name: "Classic Cotton T-Shirt",
  description: "A comfortable cotton t-shirt.",
  category: "T-Shirts",
  price: 999,

  images: [
    {
      url: "https://example.com/image.jpg",
      publicId: "products/classic-tshirt",
      alt: "Classic cotton t-shirt",
      position: 0,
    },
  ],

  variants: [
    {
      sku: "TS-BLK-M",
      color: "Black",
      size: "M",
      stock: 10,
    },
  ],

  seo: {
    slug: "classic-cotton-t-shirt",
  },
}

describe("Product Model Validation", () => {
  test("should validate a valid product", async () => {
    const product = new Product(validProduct)

    await expect(product.validate()).resolves.toBeUndefined()
  })

  test("should reject missing price", async () => {
    const product = new Product({
      ...validProduct,
      price: undefined,
    })

    await expect(product.validate()).rejects.toThrow()
  })

  test("should reject negative stock", async () => {
    const product = new Product({
      ...validProduct,
      variants: [
        {
          sku: "TS-BLK-M",
          color: "Black",
          size: "M",
          stock: -1,
        },
      ],
    })

    await expect(product.validate()).rejects.toThrow()
  })

  test("should reject decimal stock", async () => {
    const product = new Product({
      ...validProduct,
      variants: [
        {
          sku: "TS-BLK-M",
          color: "Black",
          size: "M",
          stock: 2.5,
        },
      ],
    })

    await expect(product.validate()).rejects.toThrow()
  })

  test("should reject invalid compareAtPrice", async () => {
    const product = new Product({
      ...validProduct,
      price: 999,
      compareAtPrice: 799,
    })

    await expect(product.validate()).rejects.toThrow()
  })

  test("should reject invalid status", async () => {
    const product = new Product({
      ...validProduct,
      status: "something-invalid",
    })

    await expect(product.validate()).rejects.toThrow()
  })
})