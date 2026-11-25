
import { useState, useEffect } from "react";
import "./App.css";

const initialTasks = [
  {
    id: 1,
    title: "Learn React Components",
    description: "Understand JSX and functional components.",
    date: "2026-11-26",
    time: "10:00",
    done: false,
    created: new Date().toLocaleString()
  },
  {
    id: 2,
    title: "Practice useState Hook",
    description: "Build a small counter application.",
    date: "2026-11-27",
    time: "12:00",
    done: false,
    created: new Date().toLocaleString()
  },
  {
    id: 3,
    title: "Learn useEffect Hook",
    description: "Practice LocalStorage in React.",
    date: "2026-11-28",
    time: "15:00",
    done: true,
    created: new Date().toLocaleString()
  }
];

const emptyForm = {
  title: "",
  description: "",
  date: "",
  time: ""
};

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("hh-tasks");
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("hh-tasks", JSON.stringify(tasks));
  }, [tasks]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.date || !form.time) {
      alert("Please fill in all required fields!");
      return;
    }

    if (editingId !== null) {
      setTasks(tasks.map(task =>
        task.id === editingId
          ? { ...task, ...form }
          : task
      ));

      setEditingId(null);
    } else {
      const newTask = {
        ...form,
        id: Date.now(),
        done: false,
        created: new Date().toLocaleString()
      };

      setTasks([newTask, ...tasks]);
    }

    setForm(emptyForm);
  };

  const editTask = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      date: task.date,
      time: task.time
    });

    setEditingId(task.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(task => task.id !== id));

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, done: !task.done }
        : task
    ));
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
                {editingId ? "Edit Your Task" : "Create a New Task"}
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
                {editingId ? "✓ Update Task" : "＋ Add New Task"}
              </button>

              {editingId && (
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

            {filteredTasks.length === 0 ? (
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
