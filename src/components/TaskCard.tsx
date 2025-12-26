import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

interface Task {
  id: string;
  title: string;
  difficulty: string;
  description: string;
}

interface TaskCardProps {
  task: Task;
  onView: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onView }) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ bgcolor: "#181818", color: "#fff", borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6">{task.title}</Typography>
        <Typography variant="body2" color="#aaa">
          {task.description}
        </Typography>
        <Typography sx={{ mt: 1, color: "#00FF00" }}>
          {t("task.difficulty")}: {task.difficulty}
        </Typography>
        <Button
          onClick={onView}
          variant="outlined"
          sx={{
            mt: 2,
            color: "#00FF00",
            borderColor: "#00FF00",
            "&:hover": { borderColor: "#00ffaa" },
          }}
        >
          {t("task.viewTask")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
