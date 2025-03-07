import { router } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

const Index = () => {

  console.log('Admin Page');
  return (
    <View style={styles.container}>
      
      
      
      {/* Add Category Button */}
      <Text>Add Food Category</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/admin/categoryAdd')}>
        <Text style={styles.buttonText}>Add Category</Text>
      </TouchableOpacity>
      <Text>Add Food Items</Text>
      {/* Add Food Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/admin/foodAdd')}>
        <Text style={styles.buttonText}>Add Food</Text>
      </TouchableOpacity>
      <Text>Add Pet Ages (senior, adult, puppy)</Text>
       {/* Add Food Button */}
       <TouchableOpacity style={styles.button} onPress={() => router.push('/admin/petAgeAdd')}>
        <Text style={styles.buttonText}>Add Pet Age</Text>
      </TouchableOpacity>
      <Text>Add Food Type (dry, wet)</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/admin/foodTypeAdd')}>
        <Text style={styles.buttonText}>Add Food Type</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FF914D',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginVertical: 10,
    width: '70%',
    alignItems: 'center',
    elevation: 3, // Adds shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Index;
