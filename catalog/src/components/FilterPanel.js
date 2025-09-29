import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FilterPanel = ({ filters, onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    // Загрузка категорий
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (categorySlug) => {
    const newSelectedCategories = selectedCategories.includes(categorySlug)
      ? selectedCategories.filter(cat => cat !== categorySlug)
      : [...selectedCategories, categorySlug];

    setSelectedCategories(newSelectedCategories);
    onFilterChange({ ...filters, category: newSelectedCategories.join(',') });
  };

  const handlePriceChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    onFilterChange({ category: '', minPrice: '', maxPrice: '' });
  };

  return (
    <div className="filter-panel">
      <h3>Фильтры</h3>

      {/* Фильтр по категориям */}
      <div className="filter-section">
        <h4>Категории</h4>
        {categories.map(category => (
          <label key={category.id} className="filter-checkbox">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category.slug)}
              onChange={() => handleCategoryChange(category.slug)}
            />
            {category.name}
          </label>
        ))}
      </div>

      {/* Фильтр по цене */}
      <div className="filter-section">
        <h4>Цена</h4>
        <div className="price-filters">
          <input
            type="number"
            placeholder="Мин. цена"
            value={filters.minPrice}
            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
          />
          <span> - </span>
          <input
            type="number"
            placeholder="Макс. цена"
            value={filters.maxPrice}
            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
          />
        </div>
      </div>

      {/* Кнопка сброса фильтров */}
      <button onClick={resetFilters} className="reset-filters">
        Сбросить фильтры
      </button>
    </div>
  );
};

export default FilterPanel;