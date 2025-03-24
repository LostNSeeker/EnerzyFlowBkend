export const APP_CONSTANTS = {
    OTP_EXPIRY: 300, // 5 minutes in seconds
    JWT_EXPIRY: '7d',
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
    MAX_LOGIN_ATTEMPTS: 15,
    RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS_PER_WINDOW: 100
  };