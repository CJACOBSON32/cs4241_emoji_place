import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import { router as authRouter, checkAuthentication } from "./Routes/auth.js";
import { router as gridRouter } from './Routes/gridRouter.js';
dotenv.config({ path: ".env" });
const port = "3000";
// Setup static express server
const app = express();
//app.use(express.static("build"));
const listenPort = process.env.PORT || port;
app.listen(listenPort);
console.log(`Listening on port ${listenPort}`);
//configure server to use express-session
app.use(session({
    resave: false,
    saveUninitialized: true,
    name: "session",
    secret: "catSuperSecret",
    cookie: {
        secure: false,
        maxAge: 3 * 60 * 60 * 1000,
    },
}));
app.use(passport.initialize());
app.use(passport.session());
//Setup mongoDB connection
const mongoURI = "mongodb+srv://" +
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
app.use("/updateCell", gridRouter);
app.use("/cell", gridRouter);
app.use("/grid", gridRouter);
app.use("/login", authRouter);
app.use("/logout", (req, res, next) => {
    req.logOut(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/login");
    });
});
app.use(["/", "/load"], checkAuthentication, async (req, res) => {
    res.redirect('/grid');
    // const data = await Users.findOne({ github_id: req.session.user?.github_id });
    // res.send(data?.timeOfLastEdit)
});
