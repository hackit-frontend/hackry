import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, LinearProgress } from "@mui/material";
import { auth } from "../../auth/firebase";

interface UserProgress {
  completedTasks: number;
  totalTasks: number;
}

const Progress: React.FC = () => {
  const user = auth.currentUser;
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    // Fetch progress from backend (replace URL with your API)
    if (user) {
      fetch(`http://localhost:5000/api/users/${user.uid}/progress`)
        .then((res) => res.json())
        .then((data) => setProgress(data))
        .catch(console.error);
    }
  }, [user]);

  if (!user) return <Typography>Loading user...</Typography>;

  const percentage =
    progress ? (progress.completedTasks / progress.totalTasks) * 100 : 0;

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
