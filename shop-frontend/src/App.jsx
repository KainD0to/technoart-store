import { useState, useEffect } from 'react';
import { getProducts } from './services/api';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import LoginModal from './components/LoginModal';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    }
  };

  const addToCart = (product) => {
    setCart([...cart, { ...product, cartId: Date.now() }]);
    alert(`${product.name} добавлен в корзину!`);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoginOpen(false);
  };

  return (
    <div className="App">
      <Header 
        cartCount={cart.length}
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
      />
      
      <main className="container">
        <h1>🛍️ Наши товары</h1>
        <div className="products-grid">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </main>

      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;