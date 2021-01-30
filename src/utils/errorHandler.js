/**
 * Returns all errors
 * @param {object} res - The response object
 * @param {number} code - The response code
 * @param {string} message - The error message
 * @return {object}
 */
const returnError = (res, code, message) =>
  res.status(code).send({
    message,
    status: 'error',
    data: null,
  });

/**
 * Returns error for a required field
 * @param {object} res - The response object
 * @param {string} field - A request field
 * @param {string} parent - Name of the field's parent
 * @return {function}
 */
const requiredError = (res, field, parent) =>
  returnError(
      res,
      400,
      `${field}${parent ? ` in ${parent}` : ''} is required.`,
  );

/**
 * Returns error for a invalid field type
 * @param {object} res - The response object
 * @param {string} field - A request field
 * @param {string[]} types - A required type
 * @param {string} [customMessage] - Custome error message
 * @return {function}
 */
const typeError = (res, field, types, customMessage) =>
  returnError(
      res,
      400,
    customMessage ?
      customMessage :
      `${field} should be a ${types.join(' or ')}.`,
  );

module.exports = {
  returnError,
  requiredError,
  typeError,
};
