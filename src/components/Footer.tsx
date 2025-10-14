import React from "react";
import { Box, Typography } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        mt: 6,
        py: 2,
        textAlign: "center",
        bgcolor: "#000",
        borderTop: "1px solid #00ff88",
        position: "fixed",
        bottom: 0,
        width: "100%",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "#00ff88",
          fontFamily: "Fira Code",
        }}
      >
        © {new Date().getFullYear()} Hackry — Level up your hacking skills 
      </Typography>
    </Box>
  );
};

export default Footer;
