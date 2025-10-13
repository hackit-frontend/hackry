import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0a0a0a",
      paper: "#121212",
    },
    primary: {
      main: "#00ff88",
    },
    text: {
      primary: "#00ff88",
      secondary: "#a9a9a9",
    },
  },
  typography: {
    fontFamily: "Fira Code, monospace",
  },
});

export default theme;
