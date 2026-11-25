
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let tasks = [];

app.get("/", (req, res) => {
  res.send("H❤H To-Do List Backend is Running!");
});

// Get all tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// Add task
app.post("/api/tasks", (req, res) => {
  const { title, date, time } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Task title is required" });
  }

  const newTask = {
    id: Date.now().toString(),
    title,
    date: date || "",
    time: time || "",
    completed: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Edit task
app.put("/api/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  Object.assign(task, req.body);
  res.json(task);
});

// Delete task
app.delete("/api/tasks/:id", (req, res) => {
  tasks = tasks.filter(t => t.id !== req.params.id);
  res.json({ message: "Task deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
