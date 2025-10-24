import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import TaskCard from "../components/TaskCard";

interface Task {
  id: string;
  title: string;
  difficulty: string;
  description: string;
}

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://backend.hacklab.uz/tasks")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Internal Server Error");
        }
        return res.json();
      })
      .then((data) => {
        setTasks(data);
        setFilteredTasks(data);
      })
      .catch(() => {
        setError(t("errorLoadingTasks"));
      });
  }, [t]);

  // Filter logic
  useEffect(() => {
    let filtered = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.difficulty.toLowerCase().includes(search.toLowerCase())
    );

    if (difficultyFilter !== "All") {
      filtered = filtered.filter(
        (task) =>
          task.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
      );
    }

    setFilteredTasks(filtered);
  }, [search, tasks, difficultyFilter]);

  return (
    <Box sx={{ p: 4 }}>
      {/* Header with Search and Filter */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4">{t("title")}</Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Difficulty Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{t("difficulty")}</InputLabel>
            <Select
              value={difficultyFilter}
              label={t("difficulty")}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              sx={{
                color: "#00ff88",
                fontFamily: "Fira Code",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "#00ff88",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#00ffaa",
                },
              }}
            >
              <MenuItem value="All">{t("all")}</MenuItem>
              <MenuItem value="Easy">{t("easy")}</MenuItem>
              <MenuItem value="Medium">{t("medium")}</MenuItem>
              <MenuItem value="Hard">{t("hard")}</MenuItem>
            </Select>
          </FormControl>

          {/* Search Field */}
          <TextField
            placeholder={t("searchPlaceholder")}
            variant="outlined"
            size="small"
            sx={{
              width: { xs: "100%", sm: "300px" },
              input: { color: "#00ff88", fontFamily: "Fira Code" },
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            fontFamily: "Fira Code",
            backgroundColor: "#2b0000",
            color: "#ff8888",
            position: "absolute",
            bottom: "60px",
          }}
        >
          {error}
        </Alert>
      )}

      {/* Tasks Grid */}
      {!error && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 2,
          }}
        >
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Home;
