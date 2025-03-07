import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ToastAndroid, ScrollView, TouchableOpacity } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const database = useSQLiteContext();

  // Use React Hook Form
  const { control, handleSubmit, formState: { errors }, reset } = useForm();

  // Handle sign-in logic
  const handleSignin = async (data) => {
    try {
      const user = await database.getAllAsync(
        `SELECT * FROM users WHERE email = ? AND password = ?;`,
        [data.email, data.password]
      );

      if (user.length > 0) {
        // Successful sign-in: Save session data
        await AsyncStorage.setItem('userSession', JSON.stringify({ email: data.email }));
        ToastAndroid.show('Signin success', ToastAndroid.SHORT);
        navigation.navigate('Home');  // Navigate to Home screen after login
      } else {
        ToastAndroid.show('Incorrect email or password', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [users, setUsers] = useState([]);

  // Fetch users from database
  const fetchUsers = async () => {
    const users = await database.getAllAsync('SELECT * FROM users;');
    setUsers(users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Check for existing session when component mounts
  useEffect(() => {
    const checkSession = async () => {
      const userSession = await AsyncStorage.getItem('userSession');
      if (userSession) {
        navigation.navigate('Home');  // Redirect to Home screen if session exists
      }
    };
    checkSession();
  }, []);

  const [Loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const getUserInfo = async () => {
    const user = await AsyncStorage.getItem('userSession');
    setUser(user);

    setLoading(false);

  }

  useEffect(() => {

    getUserInfo();


  });

  const navigator = useNavigation();

  useLayoutEffect(() => {
    navigator.setOptions({
      headerShown: true,
      title: user == null ? 'Sign in' : 'Profile',
    })


  })


  const logout = async () => {
    console.log('logout');
    await AsyncStorage.removeItem('userSession');
    setUser(null);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* {users.length > 0 ? users.map((user) => (
        <View key={user.id} style={styles.userItem}>
          <Text>{user.email}</Text>
          <Text>{user.password}</Text>
        </View>
      )) : <Text>No users found</Text>} */}

      {

        Loading ? <Text>Loading...</Text> : (

          user == null ? (

            <>
              <Text style={styles.title}>Sign in</Text>

              <Controller
                control={control}
                name="email"
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email format',
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                )}
              />
              {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

              <Controller
                control={control}
                name="password"
                rules={{ required: 'Password is required' }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                  />
                )}
              />
              {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

              <Button title="Sign In" onPress={handleSubmit(handleSignin)} />

              <View style={styles.signupLinkContainer}>
                <Text>Don't have an account? </Text>
                <Link href="signUp" style={styles.signupLink}>Sign Up</Link>
              </View></>
          ) : (
            <View>
              <Text>Hi , {JSON.parse(user).email}</Text>


             
                <Button title="Logout" onPress={logout}/>
            
            </View>
          )
        )
      }



    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  signupLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
});

export default Login;
