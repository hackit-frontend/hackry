import React from "react";
import { Box } from "@mui/material";
import Profile from "./Profile";
import Progress from "./Progress";

const Dashboard: React.FC = () => {
  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: { xs: "column", md: "row" }, 
        gap: 4, 
      }}
    >
      <Box sx={{ flex: 1, minWidth: 300 }}>
        <Profile />
      </Box>
      <Box sx={{ flex: 1, minWidth: 300 }}>
        <Progress />
      </Box>
    </Box>
  );
};

export default Dashboard;
