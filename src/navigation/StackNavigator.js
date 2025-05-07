import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importando as telas
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2E7D32', // Cor do topo
        },
        headerTintColor: '#fff', // Cor do texto do cabeçalho
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }} // Remover cabeçalho na tela Welcome
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Entrar' }}
      />
      
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Início' }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{ title: 'Pontos de Coleta' }}
      />
      <Stack.Screen
       name="Register"
        component={RegisterScreen}
        options={{ title:'Registro' }} />

    </Stack.Navigator>
  );
}
