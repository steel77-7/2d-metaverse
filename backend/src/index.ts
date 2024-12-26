import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";


import adminRoutes from "./routes/admin.routes"

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes"
config();
//adding user object to the req 
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
const app = express();
const PORT = process.env.PORT;
const corsOptions = {
  origin: `${process.env.FRONTEND_URL}`,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/v1", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v2/admin", adminRoutes);



app.listen(PORT, () => {
  console.log("listening at port: ", PORT);
});
