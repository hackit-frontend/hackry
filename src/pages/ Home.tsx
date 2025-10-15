import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Alert } from "@mui/material";
import TaskCard from "../components/TaskCard";

interface Task {
  id: string;
  title: string;
  difficulty: string;
  description: string;
}

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
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
        setError("Internal Server Error — Failed to load tasks");
      });
  }, []);

  useEffect(() => {
    const filtered = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.difficulty.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTasks(filtered);
  }, [search, tasks]);

  return (
    <Box sx={{ p: 4 }}>
      {/* Header with Search */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Available Tasks</Typography>

        <TextField
          placeholder="Search tasks..."
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
