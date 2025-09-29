import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({products, loading, error}) => {
    if (loading) {
    return <div className='loading'>Загрузка товаров...</div>;
    }

    if (error){
        return <div className='error'>{error}</div>;
    }
    if (products.length === 0){
        return <div className='no-products'>
         Товары не найдены
        </div>;
    }

    return (
        <div className='product-list'>
            {products.map(product => (
            <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};
export default ProductList;