const express = require("express");
const cors = require("cors");
<p>Hello World</p>
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// In-memory "database" for notes
let notes = [];
let nextId = 1;

// Health check route
app.get("/", (req, res) => {
  res.send("Notes API is running ✅");
});

// Get all notes
app.get("/notes", (req, res) => {
  res.json(notes);
});

// Create a new note
app.post("/notes", (req, res) => {
  const { title, content } = req.body;

  if (!title && !content) {
    return res.status(400).json({ error: "title or content is required" });
  }

  const note = {
    id: nextId++,
    title: title || "",
    content: content || "",
    createdAt: new Date().toISOString(),
  };

  notes.push(note);
  res.status(201).json(note);
});

// Update a note
app.put("/notes/:id", (req, res) => {
  const noteId = parseInt(req.params.id, 10);
  const { title, content } = req.body;

  const note = notes.find((n) => n.id === noteId);

  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }

  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;

  res.json(note);
});

// Delete a note
app.delete("/notes/:id", (req, res) => {
  const noteId = parseInt(req.params.id, 10);
  const index = notes.findIndex((n) => n.id === noteId);

  if (index === -1) {
    return res.status(404).json({ error: "Note not found" });
  }

  notes.splice(index, 1);
  res.status(204).send(); // No content
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Notes API listening on port ${PORT}`);
});
