export default function errorHandler(err, req, res, next) {
  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const details = err.errors.map(e => ({
      field: e.path,
      message: e.message,
    }));

    res.status(400).json({
      success: false,
      error: 'Validation Error',
      details,
    });
    return next(err); // pass to next middleware if needed
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    res.status(409).json({
      success: false,
      error: 'Duplicate entry',
    });
    return next(err);
  }

  // Sequelize database errors
  if (err.name === 'SequelizeDatabaseError') {
    res.status(500).json({
      success: false,
      error: 'Database error',
      message: err.message,
    });
    return next(err);
  }

  // All other errors
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: 'Internal server error',
    message: err.message,
  });
  return next(err);
}
