import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import messageRoute from "./routes/message.js";

import connectDB from "./config/database.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/api/messages", messageRoute);

connectDB().then(() => {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
});

export default app;
