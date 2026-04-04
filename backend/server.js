const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Running');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api/upload", uploadRoutes);

const searchRoutes = require("./routes/searchRoutes");
app.use('/api', searchRoutes);