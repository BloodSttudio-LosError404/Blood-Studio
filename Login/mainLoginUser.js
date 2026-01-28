// mainLogin.js

import { login } from './authService.js';

const form = document.querySelector('.login-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const session = await login(email, password);

    if (session.role === 'ADMIN') {
      window.location.href = '../Dashboard/index.html';
    } else {
      window.location.href = '../Dashboard/user.html';
    }

  } catch (error) {
    alert(error.message);
  }
});
