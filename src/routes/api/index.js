// Get parsed .env variables
const {parsed} = require('dotenv').config();

/**
 * Handlees GET request for the base route
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @return {Promise<object>}
 */
const homeHandler = (req, res) =>
  res.status(200).send({
    message: 'My Rule-Validation API.',
    status: 'success',
    data: parsed,
  });

// Module export
module.exports = homeHandler;
