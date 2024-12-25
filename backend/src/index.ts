import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes"
config();
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

app.use("/api/v1", userRoutes);
app.use("/api/v2/admin", adminRoutes);


app.listen(PORT, () => {
  console.log("listening at port: ", PORT);
});
