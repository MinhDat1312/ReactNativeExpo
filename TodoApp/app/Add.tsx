import React, { useContext, useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { TaskContext } from "../context/TaskContext";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function Add() {
  const { addTask, updateTask, editingTask, setEditingTask, userName } = useContext(TaskContext);
  const [text, setText] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (editingTask) {
      setText(editingTask.title);
    } else {
      setText("");
    }
  }, [editingTask]);

  const handleFinish = () => {
    if (editingTask) {
      updateTask(editingTask.id, text);
    } else {
      addTask(text);
    }
    setEditingTask(null);
    router.back();
  };

  return (
    <View style={{ flex: 1, padding: 20}}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
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

        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
          <FontAwesome name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 22, fontWeight: "bold", marginBlock: 20, textAlign: "center" }}>
        {editingTask ? "EDIT YOUR JOB" : "ADD YOUR JOB"}
      </Text>

      <TextInput
        placeholder="Input your job"
        value={text}
        onChangeText={setText}
        style={{
          borderWidth: 1,
          borderRadius: 5,
          marginBottom: 20,
          padding: 10,
        }}
      />

      <TouchableOpacity
        onPress={handleFinish}
        style={{ backgroundColor: "cyan", padding: 15, borderRadius: 8 }}
      >
        <Text
          style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}
        >
          FINISH →
        </Text>
      </TouchableOpacity>

      <Image
        source={require("../assets/images/todo.png")}
        style={{ width: 120, height: 120, alignSelf: "center", marginTop: 30 }}
      />
    </View>
  );
}
