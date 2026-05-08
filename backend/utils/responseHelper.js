/**
 * Standard API Response Helper
 * Memastikan semua response mengikuti format yang konsisten
 */

const successResponse = (res, data = null, message = 'Success', statusCode = 200, meta = null) => {
  const response = {
    status: 'success',
    message,
    data,
  };
  if (meta) response.meta = meta;
  return res.status(statusCode).json(response);
};

const createdResponse = (res, data = null, message = 'Resource created successfully') => {
  return successResponse(res, data, message, 201);
};

const errorResponse = (res, message = 'Internal server error', statusCode = 500, errors = null) => {
  const response = {
    status: 'error',
    message,
  };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

const validationErrorResponse = (res, errors) => {
  return res.status(422).json({
    status: 'error',
    message: 'Validation failed',
    errors,
  });
};

const notFoundResponse = (res, message = 'Resource not found') => {
  return errorResponse(res, message, 404);
};

const unauthorizedResponse = (res, message = 'Unauthorized') => {
  return errorResponse(res, message, 401);
};

const forbiddenResponse = (res, message = 'Forbidden') => {
  return errorResponse(res, message, 403);
};

module.exports = {
  successResponse,
  createdResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
};
