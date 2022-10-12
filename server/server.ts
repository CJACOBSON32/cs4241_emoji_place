import express, { Request, Response } from "express";
import Cell, { ICell } from "./DB_Schema/cellSchema.js";
import Users, { IUser } from "./DB_Schema/userSchema.js";
import mongoose, { Collection } from "mongoose";
import * as dotenv from "dotenv";
import session from "express-session";
import {router as authRouter, checkAuthentication} from "./Routes/auth.js"
import {router as gridRouter} from './Routes/gridRouter.js'
dotenv.config({ path: "../.env" });

const port = "3000";
// Setup static express server
const app = express();

app.use(express.static("build"));

const listenPort = process.env.PORT || port;
app.listen(listenPort);
console.log(`Listening on port ${listenPort}`);

//configure server to use express-session
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    name: "session",
    secret: "catSuperSecret",
    cookie: {
      secure: false,
      maxAge: 3 * 60 * 60 * 1000,
    },
  })
);

//Setup mongoDB connection
const mongoURI =
  "mongodb+srv://" +
  process.env.MONGODB_USER +
  ":" +
  process.env.MONGODB_PASS +
  "@" +
  process.env.MONGODB_HOST;
//connect to server
mongoose.connect(mongoURI);
const connection = mongoose.connection;

//verify conenction
connection.once("open", async () => {
  console.log("DB Connected");
});



/* Routing */
app.use("/login", authRouter);
app.use("/logout", (req:Request, res:Response, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

app.use(["/", "/load"], checkAuthentication, async (req, res) => {
    const data = await Users.findOne({ github_id: req.session.user?.github_id });
    res.send(data?.timeOfLastEdit)

});

app.use("/updateCell", checkAuthentication, gridRouter);
app.use("/cell", checkAuthentication, gridRouter);
app.use("/grid", checkAuthentication,gridRouter);