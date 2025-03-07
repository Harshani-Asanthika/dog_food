import React, { useEffect, useRef } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text, Animated, Easing } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Import the icon library


export default function HomeScreen() {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current; // Fade animation
  const scaleAnim = useRef(new Animated.Value(0)).current; // Scale animation

  useEffect(() => {
    // Start animations when the component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo with scale animation */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
      </Animated.View>

      {/* Title with fade animation */}
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        Welcome to Doggy Nutrition!
      </Animated.Text>

      {/* Subtitle with fade animation */}
      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
        Find the best food and nutrition guides for your dog.
      </Animated.Text>

      {/* Buttons with fade animation */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/shop')}
          activeOpacity={0.7} // Add button press effect
        >
          <Text style={styles.buttonText}>Browse Products</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/education')}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Dog Nutrition Guide</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/cart')}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Go to Cart</Text>
        </TouchableOpacity>
      </Animated.View>

       <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('../admin')}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Admin</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('../orders')}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Orders</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#654321',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FF914D',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 10,
    width: '300',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});