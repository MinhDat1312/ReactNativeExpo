import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import { Task, TaskContext } from "../context/TaskContext";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import { useContext } from "react";
import { useRouter } from "expo-router";

export default function Card(item: Task) {
    const { deleteTask, setEditingTask, toggleTaskComplete } = useContext(TaskContext);
    const router = useRouter();

    const handleDelete = (id: string) => {
        if (Platform.OS === "web") {
        const confirmDelete = window.confirm("Bạn có chắc muốn xóa công việc này?");
        if (confirmDelete) {
            deleteTask(id);
        }
        } else {
        Alert.alert("Xác nhận", "Bạn có chắc muốn xóa công việc này?", [
            { text: "Hủy", style: "cancel" },
            { text: "Xóa", style: "destructive", onPress: () => deleteTask(id) },
        ]);
        }
    };

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 12,
                marginBottom: 10,
                backgroundColor: item.status ? "#e0ffe0" : "#fafafa",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: item.status ? "#b2dfb5" : "#ddd",
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowOffset: { width: 0, height: 1 },
                shadowRadius: 2,
                elevation: 2,
            }}
        >
            <TouchableOpacity
                onPress={() => toggleTaskComplete(item.id)}
                style={{ marginRight: 10 }}
            >
                {item.status ? (
                    <FontAwesome name="check-circle" size={22} color="#28a745" />
                ) : (
                    <FontAwesome name="circle-o" size={22} color="#aaa" />
                )}
            </TouchableOpacity>

            <Text style={{ flex: 1, fontSize: 16, color: "#333" }}>{item.title}</Text>

            <View
                style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                }}
            >
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <FontAwesome name="trash" size={20} color="#ff4444" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        setEditingTask(item);
                        router.push("/Add");
                    }}
                >
                    <FontAwesome name="pencil" size={20} color="#007bff" />
                </TouchableOpacity>
            </View>
        </View>
    )
}