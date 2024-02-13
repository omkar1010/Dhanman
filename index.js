import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import ScheduleRoute from "./routes/ScheduleRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import UserRoute from "./routes/UserRoute.js";
import CustomerRoute from "./routes/CustomerRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import HeatRoute from "./routes/HeatRoute.js";
import RejectionRoute from "./routes/RejectionRoute.js";
import DispatchRoute from "./routes/DispatchRoute.js";
import ProductionRoute from "./routes/ProductionRoute.js";
import GradeRoute from "./routes/GradeRoute.js";
import R2rejection from "./routes/R2_RejectionRoute.js";
import R3rejection from "./routes/R3_RejectionRoute.js"


dotenv.config();

const app = express();

// (async () => {
//   await db.sync();
// })();

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(UserRoute);
app.use(CustomerRoute);
app.use(ProductRoute);
app.use(ScheduleRoute);
app.use(AuthRoute);
app.use(HeatRoute);
app.use(RejectionRoute);
app.use(DispatchRoute);
app.use(ProductionRoute);
app.use(GradeRoute);
app.use(R2rejection);
app.use(R3rejection)
app.listen(process.env.APP_PORT, () => {
  console.log("Server up and running....");
});
