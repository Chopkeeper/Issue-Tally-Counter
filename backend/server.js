const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./database.js');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 3001;

// Helper to format data for the frontend
const formatDataForFrontend = (docs) => {
  const result = {};
  docs.forEach(doc => {
    if (!result[doc.department]) {
      result[doc.department] = {};
    }
    result[doc.department][doc.issue_type] = doc.count;
  });
  return result;
};


async function main() {
    const db = await connectDB();
    const issuesCollection = db.collection('issues');

    app.use(cors());
    app.use(express.json());
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    // Helper function to get latest data and send response
    const sendLatestData = async (res, year, month) => {
        try {
            const data = await issuesCollection.find({ 
                year: parseInt(year), 
                month: parseInt(month) 
            }).toArray();
            res.json(formatDataForFrontend(data));
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch latest data: ' + err.message });
        }
    };

    app.get('/api/data/:year/:month', async (req, res) => {
      const { year, month } = req.params;
      await sendLatestData(res, year, month);
    });

    app.post('/api/increment', async (req, res) => {
        try {
            const { department, issueType } = req.body;
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            
            const filter = { year, month, department, issue_type: issueType };
            const update = { $inc: { count: 1 } };
            const options = { upsert: true };

            await issuesCollection.updateOne(filter, update, options);
            
            await sendLatestData(res, year, month);
        } catch (err) {
            res.status(500).json({ error: 'Failed to increment: ' + err.message });
        }
    });

    app.post('/api/reset', async (req, res) => {
        try {
            const { department, issueType } = req.body;
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            
            const filter = { year, month, department, issue_type: issueType };
            const existingDoc = await issuesCollection.findOne(filter);

            if (existingDoc) {
                 const update = { $set: { count: 0 } };
                 await issuesCollection.updateOne(filter, update);
            }

            await sendLatestData(res, year, month);
        } catch (err) {
            res.status(500).json({ error: 'Failed to reset: ' + err.message });
        }
    });

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

main();
