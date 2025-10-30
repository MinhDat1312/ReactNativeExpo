import { useCategories } from '@/hooks/useDatabase';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { initDatabase } from '../db/database';
import { syncNow } from '../services/sync.service';

export default function HomeScreen() {
    const router = useRouter();
    const categories = useCategories();
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        initDatabase();
    }, []);

    const handleSync = async () => {
        setSyncing(true);
        try {
            const result = await syncNow();
            const { pushed = 0, pulled = 0, deleted = 0, failed = 0} = result || {};
            Alert.alert(`✅ Pushed: ${pushed} | Pulled: ${pulled} | Deleted: ${deleted} | Failed: ${failed}`);
        } catch (err: any) {
            Alert.alert('Lỗi khi đồng bộ ❌', err.message);
        } finally {
            setSyncing(false);
        }
    };

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Button title="🔄 Sync dữ liệu" onPress={handleSync} disabled={syncing} />
                {syncing && <ActivityIndicator size="small" color="#007AFF" style={{ marginLeft: 10 }} />}
            </View>
            <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => router.push(`/category/${item.id}`)}
                        style={{
                            padding: 16,
                            backgroundColor: '#f5f5f5',
                            marginBottom: 10,
                            borderRadius: 8,
                        }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
