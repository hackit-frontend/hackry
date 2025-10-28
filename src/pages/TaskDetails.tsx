import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

interface Task {
  id: string;
  title: string;
  description: string;
}

const TaskDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [task, setTask] = useState<Task | null>(
    (location.state as { task?: Task })?.task || null
  );
  const [sshKey, setSshKey] = useState<string>("");

  // ✅ Fallback: If user refreshed and no state is available
  useEffect(() => {
    if (!task && id) {
      fetch(`https://backend.hacklab.uz/tasks/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Task not found");
          return res.json();
        })
        .then((data) => setTask(data))
        .catch((err) => console.error(err));
    }
  }, [id, task]);

  const handleStart = () => {
    fetch(`https://backend.hacklab.uz/tasks/${id}/start`)
      .then((res) => res.json())
      .then((data) => setSshKey(data.sshKey))
      .catch(console.error);
  };

  if (!task) {
    return (
      <Typography sx={{ p: 4, fontFamily: "Fira Code", color: "#888" }}>
        {t("loading")}
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        sx={{ color: "#00ff88", fontFamily: "Fira Code", mb: 2 }}
      >
        {task.title}
      </Typography>

      <Typography
        sx={{ color: "#ccc", fontFamily: "Fira Code", mb: 3, whiteSpace: "pre-line" }}
      >
        {task.description}
      </Typography>

      <Button
        onClick={handleStart}
        variant="outlined"
        sx={{
          color: "#00ff88",
          borderColor: "#00ff88",
          fontFamily: "Fira Code",
          "&:hover": { borderColor: "#00ffaa", color: "#00ffaa" },
        }}
      >
        {t("taskDetails.startTask")}
      </Button>

      {sshKey && (
        <Box sx={{ mt: 3 }}>
          <Typography
            sx={{ color: "#00ffaa", fontFamily: "Fira Code", mb: 1 }}
          >
            {t("taskDetails.sshKey")}:
          </Typography>

          <Box
            sx={{
              bgcolor: "#111",
              p: 2,
              borderRadius: 2,
              color: "#00ff88",
              fontFamily: "Fira Code",
              fontSize: "0.9rem",
              overflowX: "auto",
            }}
          >
            {sshKey}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TaskDetails;
