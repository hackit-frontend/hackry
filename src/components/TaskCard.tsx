import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // ✅ import i18n hook

interface Task {
  id: string;
  title: string;
  difficulty: string;
  description: string;
}

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const { t } = useTranslation(); // ✅ use translation

  return (
    <Card sx={{ bgcolor: "background.paper" }}>
      <CardContent>
        <Typography variant="h6">{task.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {task.description}
        </Typography>
        <Typography sx={{ mt: 1, color: "#00ff88" }}>
          {t("task.difficulty")}: {task.difficulty}
        </Typography>
        <Button
          component={Link}
          to={`/task/${task.id}`}
          variant="outlined"
          sx={{ mt: 2, color: "#00ff88", borderColor: "#00ff88" }}
        >
          {t("task.viewTask")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
