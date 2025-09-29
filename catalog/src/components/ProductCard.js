import React from 'react';

const ProductCard = ({product}) => {
    return (
    <div className='product-card'>
        <img
            src={product.image_url || '/placeholder.img'}
            alt={product.name}
            className='product-image'
        />
        <div className='product-info'>
            <h3 className='product-name'>{product.name}</h3>
            <p className='product-price'>{product.price}</p>
            <p className='product-description'>{product.description}</p>
            <div className='product-details'>
                <span className={`stock-status ${product.stock_quantity > 0 ?
                'in-stock' : 'out-stock'}`}>
                {product.stock_quantity > 0 ? 'В наличии' : 'Нет в наличии'}
                </span>
                <span className='product-category'>{product.category_name}</span>
            </div>
        </div>
    </div>
     );
};
export default ProductCard;