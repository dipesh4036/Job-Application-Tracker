import ApiError from "../utils/ApiError.js";

const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const messages = result.error.issues.map(
        (err) => `${err.path.join(".")}: ${err.message}`,
      );
      return next(ApiError.badRequest(messages.join("; ")));
    }

    req[source] = result.data;
    next();
  };

export default validate;
