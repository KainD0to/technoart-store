import { useCart } from '../context/CartContext';

export default function Cart({ isOpen, onClose }) {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();

  console.log('🛒 Cart component rendered:', { 
    isOpen, 
    itemsCount: items.length,
    items: items 
  });

  // Добавим проверку на ошибки
  if (!isOpen) return null;

  try {
    return (
      <div className="cart-overlay">
        <div className="cart">
          <div className="cart-header">
            <h2>🛒 Корзина</h2>
            <button onClick={onClose} className="close-btn">✕</button>
          </div>

          <div className="cart-content">
            {items.length === 0 ? (
              <p className="empty-cart">Корзина пуста</p>
            ) : (
              <>
                <div className="cart-items">
                  {items.map(item => {
                    console.log('📦 Rendering cart item:', item);
                    return (
                      <div key={item.id} className="cart-item">
                        <img 
                          src={item.image || '/placeholder.jpg'} 
                          alt={item.name} 
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/60x60/cccccc/666666?text=No+Image';
                          }}
                        />
                        <div className="item-info">
                          <h4>{item.name || 'Без названия'}</h4>
                          <p className="price">${item.price || 0}</p>
                        </div>
                        <div className="quantity-controls">
                          <button 
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                            disabled={(item.quantity || 1) <= 1}
                          >
                            -
                          </button>
                          <span>{item.quantity || 1}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="remove-btn"
                        >
                          🗑️
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="cart-footer">
                  <div className="total">
                    <strong>Итого: ${(total || 0).toFixed(2)}</strong>
                  </div>
                  <div className="cart-actions">
                    <button onClick={clearCart} className="clear-btn">
                      Очистить корзину
                    </button>
                    <button className="checkout-btn">
                      Оформить заказ
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('❌ Error in Cart component:', error);
    return (
      <div className="cart-overlay">
        <div className="cart">
          <div className="cart-header">
            <h2>🛒 Корзина</h2>
            <button onClick={onClose} className="close-btn">✕</button>
          </div>
          <div className="cart-content">
            <p className="error-message">Ошибка загрузки корзины: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }
}