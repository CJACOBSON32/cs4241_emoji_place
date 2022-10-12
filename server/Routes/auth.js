import express from "express";
import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import User from "../DB_Schema/userSchema.js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });
const router = express.Router();
passport.serializeUser((user, cb) => {
    cb(null, user.github_id);
});
passport.deserializeUser((id, cb) => {
    cb(null, id);
});
console.log(process.env.GITHUB_CLIENT_SECRET);
passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
}, function (accessToken, refreshToken, profile, cb) {
    User.findOne({ github_id: profile.id }, (err, user) => {
        if (err) {
            return cb(err);
        }
        if (user) {
            return cb(null, user);
        }
        else {
            const newUser = new User();
            newUser.github_id = profile.id;
            newUser.username = profile.username;
            newUser.picture = "https://github.com/" + profile.username + ".png";
            newUser.save((err) => {
                return err ? cb(err) : cb(null, newUser);
            });
        }
    });
}));
router.get("/auth/github", passport.authenticate("github"));
router.get("/auth/github/callback", passport.authenticate("github", {
    failureRedirect: "/login",
    failWithError: true,
}), (req, res) => {
    res.redirect("/");
});
// TODO: update to correct view
router.use("/", express.static("build"));

router.get("/login", (req, res)=>{
    res.send("hello")
})

const checkAuthentication = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};
export { router, checkAuthentication };
