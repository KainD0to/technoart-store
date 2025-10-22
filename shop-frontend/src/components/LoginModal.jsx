import { useState } from 'react';
import { loginUser, registerUser } from '../services/api';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  
  try {
    console.log('🔄 Отправка данных:', { 
      isLogin, 
      email: formData.email, 
      hasPassword: !!formData.password 
    });
    
    let response;
    if (isLogin) {
      response = await loginUser(formData);
    } else {
      response = await registerUser(formData);
    }
    
    console.log('📨 Ответ от сервера:', response.data);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      onLoginSuccess(response.data.user);
      onClose();
    } else {
      setError('Не получили токен от сервера. Ответ: ' + JSON.stringify(response.data));
    }
  } catch (error) {
    console.error('❌ Ошибка запроса:', error);
    
    // Детальная информация об ошибке
    if (error.response) {
      // Сервер ответил с ошибкой
      const status = error.response.status;
      const data = error.response.data;
      console.log('📊 Детали ошибки:', { status, data });
      setError(`Ошибка ${status}: ${data.error || 'Неизвестная ошибка сервера'}`);
    } else if (error.request) {
      // Запрос был сделан, но ответа нет
      setError('Нет ответа от сервера. Проверьте, запущен ли бэкенд.');
    } else {
      // Что-то пошло не так при настройке запроса
      setError('Ошибка настройки запроса: ' + error.message);
    }
  } finally {
    setLoading(false);
  }
};

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
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
          <button type="submit" disabled={loading}>
            {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>
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