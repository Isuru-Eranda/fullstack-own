const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const connectDB = require("./config/db");

// Import routes - KEEP BOTH
const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");
const showtimeRoutes = require("./routes/showtimeRoutes");

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: ["https://enimate.netlify.app", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials: true,
    methods: ["GET", "POST"]
  }
});

// Make io accessible to routes
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow cookies
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Parse cookies

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Routes - KEEP BOTH
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/showtimes", showtimeRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5008;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});