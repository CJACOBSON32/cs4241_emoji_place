import React, { useState, useRef } from "react";
import { Box } from "@mui/material";
import { Emoji } from "emoji-picker-react";
import { IndeterminateCheckBox } from "@mui/icons-material";

const container = {
  "&:hover": {
    border: "1px solid grey",
  },
};

export type PixelProps = {
  initEmoji: string;
  initUser: string;
  size: number;
  setActiveElement: Function;
  index: number;
};

export function Pixel({
  initEmoji,
  initUser,
  size,
  setActiveElement,
  index,
}: PixelProps) {
  const [emoji, setEmoji] = useState(initEmoji);
  const [user, setUser] = useState(initUser);

  function update(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    setActiveElement(event.currentTarget);
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      component="div"
      justifyContent="center"
      width={size}
      height={size}
      onClick={update}
      sx={container}
      id={`${index}`}
    >
      <Emoji unified={emoji} size={size * 0.8} />
    </Box>
  );
}
