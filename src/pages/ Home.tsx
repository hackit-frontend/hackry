import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  CircularProgress,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const Home: React.FC = () => {
  const [sshKey, setSshKey] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchSshKey = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://backend.hacklab.uz/me/ssh/public", {
          method: "GET",
          credentials: "include", // includes cookies
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.public_key) {
            setSshKey(data.public_key);
            setOpenModal(true); // show modal automatically after login
          }
        }
      } catch (error) {
        console.error("Error fetching SSH key:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSshKey();
  }, []);

  const handleDownload = () => {
    if (!sshKey) return;
    const blob = new Blob([sshKey], { type: "application/x-pem-file" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hacklab_key.pem";
    a.click();
    window.URL.revokeObjectURL(url);
    setOpenModal(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "black",
        color: "#00ff88",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Fira Code",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <Typography variant="h3" sx={{ mb: 2 }}>
        Welcome to HackLab
      </Typography>
      <Typography variant="h6" sx={{ opacity: 0.8 }}>
        Learn, Build, and Grow with Real Projects.
      </Typography>

      {/* Modal for SSH Key download */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
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
          {loading ? (
            <CircularProgress sx={{ color: "#00ff88" }} />
          ) : (
            <>
              <Typography variant="h5" sx={{ mb: 2 }}>
                🎉 Welcome to HackLab!
              </Typography>
              <Typography sx={{ mb: 3 }}>
                Download your SSH Key to start working securely.
              </Typography>
              <Button
                onClick={handleDownload}
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
    </Box>
  );
};

export default Home;
