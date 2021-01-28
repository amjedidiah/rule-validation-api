// Module imports
const express = require('express');

// Initiate our app
const app = express();
const port = process.env.PORT || 8008;

// Listen on Port 8008
app.listen(port, () => console.log(`App started on ${port}`));
