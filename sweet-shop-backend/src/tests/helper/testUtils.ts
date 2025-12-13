// Helper to generate appropriate IDs based on environment
export const generateTestId = (): string => {
  // In test environment (SQLite), use UUID
  // In production (MongoDB), would use ObjectID
  if (process.env.NODE_ENV === 'test') {
    // For SQLite tests, use simple incremental IDs or UUIDs
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
  // For MongoDB, ObjectID format
  return require('crypto').randomBytes(12).toString('hex');
};

// Validate if ID is valid for current environment
export const isValidId = (id: string): boolean => {
  if (process.env.NODE_ENV === 'test') {
    // SQLite accepts any string ID
    return typeof id === 'string' && id.length > 0;
  }
  // MongoDB requires 24-character hex string
  return /^[0-9a-fA-F]{24}$/.test(id);
};