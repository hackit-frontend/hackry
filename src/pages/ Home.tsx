import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogContent,
  CircularProgress,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import TaskCard from "../components/TaskCard";
import TaskDetails from "./TaskDetails";
import DownloadIcon from "@mui/icons-material/Download";
import KeyIcon from "@mui/icons-material/VpnKey";

interface Task {
  id: string;
  title: string;
  difficulty: string;
  description: string;
}

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [error, setError] = useState<string | null>(null);

  // Task details modal
  const [open, setOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // SSH Key download state
  const [loadingSsh, setLoadingSsh] = useState(false);
  const [sshDownloaded, setSshDownloaded] = useState(false);
  const [sshError, setSshError] = useState<string | null>(null);

  // Fetch tasks on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setError(t("errorLoadingTasks"));
      return;
    }

    fetch("https://unrefulgently-unitalicized-greta.ngrok-free.dev/tasks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load tasks");
        return res.json();
      })
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => {
        console.error(err);
        setError(t("errorLoadingTasks"));
      });
  }, [t]);

  // Handle SSH Key Download
  const handleDownloadSshKey = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setSshError("Not authenticated. Please log in again.");
      return;
    }

    try {
      setLoadingSsh(true);
      setSshError(null);

      const response = await fetch(
        "https://unrefulgently-unitalicized-greta.ngrok-free.dev/me/ssh/private",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch SSH key");
      }

      const blob = await response.blob();
      const text = await blob.text();

      // Basic validation
      if (!text.includes("PRIVATE KEY")) {
        throw new Error("Invalid SSH key format");
      }

      // Trigger download
      const downloadBlob = new Blob([text], { type: "text/plain" });
      const url = window.URL.createObjectURL(downloadBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "id_rsa"; // Correct filename for SSH
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setSshDownloaded(true);
    } catch (err: any) {
      console.error(err);
      setSshError("Failed to download SSH key: " + err.message);
    } finally {
      setLoadingSsh(false);
    }
  };

  const handleOpenDetails = (id: string) => {
    setSelectedTaskId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTaskId(null);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = difficultyFilter === "All" || task.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <Box sx={{ p: 4 }}>
      {/* Header with Filters + SSH Button */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontFamily: "Fira Code" }}>
          {t("title")}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          {/* SSH Key Download Button */}
          <Button
            variant="outlined"
            size="small"
            startIcon={loadingSsh ? <CircularProgress size={16} /> : <KeyIcon />}
            endIcon={!loadingSsh && <DownloadIcon />}
            onClick={handleDownloadSshKey}
            disabled={loadingSsh}
            sx={{
              borderColor: "#00ff88",
              color: "#00ff88",
              fontFamily: "Fira Code",
              textTransform: "none",
              fontSize: "0.875rem",
              "&:hover": {
                borderColor: "#00ffaa",
                bgcolor: "#00ff8811",
              },
              minWidth: "180px",
            }}
          >
            {loadingSsh
              ? "Downloading..."
              : sshDownloaded
              ? "Key Downloaded ✓"
              : "Download SSH Key"}
          </Button>

          {/* Difficulty Filter */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: "#00ff88" }}>{t("difficulty")}</InputLabel>
            <Select
              value={difficultyFilter}
              label={t("difficulty")}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              sx={{
                color: "#00ff88",
                fontFamily: "Fira Code",
                ".MuiOutlinedInput-notchedOutline": { borderColor: "#00ff88" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#00ffaa" },
              }}
            >
              <MenuItem value="All">{t("all")}</MenuItem>
              <MenuItem value="Easy">{t("easy")}</MenuItem>
              <MenuItem value="Medium">{t("medium")}</MenuItem>
              <MenuItem value="Hard">{t("hard")}</MenuItem>
            </Select>
          </FormControl>

          {/* Search */}
          <TextField
            placeholder={t("searchPlaceholder")}
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              width: { xs: "100%", sm: "250px" },
              input: { color: "#00ff88", fontFamily: "Fira Code" },
              ".MuiOutlinedInput-notchedOutline": { borderColor: "#00ff88" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#00ffaa" },
            }}
          />
        </Box>
      </Box>

      {/* SSH Error */}
      {sshError && (
        <Alert severity="error" sx={{ mb: 2, fontFamily: "Fira Code" }}>
          {sshError}
        </Alert>
      )}

      {/* General Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, fontFamily: "Fira Code", bgcolor: "#2b0000" }}>
          {error}
        </Alert>
      )}

      {/* Task Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 3,
        }}
      >
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onView={() => handleOpenDetails(task.id)}
          />
        ))}
      </Box>

      {/* Task Details Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ bgcolor: "#111", color: "#fff", p: 4 }}>
          {selectedTaskId ? (
            <TaskDetails taskId={selectedTaskId} />
          ) : (
            <CircularProgress sx={{ color: "#00ff88", display: "block", mx: "auto" }} />
          )}
        </DialogContent>
      </Dialog>

    </Box>
  );
};

export default Home;