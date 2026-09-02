import express from "express";

const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});