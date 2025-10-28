import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Box } from "@mui/material";

interface Task {
  id: string;
  title: string;
  difficulty: string;
  description: string;
}

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // ✅ Pass task data to TaskDetails through navigation state
    navigate(`/tasks/${task.id}`, { state: { task } });
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        border: "1px solid #00ff88",
        backgroundColor: "#0a0a0a",
        "&:hover": {
          borderColor: "#00ffaa",
          transform: "scale(1.02)",
          transition: "0.2s ease",
        },
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{ color: "#00ff88", fontFamily: "Fira Code" }}
        >
          {task.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#00ffaa", fontFamily: "Fira Code", mt: 1 }}
        >
          {task.difficulty}
        </Typography>
        <Box
          sx={{
            color: "#ccc",
            fontFamily: "Fira Code",
            fontSize: "0.9rem",
            mt: 1,
          }}
        >
          {task.description.slice(0, 100)}...
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
