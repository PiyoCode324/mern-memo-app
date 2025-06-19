const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const memoRoutes = require('./routes/memos');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

app.use(cors());
app.use(express.json());

app.use('/api/memos', memoRoutes);

app.get('/', (req, res) => {
  res.send('Hello from Memo App!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
