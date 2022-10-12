import * as mongoose from "mongoose";
const User = new mongoose.Schema({
    username: { type: String, required: true },
    github_id: { type: String, required: true, default: "null" },
    timeOfLastEdit: { type: Date, required: true, default: Date.now() },
    picture: { type: String, default: null }
});
export default mongoose.model('Users', User, 'users');
