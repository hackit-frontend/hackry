import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";

interface UserStats {
  completedTasks: number;
  rank: string;
  name: string;
  email: string;
}

const Profile: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://backend.hacklab.uz:8000/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (!token) return <Typography>Please login to see your profile</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Profile
      </Typography>

      <Card sx={{ maxWidth: 400, mb: 2 }}>
        <CardContent>
          {loading ? (
            <Typography color="text.secondary">Loading profile...</Typography>
          ) : stats ? (
            <>
              <Typography variant="h6">User Info</Typography>
              <Typography>Name: {stats.name}</Typography>
              <Typography>Email: {stats.email}</Typography>
              <Typography>Completed Tasks: {stats.completedTasks}</Typography>
              <Typography>Rank: {stats.rank}</Typography>
            </>
          ) : (
            <Typography color="error">Failed to load profile</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
