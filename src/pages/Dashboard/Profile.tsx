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
import { useTranslation } from "react-i18next";
import { API_BASE } from "../../constants";

interface UserStats {
  completedTasks: number;
  rank: string;
  name: string;
  email: string;
  surname?: string;
}

interface ProfileProps {
  sshKey?: string | null;
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ sshKey, isAuthenticated, onLogout }) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Not authenticated");

        const res = await fetch(`${API_BASE}me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setStats(data);
        setName(data.name || "");
        setSurname(data.surname || "");
        setEmail(data.email || "");
      } catch (err) {
        console.error(err);
        setStats(null);
        setError((err as any)?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_BASE}me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ name, surname }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const data = await res.json();
      setStats(data);
      setName(data.name || name);
      setSurname(data.surname || surname);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

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
          ) : error ? (
            <Typography color="error">{error}</Typography>
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

      {/* Editable fields */}
      {!loading && !error && (
        <Box sx={{ mt: 3, display: "grid", gap: 2 }}>
          <Box>
            <Typography sx={{ mb: 0.5 }}>Name</Typography>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                background: "#0a0a0a",
                border: "1px solid #00FF00",
                color: "#00FF00",
                borderRadius: "8px",
                fontFamily: "Fira Code",
              }}
            />
          </Box>
          <Box>
            <Typography sx={{ mb: 0.5 }}>Surname</Typography>
            <input
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                background: "#0a0a0a",
                border: "1px solid #00FF00",
                color: "#00FF00",
                borderRadius: "8px",
                fontFamily: "Fira Code",
              }}
            />
          </Box>
          <Box>
            <Typography sx={{ mb: 0.5 }}>Email</Typography>
            <input
              value={email}
              readOnly
              style={{
                width: "100%",
                padding: "10px",
                background: "#0a0a0a",
                border: "1px solid #444",
                color: "#888",
                borderRadius: "8px",
                fontFamily: "Fira Code",
              }}
            />
          </Box>
          <Button
            onClick={handleSave}
            disabled={saving}
            sx={{
              border: "1px solid #00FF00",
              color: "#00FF00",
              fontFamily: "Fira Code",
              "&:hover": { bgcolor: "#00FF0044" },
            }}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </Box>
      )}

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

      {/* Logout Button */}
      <Box sx={{ mt: 4 }}>
        <Button
          onClick={onLogout}
          fullWidth
          sx={{
            color: "#FF0000",
            fontFamily: "Fira Code",
            border: "1px solid #FF0000",
            borderRadius: "8px",
            py: 1.5,
            "&:hover": { 
              bgcolor: "#FF000044",
              borderColor: "#FF3333",
            },
          }}
        >
          {t("navLogout")}
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;
