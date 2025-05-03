// src/navigation/StackNavigator.js

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';

const Stack = createNativeStackNavigator();

function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#4CAF50' },  // Cor moderna para o cabeçalho
          headerTintColor: '#fff',  // Cor do texto do cabeçalho
          headerTitleAlign: 'center',  // Centraliza o título
          animation: 'slide_from_right',  // Transição de animação suave
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} options={{ title: 'Bem-vindo' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Entrar' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Cadastrar' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Mapa' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default StackNavigator;
