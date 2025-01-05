"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
exports.rateLimiter = (0, express_rate_limit_1.rateLimit)({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    statusCode: 429,
    message: "Too many requests, please try again later.",
  },
  headers: true,
});
//# sourceMappingURL=rate-limit.middleware.js.map
