import { useProductsByCategory } from '@/hooks/useDatabase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CategoryScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [search, setSearch] = useState('');
    const products = useProductsByCategory(Number(id), search);
    const router = useRouter();

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <View>
                <TextInput
                    placeholder="Search product..."
                    value={search}
                    onChangeText={setSearch}
                    style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 8,
                        padding: 10,
                        marginBottom: 12,
                    }}
                />
                <Button title="Add Product" onPress={() => router.push(`/product/add?id=${id}`)} />
            </View>

            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => router.push(`/product/${item.id}`)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#f2f2f2',
                            marginBottom: 8,
                            borderRadius: 8,
                            padding: 10,
                        }}
                    >
                        <Image
                            source={
                                item.image_uri
                                    ? { uri: item.image_uri }
                                    : { uri: `https://api.dicebear.com/7.x/avataaars/png?seed=${item.name}` }
                            }
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: 6,
                                marginRight: 10,
                                backgroundColor: '#ddd',
                            }}
                            resizeMode="cover"
                        />

                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
                            <Text style={{ color: '#555' }}>
                                {item.price} / {item.unit}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
