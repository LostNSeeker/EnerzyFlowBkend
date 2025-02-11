export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: Object.values(err.errors).map(error => ({
          field: error.path,
          message: error.message
        }))
      });
    }
  
    // Mongoose duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate field value entered',
        field: Object.keys(err.keyPattern)[0]
      });
    }
  
    // JWT error
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  
    // Multer error
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
  
    // Default error
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal Server Error'
    });
  };