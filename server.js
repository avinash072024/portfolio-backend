const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const compression = require('compression');
const connectDB = require('./config/db');
const projectRoutes = require('./routes/projectRoutes');
const projectCategoryRoutes = require('./routes/projectCategoryRoutes');
const skillRoutes = require('./routes/skillRoutes');
const skillCategoryRoutes = require('./routes/skillCategoryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const educationRoutes = require('./routes/educationRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const emailRoutes = require('./routes/emailRoutes');
const path = require('path');


// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/project-categories', projectCategoryRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/skill-categories', skillCategoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/visitor', visitorRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/emails', emailRoutes);

// Base route for testing
app.get('/', (req, res) => {
  res.send({success: true, message: 'Portfolio API is running...' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
