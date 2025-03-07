import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form'; // Import from react-hook-form

const SignUp = ({ navigation }) => {
    const database = useSQLiteContext();
    
    // React Hook Form
    const { control, handleSubmit, formState: { errors } } = useForm();

    const handleSignUp = async (data) => {
        try {
            const { email, password } = data;

            const existUser = await database.getAllAsync(`
                SELECT * FROM users WHERE email = ? LIMIT 1;
            `, [email]);

            if (existUser.length > 0) {
                Alert.alert('Error', 'User already exists.');
                return;
            }

            // Insert user into the database
            await database.execAsync(`
                INSERT INTO users (email, password) VALUES ('${email}', '${password}');
            `);
            console.log('User signed up:', email);

            // Save session data using AsyncStorage
            await AsyncStorage.setItem('userSession', JSON.stringify({ email }));

            Alert.alert('Success', 'You are signed up!');
            // Redirect to home or login screen
          
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Something went wrong.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>

            {/* Email Input */}
            <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={[styles.input, errors.email && styles.errorInput]}
                        placeholder="Email"
                        value={value}
                        onChangeText={onChange}
                        autoCapitalize="none"
                    />
                )}
                name="email"
                rules={{
                    required: 'Email is required',
                    pattern: {
                        value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                        message: 'Please enter a valid email'
                    }
                }}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

            {/* Password Input */}
            <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={[styles.input, errors.password && styles.errorInput]}
                        placeholder="Password"
                        value={value}
                        onChangeText={onChange}
                        secureTextEntry
                    />
                )}
                name="password"
                rules={{
                    required: 'Password is required',
                    minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                    }
                }}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

            {/* Submit Button */}
            <Button title="Sign Up" onPress={handleSubmit(handleSignUp)} />
            
            {/* Link to Login */}
            <Link href="login" style={styles.link}>Already have an account? Sign in</Link>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 10, padding: 10 },
    errorInput: { borderColor: 'red' },
    errorText: { color: 'red', fontSize: 12 },
    link: { marginTop: 15, paddingVertical: 15, textAlign: 'center' },
});

export default SignUp;
