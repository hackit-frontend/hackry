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
  Modal,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import TaskCard from "../components/TaskCard";
import TaskDetails from "./TaskDetails";
import DownloadIcon from "@mui/icons-material/Download";

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
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Modal handling for task details
  const [open, setOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // SSH key modal
  const [sshKey, setSshKey] = useState<string | null>(null);
  const [showSshModal, setShowSshModal] = useState<boolean>(false);
  const [loadingSsh, setLoadingSsh] = useState<boolean>(false);

  // Fetch tasks
  useEffect(() => {
    fetch("https://backend.hacklab.uz/tasks", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Internal Server Error");
        return res.json();
      })
      .then((data) => {
        setTasks(data);
        setFilteredTasks(data);
      })
      .catch(() => setError(t("errorLoadingTasks")));
  }, [t]);

  // Filter tasks
  useEffect(() => {
    let filtered = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.difficulty.toLowerCase().includes(search.toLowerCase())
    );

    if (difficultyFilter !== "All") {
      filtered = filtered.filter(
        (task) =>
          task.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
      );
    }

    setFilteredTasks(filtered);
  }, [search, tasks, difficultyFilter]);

useEffect(() => {
  const fetchSshKey = async () => {
    try {
      setLoadingSsh(true);
      const res = await fetch("https://backend.hacklab.uz/me/ssh/public", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log("SSH Key fetch data:", data);

      if (data.public_keys && Array.isArray(data.public_keys) && data.public_keys.length > 0) {
        const key = data.public_keys[0].trim();
        setSshKey(key);

        // Show modal only once per session
        if (!sessionStorage.getItem("sshModalShown")) {
          setShowSshModal(true);
          sessionStorage.setItem("sshModalShown", "true");
        }
      }
    } catch (err) {
      console.error("Error fetching SSH key:", err);
    } finally {
      setLoadingSsh(false);
    }
  };

  fetchSshKey();
}, []);


  const handleDownloadSsh = () => {
    if (!sshKey) return;
    const blob = new Blob([sshKey], { type: "application/x-pem-file" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hacklab_key.pem";
    a.click();
    URL.revokeObjectURL(url);
    setShowSshModal(false);
  };

  const handleOpenDetails = (id: string) => {
    setSelectedTaskId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTaskId(null);
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* SSH Modal */}
      <Modal
        open={showSshModal}
        onClose={() => setShowSshModal(false)}
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          mt: "5%",
        }}
      >
        <Box
          sx={{
            bgcolor: "#0a0a0a",
            border: "1px solid #00ff88",
            borderRadius: "12px",
            p: 4,
            width: "90%",
            maxWidth: "500px",
            color: "#00ff88",
            textAlign: "center",
            boxShadow: "0px 0px 20px #00ff8855",
          }}
        >
          {loadingSsh ? (
            <CircularProgress sx={{ color: "#00ff88" }} />
          ) : (
            <>
              <Typography variant="h5" sx={{ mb: 2 }}>
                🎉 Welcome to HackLab!
              </Typography>
              <Typography sx={{ mb: 3 }}>
                Your SSH key is ready — download it to connect securely.
              </Typography>
              <Button
                onClick={handleDownloadSsh}
                startIcon={<DownloadIcon />}
                sx={{
                  border: "1px solid #00ff88",
                  color: "#00ff88",
                  fontFamily: "Fira Code",
                  borderRadius: "8px",
                  px: 3,
                  "&:hover": { bgcolor: "#00ff8844" },
                }}
              >
                Download .pem
              </Button>
            </>
          )}
        </Box>
      </Modal>

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4">{t("title")}</Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{t("difficulty")}</InputLabel>
            <Select
              value={difficultyFilter}
              label={t("difficulty")}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              sx={{
                color: "#00ff88",
                fontFamily: "Fira Code",
                ".MuiOutlinedInput-notchedOutline": { borderColor: "#00ff88" },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#00ffaa",
                },
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
            sx={{
              width: { xs: "100%", sm: "300px" },
              input: { color: "#00ff88", fontFamily: "Fira Code" },
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            fontFamily: "Fira Code",
            backgroundColor: "#2b0000",
            color: "#ff8888",
          }}
        >
          {error}
        </Alert>
      )}

      {!error && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 2,
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
      )}

      {/* Task Details Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ bgcolor: "#111", color: "#fff" }}>
          {selectedTaskId ? (
            <TaskDetails taskId={selectedTaskId} />
          ) : (
            <CircularProgress
              sx={{ color: "#00ff88", display: "block", mx: "auto", my: 4 }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Home;
