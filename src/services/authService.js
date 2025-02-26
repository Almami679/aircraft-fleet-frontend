    // src/services/authService.js
    import axios from 'axios';

    // Si NO tienes proxy, usa la URL completa: 'http://localhost:8080'
    export const register = (username, password) => {
      return axios.post('/auth/register', {
        userName: username, // backend espera "userName"
        password,
        role: 'USER'
      });
    };

    export const login = (username, password) => {
      return axios.post('/auth/login', {
        userName: username, // backend espera "userName"
        password,
        role: 'USER'
      });
    };
