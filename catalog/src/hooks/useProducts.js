import { useState, useEffect } from 'react';
import axios from 'axios';

const useProducts = (filters) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();

            if (filters.category) params.append('category', filters.category);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

            const response = await axios.get(`http://localhost:5000/api/products?${params}`);
            setProducts(response.data);
            setError(null);
        }
        catch (err){
            setError('ошибка при загрузке товаров');
            console.error('Error', err);
        }
        finally {
            setLoading(false);
        }
 };
    fetchProducts();
}, [filters]);
    return {products, loading, error};
};
export default useProducts;