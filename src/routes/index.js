// Module imports
const express = require('express');

// Router
const router = new express.Router();

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

// Export router module
module.exports = router;
