"use strict";
exports.__esModule = true;
exports.checkAuthentication = exports.router = void 0;
var express_1 = require("express");
var passport_1 = require("passport");
var passport_github2_1 = require("passport-github2");
var userSchema_js_1 = require("../DB_Schema/userSchema.js");
var dotenv = require("dotenv");
dotenv.config({ path: "../../.env" });
var router = express_1["default"].Router();
exports.router = router;
passport_1["default"].serializeUser(function (user, cb) {
    cb(null, user.github_id);
});
passport_1["default"].deserializeUser(function (id, cb) {
    cb(null, id);
});
passport_1["default"].use(new passport_github2_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
}, function (accessToken, refreshToken, profile, cb) {
    userSchema_js_1["default"].findOne({ github_id: profile.id }, function (err, user) {
        if (err) {
            return cb(err);
        }
        if (user) {
            return cb(null, user);
        }
        else {
            var newUser_1 = new userSchema_js_1["default"]();
            newUser_1.github_id = profile.id;
            newUser_1.username = profile.username;
            newUser_1.picture = "https://github.com/" + profile.username + ".png";
            newUser_1.save(function (err) {
                return err ? cb(err) : cb(null, newUser_1);
            });
        }
    });
}));
router.get("/auth/github", passport_1["default"].authenticate("github"));
router.get("/auth/github/callback", passport_1["default"].authenticate("github", {
    failureRedirect: "/login",
    failWithError: true
}), function (req, res) {
    res.redirect("/");
});
// TODO: update to correct view
router.use("/", express_1["default"].static("app/views/login"));
var checkAuthentication = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};
exports.checkAuthentication = checkAuthentication;
