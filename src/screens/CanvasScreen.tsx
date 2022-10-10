import React from "react";
import { Header, Sidebar } from "../components";
import { Box } from "@mui/material";

export function CanvasScreen() {
  return (
    <Box sx={{ display: "flex" }}>
      <Header />
      <Sidebar />
    </Box>
  );
}