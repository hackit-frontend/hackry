import React, { useEffect, useState, useCallback } from "react";
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

const Tasks: React.FC = () => {
  const { t } = useTranslation();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [error, setError] = useState<string | null>(null);

  const [openDetails, setOpenDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [loadingSsh, setLoadingSsh] = useState(false);
  const [sshDownloaded, setSshDownloaded] = useState(false);
  const [sshError, setSshError] = useState<string | null>(null);

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
        if (res.status === 401 || res.status === 403) {
          localStorage.clear();
          throw new Error("unauthorized");
        }
        if (!res.ok) throw new Error("Failed to load tasks");
        return res.json();
      })
      .then((data) => setTasks(data))
      .catch((err) => {
        console.error(err);
        if (err?.message === "unauthorized") {
          setError(t("ssh.authRequired"));
          return;
        }
        setError(t("errorLoadingTasks"));
      });
  }, [t]);

  const handleOpenDetails = useCallback((task: Task) => {
    setSelectedTask(task);
    setOpenDetails(true);
  }, []);

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedTask(null);
  };

  const handleDownloadSshKey = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      localStorage.clear();
      setSshError(t("ssh.authRequired"));
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

      if (response.status === 401 || response.status === 403) {
        localStorage.clear();
        throw new Error(t("ssh.authRequired"));
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch key (${response.status})`);
      }

      const blob = await response.blob();
      const text = await blob.text();

      if (!text.includes("PRIVATE KEY")) {
        throw new Error(t("ssh.invalidFormat"));
      }

      const downloadBlob = new Blob([text], { type: "text/plain" });
      const url = window.URL.createObjectURL(downloadBlob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "id_rsa";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setSshDownloaded(true);
    } catch (err: any) {
      console.error(err);
      setSshError(t("ssh.downloadFailed", { message: err.message }));
    } finally {
      setLoadingSsh(false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === "All" || task.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          gap: 3,
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontFamily: "Fira Code", color: "#00FF00" }}>
          {t("title")}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: "center",
          }}
        >
          <Button
            variant="outlined"
            size="medium"
            startIcon={loadingSsh ? <CircularProgress size={18} /> : <KeyIcon />}
            endIcon={!loadingSsh && <DownloadIcon />}
            onClick={handleDownloadSshKey}
            disabled={loadingSsh}
            sx={{
              borderColor: "#00FF00",
              color: "#00FF00",
              fontFamily: "Fira Code",
              textTransform: "none",
              minWidth: 200,
              "&:hover": {
                borderColor: "#00ffaa",
                bgcolor: "rgba(0, 255, 136, 0.08)",
              },
            }}
          >
            {loadingSsh
              ? t("ssh.downloading")
              : sshDownloaded
              ? t("ssh.downloaded")
              : t("ssh.downloadButton")}
          </Button>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: "#00FF00" }}>{t("difficulty")}</InputLabel>
            <Select
              value={difficultyFilter}
              label={t("difficulty")}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              sx={{
                color: "#00FF00",
                fontFamily: "Fira Code",
                ".MuiOutlinedInput-notchedOutline": { borderColor: "#00FF00" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#00ffaa" },
              }}
            >
              <MenuItem value="All">{t("all")}</MenuItem>
              <MenuItem value="Easy">{t("easy")}</MenuItem>
              <MenuItem value="Medium">{t("medium")}</MenuItem>
              <MenuItem value="Hard">{t("hard")}</MenuItem>
            </Select>
          </FormControl>

          <TextField
            placeholder={t("searchPlaceholder")}
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              width: { xs: "100%", sm: 250 },
              input: { color: "#00FF00", fontFamily: "Fira Code" },
              ".MuiOutlinedInput-notchedOutline": { borderColor: "#00FF00" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#00ffaa" },
            }}
          />
        </Box>
      </Box>

      {sshError && (
        <Alert severity="error" sx={{ mb: 2, fontFamily: "Fira Code" }}>
          {sshError}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, fontFamily: "Fira Code", bgcolor: "#2b0000" }}>
          {error}
        </Alert>
      )}

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
            onView={() => handleOpenDetails(task)}
          />
        ))}
      </Box>

      <Dialog
        open={openDetails}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { bgcolor: "#111", color: "#fff" },
        }}
      >
        <DialogContent sx={{ p: 4 }}>
          {selectedTask?.id ? (
            <TaskDetails task={selectedTask} />
          ) : (
            <CircularProgress sx={{ color: "#00FF00", display: "block", mx: "auto" }} />
          )}
        </DialogContent>
      </Dialog>

      {sshDownloaded && (
        <Typography
          variant="body2"
          sx={{
            mt: 4,
            textAlign: "center",
            color: "#00FF00",
            fontFamily: "Fira Code",
            fontStyle: "italic",
          }}
        >
          {t("ssh.chmodTipPrefix")} <code>chmod 600 id_rsa</code> {t("ssh.chmodTipSuffix")}
        </Typography>
      )}
    </Box>
  );
};

export default Tasks;
