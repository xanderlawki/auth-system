import { rateLimit } from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute in milliseconds
  max: 5, // Maximum 10 requests per minute
  message: {
    statusCode: 429,
    message: "Too many requests, please try again later.",
  },
  headers: true, // Include rate-limit headers in the response
});
