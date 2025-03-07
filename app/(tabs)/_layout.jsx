import { Link, router, Tabs } from 'expo-router';
import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native'; // Import View for layout
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
        // Add profile and cart icons to the header
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
            {/* Cart Icon */}
            <TouchableOpacity
              onPress={() => router.push('../cart')} // Navigate to the cart screen
              style={{ marginRight: 20 }} // Add spacing between icons
            >
              <Ionicons name="cart" size={28} color={Colors[colorScheme ?? 'light'].tint} />
            </TouchableOpacity>

            {/* Profile Icon */}
           <Link href="login" style={{ marginRight: 20 }} >
              <Ionicons name="person-circle-outline" size={28} color={Colors[colorScheme ?? 'light'].tint} />
           </Link>
          </View>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color }) => <Ionicons name="bag" size={23} color={color} />,
          tabBarLabelStyle: { fontSize: 12 }, // Set the font size for the label
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }) => <Ionicons name="receipt" size={20} color={color} />,
          tabBarLabelStyle: { fontSize: 12 }, // Set the font size for the label
        }}
      />
      <Tabs.Screen
        name="education"
        options={{
          title: '🐶 Nutrition Care Guide',
          tabBarIcon: ({ color }) => <Ionicons name="book" size={20} color={color} />,
          tabBarLabelStyle: { fontSize: 12 }, // Set the font size for the label
        }}
      />
    </Tabs>
  );
}