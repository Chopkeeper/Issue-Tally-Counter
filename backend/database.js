
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const DBSOURCE = path.join(__dirname, "database.db");

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS issues (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            year INTEGER,
            month INTEGER,
            department TEXT,
            issue_type TEXT,
            count INTEGER,
            UNIQUE(year, month, department, issue_type)
        )`, (err) => {
            if (err) {
                // Table already created
                console.log('Table "issues" already exists.');
            } else {
                // Table just created
                console.log('Table "issues" created successfully.');
            }
        });
    }
});

module.exports = db;