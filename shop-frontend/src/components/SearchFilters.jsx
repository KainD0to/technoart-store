import { useState, memo } from "react";

const SearchFilters = memo(({ 
  searchTerm, 
  onSearchChange, 
  filters, 
  onFiltersChange,
  onResetFilters,
  productsCount
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="search-filters">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Поиск гитар, усилителей, аксессуаров..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        <button 
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="filters-toggle"
        >
          🎛️ {isFiltersOpen ? 'Скрыть' : 'Показать'} фильтры
        </button>
      </div>

      {isFiltersOpen && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Категория:</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">Все категории</option>
              <option value="guitar">🎸 Гитары</option>
              <option value="bass">🎸 Бас-гитары</option>
              <option value="amplifier">🔊 Усилители</option>
              <option value="pick">🎵 Медиаторы</option>
              <option value="strings">🎻 Струны</option>
              <option value="accessories">💎 Аксессуары</option>
            </select>
          </div>

          <div className="price-filters">
            <div className="filter-group">
              <label>Цена от:</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Цена до:</label>
              <input
                type="number"
                placeholder="10000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
          </div>

          <button onClick={onResetFilters} className="reset-filters">
            🗑️ Сбросить фильтры
          </button>
        </div>
      )}

      <div className="search-stats">
        📊 Найдено товаров: {productsCount}
      </div>
    </div>
  );
});

export default SearchFilters;