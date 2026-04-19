const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../frontend")));

let connectionPromise;

const connectDB = () => {
    if (!process.env.MONGO_URL) {
        throw new Error("MONGO_URL environment variable is required");
    }

    if (mongoose.connection.readyState === 1) {
        return Promise.resolve();
    }

    if (!connectionPromise) {
        connectionPromise = mongoose
            .connect(process.env.MONGO_URL)
            .then(() => console.log("DB connected"))
            .catch((err) => {
                connectionPromise = null;
                throw err;
            });
    }

    return connectionPromise;
};

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("Database connection failed:", err.message);
        res.status(500).json({ message: "Database connection failed" });
    }
});

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

if (require.main === module) {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server started on port: ${PORT}`);
    });
}

module.exports = app;
