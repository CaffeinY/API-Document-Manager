const express = require('express');
const app = express();
const cors = require('cors');
const docsRoutes = require('./routes/docsRoutes');
const {initializeDatabase} = require('./config/db');

require('dotenv').config();


app.use(cors({
  origin: '*',
  credentials: true,  // enable set cookie
  exposedHeaders: ['accessToken'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());


// initialize the database connection pool


app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.use('/api/docs', docsRoutes);


const port = process.env.PORT || 3001; // Default to 3000 if PORT is not set


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

