import React from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useForm, Controller } from 'react-hook-form';

const PetageAdd = ({ navigation }) => {
    const database = useSQLiteContext();
    const { control, handleSubmit, reset, formState: { errors } } = useForm();

    const handlePetAgeAdd = async (data) => {
        console.log(data);
        
        try {
            await database.execAsync(`
                INSERT INTO petages (age, description) VALUES ('${data.petage}', '${data.description}');
            `);
            console.log('Pet Age added:', data);
            Alert.alert('Success', 'Pet Age added successfully!');
            reset();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <Controller
                control={control}
                name="petage"
                render={({ field: { onChange, onBlur, value } }) => (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Pet Age"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                          
                        />
                        {errors.petage && <Text style={styles.error}>{errors.petage.message}</Text>}
                    </>
                )}
            />

            <Controller
                control={control}
                name="description"
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

            <Button title="Add Pet Age" onPress={handleSubmit(handlePetAgeAdd)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 10, padding: 10 },
    error: { color: 'red', marginBottom: 10 },
});

export default PetageAdd;
