import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";

interface Task {
  _id?: string;
  title: string;
  difficulty: string;
  description: string;
}

const API_URL = "http://localhost:5000/api/tasks"; 

const AdminPanel: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Task>({
    title: "",
    difficulty: "",
    description: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add new task
  const handleAdd = async () => {
    if (!newTask.title || !newTask.description) return alert("Fill all fields");
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      setNewTask({ title: "", difficulty: "", description: "" });
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Delete task
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Edit task
  const handleEdit = (task: Task) => {
    setEditingId(task._id || null);
    setNewTask(task);
  };

  // Save updated task
  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      setEditingId(null);
      setNewTask({ title: "", difficulty: "", description: "" });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#000",
        color: "#00ff88",
        minHeight: "100vh",
        p: 4,
        fontFamily: "Fira Code",
      }}
    >
      <Typography variant="h4" sx={{ mb: 3 }}>
        Admin Panel
      </Typography>

      {/* Add / Edit Task */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          mb: 4,
        }}
      >
        <TextField
          label="Title"
          variant="outlined"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          sx={{
            input: { color: "#00ff88" },
            label: { color: "#00ff88" },
            fieldset: { borderColor: "#00ff88" },
            width: 250,
          }}
        />
        <TextField
          label="Difficulty"
          variant="outlined"
          value={newTask.difficulty}
          onChange={(e) =>
            setNewTask({ ...newTask, difficulty: e.target.value })
          }
          sx={{
            input: { color: "#00ff88" },
            label: { color: "#00ff88" },
            fieldset: { borderColor: "#00ff88" },
            width: 200,
          }}
        />
        <TextField
          label="Description"
          variant="outlined"
          multiline
          minRows={1}
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          sx={{
            input: { color: "#00ff88" },
            label: { color: "#00ff88" },
            fieldset: { borderColor: "#00ff88" },
            width: 300,
          }}
        />
        {editingId ? (
          <Button
            variant="contained"
            onClick={handleUpdate}
            sx={{
              bgcolor: "#00ff88",
              color: "#000",
              "&:hover": { bgcolor: "#00cc66" },
            }}
          >
            Update Task
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleAdd}
            sx={{
              bgcolor: "#00ff88",
              color: "#000",
              "&:hover": { bgcolor: "#00cc66" },
            }}
          >
            Add Task
          </Button>
        )}
      </Box>

      {/* Task List */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {tasks.map((task) => (
          <Card
            key={task._id}
            sx={{
              width: 300,
              bgcolor: "#111",
              border: "1px solid #00ff88",
              color: "#00ff88",
            }}
          >
            <CardContent>
              <Typography variant="h6">{task.title}</Typography>
              <Typography variant="body2">
                Difficulty: {task.difficulty}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {task.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleEdit(task)}>
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => handleDelete(task._id!)}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default AdminPanel;
