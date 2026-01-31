const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Debug: Check if public directory exists
const publicPath = path.join(__dirname, 'public');
console.log('Public directory path:', publicPath);
console.log('Public directory exists:', fs.existsSync(publicPath));
if (fs.existsSync(publicPath)) {
  console.log('Files in public:', fs.readdirSync(publicPath));
}

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve static files from 'public' directory
app.use(express.static(publicPath));

// Set correct MIME types
app.use((req, res, next) => {
  if (req.url.endsWith('.css')) {
    res.type('text/css');
  } else if (req.url.endsWith('.js')) {
    res.type('application/javascript');
  } else if (req.url.endsWith('.csv')) {
    res.type('text/csv');
  }
  next();
});

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Dashboards available at:`);
  console.log(`  - Opus:   http://localhost:${PORT}/opus.html`);
  console.log(`  - OpenAI: http://localhost:${PORT}/openai.html`);
  console.log(`  - Gemini: http://localhost:${PORT}/gemini.html`);
});