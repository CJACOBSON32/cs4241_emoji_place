import React, { useState, useEffect } from "react";
import { Pixel } from "./Pixel";
import { Box } from "@mui/system";
import { ICell } from "../../../server/DB_Schema/cellSchema.js";

export type GridProps = {
  grid: string[];
  size: number;
  activeEmoji: string;
  setActiveElement: Function;
};

function Grid({ grid, size, activeEmoji, setActiveElement }: GridProps) {
  const [render, rerender] = useState(true);
  const [board, setBoard] = useState<ICell[]>();

  useEffect(() => {
    (async function () {
      const response: Response = await fetch("/grid");
      const res = await response.json();

      setBoard(res.grid);
      rerender(!render);
    })();
  }, []);

  return (
    <React.Fragment>
      {render
        ? null
        : board!.map((e: any, i: number) => {
            console.log(e!.emoji);
            return (
              <Pixel
                key={i}
                index={i}
                initEmoji={e!.emoji}
                size={size}
                setActiveElement={setActiveElement}
              ></Pixel>
            );
          })}
    </React.Fragment>
  );
}

export const GridMemo = React.memo(Grid);
