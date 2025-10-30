import { getDb } from '@/db/database';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';

export default function ProductDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [product, setProduct] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const db = await getDb();
            const data = await db.getFirstAsync('SELECT * FROM products WHERE id = ?', [Number(id)]);
            setProduct(data);
        })();
    }, [id]);

    const deleteProduct = async () => {
        const db = await getDb();
        await db.runAsync('UPDATE products SET is_deleted = 1 WHERE id = ?', [Number(id)]);
        Alert.alert('Deleted', 'Product marked as deleted.');
        router.back();
    };

    if (!product)
        return (
            <View>
                <Text>Product does not exist</Text>
            </View>
        );

    return (
        <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: '700' }}>{product.name}</Text>
            <Text>Price: {product.price}</Text>
            <Text>Unit: {product.unit}</Text>
            <Text>Description: {product.description}</Text>

            <Button title="Edit" onPress={() => router.push(`/product/edit/${product.id}`)} />
            <Button title="Delete" color="red" onPress={deleteProduct} />
        </View>
    );
}
