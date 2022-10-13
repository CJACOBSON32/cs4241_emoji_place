import express, { Request, Response } from "express";
import passport from "passport";
import * as dotenv from "dotenv";
import { Strategy as GithubStrategy } from "passport-github2";
import User, { IUser } from "../DB_Schema/userSchema.js";

dotenv.config({ path: ".env" });
const router = express.Router();

passport.serializeUser((user: any, cb: Function) => {
  cb(null, user.github_id);
});

passport.deserializeUser((id: string, cb) => {
  cb(null, id);
});

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: "http://157.230.2.81:3000/login/auth/github/callback",
    },
    function (accessToken: any, refreshToken: any, profile: any, cb: Function) {
      User.findOne({ github_id: profile.id }, (err: any, user: IUser) => {
        if (err) {
          return cb(err);
        }

        if (user) {
          return cb(null, user);
        } else {
          const newUser = new User();

          newUser.github_id = profile.id;
          newUser.picture = "https://github.com/" + profile.username + ".png";

          newUser.save((err) => {
            return err ? cb(err) : cb(null, newUser);
          });
        }
      });
    }
  )
);

router.get("/auth/github", passport.authenticate("github"));
router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    failWithError: true,
  }),
  (req, res) => {
    res.redirect("/");
  }
);

router.use("/", express.static("build"));

const checkAuthentication = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    res.send({ authenticated: true });
  } else {
    console.log("here");
    res.send({ authenticated: false });
  }
};

export { router, checkAuthentication };
