import * as mongoose from "mongoose";
const Cell = new mongoose.Schema({
    index: { type: Number, required: true },
    emoji: { type: String, required: true, default: " " },
    timeStamp: { type: Date, required: true, default: Date.now() },
    user: { type: mongoose.Types.ObjectId, default: null }
});
export default mongoose.model('Cells', Cell, 'cells');
