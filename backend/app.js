import express from "express";
import cors from "cors";

import productRoutes from "./routes/product.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/order.routes.js"


const app = express();

app.use(cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());


app.get("/", (req, res) => {
  res.json({
    message: "Backend is running",
  });
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes)
// Error handling middleware
app.use(errorHandler);

export default app;