// Conditions
const conditions = require('../../utils/conditions');

// ErrorHandler
const errorHandler = require('../../utils/errorHandler');

// Validator
const validator = require('../../utils/validator');

/**
 * Handlees POST request for /validate-rule
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @return {Promise<object>}
 */
const validateRuleHandler = (req, res) => {
  const {body} = req;

  // console.log(typeof body['data'], req.is('application/json'));

  // Check if body is valid JSON
  if (!req.is('application/json')) {
    return errorHandler.returnError(res, 400, 'Invalid JSON payload passed.');
  }

  // Check for rule and data
  if (body['rule'] === undefined) {
    return errorHandler.requiredError(res, 'rule');
  }
  if (body['data'] === undefined) {
    return errorHandler.requiredError(res, 'data');
  }

  // Check that rule is json object
  const {rule, data} = body;
  if (typeof rule !== 'object') {
    return errorHandler.typeError(res, 'rule', ['json object']);
  }

  // Check for required fields and valid field types in rule JSON object
  const ruleObject = rule;
  if (ruleObject['field'] === undefined) {
    return errorHandler.requiredError(res, 'field', 'rule');
  }
  if (ruleObject['condition'] === undefined) {
    return errorHandler.requiredError(res, 'condition', 'rule');
  }
  if (!conditions.includes(ruleObject['condition'])) {
    return errorHandler.typeError(
        res,
        'condition',
        'rule',
        `Condition in rule should be either ${conditions.join(' or ')} .`,
    );
  }
  if (ruleObject['condition_value'] === undefined) {
    return errorHandler.requiredError(res, 'condition_value', 'rule');
  }

  // Check for valid data type
  if (
    !(
      typeof data === 'string' ||
      typeof data === 'object' ||
      Array.isArray(data)
    )
  ) {
    return errorHandler.typeError(res, 'data', [
      'valid JSON object',
      'valid array',
      'string',
    ]);
  }

  if (!validator.valueToValidate(data, ruleObject['field'])) {
    return errorHandler.returnError(
        res,
        400,
        `field ${ruleObject['field']} is missing from data`,
    );
  }

  const isValid = validator.validate(
      validator.valueToValidate(data, ruleObject['field']),
      ruleObject['condition'],
      ruleObject['condition_value'],
  );

  return res.status(isValid ? 200 : 400).send({
    message: isValid ?
      `field ${ruleObject['field']} successfully validated.` :
      `field ${ruleObject['field']} failed validation.`,
    success: isValid ? 'success' : 'error',
    data: {
      validation: {
        error: isValid ? false : true,
        field: ruleObject['field'],
        field_value: validator.valueToValidate(data, ruleObject['field']),
        condition: ruleObject['condition'],
        condition_value: ruleObject['condition_value'],
      },
    },
  });
};

// Module export
module.exports = validateRuleHandler;
