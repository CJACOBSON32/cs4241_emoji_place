import "express-session"
import mongoose from "mongoose"

declare module "express-session" {
    interface SessionData {
      user:{
        _id:mongoose.Types.ObjectId,
        github_id:string
      }
    }
  }