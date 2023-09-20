import validator from "validator";

function sanitizeMiddleware(req, res, next) {
    // Sanitize request params
    for (const key in req.params) {
      if (Object.hasOwnProperty.call(req.params, key)) {
        req.params[key] = validator.escape(req.params[key]);
      }
    }
  
    // Sanitize request query
    for (const key in req.query) {
      if (Object.hasOwnProperty.call(req.query, key)) {
        req.query[key] = validator.escape(req.query[key]);
      }
    }
  
    // Sanitize request body
    for (const key in req.body) {
      if (Object.hasOwnProperty.call(req.body, key)) {
        if (typeof req.body[key] === 'string') {
          req.body[key] = validator.escape(req.body[key]);
        }
      }
    }
  
    next();
  }
  
export default sanitizeMiddleware;