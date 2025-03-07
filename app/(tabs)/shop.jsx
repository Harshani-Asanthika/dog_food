import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView, 
  Touchable,
  ToastAndroid
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const Shop = () => {
  const database = useSQLiteContext();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await database.getAllAsync('SELECT categoryid, categoryname FROM categories');
        console.log(result);
        if (Array.isArray(result) && result.length > 0) {
          setCategories(result);
          setSelectedCategory(result[0].categoryid); // Set first category as default
        }
      } catch (error) {
        console.error('Error fetching categories:', error.message);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;
    const fetchProducts = async () => {
      try {
        const result = await database.getAllAsync(
          `SELECT * FROM foods WHERE categoryid = ${selectedCategory}`
        );
        setProducts(result);
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  const toggleFavorite = (productId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(productId)
        ? prevFavorites.filter((id) => id !== productId)
        : [...prevFavorites, productId]
    );
  };




  const addToCart = async (product) => {
    const user = await AsyncStorage.getItem('userSession');
    if (!user) {
      ToastAndroid.show('Please log in to add items to cart', ToastAndroid.SHORT);
      router.push('/login');
      return;
    }
  
    const userEmail = JSON.parse(user).email;
  
    // Check if the product is already in the cart
    const rows = await database.getAllAsync(
      `SELECT * FROM cart WHERE food_id = ${product.id} AND user = '${userEmail}'`
    );
  
    if (rows.length > 0) {
      ToastAndroid.show('Product already added to cart', ToastAndroid.SHORT);
      return;
    }
  
    try {
      // Insert the product into the cart
      await database.execAsync(`
        INSERT INTO cart (food_id, user, quantity)
        VALUES (${product.id}, '${userEmail}', 1);
      `);
      ToastAndroid.show('Product added to cart', ToastAndroid.SHORT);
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Failed to add product to cart', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.categoryid}
            style={[
              styles.categoryTab,
              selectedCategory === category.categoryid && styles.categoryTabActive,
            ]}
            onPress={() => setSelectedCategory(category.categoryid)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.categoryid && styles.categoryTextActive,
              ]}
            >
              {category.categoryname}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {products.length === 0 ? (
        <View style={styles.noProductsContainer}>
          <Text style={styles.noProductsText}>No products available in this category.</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => {
            const imageUrl = item.image.startsWith('http') ? item.image : `${item.image}`;
            console.log("Image URL:", imageUrl); // Debugging

            return (

              <View style={styles.card} onPress={() => {

              
              }}>
          
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.productImage}
                   
                  />

                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(item.id)}
                  >
                    <AntDesign
                      name={favorites.includes(item.id) ? 'heart' : 'hearto'}
                      size={22}
                      color={favorites.includes(item.id) ? '#ff0000' : '#ccc'}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.productName}>{item.proname}</Text>
                <Text>High Quality Products</Text>
                <Text style={styles.productPrice}>${item.price}</Text>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.cartButton} onPress={() => addToCart(item)}>
                    <AntDesign name="shoppingcart" size={20} color="#fff" />
                  </TouchableOpacity>
                  {/* <TouchableOpacity style={styles.buyButton}>
                    <Text style={styles.buyButtonText}>Buy Now</Text>
                  </TouchableOpacity> */}
                </View>
              
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },

  categoryContainer: { flexDirection: 'row', marginBottom: 10 },
  categoryTab: {
    height: 40, 
    minWidth: 100, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  categoryTabActive: { backgroundColor: '#ff6600' },
  categoryText: { fontSize: 16, color: '#333', textAlign: 'center' },
  categoryTextActive: { color: '#fff', fontWeight: 'bold' },

  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  imageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 5,
    borderRadius: 20,
  },

  productName: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginTop: 5 },
  productDescription: { fontSize: 12, color: '#555', textAlign: 'center', marginBottom: 5 },
  productPrice: { fontSize: 16, color: '#ff6600', fontWeight: 'bold', marginBottom: 5 },

  buttonContainer: {

    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  cartButton: {
    backgroundColor: '#ff6600',
    padding: 10,
    borderRadius: 5,
    flex: 0.3,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#ff6600',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 0.7,
    alignItems: 'center',
  },
  buyButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  noProductsContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  noProductsText: { fontSize: 16, color: '#777' },
});

export default Shop;
