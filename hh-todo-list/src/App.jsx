
import { useState, useEffect } from "react";
import "./App.css";

// Your deployed backend URL
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://h-h-to-do-list-35hr.vercel.app";

const emptyForm = {
  title: "",
  description: "",
  date: "",
  time: ""
};

// Convert backend task into frontend task format
const formatTask = (task) => ({
  ...task,
  done: Boolean(task.completed ?? task.done),
  created: task.created || new Date().toLocaleString()
});

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Load tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_URL}/api/tasks`);

        if (!response.ok) {
          throw new Error("Unable to load tasks");
        }

        const data = await response.json();
        setTasks(data.map(formatTask));
      } catch (error) {
        console.error("Backend error:", error);
        alert("Backend se tasks load nahi ho sake. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const completed = tasks.filter(task => task.done).length;
  const pending = tasks.length - completed;

  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Add or update task through backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.date || !form.time) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      if (editingId !== null) {
        const oldTask = tasks.find(task => task.id === editingId);

        const response = await fetch(
          `${API_URL}/api/tasks/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              ...form,
              completed: oldTask?.done || false
            })
          }
        );

        if (!response.ok) {
          throw new Error("Task update failed");
        }

        const updatedTask = await response.json();

        setTasks(tasks.map(task =>
          task.id === editingId
            ? formatTask({
                ...updatedTask,
                description: form.description,
                created: task.created
              })
            : task
        ));

        setEditingId(null);
      } else {
        const response = await fetch(`${API_URL}/api/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: form.title,
            date: form.date,
            time: form.time
          })
        });

        if (!response.ok) {
          throw new Error("Task could not be added");
        }

        const newTask = await response.json();

        setTasks([
          formatTask({
            ...newTask,
            description: form.description,
            created: new Date().toLocaleString()
          }),
          ...tasks
        ]);
      }

      setForm(emptyForm);
    } catch (error) {
      console.error("Submit error:", error);
      alert("Task save nahi hua. Please try again.");
    }
  };

  // Edit task
  const editTask = (task) => {
    setForm({
      title: task.title || "",
      description: task.description || "",
      date: task.date || "",
      time: task.time || ""
    });

    setEditingId(task.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete task through backend
  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Task delete failed");
      }

      setTasks(tasks.filter(task => task.id !== id));

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Task delete nahi hua. Please try again.");
    }
  };

  // Complete or uncomplete task through backend
  const toggleTask = async (id) => {
    const task = tasks.find(item => item.id === id);

    if (!task) return;

    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          completed: !task.done
        })
      });

      if (!response.ok) {
        throw new Error("Task status update failed");
      }

      const updatedTask = await response.json();

      setTasks(tasks.map(item =>
        item.id === id
          ? formatTask({
              ...updatedTask,
              description: item.description,
              created: item.created
            })
          : item
      ));
    } catch (error) {
      console.error("Toggle error:", error);
      alert("Task status update nahi hua. Please try again.");
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "Completed") return task.done;
    if (filter === "Pending") return !task.done;
    return true;
  });

  return (
    <div className="app-container">

      {/* Header */}
      <header className="header">
        <div className="brand">
          <div className="logo">♡</div>
          <div>
            <h2>H❤H To-Do List</h2>
            <p>Your daily productivity partner</p>
          </div>
        </div>

        <div className="header-tag">
          ✨ Stay Productive
        </div>
      </header>

      <main className="main-content">

        {/* Welcome */}
        <section className="welcome">
          <div>
            <span className="welcome-label">
              HELLO, ACHIEVER! ✨
            </span>

            <h1>
              Make today <span>amazing.</span>
            </h1>

            <p>
              Organize your tasks, build good habits and achieve your goals.
            </p>
          </div>

          <div className="welcome-icon">🌸</div>
        </section>

        {/* Statistics */}
        <section className="stats-grid">

          <div className="stat-card purple">
            <div className="stat-icon">📋</div>
            <p>Total Tasks</p>
            <h2>{tasks.length}</h2>
          </div>

          <div className="stat-card pink">
            <div className="stat-icon">✅</div>
            <p>Completed</p>
            <h2>{completed}</h2>
          </div>

          <div className="stat-card blue">
            <div className="stat-icon">🎯</div>
            <p>Pending</p>
            <h2>{pending}</h2>
          </div>

        </section>

        {/* Progress */}
        <section className="progress-card">

          <div className="progress-heading">
            <div>
              <h3>✨ Daily Progress</h3>
              <p>Every small step counts!</p>
            </div>

            <strong>{progress}%</strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="progress-note">
            {progress === 100
              ? "Amazing! All tasks completed! 🎉"
              : "Keep going! You are doing great. 💗"}
          </p>

        </section>

        {/* Add Task Form */}
        <section className="form-card">

          <div className="section-heading">
            <div className="heading-icon">＋</div>

            <div>
              <h2>
                {editingId !== null ? "Edit Your Task" : "Create a New Task"}
              </h2>
              <p>Add your next goal to the list</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            <label>Task Title *</label>

            <input
              type="text"
              name="title"
              placeholder="What do you want to accomplish?"
              value={form.title}
              onChange={handleChange}
              required
            />

            <label>Description</label>

            <textarea
              name="description"
              placeholder="Write a little detail about your task..."
              value={form.description}
              onChange={handleChange}
              rows="3"
            />

            <div className="form-row">

              <div>
                <label>📅 Task Date *</label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>⏰ Task Time *</label>

                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="form-buttons">

              <button className="add-button" type="submit">
                {editingId !== null ? "✓ Update Task" : "＋ Add New Task"}
              </button>

              {editingId !== null && (
                <button
                  className="cancel-button"
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                >
                  ✕ Cancel
                </button>
              )}

            </div>

          </form>
        </section>

        {/* Tasks */}
        <section className="tasks-section">

          <div className="tasks-heading">
            <div>
              <h2>📝 My Tasks</h2>
              <p>Manage your daily activities</p>
            </div>

            <span className="task-count">
              {tasks.length} Tasks
            </span>
          </div>

          {/* Filters */}
          <div className="filter-tabs">
            {["All", "Pending", "Completed"].map(item => (
              <button
                key={item}
                className={filter === item ? "active" : ""}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Task List */}
          <div className="task-list">

            {loading ? (
              <div className="empty-state">
                <h3>Loading your tasks... 💗</h3>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="empty-state">
                <div>🌷</div>
                <h3>No tasks found!</h3>
                <p>Add a new task and make your day productive.</p>
              </div>
            ) : (
              filteredTasks.map(task => (

                <article
                  className={`task-card ${task.done ? "completed-task" : ""}`}
                  key={task.id}
                >

                  <button
                    className={`check-button ${task.done ? "checked" : ""}`}
                    onClick={() => toggleTask(task.id)}
                    title="Mark complete or uncomplete"
                  >
                    {task.done ? "✓" : "○"}
                  </button>

                  <div className="task-info">

                    <h3>{task.title}</h3>

                    {task.description && (
                      <p>{task.description}</p>
                    )}

                    <div className="task-meta">
                      <span>📅 {task.date}</span>
                      <span>⏰ {task.time}</span>
                    </div>

                    <small>Created: {task.created}</small>

                    <span className={`status ${task.done ? "done" : "pending"}`}>
                      {task.done ? "✓ Completed" : "● Pending"}
                    </span>

                  </div>

                  <div className="task-actions">

                    <button
                      className="edit-action"
                      onClick={() => editTask(task)}
                      title="Edit task"
                    >
                      ✏️
                    </button>

                    <button
                      className="delete-action"
                      onClick={() => deleteTask(task.id)}
                      title="Delete task"
                    >
                      🗑️
                    </button>

                  </div>

                </article>

              ))
            )}

          </div>

        </section>

        {/* Footer */}
        <footer>
          <p>Made with 💗 by <strong>H❤H</strong></p>
          <span>Dream Big • Stay Organized • Keep Growing ✨</span>
        </footer>

      </main>
    </div>
  );
}

export default App;
