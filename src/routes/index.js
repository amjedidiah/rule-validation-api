// Module import
const express = require('express');

// Router
const router = new express.Router();

// Set valid endpoits and request types
router.get('/', require('./api'));
router.post('/validate-rule', require('./api/validate-rule'));

// Response on all other endpoints
router.all('*', (req, res) =>
  res.status(404).send({
    message: 'Incorrect Route',
    status: 'error',
    data: null,
  }),
);

// Export router
module.exports = router;
