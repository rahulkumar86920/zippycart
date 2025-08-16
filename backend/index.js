import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import helmet, { crossOriginResourcePolicy } from "helmet";
import morgan from "morgan";

// configuration part
const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);

app.use(express.json());
app.use(cookieParser);
app.use(morgan);
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// port number where our server is goint to run
const PORT = 8080 || process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port number ${PORT}`);
});
