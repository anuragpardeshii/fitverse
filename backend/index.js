const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth"); // OAuth routes
require("./config/passport"); // Passport config
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionsRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const challengeRoutes = require("./routes/challengeRoutes");
const fitnessRoutes = require("./routes/fitnessRoutes");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const morgan = require("morgan");

connectDB();

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(morgan("dev"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/fitness", fitnessRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
