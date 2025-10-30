import { watchOnline } from '@/services/network.service';
import { syncNow } from '@/services/sync.service';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
    useEffect(() => {
        const off = watchOnline(async (online) => {
            if (online) {
                await syncNow();
            }
        });
        return off;
    }, []);

    return <Stack />;
}
