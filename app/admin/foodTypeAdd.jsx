import { View, Text, TextInput, Button, Alert, StyleSheet, ToastAndroid } from 'react-native';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSQLiteContext } from 'expo-sqlite';

const FoodTypeAdd = () => {
    const database = useSQLiteContext();
    const { control, handleSubmit, reset, formState: { errors } } = useForm();

    const handleTypeAdd = async (data) => {
        try {
            await database.execAsync(`
                INSERT INTO foodtypes (typename, description) VALUES ('${data.foodtype}', '${data.description}');
            `);
            console.log('Pet food type added:', data);
        ToastAndroid.show('Food type added successfully!', ToastAndroid.SHORT);
         ;
          reset();
        } catch (error) {
            Alert.alert('Error', 'Failed to add food type.');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Controller
                control={control}
                name="foodtype"
                rules={{ required: 'Food type is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Food Type"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                        />
                        {errors.foodtype && <Text style={styles.error}>{errors.foodtype.message}</Text>}
                    </>
                )}
            />

            <Controller
                control={control}
                name="description"
                rules={{ required: 'Description is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Description"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                        />
                        {errors.description && <Text style={styles.error}>{errors.description.message}</Text>}
                    </>
                )}
            />

            <Button title="Add Food Type" onPress={handleSubmit(handleTypeAdd)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});

export default FoodTypeAdd;
