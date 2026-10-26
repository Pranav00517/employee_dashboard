// ============================================================
//  app.js  –  Employee Dashboard Backend (Express + MongoDB)
// ============================================================

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── MongoDB Connection ───────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅  Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('❌  MongoDB connection error:', err.message);
    process.exit(1);
  });

// ─── Employee Schema & Model ──────────────────────────────────
const employeeSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    location:    { type: String, required: true, trim: true },
    salary:      { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

const Employee = mongoose.model('Employee', employeeSchema);

// ─── Routes ──────────────────────────────────────────────────

// GET  /api/employees        → retrieve ALL employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET  /api/employees/:id    → retrieve ONE employee
app.get('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/employees        → add a NEW employee
app.post('/api/employees', async (req, res) => {
  try {
    const { name, designation, location, salary } = req.body;

    // Basic server-side validation
    if (!name || !designation || !location || !salary) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const employee = new Employee({ name, designation, location, salary });
    const saved    = await employee.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT  /api/employees/:id    → update an existing employee
app.put('/api/employees/:id', async (req, res) => {
  try {
    const { name, designation, location, salary } = req.body;

    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, designation, location, salary },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'Employee not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/employees/:id  → delete a single employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Employee deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Health Check ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Employee Dashboard API is running 🚀' });
});

// ─── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  Server running on http://localhost:${PORT}`);
});
