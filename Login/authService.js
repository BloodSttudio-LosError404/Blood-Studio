// services/authService.js

import { sanitizeInput, fakeHash } from './security.js';
import { AUTH_CONFIG } from './auth.config.js';

const USERS_PATH = '../src/data/users.mock.json';

/**
 * En el futuro solo cambias esta función
 * para consumir una API real
 */
async function fetchUsers() {
  const response = await fetch(USERS_PATH);
  if (!response.ok) throw new Error('No se pudo cargar usuarios');
  return response.json();
}

export async function login(email, password) {
  const cleanEmail = sanitizeInput(email);
  const passwordHash = fakeHash(password);

  const users = await fetchUsers();

  const user = users.find(
    u => u.email === cleanEmail && u.passwordHash === passwordHash
  );

  if (!user) {
    throw new Error('Credenciales incorrectas');
  }

  // Guardar sesión mínima (NO contraseña)
  const session = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  sessionStorage.setItem(
    AUTH_CONFIG.STORAGE_KEY,
    JSON.stringify(session)
  );

  return session;
}

export function isAdmin() {
  const session = JSON.parse(
    sessionStorage.getItem(AUTH_CONFIG.STORAGE_KEY)
  );

  return session?.role === AUTH_CONFIG.ADMIN_ROLE;
}

export function logout() {
  sessionStorage.removeItem(AUTH_CONFIG.STORAGE_KEY);
}
