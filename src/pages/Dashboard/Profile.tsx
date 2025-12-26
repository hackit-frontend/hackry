import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface UserStats {
  completedTasks: number;
  rank: string;
  name: string;
  email: string;
}

interface ProfileProps {
  sshKey?: string | null;
  isAuthenticated: boolean;
}

const Profile: React.FC<ProfileProps> = ({ sshKey, isAuthenticated }) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://backend.hacklab.uz/profile", {
          method: "GET",
          credentials: "include", // sends cookie
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
  }, [isAuthenticated]);

  const handleCopy = () => {
    if (sshKey) {
      navigator.clipboard.writeText(sshKey);
      alert("✅ SSH key copied to clipboard!");
    }
  };

  if (!isAuthenticated)
    return (
      <Typography sx={{ color: "#00FF00", fontFamily: "Fira Code" }}>
        Please login to see your profile.
      </Typography>
    );

  return (
    <Box
      sx={{
        bgcolor: "#000",
        color: "#00FF00",
        p: 4,
        borderRadius: 2,
        border: "1px solid #00FF00",
        fontFamily: "Fira Code",
      }}
    >
      <Typography variant="h5" sx={{ mb: 3 }}>
        Profile
      </Typography>

      <Card
        sx={{
          bgcolor: "#0a0a0a",
          borderRadius: 2,
          border: "1px solid #00FF00",
          color: "#00FF00",
        }}
      >
        <CardContent>
          {loading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={20} sx={{ color: "#00FF00" }} />
              <Typography>Loading profile...</Typography>
            </Box>
          ) : stats ? (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                User Info
              </Typography>
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

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          SSH Key
        </Typography>
        <Box
          sx={{
            p: 2,
            bgcolor: "#0a0a0a",
            borderRadius: 1,
            fontFamily: "Fira Code",
            fontSize: "0.9rem",
            border: "1px solid #00FF00",
            wordBreak: "break-all",
            mb: 2,
          }}
        >
          {sshKey ? sshKey : "No SSH key found."}
        </Box>

        {sshKey && (
          <Button
            onClick={handleCopy}
            startIcon={<ContentCopyIcon />}
            sx={{
              border: "1px solid #00FF00",
              color: "#00FF00",
              fontFamily: "Fira Code",
              "&:hover": { bgcolor: "#00FF0044" },
            }}
          >
            Copy SSH Key
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Profile;
