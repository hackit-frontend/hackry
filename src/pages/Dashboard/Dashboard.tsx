import React from "react";
import { Box } from "@mui/material";
import Profile from "./Profile";
import Progress from "./Progress";

interface DashboardProps {
  sshKey?: string | null;
  isAuthenticated: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ sshKey, isAuthenticated }) => {
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
        <Profile sshKey={sshKey} isAuthenticated={isAuthenticated} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 300 }}>
        <Progress isAuthenticated={isAuthenticated} />
      </Box>
    </Box>
  );
};

export default Dashboard;
