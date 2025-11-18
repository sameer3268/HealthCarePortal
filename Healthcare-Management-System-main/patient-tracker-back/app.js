const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const patientRoutes = require('./routes/patientRoutes')
const appointmentRoutes = require('./routes/appointmentRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientHealthMetricsRoutes = require('./routes/patientHealthMetricsRoutes');
const { verifyToken } = require('./jwt-middleware');


const app = express();
app.use(bodyParser.json());
// Allow local dev (Vite) and production origin
const allowedOrigins = [
	'https://patient-tracker.netlify.app',
	'http://localhost:5173'
];


// MongoDB Connection: prefer MONGO_URI from .env, fallback to legacy atlas url using MONGO_PWD
const mongoUri = process.env.MONGO_URI || `mongodb+srv://sudharshan:${process.env.MONGO_PWD}@patient-tracker-codecel.5vzdhw8.mongodb.net/patient_data?retryWrites=true&w=majority`;
mongoose.connect(mongoUri)
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.log('Error connecting to MongoDB:', err));

app.use('/api/doctors', doctorRoutes);
app.use(verifyToken)
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/patient-health-metrics', patientHealthMetricsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));