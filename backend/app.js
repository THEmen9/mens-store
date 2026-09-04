import express from "express";
import productRoutes from "./routes/product.routes.js";

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running",
  });
});

app.use("/api/products", productRoutes);

export default app;