import NetInfo from '@react-native-community/netinfo';

export function watchOnline(callback: (isOnline: boolean) => void) {
    const sub = NetInfo.addEventListener((state) => callback(!!state.isConnected));
    return () => sub();
}
