export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">${product.price}</p>
      <p className="description">{product.description}</p>
      <button onClick={() => onAddToCart(product)} className="add-to-cart">
        В корзину
      </button>
    </div>
  );
}