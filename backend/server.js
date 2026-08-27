require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const pondRoutes = require("./routes/pondRoutes");
const restorationRoutes = require("./routes/restorationRoutes");
const waterQualityRoutes = require("./routes/waterQualityRoutes");
const citizenReportRoutes = require("./routes/citizenReportRoutes");

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "Pond Restoration Dashboard API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/ponds", pondRoutes);
app.use("/api/restoration-logs", restorationRoutes);
app.use("/api/water-quality", waterQualityRoutes);
app.use("/api/citizen-reports", citizenReportRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
