import { getDb } from '@/db/database';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, TextInput, Text } from 'react-native';

export default function AddProduct() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [unit, setUnit] = useState('pcs');
    const [description, setDescription] = useState('');
    const router = useRouter();

    const add = async () => {
        if (!name || !price || !unit || !description) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const db = await getDb();
        const now = new Date().toISOString();
        const image_uri = `https://api.dicebear.com/7.x/avataaars/png?seed=${name}`;
        await db.runAsync(
            'INSERT INTO products (name, price, unit, description, image_uri, category_id, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, parseFloat(price), unit, description, image_uri, id, now],
        );

        Alert.alert('Success', 'Product added');
        router.back();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Name</Text>
            <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Product name" />

            <Text style={styles.label}>Price</Text>
            <TextInput
                value={price}
                onChangeText={setPrice}
                style={styles.input}
                keyboardType="decimal-pad"
                placeholder="Price"
            />

            <Text style={styles.label}>Unit</Text>
            <TextInput value={unit} onChangeText={setUnit} style={styles.input} placeholder="e.g. pcs" />

            <Text style={styles.label}>Description</Text>
            <TextInput
                value={description}
                onChangeText={setDescription}
                style={[styles.input, { height: 100 }]}
                multiline
            />

            <Button title="Save Changes" onPress={add} />
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
