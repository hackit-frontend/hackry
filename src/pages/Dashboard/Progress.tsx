import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, LinearProgress } from "@mui/material";

interface UserProgress {
  completedTasks: number;
  totalTasks: number;
}

interface ProgressProps {
  isAuthenticated: boolean;
}

const Progress: React.FC<ProgressProps> = ({ isAuthenticated }) => {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchProgress = async () => {
      try {
        const [tasksRes, completedRes] = await Promise.all([
          fetch("https://backend.hacklab.uz/tasks", {
            credentials: "include",
          }),
          fetch("https://backend.hacklab.uz/me/completed", {
            credentials: "include",
          }),
        ]);

        if (!tasksRes.ok || !completedRes.ok) return;

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
  }, [isAuthenticated]);

  if (!isAuthenticated)
    return (
      <Typography sx={{ color: "#00FF00", fontFamily: "Fira Code" }}>
        Please login to see progress.
      </Typography>
    );

  const percentage = progress
    ? (progress.completedTasks / progress.totalTasks) * 100
    : 0;

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
                  "& .MuiLinearProgress-bar": { bgcolor: "#00FF00" },
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
