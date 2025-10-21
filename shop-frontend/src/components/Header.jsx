export default function Header({ cartCount, user, onLoginClick }) {
  return (
    <header className="header">
      <div className="container">
        <h1>🛍️ Магазин</h1>
        <div className="header-actions">
          <span>Корзина: {cartCount}</span>
          {user ? (
            <span>Привет, {user.name}!</span>
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