const conditions = require('../../utils/conditions');

// Module export
module.exports = (req, res) => {
  const returnError = (code, message) =>
    res.status(code).send({
      message,
      status: 'error',
      data: null,
    });

  const requiredError = (field, parent) =>
    returnError(400, `${field}${parent ? ` in ${parent}` : ''} is required.`);

  const typeError = (field, types, customMessage) =>
    returnError(
        400,
      customMessage ?
        customMessage :
        `${field} should be a ${types.join(' or ')}.`,
    );

  const validate = (fieldValue, condition, conditionValue) =>
    ({
      eq: fieldValue === conditionValue,
      neq: fieldValue !== conditionValue,
      gt: fieldValue > conditionValue,
      gte: fieldValue >= conditionValue,
      contains:
        Array.isArray(fieldValue) || typeof fieldValue === 'string' ?
          fieldValue.includes(conditionValue) :
          false,
    }[condition] || false);

  const {body} = req;

  console.log(typeof body['data'], req.is('application/json'));

  // Check if body is valid JSON
  if (!req.is('application/json')) {
    return returnError(400, 'Invalid JSON payload passed.');
  }

  // Check for rule and data
  if (body['rule'] === undefined) return requiredError('rule');
  if (body['data'] === undefined) return requiredError('data');

  // Check that rule is json object
  const {rule, data} = body;
  if (typeof rule !== 'object') return typeError('rule', ['json object']);

  // Check for required fields and valid field types in rule JSON object
  const ruleObject = rule;
  if (ruleObject['field'] === undefined) return requiredError('field', 'rule');
  if (ruleObject['condition'] === undefined) {
    return requiredError('condition', 'rule');
  }
  if (!conditions.includes(ruleObject['condition'])) {
    return typeError(
        'condition',
        'rule',
        `Condition in rule should be either ${conditions.join(' or ')} .`,
    );
  }
  if (ruleObject['condition_value'] === undefined) {
    return requiredError('condition_value', 'rule');
  }

  // Check for valid data type
  if (
    !(
      typeof data === 'string' ||
      typeof data === 'object' ||
      Array.isArray(data)
    )
  ) {
    return typeError('data', ['valid JSON object', 'valid array', 'string']);
  }

  // Check for field to validate
  const valueToValidate = () => {
    const field = ruleObject['field'];

    if (!field.includes('.')) {
      return data[field];
    } else {
      const fieldArray = ruleObject['field'].split('.');

      return (
        {
          2: data[fieldArray[0]] && data[fieldArray[0]][fieldArray[1]],
          3:
            data[fieldArray[0]] &&
            data[fieldArray[0]][fieldArray[1]] &&
            data[fieldArray[0]][fieldArray[1]][fieldArray[2]],
        }[fieldArray.length] ||
        (data[fieldArray[0]] &&
          data[fieldArray[0]][fieldArray[1]] &&
          data[fieldArray[0]][fieldArray[1]][fieldArray[2]] &&
          data[fieldArray[0]][fieldArray[1]][fieldArray[2]][fieldArray[3]])
      );
    }
  };

  if (!valueToValidate()) {
    return returnError(
        400,
        `field ${ruleObject['field']} is missing from data`,
    );
  }

  return validate(
      valueToValidate(),
      ruleObject['condition'],
      ruleObject['condition_value'],
  ) === true ?
    res.status(200).send({
      message: `field ${ruleObject['field']} successfully validated.`,
      status: 'success',
      data: {
        validation: {
          error: false,
          field: ruleObject['field'],
          field_value: valueToValidate(),
          condition: ruleObject['condition'],
          condition_value: ruleObject['condition_value'],
        },
      },
    }) :
    res.status(400).send({
      message: `field ${ruleObject['field']} failed validation.`,
      status: 'error',
      data: {
        validation: {
          error: true,
          field: ruleObject['field'],
          field_value: valueToValidate(),
          condition: ruleObject['condition'],
          condition_value: ruleObject['condition_value'],
        },
      },
    });
};
