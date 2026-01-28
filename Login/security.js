// utils/security.js

export function sanitizeInput(value) {
  return value.trim().toLowerCase();
}

/**
 * Simulación de hash (DEV ONLY)
 * En producción esto JAMÁS va en frontend
 */
export function fakeHash(password) {
  return password; // placeholder
}
