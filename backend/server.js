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
const analyticsRoutes = require("./routes/analyticsRoutes");
const workerRoutes = require("./routes/workerRoutes");

connectDB();

const app = express();

const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"].filter(Boolean);
app.use(cors({ origin: allowedOrigins }));
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
app.use("/api/analytics", analyticsRoutes);

app.use("/api/workers", workerRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
