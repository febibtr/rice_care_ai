const { validationResult } = require('express-validator');
const { validationErrorResponse } = require('../utils/responseHelper');

/**
 * Middleware: Jalankan setelah express-validator rules
 * Otomatis return 422 jika ada error validasi
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return validationErrorResponse(res, formatted);
  }
  next();
};

module.exports = validate;
