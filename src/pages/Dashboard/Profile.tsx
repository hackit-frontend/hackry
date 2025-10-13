import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { auth } from "../../auth/firebase";

interface UserStats {
  completedTasks: number;
  rank: string;
}

const Profile: React.FC = () => {
  const user = auth.currentUser;
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/users/${user.uid}/stats`)
        .then((res) => res.json())
        .then((data) => setStats(data))
        .catch(console.error);
    }
  }, [user]);

  if (!user) return <Typography>Loading user...</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Profile
      </Typography>

      <Card sx={{ maxWidth: 400, mb: 2 }}>
        <CardContent>
          <Typography variant="h6">User Info</Typography>
          <Typography>Name: {user.displayName}</Typography>
          <Typography>Email: {user.email}</Typography>
        </CardContent>
      </Card>

      <Card sx={{ maxWidth: 400 }}>
        <CardContent>
          <Typography variant="h6">Stats</Typography>
          {stats ? (
            <>
              <Typography>Completed Tasks: {stats.completedTasks}</Typography>
              <Typography>Rank: {stats.rank}</Typography>
            </>
          ) : (
            <Typography color="text.secondary">Loading stats...</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
