import express, { Request, Response, Router } from "express";
import Cell, { ICell } from "../DB_Schema/cellSchema.js";

//Server scoped arrays
const GRID_SIZE = 50 * 50;
const grid = Array<ICell>(GRID_SIZE);

/**
 * Handles the routing for cell updates and requests
 */
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  if (grid[0] === undefined) {
    populateArray();
  }
  res.send("hello");
});

async function populateArray() {
  await Cell.find({}, (error: any, docs: ICell[]) => {
    //if there are not the right number of cells in the DB
    if (docs.length < GRID_SIZE) {
      //add the missing cells to the server array
      for (var i = docs.length; i < GRID_SIZE; i++) {
        grid[i] = new Cell({ index: i });
      }
      //overwrite the grid collection in the DB with the server representation
      Cell.deleteMany({});
      Cell.insertMany(grid).then(() => {
        console.log("a ton of new entries in the DB");
      });
      //if there are the correct number of entries in the database
    } else {
      //read in the cells from the database into the server's grid
      for (const i in docs) {
        grid[i] = docs[i];
      }
    }
  }).clone(); //cloning makes the query repeatable
}

router.post("/updateCell", (req: Request, res: Response) => {
  req.on("data", (data) => {
    data = JSON.parse(data);
    grid[data.index].emoji = data.emoji;
    grid[data.index].timeStamp = new Date(Date.now());
    grid[data.index].user = "";
    updateCell(new Cell({ ...grid[data.index] }));
  });
});

router.get("/cell", (req: Request, res: Response) => {
  req.on("data", (data) => {
    requestCell(data.index).then((cell) => {
      res.send(cell);
    });
  });
});

async function updateCell(cellData: ICell) {
  const updatedCell = await Cell.findOneAndUpdate(
    { index: cellData.index },
    {
      emoji: cellData.emoji,
      user: cellData.user,
      timestamp: cellData.timeStamp,
    }
  );
  console.log(updatedCell);
  return updatedCell;
}

async function requestCell(cellIndex: number) {
  return await Cell.find({ index: cellIndex }).exec();
}

export { router };
