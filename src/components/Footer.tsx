import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        mt: 6,
        py: 2,
        textAlign: "center",
        bgcolor: "#000",
        borderTop: "1px solid #00FF00",
        position: "fixed",
        bottom: 0,
        width: "100%",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "#00FF00",
          fontFamily: "Fira Code",
        }}
      >
        © {new Date().getFullYear()} HackLab — {t("footerText")}
      </Typography>
    </Box>
  );
};

export default Footer;
