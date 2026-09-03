import Product from "../models/Product.js";

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
};

const product = new Product(validProduct);

try {
  await product.validate();
  console.log("Product validation passed");
} catch (error) {
  console.error("Product validation failed:", error.message);
  process.exitCode = 1;
}

async function expectValidationFailure(data, testName) {
  const product = new Product({
    ...validProduct,
    ...data,
  });

  try {
    await product.validate();
    console.error(`❌ ${testName}: validation unexpectedly passed`);
    process.exitCode = 1;
  } catch {
    console.log(`✅ ${testName}: validation failed as expected`);
  }
}
await expectValidationFailure(
  { price: undefined },
  "Missing price"
);

await expectValidationFailure(
  {
    variants: [
      {
        sku: "TS-BLK-M",
        color: "Black",
        size: "M",
        stock: -1,
      },
    ],
  },
  "Negative stock"
);

await expectValidationFailure(
  {
    variants: [
      {
        sku: "TS-BLK-M",
        color: "Black",
        size: "M",
        stock: 2.5,
      },
    ],
  },
  "Decimal stock"
);

await expectValidationFailure(
  { price: 999, compareAtPrice: 799 },
  "Invalid compareAtPrice"
);

await expectValidationFailure(
  { status: "something-invalid" },
  "Invalid status"
);