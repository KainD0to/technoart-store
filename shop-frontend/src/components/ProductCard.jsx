export default function ProductCard({ product, onAddToCart }) {
  // Для отображения - добавляем $
  const displayPrice = `$${product.price}`;

  const handleAddToCart = () => {
    // В данные передаем ЧИСЛО (без $)
    const safeProduct = {
      ...product,
      price: product.price // уже число из API
    };
    
    console.log('🛒 Adding to cart:', safeProduct);
    onAddToCart(safeProduct);
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">{displayPrice}</p> {/* Отображаем с $ */}
      <p className="description">{product.description}</p>
      <button onClick={handleAddToCart} className="add-to-cart">
        В корзину
      </button>
    </div>
  );
}