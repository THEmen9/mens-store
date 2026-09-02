import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running",
  });
});

export default app;