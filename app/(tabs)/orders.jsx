import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ToastAndroid } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router'; // Import Expo Router
import { useSQLiteContext } from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrdersUI = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const database = useSQLiteContext();

  // Fetch orders from the database
  const fetchOrders = async () => {
    try {
      const user = await AsyncStorage.getItem('userSession');
      if (!user) {
        router.push('/login');
        return;
      }

      const userEmail = JSON.parse(user).email;

      // Fetch orders for the logged-in user
      const rows = await database.getAllAsync(
        `SELECT orders.*, GROUP_CONCAT(foods.proname, ', ') AS items 
         FROM orders 
         LEFT JOIN cart ON orders.id = cart.id 
         LEFT JOIN foods ON cart.food_id = foods.id 
         WHERE orders.user = ?
         GROUP BY orders.id`,
        [userEmail]
      );

      setOrders(rows);
      console.log("Fetched orders:", rows);
    } catch (error) {
      console.error('Error fetching orders:', error);
      ToastAndroid.show('Failed to fetch orders', ToastAndroid.SHORT);
    }
  };

  // Fetch user info
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
    getUserInfo();
    fetchOrders();
  }, []);

  // Filter orders based on selected status
  const filteredOrders = statusFilter === 'All'
    ? orders
    : orders.filter(order => order.status === statusFilter);

  return (
    <View style={styles.container}>
      {/* Status Filters */}
      <View style={styles.tabsContainer}>
        {['All', 'Pending', 'Shipped', 'Delivered'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.tab,
              statusFilter === status && styles.tabActive,
            ]}
            onPress={() => setStatusFilter(status)}
          >
            <Text
              style={[
                styles.tabText,
                statusFilter === status && styles.tabTextActive,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <View style={styles.noOrdersContainer}>
          <Text style={styles.noOrdersText}>No orders found with the selected filter.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderTitle}>Order #{item.id}</Text>
                <Text style={styles.orderStatus}>{item.status}</Text>
              </View>
              <View style={styles.orderDetails}>
                <Text style={styles.orderDate}>
                  Date: {new Date(item.updated_at).toLocaleDateString()}
                </Text>
                <Text style={styles.orderTotal}>Total: ${item.total_price.toFixed(2)}</Text>
                <Text style={styles.orderItems}>Items: {item.items} x4r</Text>
              </View>

              {/* Order Actions */}
              <View style={styles.orderActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <AntDesign name="checkcircle" size={22} color="green" />
                  <Text style={styles.actionText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <AntDesign name="closecircle" size={22} color="red" />
                  <Text style={styles.actionText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <AntDesign name="export" size={22} color="blue" />
                  <Text style={styles.actionText}>Ship</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f8f8f8' },

  // Tab container for filtering orders
  tabsContainer: { flexDirection: 'row', marginBottom: 15, marginTop: 10, justifyContent: 'space-around' },
  tab: {
    height: 40,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tabActive: {
    backgroundColor: '#ff6600',
    borderColor: '#ff6600',
  },
  tabText: { fontSize: 16, color: '#333', fontWeight: '500' },
  tabTextActive: { color: '#fff', fontWeight: '700' },

  // Order cards
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  orderTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  orderStatus: { fontSize: 16, color: '#ff6600', fontWeight: '600' },

  orderDetails: { marginBottom: 15 },
  orderDate: { fontSize: 14, color: '#666' },
  orderTotal: { fontSize: 14, color: '#666' },
  orderItems: { fontSize: 14, color: '#666' },

  // Actions buttons (Accept, Reject, Ship)
  orderActions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    width: '30%',
    justifyContent: 'center',
  },
  actionText: { marginLeft: 5, fontSize: 14, color: '#333' },

  // No orders message
  noOrdersContainer: { justifyContent: 'center', alignItems: 'center', flex: 1 },
  noOrdersText: { fontSize: 16, color: '#888', textAlign: 'center' },
});

export default OrdersUI;