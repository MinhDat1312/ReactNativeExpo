import React, { useContext, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Task, TaskContext } from "../context/TaskContext";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Card from "./Card";

export default function Todo() {
  const router = useRouter();
  const { tasks, setEditingTask, userName } = useContext(TaskContext);
  const [search, setSearch] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
                        task.title.toLowerCase().includes(search.toLowerCase())
            )
            .sort((a, b) => Number(a.status) - Number(b.status));
  }, [search, tasks]);


  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
          <FontAwesome name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>

        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
          <TouchableOpacity style={{ padding: 8 }}>
            <Image
              source={require("../assets/images/todo.png")}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Hi {userName}</Text>
            <Text style={{ color: "gray" }}>Have a great day ahead</Text>
          </View>
        </View>
      </View>

      <TextInput
        placeholder="Search"
        value={search}
        onChangeText={setSearch}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          marginBottom: 20,
          padding: 10,
        }}
      />

      <FlatList
        data={filteredTasks}
        keyExtractor={(item: Task) => item.id}
        renderItem={({ item }) => (
          <Card {...item} />
        )}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "cyan",
          width: 50,
          height: 50,
          borderRadius: 25,
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
        }}
        onPress={() => {
          setEditingTask(null);
          router.push("/Add");
        }}
      >
        <Text style={{ fontSize: 24, color: "#fff", fontWeight: "bold" }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
