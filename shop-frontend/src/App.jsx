import { useState, useEffect } from 'react';
import { getProducts } from './services/api';
import { useCart } from './context/CartContext';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import LoginModal from './components/LoginModal';
import Cart from './components/Cart';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  const { addToCart, count, clearCart } = useCart();

  // Загружаем товары и пользователя при загрузке приложения
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Загружаем товары
        const response = await getProducts();
        setProducts(response.data);
        
        // Загружаем пользователя из localStorage
        const token = localStorage.getItem('token');
        if (token) {
          const userData = localStorage.getItem('user');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    loadInitialData();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} добавлен в корзину!`);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoginOpen(false);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    clearCart();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('👋 Пользователь вышел из системы');
  };

  return (
    <div className="App">
      <Header 
        cartCount={count}
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
        onLogoutClick={handleLogout} // Передаем функцию выхода
      />
      
      <main className="container">
        <h1>🛍️ Наши товары</h1>
        <div className="products-grid">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </main>

      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
}

export default App;