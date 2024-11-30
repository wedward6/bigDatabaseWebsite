const express = require('express');
const path = require('path');

const app = express();

// Serve static files (CSS, JS, images, HTML files)
app.use(express.static(path.join(__dirname, 'BigDatabaseWebsite')));

// Route '/' to serve `ClothingStoreHomePage.html`
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'BigDatabaseWebsite', 'ClothingStoreHomePage.html'));
});
// Define the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
