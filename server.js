const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/remedies', require('./routes/remedies'));
app.use('/api/repertory', require('./routes/repertory'));
app.use('/api/prescriptions', require('./routes/prescriptions'));
app.use('/api/consultations', require('./routes/consultations'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Homeopathic Practice Manager API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
