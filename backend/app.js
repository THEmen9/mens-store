import express from "express";
import productRoutes from "./routes/product.routes.js";
import errorHandler from "./middleware/error.middleware.js";


const app = express();

app.use(express.json());


app.get("/", (req, res) => {
  res.json({
    message: "Backend is running",
  });
});

app.use("/api/products", productRoutes);
// Error handling middleware
app.use(errorHandler);

export default app;