export default function Header({ cartCount, user, onLoginClick, onCartClick, onLogoutClick }) {
  return (
    <header className="header">
      <div className="container">
        <h1>🛍️ Магазин</h1>
        <div className="header-actions">
          <button onClick={onCartClick} className="cart-btn">
            🛒 Корзина ({cartCount})
          </button>
          
          {user ? (
            <div className="user-menu">
              <span>Привет, {user.name}!</span>
              <button onClick={onLogoutClick} className="logout-btn">
                Выйти
              </button>
            </div>
          ) : (
            <button onClick={onLoginClick} className="login-btn">
              Войти
            </button>
          )}
        </div>
      </div>
    </header>
  );
}