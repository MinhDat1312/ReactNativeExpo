import { getDb } from '@/db/database';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput } from 'react-native';

export default function EditProductScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        if (id) {
            loadProduct(parseInt(id));
        }
    }, [id]);

    async function loadProduct(productId: number) {
        try {
            const db = await getDb();
            const result = await db.getFirstAsync('SELECT * FROM products WHERE id = ?', [productId]);
            if (result) {
                setProduct(result);
            }
        } catch (e) {
            console.error('Load error', e);
            Alert.alert('Error', 'Cannot load product');
        }
    }

    async function handleSave() {
        const name = product?.name || '';
        const price = product?.price?.toString() || '';
        const unit = product?.unit || '';
        const description = product?.description || '';
        const categoryId = product?.category_id;
        if (!name.trim() || !price.trim() || !unit.trim() || !categoryId) {
            Alert.alert('Validation', 'Please fill all fields');
            return;
        }

        try {
            const db = await getDb();
            await db.runAsync(
                `UPDATE products 
                SET name=?, price=?, unit=?, description=?, updated_at=? 
                WHERE id=?`,
                [name, parseFloat(price), unit, description, new Date().toISOString(), id],
            );
            Alert.alert('Success', 'Product updated successfully', [{ text: 'OK', onPress: () => router.back() }]);
        } catch (e) {
            console.error('Save error', e);
            Alert.alert('Error', 'Failed to update product');
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Name</Text>
            <TextInput
                value={product?.name}
                onChangeText={(text) => setProduct({ ...product, name: text })}
                style={styles.input}
                placeholder="Product name"
            />

            <Text style={styles.label}>Price</Text>
            <TextInput
                value={Number(product?.price).toString()}
                onChangeText={(text) => setProduct({ ...product, price: text })}
                style={styles.input}
                keyboardType="decimal-pad"
                placeholder="Price"
            />

            <Text style={styles.label}>Unit</Text>
            <TextInput
                value={product?.unit}
                onChangeText={(text) => setProduct({ ...product, unit: text })}
                style={styles.input}
                placeholder="e.g. pcs"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
                value={product?.description}
                onChangeText={(text) => setProduct({ ...product, description: text })}
                style={[styles.input, { height: 100 }]}
                multiline
            />

            <Button title="Save Changes" onPress={handleSave} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    label: {
        marginTop: 12,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        padding: 8,
        marginTop: 4,
    },
});
