import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { TaskContext } from "../context/TaskContext";

export default function Home() {
  const [name, setName] = useState("");
  const { setUserName } = useContext(TaskContext);
  const router = useRouter();

  const handleStart = () => {
    if (name.trim() === "") return;
    setUserName(name);
    router.push("/Todo");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Image
        source={require("../assets/images/todo.png")}
        style={{ width: 150, height: 150, marginBottom: 20 }}
      />

      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: "purple",
          marginBottom: 20,
        }}
      >
        MANAGE YOUR TASK
      </Text>

      <TextInput
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
          width: "70%",
          marginBottom: 20,
          padding: 10,
        }}
      />

      <TouchableOpacity
        onPress={handleStart}
        style={{
          backgroundColor: "cyan",
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>GET STARTED →</Text>
      </TouchableOpacity>
    </View>
  );
}
