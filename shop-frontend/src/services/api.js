import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

export const api = axios.create({
  baseURL: API_BASE,
});

// Получить все товары
export const getProducts = () => api.get('/products');

// Регистрация
export const registerUser = (userData) => api.post('/auth/register', userData);

// Авторизация
export const loginUser = (credentials) => api.post('/auth/login', credentials);