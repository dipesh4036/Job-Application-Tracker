import config from "../config/index.js";

const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal server error";

  if (config.nodeEnv === "development") {
    console.error(`❌ [${statusCode}] ${err.message}`);
    if (!err.isOperational) console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.nodeEnv === "development" &&
      !err.isOperational && { stack: err.stack }),
  });
};

export default errorHandler;
