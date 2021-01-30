// Get parsed .env variables
const { parsed } = require('dotenv').config();

// Module export
module.exports = (req, res) =>
  res.status(200).send({
    message: 'My Rule-Validation API.',
    status: 'success',
    data: parsed
  });
