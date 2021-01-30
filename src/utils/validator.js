/**
 * Validates according to defined rule
 * @param {string | array | object | number} fieldValue - Value to validate
 * @param {condition} condition - Condition to validate against
 * @param {string | number} conditionValue - value to validate condition against
 * @return {bool}
 */
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

/**
 * Check if field to validate exists
 * @param {object} data
 * @param {string} field
 * @return {string | array | object | number}
 */
const valueToValidate = (data, field) => {
  if (!field.includes('.')) {
    return data[field];
  } else {
    const fieldArray = field.split('.');

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

module.exports = {
  validate,
  valueToValidate,
};
