import express from 'express';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; // Берем порт из .env

app.use(cors());
app.use(express.json());

// Подключение к PostgreSQL через .env
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
  // Или можно так:
  // user: process.env.DB_USER,
  // host: process.env.DB_HOST,
  // database: process.env.DB_NAME,
  // password: process.env.DB_PASSWORD,
  // port: process.env.DB_PORT,
});

// Тестовый роут
app.get('/', (req, res) => {
  res.json({ 
    message: '🛍️ Сервер работает!',
    port: process.env.PORT,
    database: process.env.DB_NAME
  });
});

// Роут товаров
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Роут корзины - получение корзины пользователя
app.get('/api/cart', async (req, res) => {
  try {
    // В реальном приложении здесь бы проверялся JWT токен
    // и получалась корзина из БД для конкретного пользователя
    
    // Пока просто возвращаем тестовые данные или пустой массив
    res.json({
      message: 'Корзина пользователя',
      items: [], // В будущем здесь будут товары из БД
      total: 0
    });
  } catch (error) {
    console.error('❌ Ошибка получения корзины:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Сохранение корзины пользователя
app.post('/api/cart', async (req, res) => {
  try {
    const { items, userId } = req.body;
    
    console.log('🛒 Сохранение корзины:', { 
      userId, 
      itemsCount: items?.length 
    });
    
    // В реальном приложении здесь бы сохранялось в БД
    // Пока просто логируем и возвращаем успех
    
    res.json({
      message: 'Корзина сохранена',
      savedItems: items?.length || 0
    });
  } catch (error) {
    console.error('❌ Ошибка сохранения корзины:', error);
    res.status(500).json({ error: 'Ошибка сохранения корзины' });
  }
});

// Очистка корзины пользователя
app.delete('/api/cart', async (req, res) => {
  try {
    const { userId } = req.body;
    
    console.log('🗑️ Очистка корзины пользователя:', userId);
    
    // В реальном приложении здесь бы удалялись данные из БД
    
    res.json({
      message: 'Корзина очищена'
    });
  } catch (error) {
    console.error('❌ Ошибка очистки корзины:', error);
    res.status(500).json({ error: 'Ошибка очистки корзины' });
  }
});

// Регистрация пользователя
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Пользователь уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name]
    );
    
    res.json({ 
      message: 'Пользователь создан',
      user: result.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Авторизация
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 Попытка входа:', { email, password: '***' }); // Логируем запрос
    
    // Ищем пользователя
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log('📊 Найден пользователь:', result.rows[0] ? 'да' : 'нет'); // Логируем результат поиска
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Пользователь не найден' });
    }

    const user = result.rows[0];
    console.log('👤 Данные пользователя из БД:', { 
      id: user.id, 
      email: user.email, 
      hasPassword: !!user.password 
    }); // Логируем данные пользователя
    
    // Проверяем пароль
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('🔑 Проверка пароля:', validPassword ? 'успех' : 'неверный пароль'); // Логируем проверку пароля
    
    if (!validPassword) {
      return res.status(400).json({ error: 'Неверный пароль' });
    }

    // Создаем JWT токен
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Успешный вход, токен создан');
    
    res.json({
      message: 'Успешный вход',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('❌ Ошибка входа:', error);
    res.status(500).json({ error: error.message });
  }
});


// Запуск сервера
app.listen(PORT, 'localhost', () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📊 База данных: ${process.env.DB_NAME}`);
  console.log(`🔐 JWT секрет: ${process.env.JWT_SECRET ? 'установлен' : 'не установлен'}`);
});