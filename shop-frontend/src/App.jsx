import { useState, useEffect, useCallback } from 'react';
import { getProducts } from './services/api';
import { useCart } from './context/CartContext';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import LoginModal from './components/LoginModal';
import Cart from './components/Cart';
import SearchFilters from './components/SearchFilters';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: ''
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const { addToCart, count, clearCart } = useCart();

  // Загрузка данных
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await getProducts();
        const productsData = response.data;
        setProducts(productsData);
        setFilteredProducts(productsData);
        
        const token = localStorage.getItem('token');
        if (token) {
          const userData = localStorage.getItem('user');
          if (userData) setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    loadInitialData();
  }, []);

  // Оптимизированная фильтрация
  useEffect(() => {
    const filtered = products.filter(product => {
      const matchesSearch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !filters.category || 
        product.category === filters.category;
      
      const matchesMinPrice = !filters.minPrice || 
        product.price >= Number(filters.minPrice);
      
      const matchesMaxPrice = !filters.maxPrice || 
        product.price <= Number(filters.maxPrice);

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, filters]);

  // useCallback для оптимизации
  const handleAddToCart = useCallback((product) => {
    addToCart(product);
    alert(`${product.name} добавлен в корзину!`);
  }, [addToCart]);

  const handleLoginSuccess = useCallback((userData) => {
    setUser(userData);
    setIsLoginOpen(false);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    clearCart();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, [clearCart]);

  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setFilters({ category: '', minPrice: '', maxPrice: '' });
  }, []);

  return (
    <div className="App">
      <Header 
        cartCount={count}
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
        onLogoutClick={handleLogout}
      />
      
      <main className="container">
        
        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onResetFilters={handleResetFilters}
          productsCount={filteredProducts.length}
        />
        
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-products">
            😔 Товары не найдены. Попробуйте изменить параметры поиска.
          </div>
        )}
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