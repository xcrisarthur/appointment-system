const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors({
  origin: "*",  // alamat frontend
  credentials: true                 // jika pakai cookie/session
}));

// Middleware untuk parsing body
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

// Middleware Auth
const auth = require("./middleware/authMiddleware");

// Routes
app.use("/api/auth", require("./routes/authRoutes")); // Login tidak pakai auth
app.use("/users", auth, require("./routes/userRoutes")); // Proteksi pakai JWT
app.use("/appointments", auth, require("./routes/appointmentRoutes"));
app.use("/api/participants", auth, require("./routes/appointmentParticipantRoutes"));

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
