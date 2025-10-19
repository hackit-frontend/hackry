import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const [task, setTask] = useState<Task | null>(null);
  const [sshKey, setSshKey] = useState<string>("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/tasks/${id}`)
      .then((res) => res.json())
      .then(setTask)
      .catch(console.error);
  }, [id]);

  const handleStart = () => {
    fetch(`http://localhost:5000/api/tasks/${id}/start`)
      .then((res) => res.json())
      .then((data) => setSshKey(data.sshKey))
      .catch(console.error);
  };

  if (!task) return <Typography>{t("loading")}</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">{task.title}</Typography>
      <Typography sx={{ my: 2 }}>{task.description}</Typography>

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
