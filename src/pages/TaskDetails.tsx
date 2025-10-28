import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";

interface Task {
  id: string;
  title: string;
  description: string;
}

interface Props {
  taskId: string;
}

const TaskDetails: React.FC<Props> = ({ taskId }) => {
  const { t } = useTranslation();
  const [task, setTask] = useState<Task | null>(null);
  const [sshKey, setSshKey] = useState<string>("");

  useEffect(() => {
    fetch(`https://backend.hacklab.uz/tasks/${taskId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(setTask)
      .catch(console.error);
  }, [taskId]);

  const handleStart = () => {
    fetch(`https://backend.hacklab.uz/tasks/${taskId}/start`)
      .then((res) => res.json())
      .then((data) => setSshKey(data.sshKey))
      .catch(console.error);
  };

  if (!task)
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress sx={{ color: "#00ff88" }} />
        <Typography sx={{ mt: 2 }}>{t("loading")}</Typography>
      </Box>
    );

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {task.title}
      </Typography>
      <Typography sx={{ mb: 3, color: "#ccc" }}>{task.description}</Typography>

      <Button
        onClick={handleStart}
        variant="outlined"
        sx={{ color: "#00ff88", borderColor: "#00ff88" }}
      >
        {t("taskDetails.startTask")}
      </Button>

      {sshKey && (
        <Box sx={{ mt: 3 }}>
          <Typography>{t("taskDetails.sshKey")}:</Typography>
          <Box
            sx={{
              bgcolor: "#000",
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
