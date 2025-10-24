import { Stack } from "expo-router";
import { TaskProvider } from "../context/TaskContext";
import {SQLiteProvider} from "expo-sqlite";

export default function RootLayout() {
  return (
    <SQLiteProvider
      databaseName="todos.db"
      onInit={async (db)=>{
        await db.execAsync(
          `
          CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            status INTEGER NOT NULL DEFAULT 0
          );
          PRAGMA journal_mode = WAL;
          `
        );
      }}
      options={{useNewConnection: false}}
    >
      <TaskProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" />
          <Stack.Screen name="Todo" />
          <Stack.Screen name="Add" />
        </Stack>
      </TaskProvider>
    </SQLiteProvider>
  );
}
