import { useCart } from '../context/CartContext';

export default function Cart({ isOpen, onClose }) {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();

  // ЗАЩИТА: гарантируем что total - число
  const safeTotal = typeof total === 'number' ? total : 0;
  const displayTotal = `$${safeTotal.toFixed(2)}`;

  console.log('🛒 Cart debug:', { 
    total, 
    typeof: typeof total,
    safeTotal,
    items 
  });

  if (!isOpen) return null;

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
                  const safeItemPrice = typeof item.price === 'number' ? item.price : 0;
                  const displayPrice = `$${safeItemPrice.toFixed(2)}`;
                  
                  return (
                    <div key={item.id} className="cart-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p className="price">{displayPrice}</p>
                      </div>
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                  <strong>Итого: {displayTotal}</strong>
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
}