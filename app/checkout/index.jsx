import React from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router'; // Import Expo Router

export default function Checkout() {
  const { cart, totalPrice } = useLocalSearchParams(); // Get cart data and total price from navigation params

  // Parse the cart data (it's passed as a JSON string)
  const parsedCart = JSON.parse(cart);

  // Simulate payment process
  const handlePayment = () => {
    alert('Payment successful! Thank you for your purchase.');
    router.push('/'); // Navigate back to the home screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>

      {/* Display Cart Items */}
      <FlatList
        data={parsedCart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.price.toFixed(2)} x {item.quantity}</Text>
          </View>
        )}
      />

      {/* Total Price */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${parseFloat(totalPrice).toFixed(2)}</Text>
      </View>

      {/* Payment Button */}
      <Button title="Pay Now" onPress={handlePayment} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  productName: { fontSize: 16, fontWeight: 'bold' },
  productPrice: { fontSize: 14, color: '#666' },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 15,
    marginTop: 15,
    alignItems: 'flex-end',
  },
  totalText: { fontSize: 18, fontWeight: 'bold' },
});