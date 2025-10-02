
const express = require('express');
const cors = require('cors');
const db = require('./database.js');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Helper to format data for the frontend
const formatDataForFrontend = (rows) => {
  const result = {};
  rows.forEach(row => {
    if (!result[row.department]) {
      result[row.department] = {};
    }
    result[row.department][row.issue_type] = row.count;
  });
  return result;
};

// GET endpoint to fetch data for a specific month and year
app.get('/api/data/:year/:month', (req, res) => {
  const { year, month } = req.params;
  const sql = 'SELECT department, issue_type, count FROM issues WHERE year = ? AND month = ?';
  db.all(sql, [year, month], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(formatDataForFrontend(rows));
  });
});

// POST endpoint to increment a count
app.post('/api/increment', (req, res) => {
  const { department, issueType } = req.body;
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const findSql = 'SELECT count FROM issues WHERE year = ? AND month = ? AND department = ? AND issue_type = ?';
  db.get(findSql, [year, month, department, issueType], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (row) {
      // Update existing record
      const newCount = row.count + 1;
      const updateSql = 'UPDATE issues SET count = ? WHERE year = ? AND month = ? AND department = ? AND issue_type = ?';
      db.run(updateSql, [newCount, year, month, department, issueType], handleDbResponse(req, res));
    } else {
      // Insert new record
      const insertSql = 'INSERT INTO issues (year, month, department, issue_type, count) VALUES (?, ?, ?, ?, ?)';
      db.run(insertSql, [year, month, department, issueType, 1], handleDbResponse(req, res));
    }
  });
});

// POST endpoint to reset a count
app.post('/api/reset', (req, res) => {
    const { department, issueType } = req.body;
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const updateSql = 'UPDATE issues SET count = 0 WHERE year = ? AND month = ? AND department = ? AND issue_type = ?';
    db.run(updateSql, [year, month, department, issueType], handleDbResponse(req, res));
});


// Helper function to handle the database response and send back the latest monthly data
const handleDbResponse = (req, res) => (err) => {
  if (err) {
    return res.status(500).json({ error: err.message });
  }
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const sql = 'SELECT department, issue_type, count FROM issues WHERE year = ? AND month = ?';
  db.all(sql, [year, month], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(formatDataForFrontend(rows));
  });
};

// All remaining requests return the React app, so it can handle routing.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});