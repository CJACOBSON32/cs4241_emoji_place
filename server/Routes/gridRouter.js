import express from "express";
import Cell from "../DB_Schema/cellSchema.js";
//Server scoped arrays
const GRIDSIZE = 50 * 50;
const grid = Array(GRIDSIZE);
/**
 * Handles the routing for cell updates and requests
 */
const router = express.Router();
router.get("/grid", (req, res) => {
    if (grid[0] === undefined) {
        populateArray();
    }
});
async function populateArray() {
    await Cell.find({}, (error, docs) => {
        //if there are not the right number of cells in the DB
        if (docs.length < GRIDSIZE) {
            //add the missing cells to the server array
            for (var i = docs.length; i < GRIDSIZE; i++) {
                grid[i] = new Cell({ index: i });
            }
            //overwrite the grid collection in the DB with the server representation
            Cell.deleteMany({});
            Cell.insertMany(grid).then(() => {
                console.log("a ton of new entries in the DB");
            });
            //if there are the correct number of entries in the database
        }
        else {
            //read in the cells from the database into the server's grid
            for (const i in docs) {
                grid[i] = docs[i];
            }
        }
    }).clone(); //cloning makes the query repeatable
}
router.post("/updateCell", (req, res) => {
    req.on("data", (data) => {
        data = JSON.parse(data);
        grid[data.index].emoji = data.emoji;
        grid[data.index].timeStamp = new Date(Date.now());
        grid[data.index].user = req.session.user._id;
        updateCell(new Cell({ ...grid[data.index] }));
    });
});
router.get("/cell", (req, res) => {
    req.on("data", (data) => {
        requestCell(data.index).then((cell) => {
            res.send(cell);
        });
    });
});
async function updateCell(cellData) {
    const updatedCell = await Cell.findOneAndUpdate({ index: cellData.index }, {
        emoji: cellData.emoji,
        user: cellData.user,
        timestamp: cellData.timeStamp,
    });
    console.log(updatedCell);
    return updatedCell;
}
async function requestCell(cellIndex) {
    return await Cell.find({ index: cellIndex }).exec();
}
export { router };
