import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, LinearProgress } from "@mui/material";
import { API_BASE } from "../../constants";

interface UserProgress {
  completedTasks: number;
  totalTasks: number;
}

interface ProgressProps {
  isAuthenticated: boolean;
}

const Progress: React.FC<ProgressProps> = ({ isAuthenticated }) => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchProgress = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Not authenticated");
        const [tasksRes, completedRes] = await Promise.all([
          fetch(`${API_BASE}tasks`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          }),
          fetch(`${API_BASE}me/completed`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          }),
        ]);

        if (!tasksRes.ok || !completedRes.ok) {
          throw new Error("Failed to load progress");
        }

        const tasks = await tasksRes.json();
        const completed = await completedRes.json();

        setProgress({
          totalTasks: tasks.length,
          completedTasks: completed.length,
        });
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load progress");
      }
      finally {
        setLoading(false);
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
          {loading ? (
            <Typography color="text.secondary">Loading progress...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : progress ? (
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
