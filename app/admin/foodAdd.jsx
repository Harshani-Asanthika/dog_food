import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useSQLiteContext } from 'expo-sqlite';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

const FoodAdd = ({ navigation }) => {
  const database = useSQLiteContext();
  const [categories, setCategories] = useState([]);
  const [petAges, setPetAges] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);
  const [imageUri, setImageUri] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResult = await database.getAllAsync('SELECT categoryid, categoryname FROM categories');
        setCategories(categoriesResult.length > 0 ? categoriesResult.map(item => ({ id: item.categoryid, name: item.categoryname })) : []);

        const petAgesResult = await database.getAllAsync('SELECT ageid, age FROM petages');
        setPetAges(petAgesResult.length > 0 ? petAgesResult.map(item => ({ id: item.ageid, name: item.age })) : []);

        const foodTypesResult = await database.getAllAsync('SELECT typeid, typename FROM foodtypes');
        setFoodTypes(foodTypesResult.length > 0 ? foodTypesResult.map(item => ({ id: item.typeid, name: item.typename })) : []);
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };
    fetchData();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (!imageUri) throw new Error('Please select an image');

      await database.execAsync(`
        INSERT INTO foods (brand, proname, price, description, image, categoryid, petage, type) 
        VALUES ('${data.brand}', '${data.proname}', ${data.price}, '${data.description}', '${imageUri}', '${data.categoryid}', '${data.petage}', '${data.type}');
      `);

      Alert.alert('Success', 'Product added successfully!');
      console.log('Product added successfully!', data);

    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>ADD PET FOOD</Text>

      {/* Category Dropdown */}
      <Text style={styles.label}>Category</Text>
      <Controller
        control={control}
        name="categoryid"
        rules={{ required: 'Category is required' }}
        render={({ field: { onChange, value } }) => (
          <Picker selectedValue={value} onValueChange={onChange} style={styles.input}>
            <Picker.Item label={categories.length > 0 ? "Select Category" : "Not Available"} value={null} />
            {categories.map(cat => <Picker.Item key={cat.id} label={cat.name} value={cat.id} />)}
          </Picker>
        )}
      />
      {errors.categoryid && <Text style={styles.errorText}>{errors.categoryid.message}</Text>}

      {/* Brand Input */}
      <Text style={styles.label}>Brand</Text>
      <Controller
        control={control}
        name="brand"
        rules={{ required: 'Brand is required' }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Enter brand name" value={value} onChangeText={onChange} />
        )}
      />
      {errors.brand && <Text style={styles.errorText}>{errors.brand.message}</Text>}

      {/* Product Name Input */}
      <Text style={styles.label}>Product Name</Text>
      <Controller
        control={control}
        name="proname"
        rules={{ required: 'Product name is required' }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Enter product name" value={value} onChangeText={onChange} />
        )}
      />
      {errors.proname && <Text style={styles.errorText}>{errors.proname.message}</Text>}

      {/* Price Input */}
      <Text style={styles.label}>Price</Text>
      <Controller
        control={control}
        name="price"
        rules={{ required: 'Price is required' }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Enter price" value={value} onChangeText={onChange} keyboardType="numeric" />
        )}
      />
      {errors.price && <Text style={styles.errorText}>{errors.price.message}</Text>}

      {/* Pet Age Dropdown */}
      <Text style={styles.label}>Pet Age</Text>
      <Controller
        control={control}
        name="petage"
        rules={{ required: 'Pet age is required' }}
        render={({ field: { onChange, value } }) => (
          <Picker selectedValue={value} onValueChange={onChange} style={styles.input}>
            <Picker.Item label={petAges.length > 0 ? "Select Age" : "Not Available"} value={null} />
            {petAges.map(age => <Picker.Item key={age.id} label={age.name} value={age.id} />)}
          </Picker>
        )}
      />
      {errors.petage && <Text style={styles.errorText}>{errors.petage.message}</Text>}

      {/* Food Type Dropdown */}
      <Text style={styles.label}>Food Type</Text>
      <Controller
        control={control}
        name="type"
        rules={{ required: 'Food type is required' }}
        render={({ field: { onChange, value } }) => (
          <Picker selectedValue={value} onValueChange={onChange} style={styles.input}>
            <Picker.Item label={foodTypes.length > 0 ? "Select Food Type" : "Not Available"} value={null} />
            {foodTypes.map(ft => <Picker.Item key={ft.id} label={ft.name} value={ft.id} />)}
          </Picker>
        )}
      />
      {errors.type && <Text style={styles.errorText}>{errors.type.message}</Text>}

      {/* Image Picker */}
      <Text style={styles.label}>Product Image</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>{imageUri ? 'Change Image' : 'Pick an Image'}</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f8f8f8' },
  title: { fontSize: 22, textAlign: 'center', fontWeight: 'bold', marginBottom: 10 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 10, marginTop: 5 },
  errorText: { color: 'red', marginBottom: 5 },
  imagePicker: { backgroundColor: '#ffa500', padding: 10, alignItems: 'center', borderRadius: 10, marginTop: 10 },
  imagePickerText: { color: '#fff', fontWeight: 'bold' },
  image: { width: 150, height: 150, alignSelf: 'center', marginTop: 10, borderRadius: 10 },
  button: { backgroundColor: '#ff6600', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default FoodAdd;
