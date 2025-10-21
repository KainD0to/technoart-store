import { useState } from 'react';
import { loginUser, registerUser } from '../services/api';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let response;
      if (isLogin) {
        response = await loginUser(formData);
      } else {
        response = await registerUser(formData);
      }
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        onLoginSuccess(response.data.user);
        onClose();
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Ошибка авторизации');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Имя"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <button type="submit">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
        </form>
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="switch-mode"
        >
          {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
        </button>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>
    </div>
  );
}