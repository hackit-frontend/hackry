import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, LinearProgress } from "@mui/material";

interface UserProgress {
  completedTasks: number;
  totalTasks: number;
}

const Progress: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) return;

    const fetchProgress = async () => {
      try {
        const [tasksRes, completedRes] = await Promise.all([
          fetch("http://backend.hacklab.uz:8000/tasks", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://backend.hacklab.uz:8000/me/completed", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const tasks = await tasksRes.json();
        const completed = await completedRes.json();

        setProgress({
          totalTasks: tasks.length,
          completedTasks: completed.length,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchProgress();
  }, [token]);

  if (!token) return <Typography>Please login to see progress</Typography>;

  const percentage = progress ? (progress.completedTasks / progress.totalTasks) * 100 : 0;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Progress
      </Typography>

      <Card sx={{ maxWidth: 400 }}>
        <CardContent>
          {progress ? (
            <>
              <Typography sx={{ mb: 1 }}>
                Tasks Completed: {progress.completedTasks} / {progress.totalTasks}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: "#222",
                  "& .MuiLinearProgress-bar": { bgcolor: "#00ff88" },
                }}
              />
              <Typography sx={{ mt: 1 }}>{Math.round(percentage)}%</Typography>
            </>
          ) : (
            <Typography color="text.secondary">Loading progress...</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Progress;
