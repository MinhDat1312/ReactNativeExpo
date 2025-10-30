import { getDb } from '@/db/database';
import { useEffect, useState } from 'react';

export function useCategories() {
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const database = await getDb();
            const result = await database.getAllAsync(`SELECT * FROM categories`);
            setCategories(result);
        };

        fetchCategories();
    }, []);

    return categories;
}

export function useProducts() {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const database = await getDb();
            const result = await database.getAllAsync(`SELECT * FROM products`);
            setProducts(result);
        };

        fetchProducts();
    }, []);

    return products;
}

export function useProductsByCategory(categoryId: number, search: string = '') {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            const db = await getDb();
            let sql = 'SELECT * FROM products WHERE category_id = ? AND is_deleted = 0';
            const params: any[] = [categoryId];
            if (search) {
                sql += ' AND name LIKE ?';
                params.push(`%${search}%`);
            }
            const result = await db.getAllAsync(sql, params);
            setProducts(result);
        })();
    }, [categoryId, search]);

    return products;
}
