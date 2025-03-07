import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Button, ToastAndroid } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; // Import Expo Router
import { useSQLiteContext } from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [isCartLoaded, setIsCartLoaded] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState(null);

  const database = useSQLiteContext();

  const fetchItems = async () => {
    try {
      const rows = await database.getAllAsync(
        `SELECT cart.*, foods.proName, foods.price, foods.image 
         FROM cart 
         LEFT JOIN foods ON cart.food_id = foods.id`
      );
      setCart(rows);
      console.log("Fetched items:", rows);
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Failed to fetch cart items', ToastAndroid.SHORT);
    } finally {
      setIsCartLoaded(false);
    }
  };

  const updateQuantity = async (id, action) => {
    try {
      if (action === 'increase') {
        await database.runAsync(`UPDATE cart SET quantity = quantity + 1 WHERE id = ?`, [id]);
      } else {
        await database.runAsync(`UPDATE cart SET quantity = quantity - 1 WHERE id = ?`, [id]);
      }
      fetchItems();
      ToastAndroid.show('Quantity updated', ToastAndroid.SHORT);
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Failed to update quantity', ToastAndroid.SHORT);
    }
  };

  const removeItem = async (id) => {
    try {
      await database.runAsync(`DELETE FROM cart WHERE id = ?`, [id]);
      fetchItems();
      ToastAndroid.show('Item removed from cart', ToastAndroid.SHORT);
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Failed to remove item', ToastAndroid.SHORT);
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const proceedToCheckout = async () => {
    try {
      if (cart.length === 0) {
        ToastAndroid.show('Your cart is empty!', ToastAndroid.SHORT);
        return;
      }

      if (!user) {
        ToastAndroid.show('Please log in to proceed to checkout', ToastAndroid.SHORT);
        router.push('/login');
        return;
      }

      const userEmail = JSON.parse(user).email;
      await database.runAsync(
        'INSERT INTO orders (user, total_price) VALUES (?, ?)',
        [userEmail, totalPrice]
      );
      

      await database.runAsync('DELETE FROM cart');
      fetchItems();

      ToastAndroid.show('Order placed successfully!', ToastAndroid.SHORT);

      router.push({
        pathname: '../(tabs)/orders',
        params: { totalPrice: totalPrice.toFixed(2) },
      });

    } catch (error) {
      console.error('Error during checkout:', error);
      ToastAndroid.show('Failed to place order. Please try again.', ToastAndroid.SHORT);
    }
  };

  const getUserInfo = async () => {
    try {
      const user = await AsyncStorage.getItem('userSession');
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
    } catch (error) {
      console.error(error);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    getUserInfo();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart 🛍️</Text>

      {userLoading || isCartLoaded ? (
        <Text>Loading...</Text>
      ) : cart.length > 0 ? (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.proName}</Text>
                  <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      disabled={item.quantity === 1}
                      onPress={() => updateQuantity(item.id, 'decrease')}
                    >
                      <Ionicons name="remove-circle-outline" size={24} color="#FF914D" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, 'increase')}>
                      <Ionicons name="add-circle-outline" size={24} color="#FF914D" />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeButton}>
                  <Ionicons name="trash-outline" size={24} color="#FF6347" />
                </TouchableOpacity>
              </View>
            )}
          />

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
          </View>

          <Button title="Proceed to Checkout" onPress={proceedToCheckout} />
        </>
      ) : (
        <>
          <Text style={styles.emptyText}>No items in your cart yet!</Text>
          <Button title="Go Shopping" onPress={() => router.push('/shop')} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  productImage: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  productInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: 'bold' },
  productPrice: { fontSize: 14, color: '#666', marginTop: 5 },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityText: { fontSize: 16, marginHorizontal: 10 },
  removeButton: { padding: 10 },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 15,
    marginTop: 15,
    alignItems: 'flex-end',
  },
  totalText: { fontSize: 18, fontWeight: 'bold' },
  emptyText: { fontSize: 16, color: '#666', marginBottom: 20 },
});