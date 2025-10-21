import React from "react";
import { Box } from "@mui/material";
import Profile from "./Profile";
import Progress from "./Progress";

interface DashboardProps {
  sshKey?: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ sshKey }) => {
  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 4,
      }}
    >
      {/* Profile Section */}
      <Box sx={{ flex: 1, minWidth: 300 }}>
        <Profile sshKey={sshKey} />
      </Box>

      {/* Progress Section */}
      <Box sx={{ flex: 1, minWidth: 300 }}>
        <Progress />
      </Box>
    </Box>
  );
};

export default Dashboard;
