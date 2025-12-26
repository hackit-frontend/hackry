import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTranslation } from "react-i18next";
import { API_BASE } from "../constants.ts";

interface ContainerInfo {
  container_id: string;
  container_name: string;
  host: string;
  port: number;
  user: string;
  ssh_command: string;
  your_public_key_was_installed: boolean;
}

interface ApiResponse {
  status: string;
  task_id: number;
  container_info: ContainerInfo;
}

interface Task {
  id: string;
  title: string;
  description: string;
}

interface Props {
  task: Task;
}

const TaskDetails: React.FC<Props> = ({ task }) => {
  const { t } = useTranslation();
  const [containerInfo, setContainerInfo] = useState<ContainerInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleStart = () => {
    setLoading(true);
    const token = localStorage.getItem("access_token");

    fetch(`${API_BASE}tasks/${task.id}/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ task_id: task.id }),
    })
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        if (data.status === "ok" && data.container_info) {
          setContainerInfo(data.container_info);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleCopy = () => {
    if (!containerInfo) return;
    const command = `ssh -i <path/to/id_rsa> ${containerInfo.user}@${containerInfo.host} -p ${containerInfo.port}`;
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!task) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress sx={{ color: "#00FF00" }} />
        <Typography sx={{ mt: 2 }}>{t("loading")}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {task.title}
      </Typography>
      <Typography sx={{ mb: 3, color: "#ccc" }}>{task.description}</Typography>

      <Button
        onClick={handleStart}
        variant="outlined"
        disabled={loading || !!containerInfo}
        sx={{ color: "#00FF00", borderColor: "#00FF00" }}
      >
        {loading ? <CircularProgress size={24} sx={{ color: "#00FF00" }} /> : t("taskDetails.startTask")}
      </Button>

      {containerInfo && (
        <Box sx={{ mt: 4 }}>
          <Alert
            severity="success"
            icon={<CheckCircleIcon />}
            sx={{ mb: 3, bgcolor: "#001a0a", border: "1px solid #00FF00" }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Success! Your SSH container is ready 🚀
            </Typography>
          </Alert>

          <Typography variant="subtitle2" sx={{ mb: 2, color: "#aaa" }}>
            Container Details:
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            <Chip label={`Name: ${containerInfo.container_name}`} color="primary" variant="outlined" />
            <Chip label={`ID: ${containerInfo.container_id.substring(0, 12)}`} color="primary" variant="outlined" />
            <Chip label={`Host: ${containerInfo.host}`} color="primary" variant="outlined" />
            <Chip label={`Port: ${containerInfo.port}`} color="primary" variant="outlined" />
          </Box>

          {containerInfo.your_public_key_was_installed && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Your public key has been successfully installed.
            </Alert>
          )}

          <Typography sx={{ mb: 1 }}>
            To connect via SSH, run this command (replace <code>&lt;path/to/id_rsa&gt;</code> with your private key path):
          </Typography>

          <Box
            sx={{
              position: "relative",
              bgcolor: "#000",
              p: 2,
              borderRadius: 2,
              border: "1px solid #333",
              fontFamily: "Fira Code, monospace",
              fontSize: "0.95rem",
              overflowX: "auto",
              color: "#00FF00",
            }}
          >
            <code>
              ssh -i {"<path/to/id_rsa>"} {containerInfo.user}@{containerInfo.host} -p {containerInfo.port}
            </code>

            <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
              <IconButton
                onClick={handleCopy}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  color: "#00FF00",
                }}
              >
                {copied ? <CheckCircleIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TaskDetails;