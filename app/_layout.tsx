import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';


import { useColorScheme } from '@/hooks/useColorScheme';
import { SQLiteAnyDatabase } from 'expo-sqlite/build/NativeStatement';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }


  




  const dbOnInit = async (db: SQLiteAnyDatabase) => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        email TEXT NOT NULL UNIQUE, 
        password TEXT NOT NULL
      );
    `);
  
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS foodtypes (
        typeid INTEGER PRIMARY KEY AUTOINCREMENT, 
        typename TEXT NOT NULL, 
        description TEXT NOT NULL
      );
    `);
  
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS petages (
        ageid INTEGER PRIMARY KEY AUTOINCREMENT, 
        age TEXT NOT NULL, 
        description TEXT NOT NULL
      );
    `);
  
    // Create the categories table first
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        categoryid INTEGER PRIMARY KEY AUTOINCREMENT, 
        categoryname TEXT NOT NULL
      );
    `);
  
    // Now create the foods table with a foreign key to categories
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS foods (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        categoryid INTEGER NOT NULL,
        brand TEXT NOT NULL,
        proname TEXT NOT NULL, 
        price REAL NOT NULL, 
        type TEXT NOT NULL,
        petage TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        FOREIGN KEY (categoryid) REFERENCES categories(categoryid) ON DELETE CASCADE
      );
    `);
  
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        food_id INTEGER NOT NULL,
        user TEXT NOT NULL,
        quantity REAL NOT NULL, 
        FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
      );
    `);
  
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        user TEXT NOT NULL,
        total_price REAL NOT NULL,
        status INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        food_id INTEGER DEFAULT 1,
        quantity REAL DEFAULT 1,
        price REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  
    console.log('Database initialized.');
  };


  return (
    <SQLiteProvider databaseName="dogFood_dbnew.db" onInit={dbOnInit}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SQLiteProvider>
  );
}
