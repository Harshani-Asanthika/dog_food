import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

const Add = ({ navigation }) => {
  const database = useSQLiteContext();

  const [categoryname, setCategory] = useState('');
  const [errors, setErrors] = useState({}); // Initialize errors state

/*************  ✨ Codeium Command ⭐  *************/
/******  0bd23cf5-6bd7-410d-a921-d825be102c2d  *******/
  const validateForm = () => {
    let newErrors = {};

    // Validate category name input
    if (!categoryname.trim()) {
      newErrors.categoryname = 'Category is required';
    }

    setErrors(newErrors); // Set errors state
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCat = async () => {
    if (!validateForm()) return;

    try {
      // Insert category into the database
      await database.execAsync(`
        INSERT INTO categories (categoryname) VALUES ('${categoryname}');
      `);
      console.log('Category added:', categoryname);

      Alert.alert('Success', 'Category added!');
      setCategory(''); // Clear the input field after successful submission
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Category</Text>

      {/* Category Input */}
      <Text style={styles.label}>Category</Text>
      <TextInput
        style={[styles.input, errors.categoryname && styles.inputError]}
        placeholder="Enter Category name"
        value={categoryname}
        onChangeText={setCategory}
        autoCapitalize="none"
      />
      {errors.categoryname && <Text style={styles.errorText}>{errors.categoryname}</Text>}

      <Button title="Add Category" onPress={handleAddCat} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
  inputError: { borderColor: 'red' },
  errorText: { color: 'red', marginBottom: 10 },
});

export default Add;
